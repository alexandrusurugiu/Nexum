const { db } = require('../database/db');

const addReview = async (req, res) => {
    try {
        const { productId, userId, userName, userAvatar, rating, comment } = req.body;
        
        if (!productId || !userId || !rating) {
            return res.status(400).json({ success: false, message: 'Date incomplete.' });
        }

        const newReview = {
            productId,
            userId,
            userName,
            userAvatar: userAvatar || '',
            rating,
            comment,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('reviews').add(newReview);
        res.status(201).json({ success: true, review: { id: docRef.id, ...newReview } });
    } catch (error) {
        console.error("Eroare la adăugarea recenziei:", error);
        res.status(500).json({ success: false, message: 'Eroare la adăugare.' });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const snapshot = await db.collection('reviews').where('productId', '==', productId).get();
        
        let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        let average = 0;
        
        if (reviews.length > 0) {
            const total = reviews.reduce((sum, r) => sum + r.rating, 0);
            average = parseFloat((total / reviews.length).toFixed(1));
        }

        res.status(200).json({ success: true, reviews, average });
    } catch (error) {
        console.error("Eroare la preluarea recenziilor:", error);
        res.status(500).json({ success: false, message: 'Nu am putut încărca recenziile.' });
    }
};

module.exports = { addReview, getReviews };