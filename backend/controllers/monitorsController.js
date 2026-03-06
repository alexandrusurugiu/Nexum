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

const addMonitor = async (req, res) => {
    try {
        const monitorData = req.body;
        const docRef = await db.collection('monitors').add(monitorData);
        
        res.status(201).json({ success: true, id: docRef.id, message: 'Monitor adăugat.' });
    } catch (error) {
        console.error("Eroare la adăugare:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la adăugare.' });
    }
};

const updateMonitor = async (req, res) => {
    try {
        const { id } = req.params;
        const monitorData = req.body;

        await db.collection('monitors').doc(id).update(monitorData);

        res.status(200).json({ success: true, message: 'Monitor actualizat.' });
    } catch (error) {
        console.error("Eroare la actualizare:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la actualizare.' });
    }
};

const deleteMonitor = async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection('monitors').doc(id).delete();

        res.status(200).json({ success: true, message: 'Monitor șters.' });
    } catch (error) {
        console.error("Eroare la ștergere:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la ștergere.' });
    }
};

module.exports = { 
    getMonitors, 
    addMonitor, 
    updateMonitor, 
    deleteMonitor 
};