const { db } = require('../database/db');

const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const searchTerm = q.toLowerCase().trim();
        const snapshot = await db.collection('products').get();
        
        let results = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            const nameMatch = data.name && data.name.toLowerCase().includes(searchTerm);
            const brandMatch = data.brand && data.brand.toLowerCase().includes(searchTerm);
            const categoryMatch = data.category && data.category.toLowerCase().includes(searchTerm);

            if (nameMatch || brandMatch || categoryMatch) {
                results.push({ id: doc.id, ...data });
            }
        });

        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        console.error("Eroare la căutare:", error);
        res.status(500).json({ success: false, message: 'Eroare la procesarea căutării.' });
    }
};

module.exports = { searchProducts };