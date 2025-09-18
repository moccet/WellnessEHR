import { NextRequest, NextResponse } from 'next/server';

interface ConsultationRecord {
    id: string;
    patientId: string;
    date: string;
    chiefComplaint: string;
    presentingHistory: string;
    examination: string;
    diagnosis: string;
    treatment: string;
    followUpInstructions: string;
    doctorId: string;
    status: 'draft' | 'complete' | 'reviewed';
}

interface Prescription {
    id: string;
    patientId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
    prescribedBy: string;
    prescribedDate: string;
    status: 'active' | 'completed' | 'cancelled';
}

interface LabOrder {
    id: string;
    patientId: string;
    testType: string;
    priority: 'routine' | 'urgent' | 'stat';
    orderedBy: string;
    orderedDate: string;
    scheduledDate?: string;
    status: 'ordered' | 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
    results?: {
        value: string;
        normalRange: string;
        flag?: 'high' | 'low' | 'critical';
    }[];
}

interface Referral {
    id: string;
    patientId: string;
    specialty: string;
    urgency: 'routine' | 'urgent' | 'emergency';
    reason: string;
    clinicalSummary: string;
    preferredProvider?: string;
    referredBy: string;
    referredDate: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
}

class ConsultationService {
    private consultations: ConsultationRecord[] = [
        {
            id: '1',
            patientId: '1',
            date: '2025-09-18',
            chiefComplaint: 'Chest pain and shortness of breath',
            presentingHistory: 'Patient reports chest pain onset 2 hours ago, accompanied by shortness of breath',
            examination: 'BP 140/90, HR 95, chest clear, no murmurs',
            diagnosis: 'Anxiety-related chest pain, hypertension',
            treatment: 'Reassurance, breathing exercises, review hypertension medication',
            followUpInstructions: 'Return if symptoms worsen, follow up in 1 week',
            doctorId: 'dr001',
            status: 'complete'
        }
    ];

    async getConsultations(patientId?: string): Promise<ConsultationRecord[]> {
        if (patientId) {
            return this.consultations.filter(c => c.patientId === patientId);
        }
        return this.consultations;
    }

    async createConsultation(consultation: Omit<ConsultationRecord, 'id'>): Promise<ConsultationRecord> {
        const newConsultation: ConsultationRecord = {
            ...consultation,
            id: String(this.consultations.length + 1)
        };
        this.consultations.push(newConsultation);
        return newConsultation;
    }
}

class PrescriptionService {
    private prescriptions: Prescription[] = [
        {
            id: '1',
            patientId: '1',
            medicationName: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take with or without food',
            prescribedBy: 'dr001',
            prescribedDate: '2025-09-18',
            status: 'active'
        }
    ];

    async getPrescriptions(patientId?: string): Promise<Prescription[]> {
        if (patientId) {
            return this.prescriptions.filter(p => p.patientId === patientId);
        }
        return this.prescriptions;
    }

    async createPrescription(prescription: Omit<Prescription, 'id'>): Promise<Prescription> {
        const newPrescription: Prescription = {
            ...prescription,
            id: String(this.prescriptions.length + 1)
        };
        this.prescriptions.push(newPrescription);
        return newPrescription;
    }
}

class LabService {
    private labOrders: LabOrder[] = [
        {
            id: '1',
            patientId: '1',
            testType: 'Complete Blood Count',
            priority: 'routine',
            orderedBy: 'dr001',
            orderedDate: '2025-09-18',
            status: 'ordered'
        }
    ];

    async getLabOrders(patientId?: string): Promise<LabOrder[]> {
        if (patientId) {
            return this.labOrders.filter(l => l.patientId === patientId);
        }
        return this.labOrders;
    }

    async createLabOrder(labOrder: Omit<LabOrder, 'id'>): Promise<LabOrder> {
        const newLabOrder: LabOrder = {
            ...labOrder,
            id: String(this.labOrders.length + 1)
        };
        this.labOrders.push(newLabOrder);
        return newLabOrder;
    }
}

class ReferralService {
    private referrals: Referral[] = [
        {
            id: '1',
            patientId: '1',
            specialty: 'Cardiology',
            urgency: 'routine',
            reason: 'Hypertension management',
            clinicalSummary: 'Patient with poorly controlled hypertension despite medication',
            referredBy: 'dr001',
            referredDate: '2025-09-18',
            status: 'pending'
        }
    ];

    async getReferrals(patientId?: string): Promise<Referral[]> {
        if (patientId) {
            return this.referrals.filter(r => r.patientId === patientId);
        }
        return this.referrals;
    }

    async createReferral(referral: Omit<Referral, 'id'>): Promise<Referral> {
        const newReferral: Referral = {
            ...referral,
            id: String(this.referrals.length + 1)
        };
        this.referrals.push(newReferral);
        return newReferral;
    }
}

class ClinicalController {
    private consultationService: ConsultationService;
    private prescriptionService: PrescriptionService;
    private labService: LabService;
    private referralService: ReferralService;

    constructor() {
        this.consultationService = new ConsultationService();
        this.prescriptionService = new PrescriptionService();
        this.labService = new LabService();
        this.referralService = new ReferralService();
    }

    async getClinicalData(type: string, patientId?: string) {
        switch (type) {
            case 'consultations':
                return this.consultationService.getConsultations(patientId);
            case 'prescriptions':
                return this.prescriptionService.getPrescriptions(patientId);
            case 'labs':
                return this.labService.getLabOrders(patientId);
            case 'referrals':
                return this.referralService.getReferrals(patientId);
            default:
                throw new Error(`Unknown clinical data type: ${type}`);
        }
    }

    async createClinicalRecord(type: string, data: any) {
        switch (type) {
            case 'consultations':
                return this.consultationService.createConsultation(data);
            case 'prescriptions':
                return this.prescriptionService.createPrescription(data);
            case 'labs':
                return this.labService.createLabOrder(data);
            case 'referrals':
                return this.referralService.createReferral(data);
            default:
                throw new Error(`Unknown clinical data type: ${type}`);
        }
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const type = searchParams.get('type');
        const patientId = searchParams.get('patientId') || undefined;

        if (!type) {
            return NextResponse.json(
                { error: 'Type parameter is required' },
                { status: 400 }
            );
        }

        const controller = new ClinicalController();
        const data = await controller.getClinicalData(type, patientId);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Clinical API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch clinical data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { type, ...data } = body;

        if (!type) {
            return NextResponse.json(
                { error: 'Type is required' },
                { status: 400 }
            );
        }

        const controller = new ClinicalController();
        const result = await controller.createClinicalRecord(type, data);
        
        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error('Clinical record creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create clinical record' },
            { status: 500 }
        );
    }
}