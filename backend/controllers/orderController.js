const { db } = require('../database/db');

const createOrder = async (req, res) => {
    try {
        const { userId, contactInfo, deliveryInfo, paymentInfo, items, summary } = req.body;
        
        const newOrder = {
            userId: userId || null,
            contactInfo,
            deliveryInfo,
            paymentInfo,
            items,
            summary,
            status: 'În procesare',
            createdAt: new Date().toISOString(),
            orderNumber: 'NXM-' + Math.floor(100000 + Math.random() * 900000)
        };

        const docRef = await db.collection('orders').add(newOrder);

        if (userId && contactInfo.saveDetails) {
            await db.collection('users').doc(userId).update({
                phone: contactInfo.phone,
                address: deliveryInfo.address,
                name: contactInfo.name
            });
        }

        res.status(201).json({ success: true, orderId: docRef.id, orderNumber: newOrder.orderNumber });
    } catch (error) {
        console.error("Eroare la crearea comenzii:", error);
        res.status(500).json({ success: false, message: 'Eroare la plasarea comenzii.' });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('orders')
            .where('userId', '==', userId)
            .orderBy('createdAt', 'desc')
            .get();
        
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error("Eroare la preluarea comenzilor:", error);
        res.status(500).json({ success: false, message: 'Nu am putut încărca istoricul comenzilor.' });
    }
};

module.exports = { createOrder, getUserOrders };