const { db } = require('../database/db');

const ALLOWED_COLLECTIONS = new Set(['products', 'monitors', 'peripherals', 'laptops']);

const addProduct = async (req, res) => {
    try {
        const { collectionName, productData } = req.body;
        if (!ALLOWED_COLLECTIONS.has(collectionName)) {
            return res.status(403).json({ success: false, message: 'Acces interzis la această colecție.' });
        }
        
        if (!productData || typeof productData !== 'object' || !productData.price) {
            return res.status(400).json({ success: false, message: 'Date produs invalide.' });
        }

        const docRef = await db.collection(collectionName).add(productData);
        res.status(201).json({ success: true, id: docRef.id });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la adăugare.' });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { collectionName, productData } = req.body;
        if (!ALLOWED_COLLECTIONS.has(collectionName)) {
            return res.status(403).json({ success: false, message: 'Acces interzis.' });
        }

        await db.collection(collectionName).doc(id).update(productData);
        res.status(200).json({ success: true, message: 'Produs actualizat!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la actualizare.' });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { collectionName } = req.query;
        if (!ALLOWED_COLLECTIONS.has(collectionName)) {
            return res.status(403).json({ success: false, message: 'Acces interzis.' });
        }
        
        await db.collection(collectionName).doc(id).delete();
        res.status(200).json({ success: true, message: 'Produs șters!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la ștergere.' });
    }
};

module.exports = { 
    addProduct, 
    updateProduct, 
    deleteProduct 
};