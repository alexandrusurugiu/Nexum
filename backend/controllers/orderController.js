require('dotenv').config();
const { db } = require('../database/db');
const stripe = require('stripe')(process.env.STRIPE_KEY);
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

function generateTableRow(doc, y, c1, c2, c3, c4, c5) {
    doc.fontSize(10)
       .text(c1, 50, y)
       .text(c2.substring(0, 45) + (c2.length > 45 ? '...' : ''), 80, y)
       .text(c3, 280, y, { width: 90, align: 'center' })
       .text(c4, 370, y, { width: 90, align: 'right' })
       .text(c5, 470, y, { width: 70, align: 'right' });
}

function generateHr(doc, y) {
    doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, y).lineTo(550, y).stroke();
}

const generateInvoiceBuffer = (order) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        let buffers = [];
        
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', () => resolve(Buffer.concat(buffers)));
        doc.on('error', reject);

        doc.fillColor('#333333')
           .fontSize(20).text('FACTURA FISCALA', 50, 50, { align: 'right' })
           .fontSize(10).text(`Nr. Factura: ${order.orderNumber}`, { align: 'right' })
           .text(`Data: ${new Date(order.createdAt).toLocaleDateString('ro-RO')}`, { align: 'right' });

        doc.moveDown();

        doc.fontSize(12).font('Helvetica-Bold').text('FURNIZOR:', 50, 100);
        doc.font('Helvetica').fontSize(10)
           .text('S.C. NEXUM IT S.R.L.')
           .text('C.U.I: RO12345678')
           .text('Reg. Com: J40/1234/2026')
           .text('Adresa: Bucuresti, Sector 1, Str. Paris Nr. 40')
           .text('Email: contact@nexum.ro');

        doc.fontSize(12).font('Helvetica-Bold').text('CLIENT:', 300, 100);
        doc.font('Helvetica').fontSize(10)
           .text(`Nume: ${order.contactInfo.name}`)
           .text(`Telefon: ${order.contactInfo.phone}`)
           .text(`Email: ${order.contactInfo.email}`)
           .text(`Adresa: ${order.deliveryInfo.address.street}, ${order.deliveryInfo.address.city}, ${order.deliveryInfo.address.county}`);

        doc.moveDown(3);

        const tableTop = 230;
        doc.font('Helvetica-Bold');
        generateTableRow(doc, tableTop, 'Nr.', 'Denumire Produs', 'Cantitate', 'Pret Unitar', 'Valoare');
        generateHr(doc, tableTop + 20);
        doc.font('Helvetica');

        let position = tableTop + 30;

        order.items.forEach((item, i) => {
            const valoare = item.quantity * item.price;
            generateTableRow(doc, position, i + 1, item.name, item.quantity, `${item.price} Lei`, `${valoare} Lei`);
            generateHr(doc, position + 20);
            position += 30;
        });

        if (order.summary.shipping > 0) {
            generateTableRow(doc, position, '', 'Taxa Livrare Curier', 1, `${order.summary.shipping} Lei`, `${order.summary.shipping} Lei`);
            generateHr(doc, position + 20);
            position += 30;
        }

        doc.font('Helvetica-Bold').fontSize(12)
           .text('TOTAL DE PLATA:', 350, position + 10, { width: 100, align: 'right' })
           .text(`${order.summary.total} Lei`, 450, position + 10, { width: 90, align: 'right' });

        doc.end();
    });
};

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 2525,   
    secure: false,
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS
    }
});

const sendOrderEmailWithInvoice = async (order) => {
    try {
        const pdfBuffer = await generateInvoiceBuffer(order);
        const mailOptions = {
            from: '"Nexum IT" <' + process.env.GOOGLE_ACCOUNT + '>',
            to: order.contactInfo.email,
            subject: `Factură și Confirmare Comandă #${order.orderNumber}`,
            html: `<h2>Salut, ${order.contactInfo.name}!</h2>
                   <p>Îți mulțumim pentru comandă! Am atașat factura aferentă comenzii tale <b>${order.orderNumber}</b>.</p>
                   <p>Total de plată: <b>${order.summary.total} Lei</b></p>
                   <p>Echipa Nexum.</p>`,
            attachments: [
                {
                    filename: `Factura_${order.orderNumber}.pdf`,
                    content: pdfBuffer
                }
            ]
        };
        
        await transporter.sendMail(mailOptions);
        console.log(`[EMAIL] Factura pt. comanda ${order.orderNumber} a fost trimisă.`);
    } catch (error) {
        console.error('Eroare la trimiterea facturii pe email:', error);
    }
};

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
                        product_data: { name: 'Taxă Livrare' },
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

        await sendOrderEmailWithInvoice(newOrder);
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
        const orderDoc = await db.collection('orders').doc(orderId).get();

        if (orderDoc.exists) {
            await sendOrderEmailWithInvoice(orderDoc.data());
        }

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

module.exports = { createOrder, confirmPayment, getUserOrders };