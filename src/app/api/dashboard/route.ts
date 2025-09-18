import { NextRequest, NextResponse } from 'next/server';

interface DashboardStats {
    id: string;
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    icon?: string;
}

interface PatientQueueItem {
    id: string;
    name: string;
    time: string;
    type: string;
    priority: 'high' | 'medium' | 'low';
    status: 'waiting' | 'in-progress' | 'completed';
    nhs: string;
}

interface Protocol {
    id: string;
    title: string;
    description: string;
    steps: string;
    duration: string;
    category: string;
}

interface Service {
    id: string;
    name: string;
    duration: string;
    icon: string;
    category: string;
    cost?: number;
}

interface DashboardResponse {
    stats: DashboardStats[];
    patientQueue: PatientQueueItem[];
    protocols: Protocol[];
    services: Service[];
    morningDashboard: {
        totalPatients: number;
        urgentCases: number;
        completedTasks: number;
        pendingReviews: number;
    };
}

class StatsService {
    async getDashboardStats(): Promise<DashboardStats[]> {
        return [
            { id: 'patients-today', label: 'Patients Today', value: '24', change: '+3', trend: 'up', icon: '👥' },
            { id: 'appointments', label: 'Appointments', value: '18', change: '+2', trend: 'up', icon: '📅' },
            { id: 'wait-time', label: 'Avg Wait Time', value: '12 min', change: '-5 min', trend: 'down', icon: '⏱️' },
            { id: 'satisfaction', label: 'Satisfaction', value: '4.8/5', change: '+0.2', trend: 'up', icon: '⭐' }
        ];
    }
}

class PatientQueueService {
    async getPatientQueue(): Promise<PatientQueueItem[]> {
        return [
            {
                id: '1',
                name: 'Emily Carter',
                time: '09:30',
                type: 'Consultation',
                priority: 'high',
                status: 'waiting',
                nhs: 'XXX-XXX-1234'
            },
            {
                id: '2',
                name: 'Michael Thompson',
                time: '10:00',
                type: 'Follow-up',
                priority: 'medium',
                status: 'waiting',
                nhs: 'XXX-XXX-1235'
            },
            {
                id: '3',
                name: 'Sarah Johnson',
                time: '10:30',
                type: 'Emergency',
                priority: 'high',
                status: 'in-progress',
                nhs: 'XXX-XXX-1236'
            },
            {
                id: '4',
                name: 'David Wilson',
                time: '11:00',
                type: 'Procedure',
                priority: 'medium',
                status: 'waiting',
                nhs: 'XXX-XXX-1237'
            },
            {
                id: '5',
                name: 'Lisa Brown',
                time: '11:30',
                type: 'Consultation',
                priority: 'low',
                status: 'waiting',
                nhs: 'XXX-XXX-1238'
            }
        ];
    }
}

class ProtocolService {
    async getProtocols(): Promise<Protocol[]> {
        return [
            {
                id: 'hypertension',
                title: 'Hypertension Protocol',
                description: 'Standard care pathway for hypertension management',
                steps: 'BP check → Assessment → Medication review → Lifestyle advice',
                duration: '30 mins',
                category: 'cardiovascular'
            },
            {
                id: 'diabetes',
                title: 'Diabetes Check',
                description: 'Routine diabetes monitoring and management',
                steps: 'HbA1c → Foot exam → Eye screening → Med adjustment',
                duration: '45 mins',
                category: 'endocrine'
            },
            {
                id: 'respiratory',
                title: 'Respiratory Assessment',
                description: 'Comprehensive respiratory evaluation',
                steps: 'Spirometry → Chest exam → O2 sats → Treatment plan',
                duration: '25 mins',
                category: 'respiratory'
            },
            {
                id: 'mental-health',
                title: 'Mental Health Screen',
                description: 'Mental health assessment and support',
                steps: 'PHQ-9 → Risk assessment → Support plan → Referral',
                duration: '40 mins',
                category: 'mental-health'
            }
        ];
    }
}

class ServiceService {
    async getServices(): Promise<Service[]> {
        return [
            {
                id: 'consultation',
                name: 'General Consultation',
                duration: '15 mins',
                icon: '👨‍⚕️',
                category: 'general',
                cost: 80
            },
            {
                id: 'blood-test',
                name: 'Blood Test',
                duration: '10 mins',
                icon: '🩸',
                category: 'diagnostics',
                cost: 25
            },
            {
                id: 'x-ray',
                name: 'X-Ray',
                duration: '20 mins',
                icon: '🦴',
                category: 'imaging',
                cost: 120
            },
            {
                id: 'ecg',
                name: 'ECG',
                duration: '15 mins',
                icon: '❤️',
                category: 'cardiovascular',
                cost: 60
            },
            {
                id: 'vaccination',
                name: 'Vaccination',
                duration: '5 mins',
                icon: '💉',
                category: 'preventive',
                cost: 35
            },
            {
                id: 'physiotherapy',
                name: 'Physiotherapy',
                duration: '45 mins',
                icon: '🤸',
                category: 'therapy',
                cost: 90
            }
        ];
    }
}

class DashboardController {
    private statsService: StatsService;
    private queueService: PatientQueueService;
    private protocolService: ProtocolService;
    private serviceService: ServiceService;

    constructor() {
        this.statsService = new StatsService();
        this.queueService = new PatientQueueService();
        this.protocolService = new ProtocolService();
        this.serviceService = new ServiceService();
    }

    async getDashboardData(): Promise<DashboardResponse> {
        const [stats, patientQueue, protocols, services] = await Promise.all([
            this.statsService.getDashboardStats(),
            this.queueService.getPatientQueue(),
            this.protocolService.getProtocols(),
            this.serviceService.getServices()
        ]);

        return {
            stats,
            patientQueue,
            protocols,
            services,
            morningDashboard: {
                totalPatients: patientQueue.length,
                urgentCases: patientQueue.filter(p => p.priority === 'high').length,
                completedTasks: patientQueue.filter(p => p.status === 'completed').length,
                pendingReviews: patientQueue.filter(p => p.status === 'waiting').length
            }
        };
    }
}

export async function GET(request: NextRequest) {
    try {
        const controller = new DashboardController();
        const data = await controller.getDashboardData();
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Dashboard API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch dashboard data' },
            { status: 500 }
        );
    }
}