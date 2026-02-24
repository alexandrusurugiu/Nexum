const { db } = require('../database/db');

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
    updateProfile 
};