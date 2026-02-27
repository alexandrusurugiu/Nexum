const { db } = require('../database/db');

const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q || q.trim() === '') {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const searchTerm = q.toLowerCase().trim();
        const collectionsToSearch = ['products', 'monitors', 'peripherals', 'laptops'];
        
        let results = [];

        const searchPromises = collectionsToSearch.map(async (collectionName) => {
            const snapshot = await db.collection(collectionName).get();
            
            snapshot.forEach(doc => {
                const data = doc.data();
                const nameMatch = data.name && data.name.toLowerCase().includes(searchTerm);
                const brandMatch = data.brand && data.brand.toLowerCase().includes(searchTerm);
                const categoryMatch = data.category && data.category.toLowerCase().includes(searchTerm);

                if (nameMatch || brandMatch || categoryMatch) {
                    results.push({ id: doc.id, ...data });
                }
            });
        });

        await Promise.all(searchPromises);

        res.status(200).json({ success: true, count: results.length, data: results });
    } catch (error) {
        console.error("Eroare la căutare:", error);
        res.status(500).json({ success: false, message: 'Eroare la procesarea căutării.' });
    }
};

module.exports = { searchProducts };