const { db } = require('../database/db');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GOOGLE_ACCOUNT,
        pass: process.env.GOOGLE_PASS
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

        await db.collection('users').doc(uid).update({
            twoFactorCode: code,
            twoFactorExpires: expireAt
        });

        await transporter.sendMail({
            from: '"Nexum Security" <adresa.ta@gmail.com>',
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

        const userRef = db.collection('users').doc(userId);
        await userRef.update(updates);

        const updatedDoc = await userRef.get();
        res.status(200).json({ success: true, message: 'Profil actualizat!', user: { id: userId, ...updatedDoc.data() } });
    } catch (error) {
        console.error("Eroare la actualizare:", error);
        res.status(500).json({ success: false, message: 'Eroare la actualizarea profilului.' });
    }
};

module.exports = { 
    syncUser, 
    updateProfile,
    toggle2FA,
    send2FACode,
    verify2FACode 
};