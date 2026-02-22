const { db } = require('../database/db');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).get();

        if (!snapshot.empty) {
            return res.status(400).json({ success: false, message: 'Acest email este deja folosit!' });
        }

        const autoAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;

        const newUser = {
            name,
            email,
            password, 
            phone: '',
            address: '',
            avatar: autoAvatar,
            createdAt: new Date().toISOString()
        };

        const docRef = await usersRef.add(newUser);
        
        const { password: pwd, ...userData } = newUser;
        
        res.status(201).json({ 
            success: true, 
            message: 'Cont creat cu succes!', 
            user: { id: docRef.id, ...userData } 
        });
    } catch (error) {
        console.error("Eroare la înregistrare:", error);
        res.status(500).json({ success: false, message: 'Eroare la crearea contului.' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const usersRef = db.collection('users');
        const snapshot = await usersRef.where('email', '==', email).where('password', '==', password).get();

        if (snapshot.empty) {
            return res.status(401).json({ success: false, message: 'Email sau parolă incorecte!' });
        }

        let userData = {};
        let userId = '';
        snapshot.forEach(doc => {
            userId = doc.id;
            userData = doc.data();
        });

        const { password: pwd, ...safeUserData } = userData;

        res.status(200).json({ 
            success: true, 
            message: 'Te-ai logat cu succes!', 
            user: { id: userId, ...safeUserData } 
        });
    } catch (error) {
        console.error("Eroare la logare:", error);
        res.status(500).json({ success: false, message: 'Eroare la autentificare.' });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { userId } = req.params;
        const updates = req.body;

        const userRef = db.collection('users').doc(userId);
        await userRef.update(updates);

        const updatedDoc = await userRef.get();
        const { password: pwd, ...safeUserData } = updatedDoc.data();

        res.status(200).json({ 
            success: true, 
            message: 'Profil actualizat cu succes!',
            user: { id: userId, ...safeUserData }
        });
    } catch (error) {
        console.error("Eroare la actualizare:", error);
        res.status(500).json({ success: false, message: 'Eroare la actualizarea profilului.' });
    }
};

module.exports = {
    register,
    login,
    updateProfile
};