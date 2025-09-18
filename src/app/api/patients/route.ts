import { NextRequest, NextResponse } from 'next/server';

interface Patient {
    id: string;
    name: string;
    nhs: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    phone: string;
    email: string;
    address: string;
    emergencyContact: {
        name: string;
        phone: string;
        relationship: string;
    };
    medicalHistory: string[];
    allergies: string[];
    medications: string[];
    lastVisit?: string;
    nextAppointment?: string;
    status: 'active' | 'inactive' | 'deceased';
}

interface PatientSearchFilters {
    search?: string;
    status?: string;
    ageRange?: string;
    gender?: string;
    hasAllergies?: boolean;
}

class PatientService {
    private patients: Patient[] = [
        {
            id: '1',
            name: 'Olivia Randall',
            nhs: 'XXX-XXX-2847',
            age: 34,
            gender: 'female',
            phone: '+44 7700 900123',
            email: 'olivia.randall@email.com',
            address: '123 High Street, London, SW1A 1AA',
            emergencyContact: {
                name: 'James Randall',
                phone: '+44 7700 900124',
                relationship: 'Spouse'
            },
            medicalHistory: ['Hypertension', 'Type 2 Diabetes'],
            allergies: ['Penicillin'],
            medications: ['Metformin 500mg', 'Lisinopril 10mg'],
            lastVisit: '2025-09-15',
            nextAppointment: '2025-10-15',
            status: 'active'
        },
        {
            id: '2',
            name: 'Michael Chen',
            nhs: 'XXX-XXX-2848',
            age: 42,
            gender: 'male',
            phone: '+44 7700 900125',
            email: 'michael.chen@email.com',
            address: '456 Oak Avenue, Manchester, M1 2AB',
            emergencyContact: {
                name: 'Susan Chen',
                phone: '+44 7700 900126',
                relationship: 'Wife'
            },
            medicalHistory: ['Asthma'],
            allergies: ['Shellfish'],
            medications: ['Ventolin Inhaler'],
            lastVisit: '2025-09-10',
            status: 'active'
        },
        {
            id: '3',
            name: 'Jessica Williams',
            nhs: 'XXX-XXX-2849',
            age: 28,
            gender: 'female',
            phone: '+44 7700 900127',
            email: 'jessica.williams@email.com',
            address: '789 Elm Road, Birmingham, B1 3CD',
            emergencyContact: {
                name: 'Robert Williams',
                phone: '+44 7700 900128',
                relationship: 'Father'
            },
            medicalHistory: ['Migraine', 'Iron Deficiency Anemia'],
            allergies: [],
            medications: ['Iron Supplements', 'Sumatriptan'],
            lastVisit: '2025-09-12',
            nextAppointment: '2025-10-20',
            status: 'active'
        },
        {
            id: '4',
            name: 'Tom Anderson',
            nhs: 'XXX-XXX-2850',
            age: 56,
            gender: 'male',
            phone: '+44 7700 900129',
            email: 'tom.anderson@email.com',
            address: '321 Pine Street, Leeds, LS1 4EF',
            emergencyContact: {
                name: 'Mary Anderson',
                phone: '+44 7700 900130',
                relationship: 'Wife'
            },
            medicalHistory: ['High Cholesterol', 'Arthritis'],
            allergies: ['Latex'],
            medications: ['Atorvastatin 20mg', 'Ibuprofen'],
            lastVisit: '2025-09-08',
            status: 'active'
        }
    ];

    async getAllPatients(filters?: PatientSearchFilters): Promise<Patient[]> {
        let filteredPatients = [...this.patients];

        if (filters?.search) {
            const searchTerm = filters.search.toLowerCase();
            filteredPatients = filteredPatients.filter(patient =>
                patient.name.toLowerCase().includes(searchTerm) ||
                patient.nhs.includes(searchTerm) ||
                patient.email.toLowerCase().includes(searchTerm)
            );
        }

        if (filters?.status) {
            filteredPatients = filteredPatients.filter(patient =>
                patient.status === filters.status
            );
        }

        if (filters?.gender) {
            filteredPatients = filteredPatients.filter(patient =>
                patient.gender === filters.gender
            );
        }

        if (filters?.hasAllergies !== undefined) {
            filteredPatients = filteredPatients.filter(patient =>
                filters.hasAllergies ? patient.allergies.length > 0 : patient.allergies.length === 0
            );
        }

        return filteredPatients;
    }

    async getPatientById(id: string): Promise<Patient | null> {
        return this.patients.find(patient => patient.id === id) || null;
    }

    async createPatient(patientData: Omit<Patient, 'id'>): Promise<Patient> {
        const newPatient: Patient = {
            ...patientData,
            id: String(this.patients.length + 1)
        };
        this.patients.push(newPatient);
        return newPatient;
    }

    async updatePatient(id: string, updates: Partial<Patient>): Promise<Patient | null> {
        const index = this.patients.findIndex(patient => patient.id === id);
        if (index === -1) return null;

        this.patients[index] = { ...this.patients[index], ...updates };
        return this.patients[index];
    }

    async deletePatient(id: string): Promise<boolean> {
        const index = this.patients.findIndex(patient => patient.id === id);
        if (index === -1) return false;

        this.patients.splice(index, 1);
        return true;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const id = searchParams.get('id');
        
        const patientService = new PatientService();
        
        if (id) {
            const patient = await patientService.getPatientById(id);
            if (!patient) {
                return NextResponse.json(
                    { error: 'Patient not found' },
                    { status: 404 }
                );
            }
            return NextResponse.json(patient);
        }

        const filters: PatientSearchFilters = {
            search: searchParams.get('search') || undefined,
            status: searchParams.get('status') || undefined,
            gender: searchParams.get('gender') || undefined,
            hasAllergies: searchParams.get('hasAllergies') === 'true' ? true : 
                         searchParams.get('hasAllergies') === 'false' ? false : undefined
        };

        const patients = await patientService.getAllPatients(filters);
        return NextResponse.json(patients);
    } catch (error) {
        console.error('Patients API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch patients' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const patientData = await request.json();
        const patientService = new PatientService();
        const newPatient = await patientService.createPatient(patientData);
        
        return NextResponse.json(newPatient, { status: 201 });
    } catch (error) {
        console.error('Patient creation error:', error);
        return NextResponse.json(
            { error: 'Failed to create patient' },
            { status: 500 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { id, ...updates } = await request.json();
        const patientService = new PatientService();
        const updatedPatient = await patientService.updatePatient(id, updates);
        
        if (!updatedPatient) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json(updatedPatient);
    } catch (error) {
        console.error('Patient update error:', error);
        return NextResponse.json(
            { error: 'Failed to update patient' },
            { status: 500 }
        );
    }
}

export async function DELETE(request: NextRequest) {
    try {
        const { id } = await request.json();
        const patientService = new PatientService();
        const deleted = await patientService.deletePatient(id);
        
        if (!deleted) {
            return NextResponse.json(
                { error: 'Patient not found' },
                { status: 404 }
            );
        }
        
        return NextResponse.json({ message: 'Patient deleted successfully' });
    } catch (error) {
        console.error('Patient deletion error:', error);
        return NextResponse.json(
            { error: 'Failed to delete patient' },
            { status: 500 }
        );
    }
}