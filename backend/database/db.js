require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = JSON.parse(process.env.FIREBASE_ACCOUNT_KEY);

function initializeDatabase() {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    return admin.firestore();
}

const db = initializeDatabase();

module.exports = { db, admin };