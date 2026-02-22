const { db } = require('../database/db');

const getMonitors = async (req, res) => {
    try {
        const { minPrice, maxPrice, brands, sort } = req.query;

        let query = db.collection('monitors').where('category', '==', 'monitoare');

        if (brands) {
            const brandList = brands.split(',');
            query = query.where('brand', 'in', brandList);
        }

        if (minPrice) query = query.where('price', '>=', Number(minPrice));
        if (maxPrice) query = query.where('price', '<=', Number(maxPrice));

        if (sort === 'price_asc') query = query.orderBy('price', 'asc');
        else if (sort === 'price_desc') query = query.orderBy('price', 'desc');

        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        let monitorsList = [];
        snapshot.forEach(doc => {
            monitorsList.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, count: monitorsList.length, data: monitorsList });
    } catch (error) {
        console.error("Eroare Firebase Monitoare:", error);
        res.status(500).json({ success: false, message: 'Eroare la obținerea monitoarelor.' });
    }
};

module.exports = { getMonitors };