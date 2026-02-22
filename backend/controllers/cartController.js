const { db } = require('../database/db');

const getCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const cartRef = db.collection('carts').doc(userId).collection('items');
        const snapshot = await cartRef.get();

        let cartItems = [];
        snapshot.forEach(doc => {
            cartItems.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json({ success: true, data: cartItems });
    } catch (error) {
        console.error("Eroare la preluarea coșului:", error);
        res.status(500).json({ success: false, message: 'Eroare la preluarea coșului.' });
    }
};

const addToCart = async (req, res) => {
    try {
        const { userId } = req.params;
        const product = req.body; 

        const itemRef = db.collection('carts').doc(userId).collection('items').doc(product.id);
        const doc = await itemRef.get();

        if (doc.exists) {
            const currentQuantity = doc.data().quantity || 1;
            await itemRef.update({ quantity: currentQuantity + 1 });
        } else {
            await itemRef.set({
                name: product.name,
                price: product.price,
                brand: product.brand,
                image: product.image || (product.specs && product.specs.image) || '',
                quantity: 1
            });
        }

        res.status(200).json({ success: true, message: 'Produs adăugat în coș!' });
    } catch (error) {
        console.error("Eroare la adăugarea în coș:", error);
        res.status(500).json({ success: false, message: 'Eroare la adăugarea în coș.' });
    }
};

const removeFromCart = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const { removeAll } = req.query;

        const itemRef = db.collection('carts').doc(userId).collection('items').doc(productId);
        const doc = await itemRef.get();

        if (!doc.exists) {
            return res.status(404).json({ success: false, message: 'Produsul nu este în coș.' });
        }

        const currentQuantity = doc.data().quantity;

        if (currentQuantity > 1 && removeAll !== 'true') {
            await itemRef.update({ quantity: currentQuantity - 1 });
        } else {
            await itemRef.delete();
        }

        res.status(200).json({ success: true, message: 'Produs eliminat/actualizat!' });
    } catch (error) {
        console.error("Eroare la eliminarea din coș:", error);
        res.status(500).json({ success: false, message: 'Eroare la eliminarea din coș.' });
    }
};

module.exports = {
    addToCart,
    removeFromCart,
    getCart
};