const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Simple .env.local parser
function loadEnv() {
    try {
        const envPath = path.resolve(process.cwd(), '.env.local');
        if (!fs.existsSync(envPath)) {
            console.error('CRITICAL: .env.local file not found!');
            return;
        }
        const content = fs.readFileSync(envPath, 'utf8');
        content.split(/\r?\n/).forEach(line => {
            if (!line || line.trim().startsWith('#')) return;
            const parts = line.split('=');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join('=').trim().replace(/^["']|["']$/g, '');
                if (key && value) {
                    process.env[key] = value;
                }
            }
        });
        console.log('Environment variables loaded from .env.local');
    } catch (e) {
        console.error('Error loading .env.local:', e);
    }
}

async function testConnection() {
    loadEnv();

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
        console.error('CRITICAL: GOOGLE_API_KEY not found in environment');
        return;
    }

    console.log('Testing Gemini API Connection...');
    console.log('API Key present. Length:', apiKey.length);

    const imagePath = path.join(process.cwd(), 'public', 'foto.jpg');
    if (!fs.existsSync(imagePath)) {
        console.error('CRITICAL: Test image not found at ' + imagePath);
        return;
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        // Using a model found in the list
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' });

        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');

        console.log(`Image loaded from ${imagePath}. Size: ${imageBuffer.length} bytes`);

        const prompt = "Describe this image for a connection test.";

        console.log('Sending request to Gemini (gemini-2.5-flash-image)...');
        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: base64Image,
                    mimeType: 'image/jpeg'
                }
            }
        ]);

        const response = await result.response;
        const text = response.text();

        console.log('SUCCESS! Gemini responded:');
        console.log('------------------------------------------------');
        console.log(text);
        console.log('------------------------------------------------');

    } catch (error) {
        console.error('FAILED: API Connection Test Error');
        console.error(error);
    }
}

testConnection();

