export interface Patient {
    id: string;
    // Add patient details
}

export interface TriageResult {
    urgency: 'low' | 'medium' | 'high' | 'critical';
    // Add details
}
