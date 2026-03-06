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

const addPeripheral = async (req, res) => {
    try {
        const peripheralData = req.body;
        const docRef = await db.collection('peripherals').add(peripheralData);
        
        res.status(201).json({ success: true, id: docRef.id, message: 'Periferic adăugat.' });
    } catch (error) {
        console.error("Eroare la adăugare:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la adăugare.' });
    }
};

const updatePeripheral = async (req, res) => {
    try {
        const { id } = req.params;
        const peripheralData = req.body;

        await db.collection('peripherals').doc(id).update(peripheralData);

        res.status(200).json({ success: true, message: 'Periferic actualizat.' });
    } catch (error) {
        console.error("Eroare la actualizare:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la actualizare.' });
    }
};

const deletePeripheral = async (req, res) => {
    try {
        const { id } = req.params;

        await db.collection('peripherals').doc(id).delete();

        res.status(200).json({ success: true, message: 'Periferic șters.' });
    } catch (error) {
        console.error("Eroare la ștergere:", error);
        res.status(500).json({ success: false, message: 'Eroare internă la ștergere.' });
    }
};

module.exports = { 
    getPeripherals, 
    addPeripheral, 
    updatePeripheral, 
    deletePeripheral 
};