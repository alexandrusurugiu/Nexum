const { db } = require('../database/db');
const nodemailer = require('nodemailer');
const { FieldValue } = require('firebase-admin/firestore');

const ALLOWED_PROFILE_FIELDS = ['name', 'phone', 'address', 'avatar'];

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,
    secure: false, 
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

const toggle2FA = async (req, res) => {
    try {
        const { userId } = req.params;
        const { isEnabled } = req.body;
        await db.collection('users').doc(userId).update({ is2FAEnabled: isEnabled });
        res.status(200).json({ success: true, message: `2FA a fost ${isEnabled ? 'activat' : 'dezactivat'}.` });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la modificarea 2FA.' });
    }
};

const send2FACode = async (req, res) => {
    try {
        const { uid, email } = req.body;
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const expireAt = Date.now() + 10 * 60 * 1000;
        const rateLimitRef = db.collection('rate_limits').doc(uid);
        const rateLimitDoc = await rateLimitRef.get();

        if (rateLimitDoc.exists && rateLimitDoc.data().count >= 5 && rateLimitDoc.data.resetAt >= Date.now()) {
            return res.status(429).json({ success: false, message: 'Ai atins limita de trimitere a codurilor. Încearcă mai târziu.' });
        }
        await rateLimitRef.set({ count: FieldValue.increment(1), resetAt: Date.now() + 15 * 60000 }), { merge: true };

        await db.collection('users').doc(uid).update({
            twoFactorCode: code,
            twoFactorExpires: expireAt
        });

        await transporter.sendMail({
            from: '"Nexum IT" <nexum.noreply@gmail.com>',
            to: email,
            subject: 'Codul tău de autentificare Nexum',
            html: `<h2>Codul tău de acces este: <span style="color: #10B981;">${code}</span></h2><p>Acest cod expiră în 10 minute.</p>`
        });

        res.status(200).json({ success: true, message: 'Cod trimis pe email.' });
    } catch (error) {
        console.error("Eroare trimitere 2FA:", error);
        res.status(500).json({ success: false, message: 'Nu am putut trimite email-ul.' });
    }
};

const verify2FACode = async (req, res) => {
    try {
        const { uid, code } = req.body;
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (!userDoc.exists) return res.status(404).json({ success: false, message: 'Utilizator inexistent.' });
        
        const userData = userDoc.data();
        
        if (userData.twoFactorCode !== code) {
            return res.status(400).json({ success: false, message: 'Cod incorect.' });
        }
        if (Date.now() > userData.twoFactorExpires) {
            return res.status(400).json({ success: false, message: 'Codul a expirat. Solicită altul.' });
        }

        await db.collection('users').doc(uid).update({ twoFactorCode: null, twoFactorExpires: null });
        
        res.status(200).json({ success: true, message: 'Autentificare reușită!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la validarea codului.' });
    }
};

const syncUser = async (req, res) => {
    try {
        const { uid, email, name, avatar } = req.body;
        
        const userRef = db.collection('users').doc(uid);
        const doc = await userRef.get();

        if (!doc.exists) {
            const newUser = {
                name: name || 'Utilizator Nou',
                email: email,
                avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
                phone: '',
                address: '',
                createdAt: new Date().toISOString()
            };
            await userRef.set(newUser);
            return res.status(200).json({ success: true, user: { id: uid, ...newUser } });
        } else {
            return res.status(200).json({ success: true, user: { id: uid, ...doc.data() } });
        }
    } catch (error) {
        console.error("Eroare la sincronizarea contului:", error);
        res.status(500).json({ success: false, message: 'Eroare la autentificarea pe server.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const safeUpdates = {};
        Object.keys(updates).forEach(key => {
            if (ALLOWED_PROFILE_FIELDS.includes(key)) {
                safeUpdates[key] = updates[key];
            }
        });

        if (Object.keys(safeUpdates).length === 0) {
            return res.status(400).json({ success: false, message: 'Nicio actualizare validă furnizată.' });
        }

        await db.collection(users).doc(userId).update(safeUpdates);
        res.status(200).json({ success: true, message: 'Profil actualizat!', user: { id: userId, ...updatedDoc.data() } });
    } catch (error) {
        console.error("Eroare la actualizare:", error);
        res.status(500).json({ success: false, message: 'Eroare la actualizarea profilului.' });
    }
};

const updatePreferences = async (req, res) => {
    try {
        const { id } = req.params;
        const { notifications } = req.body;

        await db.collection('users').doc(id).update({
            notifications: notifications
        });

        res.status(200).json({ success: true, message: 'Preferințe actualizate.' });
    } catch (error) {
        console.error("Eroare la actualizare preferințe:", error);
        res.status(500).json({ success: false, message: 'Eroare internă.' });
    }
};

const sendOrderUpdate = async (req, res) => {
    try {
        const { userEmail, userPreferences, orderNumber, type } = req.body;

        if (userPreferences && userPreferences.orders === false) {
            console.log("Utilizatorul a dezactivat notificările.");
            return res.status(200).json({ success: true, message: 'Notificări dezactivate de utilizator.' });
        }

        let subject = '';
        let htmlMessage = '';

        if (type === 'plasata') {
            subject = `Confirmare comandă #${orderNumber}`;
            htmlMessage = `<h2>Salut!</h2> <p>Îți mulțumim! Comanda ta <b>${orderNumber}</b> a fost înregistrată cu succes și este în procesare.</p>`;
        } else if (type === 'expediata') {
            subject = `Comanda ta #${orderNumber} a fost expediată!`;
            htmlMessage = `<h2>Salut!</h2> <p>Avem vești bune. Comanda ta <b>${orderNumber}</b> a fost predată curierului și este pe drum spre tine.</p>`;
        }

        const mailOptions = {
            from: '"Nexum IT" <nexum.noreply@gmail.com>',
            to: userEmail,
            subject: subject,
            html: htmlMessage
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: 'Email trimis cu succes!' });
    } catch (error) {
        console.error("Eroare la trimiterea emailului:", error);
        res.status(500).json({ success: false, message: 'Eroare la trimiterea emailului.' });
    }
};

module.exports = { 
    syncUser, 
    updateProfile,
    toggle2FA,
    send2FACode,
    verify2FACode,
    updatePreferences,
    sendOrderUpdate
};