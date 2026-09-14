const { db } = require('../database/db');

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const collections = ['products', 'monitors', 'peripherals', 'laptops'];
        
        const queries = collections.map(async (collection) => {
            const doc  = await db.collection(collection).doc(id).get();
            return { exists: doc.exists, doc, collection };
        });

        const results = await Promise.all(queries);
        const match = results.find(result => result.exists);

        if (!match) {
            return res.status(404).json({ success: false, message: 'Produsul nu a fost găsit.' });
        }

        const productData = {
            id: match.doc.id,
            ...match.doc.data(),
            collectionType: match.collection
        };

        res.status(200).json({ success: true, product: productData });
    } catch (error) {
        console.error("Eroare preluare produs:", error);
        res.status(500).json({ success: false, message: 'Eroare la server.' });
    }
};

module.exports = { getProductById };