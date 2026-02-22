const { db } = require('../database/db');

const getPeripherals = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            brands,
            sort
        } = req.query;

        let productsRef = db.collection('peripherals');
        let query = productsRef;

        if (category) {
            query = query.where('category', '==', category);
        }

        if (brands) {
            const brandList = brands.split(',');
            query = query.where('brand', 'in', brandList);
        }

        if (minPrice) {
            query = query.where('price', '>=', Number(minPrice));
        }
        if (maxPrice) {
            query = query.where('price', '<=', Number(maxPrice));
        }

        if (sort === 'price_asc') {
            query = query.orderBy('price', 'asc');
        } else if (sort === 'price_desc') {
            query = query.orderBy('price', 'desc');
        }

        const snapshot = await query.get();

        if (snapshot.empty) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        let peripheralsList = [];
        snapshot.forEach(doc => {
            peripheralsList.push({
                id: doc.id, 
                ...doc.data() 
            });
        });

        const { sockets, memory, types } = req.query;
        
        if (sockets) {
            const socketList = sockets.split(',');
            peripheralsList = peripheralsList.filter(p => socketList.includes(p.socket));
        }
        if (memory) {
            const memoryList = memory.split(',');
            peripheralsList = peripheralsList.filter(p => memoryList.includes(p.memory));
        }
        if (types) {
            const typesList = types.split(',');
            peripheralsList = peripheralsList.filter(p => typesList.includes(p.type));
        }

        res.status(200).json({
            success: true,
            count: peripheralsList.length,
            data: peripheralsList
        });
    } catch (error) {
        console.error("Eroare Firebase:", error);
        res.status(500).json({
            success: false,
            message: 'Eroare la obținerea perifericelor din baza de date.'
        });
    }
};

module.exports = { getPeripherals };