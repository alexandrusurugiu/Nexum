const { db } = require('../database/db');

const getConfiguratorParts = async (req, res) => {
    try {
        const categories = ['procesoare', 'placi_de_baza', 'memorie_ram', 'placi_video', 'stocare', 'surse'];
        
        const snapshot = await db.collection('products').where('category', 'in', categories).get();

        let parts = [];
        snapshot.forEach(doc => {
            parts.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, data: parts });
    } catch (error) {
        console.error("Eroare la preluarea pieselor pentru configurator:", error);
        res.status(500).json({ success: false, message: 'Eroare la preluarea pieselor.' });
    }
};

module.exports = { getConfiguratorParts };