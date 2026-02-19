const { db } = require('../database/db');

exports.getProducts = async (req, res) => {
    try {
        const {
            category,
            minPrice,
            maxPrice,
            brands,
            sort
        } = req.query;

        let productsRef = db.collection('products');
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

        let productsList = [];
        snapshot.forEach(doc => {
            productsList.push({
                id: doc.id, 
                ...doc.data() 
            });
        });

        const { sockets, memory, types } = req.query;
        
        if (sockets) {
            const socketList = sockets.split(',');
            productsList = productsList.filter(p => socketList.includes(p.socket));
        }
        if (memory) {
            const memoryList = memory.split(',');
            productsList = productsList.filter(p => memoryList.includes(p.memory));
        }
        if (types) {
            const typesList = types.split(',');
            productsList = productsList.filter(p => typesList.includes(p.type));
        }

        res.status(200).json({
            success: true,
            count: productsList.length,
            data: productsList
        });
    } catch (error) {
        console.error("Eroare Firebase:", error);
        res.status(500).json({
            success: false,
            message: 'Eroare la obținerea produselor din baza de date.'
        });
    }
};