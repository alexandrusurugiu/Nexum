const { db } = require('../database/db');
const Groq = require('groq-sdk');

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});
const OLLAMA_BASE_URL = process.env.OLLAMA_URL

const addReview = async (req, res) => {
    try {
        const { productId, userId, userName, userAvatar, rating, comment } = req.body;
        
        if (!productId || !userId || !rating) {
            return res.status(400).json({ success: false, message: 'Date incomplete.' });
        }

        const newReview = {
            productId,
            userId,
            userName,
            userAvatar: userAvatar || '',
            rating,
            comment,
            createdAt: new Date().toISOString()
        };

        const docRef = await db.collection('reviews').add(newReview);
        res.status(201).json({ success: true, review: { id: docRef.id, ...newReview } });
    } catch (error) {
        console.error("Eroare la adăugarea recenziei:", error);
        res.status(500).json({ success: false, message: 'Eroare la adăugare.' });
    }
};

const getReviews = async (req, res) => {
    try {
        const { productId } = req.params;
        const snapshot = await db.collection('reviews').where('productId', '==', productId).get();
        
        let reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        let average = 0;
        
        if (reviews.length > 0) {
            const total = reviews.reduce((sum, r) => sum + r.rating, 0);
            average = parseFloat((total / reviews.length).toFixed(1));
        }

        res.status(200).json({ success: true, reviews, average });
    } catch (error) {
        console.error("Eroare la preluarea recenziilor:", error);
        res.status(500).json({ success: false, message: 'Nu am putut încărca recenziile.' });
    }
};

generateReviewSummary = async (req, res) => {
    try {
        const { productId } = req.params;
        const productDoc = await db.collection('products').doc(productId).get();
        
        if (!productDoc.exists) {
            return res.status(404).json({ summary: "Produs inexistent." });
        }

        const productData = productDoc.data();
        if (productData.aiSummary && productData.summaryUpdatedAt) {
            const lastUpdated = new Date(productData.summaryUpdatedAt).getTime();
            const now = new Date().getTime();
            
            if (now - lastUpdated < 24 * 60 * 60 * 1000) {
                return res.status(200).json({ summary: productData.aiSummary });
            }
        }
        
        const snapshot = await db.collection('reviews').where('productId', '==', productId).get();
        
        let reviewsText = "";
        let reviewCount = 0;
        
        snapshot.forEach(doc => {
            const review = doc.data();
            if (review.comment && review.comment.length > 10) {
                reviewsText += `- Nota: ${review.rating}/5 | Text: "${review.comment}"\n`;
                reviewCount++;
            }
        });

        if (reviewCount < 1) {
            return res.status(200).json({ summary: "Nu există recenzii pentru a genera un rezumat." });
        }

        const ollamaPrompt = `
            Analizează următoarele recenzii pentru produsul ${productData.name}.
            Sarcina ta este să extragi DOAR detaliile tehnice. Elimină orice informație despre curier, livrare, ambalaj, înjurături sau spam.
            Returnează STRICT un obiect JSON cu două array-uri: "aspecte_pozitive" și "aspecte_negative". 
            Fără alte explicații sau text pe lângă JSON.

            Recenzii:
            ${reviewsText}
        `;

        const ollamaResponse = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: "qwen2.5-coder:3b",
                prompt: ollamaPrompt,
                stream: false,
                format: "json",
                options: { temperature: 0.1 }
            })
        });

        const ollamaData = await ollamaResponse.json();
        const extragereTehnicaJSON = ollamaData.response; 

        const groqPrompt = `
            Ești un asistent AI pentru magazinul Nexum. 
            Folosind URMĂTOARELE DATE TEHNICE extrase deja de sistemul nostru, redactează un rezumat clar pentru clienți.
            Dacă array-ul de aspecte negative este gol, menționează că "Nu au fost raportate probleme tehnice".

            Date tehnice:
            ${extragereTehnicaJSON}

            FORMAT OBLIGATORIU:
            PRO: [1-2 propoziții]
            CONTRA: [1-2 propoziții]
            VERDICT: [O concluzie de o propoziție]
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [{ role: 'system', content: groqPrompt }],
            model: "openai/gpt-oss-20b",
            temperature: 0.2,
        });

        const finalSummary = chatCompletion.choices[0]?.message?.content;

        await productDoc.ref.update({
            aiSummary: finalSummary,
            summaryUpdatedAt: new Date().toISOString()
        });

        res.status(200).json({ summary: finalSummary });
        
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.message.includes('fetch')) {
             return res.status(200).json({ summary: "AI-ul Nexum este în mentenanță locală. Rezumatul nu poate fi generat momentan." });
        }
        res.status(500).json({ error: 'Eroare la generarea rezumatului AI.' });
    }
};

module.exports = { 
    addReview, 
    getReviews,
    generateReviewSummary
};