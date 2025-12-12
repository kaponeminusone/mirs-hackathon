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

const SYSTEM_PROMPT = `Eres MIRS, un Asistente de Triaje con IA. Analiza la transcripción del paciente.
1. Identifica síntomas y factores de riesgo.
2. Clasifica la urgencia (Sistema de Triaje Manchester).
3. Genera SOLAMENTE un JSON con las claves: { reply_text, triage_color, action_type }.
- reply_text: Respuesta médica concisa y empoderadora en ESPAÑOL.
- triage_color: RED, ORANGE, YELLOW, o GREEN.
- action_type: Acción Inmediata, Revisión por Consultor, Chequeo de Rutina, o Autocuidado.
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
            language: 'es', // Force Spanish transcription logic help
        });

        const transcriptText = transcription.text;
        console.log('Transcript:', transcriptText);

        // 2. Analyze with LLM
        const completion = await groq.chat.completions.create({
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                { role: 'user', content: transcriptText },
            ],
            model: 'llama-3.3-70b-versatile',
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

    } catch (error: any) {
        console.error('Error processing triage:', error);
        throw new Error(`Failed to process voice triage: ${error.message}`);
    }
}
