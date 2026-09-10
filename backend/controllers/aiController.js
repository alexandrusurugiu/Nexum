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
            model: "gemini-3.6-flash"
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

const analyzeBuild = async (req, res) => {
    try {
        const { buildComponents, targetGames, targetResolution } = req.body;

        if (!buildComponents || !buildComponents.cpu || !buildComponents.gpu) {
            return res.status(400).json({ error: "Sistemul trebuie să conțină cel puțin un procesor (CPU) și o placă video (GPU)." });
        }

        const gamesToAnalyze = targetGames && targetGames.length > 0 
            ? targetGames.join(", ") 
            : "Cyberpunk 2077, Counter-Strike 2, Call of Duty: Warzone";
            
        const resolution = targetResolution || "1440p (QHD)";

        const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });

        const prompt = `
            Ești un expert în hardware PC. Analizează următoarea configurație PC:
            ${JSON.stringify(buildComponents)}
            
            Estimează performanța specific pentru aceste jocuri: ${gamesToAnalyze}.
            IMPORTANT: Rezoluția țintă pentru care faci estimările este ${resolution}.
            
            Returnează răspunsul STRICT în următorul format JSON, fără text adițional sau block-uri markdown:
            {
                "fps_estimates": [
                    {"game": "Numele Jocului 1", "resolution": "${resolution}", "estimated_fps": "65-75"},
                    {"game": "Numele Jocului 2", "resolution": "${resolution}", "estimated_fps": "120+"}
                ],
                "bottleneck": {
                    "has_bottleneck": true/false,
                    "component": "Numele componentei (ex. Intel Core i3-12100F) sau null",
                    "explanation": "Explicație scurtă a limitării (ex: Procesorul este prea slab pentru RTX 4080)."
                },
                "general_verdict": "O propoziție scurtă despre performanța generală a sistemului."
            }
        `;

        const result = await model.generateContent(prompt);
        let aiResponseText = result.response.text();
        
        aiResponseText = aiResponseText.replace(/```json/gi, '').replace(/```/gi, '').trim();
        const jsonMatch = aiResponseText.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            throw new Error("AI-ul nu a generat un JSON valid la analiză.");
        }

        res.status(200).json(JSON.parse(jsonMatch[0]));
    } catch (error) {
        console.error("=====================================");
        console.error("EROARE CRITICĂ LA ANALIZA AI:");
        console.error(error.message || error);
        console.error("=====================================");
        res.status(500).json({ error: 'Eroare la analiza configurației folosind AI.' });
    }
};

module.exports = { 
    generateAiBuild, 
    analyzeBuild 
};