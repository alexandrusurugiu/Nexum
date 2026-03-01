const { db } = require('../database/db');

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const collections = ['products', 'monitors', 'peripherals', 'laptops'];
        let productData = null;

        for (const collection of collections) {
            const docRef = db.collection(collection).doc(id);
            const doc = await docRef.get();
            
            if (doc.exists) {
                productData = { id: doc.id, ...doc.data(), collectionType: collection };
                break; 
            }
        }

        if (!productData) {
            return res.status(404).json({ success: false, message: 'Produsul nu a fost găsit.' });
        }

        res.status(200).json({ success: true, product: productData });
    } catch (error) {
        console.error("Eroare preluare produs:", error);
        res.status(500).json({ success: false, message: 'Eroare la server.' });
    }
};

module.exports = { getProductById };