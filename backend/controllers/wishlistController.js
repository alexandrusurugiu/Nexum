const { db } = require('../database/db');

const generateShareCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

const saveWishlist = async (req, res) => {
    try {
        const { userId, name, items, total } = req.body;
        
        if (!userId || !items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Date invalide pentru salvare.' });
        }

        const shareCode = generateShareCode();
        
        const wishlist = {
            userId,
            name: name || 'Sistemul Meu Salvat',
            items,
            total,
            shareCode,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('wishlists').add(wishlist);

        res.status(200).json({ 
            success: true, 
            message: 'Wishlist salvat cu succes!', 
            shareCode, 
            id: docRef.id 
        });
    } catch (error) {
        console.error("Eroare salvare wishlist:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la salvare.' });
    }
};

const getUserWishlists = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('wishlists').where('userId', '==', userId).get();
        
        let wishlists = [];
        snapshot.forEach(doc => {
            wishlists.push({ id: doc.id, ...doc.data() });
        });

        wishlists.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        res.status(200).json({ success: true, data: wishlists });
    } catch (error) {
        console.error("Eroare preluare wishlists:", error);
        res.status(500).json({ success: false, message: 'Eroare la preluarea listelor.' });
    }
};

module.exports = { 
    saveWishlist, 
    getUserWishlists 
};