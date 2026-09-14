const { db } = require('../database/db');

const validateCoupon = async (req, res) => {
    try {
        const { code } = req.body;
        
        const cleanCode = code ? code.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() : null;
        
        if (!cleanCode) {
            return res.status(400).json({ success: false, message: 'Cod invalid.' });
        }

        const couponsRef = db.collection('coupons');
        const snapshot = await couponsRef.where('code', '==', cleanCode).get();

        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: 'Acest cod nu există.' });
        }

        const couponDoc = snapshot.docs[0];
        const couponData = couponDoc.data();

        if (!couponData.isActive) {
            return res.status(400).json({ success: false, message: 'Acest cupon a fost dezactivat.' });
        }

        if (couponData.expiryDate && new Date(couponData.expiryDate) < new Date()) {
            return res.status(400).json({ success: false, message: 'Acest cupon a expirat.' });
        }

        return res.status(200).json({
            success: true,
            discount: {
                type: couponData.type,
                value: couponData.value,
                code: couponData.code
            }
        });

    } catch (error) {
        console.error("Eroare validare cupon:", error);
        res.status(500).json({ success: false, message: 'Eroare la serverul de cupoane.' });
    }
};

module.exports = { validateCoupon };