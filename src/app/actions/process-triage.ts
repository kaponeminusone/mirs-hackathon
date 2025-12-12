'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface TriageResponse {
    transcript: string;
    aiResponse: string;
    triageLevel: 'RED' | 'ORANGE' | 'YELLOW' | 'GREEN';
    suggestedAction: string;
}

const SYSTEM_PROMPT = `You are MIRS, an AI Triage Assistant. Analyze the patient's transcript.
1. Identify symptoms and risk factors.
2. Classify urgency (Manchester Triage System).
3. Output ONLY JSON with keys: { reply_text, triage_color, action_type }.
- reply_text: Empowering, concise medical response.
- triage_color: RED, ORANGE, YELLOW, or GREEN.
- action_type: Immediate Action, Consultant Review, Routine Check, or Self Care.
`;

export async function processVoiceTriage(formData: FormData): Promise<TriageResponse> {
    const file = formData.get('file') as Blob;

    if (!file) {
        throw new Error('No audio file provided');
    }

    try {
        // 1. Transcribe Audio
        // We need to cast the Blob to a File-like object that Groq accepts if it's not strictly compatible
        // But usually passing the File directly from FormData works for node-fetch based SDKs
        // If running in Node environment we might need buffer conversion, but let's try direct first.

        // Convert Blob to File instance if needed, or just pass as is to the SDK which usually handles it.
        // NOTE: Groq SDK usually expects 'file' to be a ReadStream or File object.

        const transcription = await groq.audio.transcriptions.create({
            file: file as File, // Type assertion for SDK compatibility
            model: 'whisper-large-v3',
        });

        const transcriptText = transcription.text;
        console.log('Transcript:', transcriptText);

        // 2. Analyze with LLM
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: transcriptText },
            ],
            model: 'llama3-70b-8192',
            temperature: 0.1,
            response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;
        if (!content) throw new Error('No response from LLM');

        const result = JSON.parse(content);

        return {
            transcript: transcriptText,
            aiResponse: result.reply_text,
            triageLevel: result.triage_color,
            suggestedAction: result.action_type,
        };

    } catch (error) {
        console.error('Error processing triage:', error);
        throw new Error('Failed to process voice triage');
    }
}
