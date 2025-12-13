'use server';

import Groq from 'groq-sdk';

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export interface TriageResponse {
    transcript: string;
    aiResponse: string;
    triageLevel: string; // Relaxed type to accept backend values or mapped colors
    suggestedAction: string;
    sessionId?: string;
    followUpQuestions?: string[];
    supplementalMessage?: string;
}

// Backend Response Interface
interface BackendTriageResponse {
    sessionId: string;
    patientId: string;
    urgencyLevel: string;
    recommendation: string;
    warningSigns: string[];
    epsBrief: string;
    followUpQuestions: string[];
}

export async function transcribeAudio(formData: FormData): Promise<{ transcript: string }> {
    const file = formData.get('file') as Blob;
    if (!file) throw new Error('No audio file provided');

    try {
        const transcription = await groq.audio.transcriptions.create({
            file: file as File,
            model: 'whisper-large-v3',
            language: 'es',
        });
        return { transcript: transcription.text };
    } catch (error: any) {
        console.error('Transcription error:', error);
        throw new Error(`Transcription failed: ${error.message}`);
    }
}

// Deprecated or can be kept as a wrapper if needed, but we will use the split flow.
export async function processVoiceTriage(formData: FormData, sessionId: string = 'session-1', patientId: string = '1'): Promise<TriageResponse> {
    // ... (Legacy implementation, can delegate to transcribe + text triage if needed)
    const { transcript } = await transcribeAudio(formData);
    return await processTextTriage(transcript, sessionId, patientId);
}

export async function processTextTriage(
    text: string,
    sessionId: string = 'default-session',
    patientId: string = '1'
): Promise<TriageResponse> {
    console.log(`SERVER ACTION: Sending to Backend API: ${text} | Session: ${sessionId} | Patient: ${patientId}`);

    try {
        const payload = {
            patientId: patientId,
            sessionId: sessionId,
            content: text,
            language: "es"
        };

        // Use test-final-1 if session is 'test-final-1' or default logic? 
        // User asked to use 'test-final-1' for good results. 
        // We will pass it from client, but purely debugging logs here.
        console.log('Fetching based on payload:', payload);

        const response = await fetch('http://localhost:8080/api/triage/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Backend API Error (${response.status}): ${errorText}`);
        }

        const data: BackendTriageResponse = await response.json();
        console.log('Backend Response:', data);

        // Map Raw Data - No Markdown Formatting
        // Main content is the recommendation.
        // If there are follow-up questions, we append them cleanly.
        let aiContent = data.recommendation; // Just the core recommendation now

        // --- NEW: Llama 3 Supplemental Message ---
        let supplementalMessage = "";
        try {
            const llamaCompletion = await groq.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: "Eres un asistente médico empático. Tu única tarea es dar un mensaje muy breve (max 15 palabras) de apoyo emocional o cierre cortés al paciente, basado en la recomendación técnica que acaba de recibir. No repitas la recomendación. Sé cálido."
                    },
                    {
                        role: "user",
                        content: `El paciente dijo: "${text}". La recomendación médica fue: "${data.recommendation}". Dame el mensaje corto de apoyo.`
                    }
                ],
                model: "llama3-8b-8192",
            });
            supplementalMessage = llamaCompletion.choices[0]?.message?.content || "";
        } catch (llamaError) {
            console.error("Llama supplemental generation failed:", llamaError);
            // Non-critical, just ignore
        }

        return {
            transcript: text,
            aiResponse: aiContent,
            triageLevel: mapUrgencyToColor(data.urgencyLevel),
            suggestedAction: data.urgencyLevel,
            sessionId: data.sessionId,
            followUpQuestions: data.followUpQuestions,
            supplementalMessage: supplementalMessage // Include the new message
        };

    } catch (error: any) {
        console.error('Error processing text triage:', error);
        throw new Error(`Failed to process text triage: ${error.message}`);
    }
}

// Helpers
function getUrgencyEmoji(level: string): string {
    const l = level.toUpperCase();
    if (l.includes('ALTO') || l.includes('CRITICO') || l.includes('EMERGENCIA')) return '🔴';
    if (l.includes('MEDIO') || l.includes('URGENTE')) return '🟠';
    if (l.includes('BAJO') || l.includes('NORMAL')) return '🟢';
    return '📋';
}

function mapUrgencyToColor(level: string): string {
    const l = level.toUpperCase();
    if (l.includes('ALTO') || l.includes('CRITICO')) return 'RED';
    if (l.includes('MEDIO') || l.includes('URGENTE')) return 'ORANGE'; // Or YELLOW based on Manchester
    if (l.includes('BAJO')) return 'GREEN';
    return 'BLUE';
}
