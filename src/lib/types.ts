export interface Patient {
    id: string;
    name: string;
    age: number;
    nhs: string;
    service: string;
    time: string;
    status: 'waiting' | 'active' | 'completed';
    hasNotes?: boolean;
}

export interface Service {
    id: string;
    name: string;
    duration: string;
    icon: string;
}

export interface Prescription {
    name: string;
    dose: string;
    frequency: string;
    duration: string;
}

export interface StatsCard {
    id: string;
    label: string;
    value: string;
    change?: string;
    changeType?: 'positive' | 'negative';
    revenue?: string;
    hasNotes?: boolean;
}

export interface Protocol {
    id: string;
    title: string;
    steps: string;
}

export interface ClinicalState {
    currentView: 'dashboard' | 'patients' | 'services' | 'prescriptions' | 'labs' | 'referrals' | 'billing' | 'analytics' | 'error-codes';
    currentPatient: Patient | null;
    currentPanelTab: 'consultation' | 'prescription' | 'referral' | 'labs' | 'billing' | 'history';
    isRecording: boolean;
    recordingTime: number;
    prescriptions: Prescription[];
    videoCallActive: boolean;
    aiActive: boolean;
    voiceActive: boolean;
    morningDashboardSeen: boolean;
    clinicalPanelOpen: boolean;
    photoModalOpen: boolean;
    daySummaryOpen: boolean;
}

export interface MorningDashboardData {
    greeting: string;
    date: string;
    schedule: {
        totalPatients: number;
        firstPatient: string;
        videoConsults: number;
    };
    actionItems: {
        labResults: number;
        prescriptionRenewals: number;
        insuranceForms: number;
    };
    clinicalAlerts: Array<{
        message: string;
        priority: 'low' | 'medium' | 'high';
        type: 'info' | 'warning' | 'success';
    }>;
    teamUpdates: Array<{
        message: string;
        author?: string;
    }>;
}

export interface AIMessage {
    id: string;
    type: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export interface VitalSigns {
    temperature?: string;
    bloodPressure?: string;
    heartRate?: string;
    oxygenSaturation?: string;
}

export interface ConsultationData {
    chiefComplaint: string;
    vitals: VitalSigns;
    assessment: string;
    plan: string;
}