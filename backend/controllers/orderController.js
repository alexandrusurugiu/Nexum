require('dotenv').config();
const { db } = require('../database/db');
const stripe = require('stripe')(process.env.STRIPE_KEY);

const createOrder = async (req, res) => {
    try {
        const { userId, contactInfo, deliveryInfo, paymentInfo, items, summary, successUrl, cancelUrl } = req.body;
        const orderStatus = paymentInfo.method === 'card' ? 'Așteptare Plată' : 'În procesare';
        const newOrder = {
            userId: userId || null,
            contactInfo,
            deliveryInfo,
            paymentInfo,
            items,
            summary,
            status: orderStatus,
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

        if (paymentInfo.method === 'card') {
            const lineItems = items.map(item => ({
                price_data: {
                    currency: 'ron',
                    product_data: { name: item.name },
                    unit_amount: Math.round(item.price * 100), 
                },
                quantity: item.quantity,
            }));

            if (summary.shipping > 0) {
                lineItems.push({
                    price_data: {
                        currency: 'ron',
                        product_data: { name: `Livrare ${deliveryInfo.courierName}` },
                        unit_amount: Math.round(summary.shipping * 100),
                    },
                    quantity: 1,
                });
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${successUrl}&orderId=${docRef.id}&orderNum=${newOrder.orderNumber}`,
                cancel_url: cancelUrl,
            });

            return res.status(201).json({ success: true, isStripe: true, url: session.url });
        }

        res.status(201).json({ success: true, isStripe: false, orderId: docRef.id, orderNumber: newOrder.orderNumber });
    } catch (error) {
        console.error("Eroare la crearea comenzii:", error);
        res.status(500).json({ success: false, message: 'Eroare la plasarea comenzii.' });
    }
};

const confirmPayment = async (req, res) => {
    try {
        const { orderId } = req.body;
        await db.collection('orders').doc(orderId).update({ status: 'În procesare (Plătit)' });
        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Eroare confirmare plata:", error);
        res.status(500).json({ success: false });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const { userId } = req.params;
        const snapshot = await db.collection('orders').where('userId', '==', userId).orderBy('createdAt', 'desc').get();
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Nu am putut încărca istoricul comenzilor.' });
    }
};

module.exports = { createOrder, getUserOrders, confirmPayment };