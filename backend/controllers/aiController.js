const { db } = require('../database/db');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateAiBuild = async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ success: false, message: 'Te rog să introduci un text.' });
        }

        const snapshot = await db.collection('products').get();
        
        if (snapshot.empty) {
            return res.status(404).json({ success: false, message: 'Nu am găsit produse în baza de date.' });
        }

        let availableParts = [];
        snapshot.forEach(doc => {
            const data = doc.data();
            availableParts.push({
                id: doc.id,
                name: data.name,
                category: data.category,
                price: data.price,
                specs: {
                    socket: data.specs?.socket || data.specs?.socket_support || '',
                    memoryType: data.specs?.memory_type || data.specs?.memory_support || '',
                    type: data.specs?.type || data.specs?.format || '',
                    tdp: data.specs?.tdp || data.specs?.putere || ''
                }
            });
        });

        const model = genAI.getGenerativeModel({ 
            model: "gemini-2.5-flash"
        });

        const systemPrompt = `
            Ești un expert în asamblarea de calculatoare. 
            Ai la dispoziție următorul inventar de produse în format JSON: ${JSON.stringify(availableParts)}.
            
            Cerința clientului este: "${prompt}".
            
            Sarcina ta:
            Selectează exact 8 componente compatibile din inventar pentru a crea un PC complet.
            - Compatibilitate perfectă la Socket (CPU + Placă de bază + Cooler).
            - Compatibilitate la Memorie RAM (placă DDR5 cu memorie DDR5).
            - Compatibilitate la Format (Carcasa să suporte placa de bază).
            
            Returnează RĂSPUNSUL TĂU STRICT CA UN OBIECT JSON valid, folosind doar ID-urile produselor alese, cu următoarele chei:
            {
                "cpu": "id_aici",
                "mb": "id_aici",
                "cooler": "id_aici",
                "ram": "id_aici",
                "gpu": "id_aici",
                "storage": "id_aici",
                "psu": "id_aici",
                "case": "id_aici"
            }
            Dacă nu găsești o piesă pentru o categorie, lasă valoarea null. Nu adăuga absolut niciun alt cuvânt, doar JSON-ul pur!
        `;

        const result = await model.generateContent(systemPrompt);
        let aiResponseText = result.response.text();
        aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new Error("AI-ul nu a generat un JSON valid. Răspunsul lui a fost: " + aiResponseText);
        }

        const recommendedBuildIds = JSON.parse(jsonMatch[0]);

        res.status(200).json({ success: true, build: recommendedBuildIds });
    } catch (error) {
        console.error("=====================================");
        console.error("EROARE CRITICĂ LA GENERAREA AI:");
        console.error(error.message || error);
        console.error("=====================================");
        res.status(500).json({ success: false, message: 'Eroare la generarea sistemului cu AI.' });
    }
};

module.exports = { generateAiBuild };