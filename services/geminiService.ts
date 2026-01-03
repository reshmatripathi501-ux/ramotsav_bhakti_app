
import { GoogleGenAI } from "@google/genai";
import { darshanImageBase64 } from "../image";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    console.error("Gemini API key is not set. Please set the API_KEY environment variable.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const imagePart = {
  inlineData: {
    mimeType: 'image/jpeg',
    data: darshanImageBase64,
  },
};

export const askDarshanAI = async (question: string) => {
    if (!API_KEY) {
        return "क्षमस्व, AI से जुड़ने के लिए API कुंजी की आवश्यकता है।";
    }
    try {
        const textPart = {
            text: `आप एक जानकार और भक्तिपूर्ण मार्गदर्शक हैं। आपको भगवान श्री राम की एक छवि प्रदान की गई है। उपयोगकर्ता के प्रश्न का उत्तर विनम्रतापूर्वक और विस्तृत रूप से हिंदी में दें, छवि में दिख रहे विवरणों पर ध्यान केंद्रित करते हुए। प्रश्न: "${question}"`
        };
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-3-flash-preview',
            contents: { parts: [imagePart, textPart] },
        });
        return responseStream;
    } catch (error) {
        console.error("Error calling Gemini API for Darshan AI:", error);
        return "क्षमस्व, AI से संपर्क करते समय एक त्रुटि हुई।";
    }
};

export const askGranthAI = async (context: string, question: string) => {
    if (!API_KEY) {
        return "क्षमस्व, AI से जुड़ने के लिए API कुंजी की आवश्यकता है।";
    }

    try {
        const prompt = `
            आप एक ज्ञानी और सहायक गुरु हैं जो हिंदू धर्मग्रंथों के विशेषज्ञ हैं।
            नीचे दिए गए ग्रंथ के पाठ के आधार पर, उपयोगकर्ता के प्रश्न का उत्तर दें।
            आपका उत्तर सरल, विनम्र और स्टेप-बाय-स्टेप हिंदी में होना चाहिए।

            ग्रंथ का पाठ:
            ---
            ${context}
            ---

            उपयोगकर्ता का प्रश्न:
            ---
            ${question}
            ---

            आपका उत्तर:
        `;

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return responseStream;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "क्षमस्व, AI से संपर्क करते समय एक त्रुटि हुई।";
    }
};

export const askGlobalAI = async (question: string) => {
    if (!API_KEY) {
        return "क्षमस्व, AI से जुड़ने के लिए API कुंजी की आवश्यकता है।";
    }

    try {
        const prompt = `
            आप 'रामोत्सव' ऐप के एक जानकार और सहायक AI गुरु हैं जो हिंदू धर्म, ग्रंथ, त्यौहारों और परंपराओं के विशेषज्ञ हैं।
            उपयोगकर्ता के प्रश्न का उत्तर सम्मानपूर्वक और स्पष्ट रूप से हिंदी में दें।
            
            प्रश्न: "${question}"
            
            उत्तर:
        `;

        const responseStream = await ai.models.generateContentStream({
            model: "gemini-3-flash-preview",
            contents: prompt,
        });

        return responseStream;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "क्षमस्व, AI से संपर्क करते समय एक त्रुटि हुई।";
    }
};
