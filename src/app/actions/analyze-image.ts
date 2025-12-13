'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

export async function analyzeImage(formData: FormData) {
    console.log("--- analyzeImage Action STARTED ---");
    try {
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error("analyzeImage: GOOGLE_API_KEY is missing from environment variables");
            throw new Error('GOOGLE_API_KEY is not set');
        }
        const genAI = new GoogleGenerativeAI(apiKey);

        const file = formData.get('file') as File;
        if (!file) {
            console.error("analyzeImage: No file found in FormData");
            throw new Error('No file uploaded');
        }
        console.log(`analyzeImage: File received. Name: ${file.name}, Size: ${file.size}, Type: ${file.type}`);

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64Image = buffer.toString('base64');
        const mimeType = file.type;
        console.log("analyzeImage: File converted to base64");

        // Updated to use the model available to this API key (as per test-gemini.js results)
        // User confirmed gemini-2.5-flash works in Python script
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        console.log("analyzeImage: Calling Gemini Model (gemini-2.5-flash)...");

        const prompt = `Act as a Triage Nurse. Analyze the image and provide a clinical description in Spanish.
Constraints:
1. MAX 50 WORDS.
2. Be objective (mention location, color, bleeding, swelling, foreign objects).
3. NO filler phrases like 'La imagen muestra...' or 'Se puede apreciar...'. Start directly with the finding.
4. Output ONLY the description.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: mimeType
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();
        console.log("analyzeImage: Gemini Response received. Length:", text.length);
        console.log("analyzeImage: Content snippet:", text.substring(0, 50));

        return { success: true, description: text };
    } catch (error) {
        console.error('analyzeImage: FATAL ERROR:', error);
        return { success: false, error: 'Failed to analyze image' };
    }
}
