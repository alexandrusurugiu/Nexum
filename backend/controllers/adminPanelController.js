const { db } = require('../database/db');

const addProduct = async (req, res) => {
    try {
        const { collectionName, productData } = req.body;
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
        await db.collection(collectionName).doc(id).delete();
        res.status(200).json({ success: true, message: 'Produs șters!' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Eroare la ștergere.' });
    }
};

module.exports = { addProduct, updateProduct, deleteProduct };