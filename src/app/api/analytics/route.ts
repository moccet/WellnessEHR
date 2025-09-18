import { NextRequest, NextResponse } from 'next/server';

interface MetricData {
    id: string;
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
}

interface ChartDataset {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
}

interface ChartData {
    labels: string[];
    datasets: ChartDataset[];
}

interface AnalyticsResponse {
    metrics: MetricData[];
    patientFlow: ChartData;
    appointmentTypes: ChartData;
    revenueAnalysis: ChartData;
    referralPatterns: ChartData;
}

class MetricsService {
    calculateMetrics(range: string): MetricData[] {
        const baseMetrics = [
            { id: 'my-patients', label: 'My Patients', value: '127', change: '+8', trend: 'up' as const, color: '#7FB88E' },
            { id: 'appointments-today', label: 'My Appointments Today', value: 12, change: '+2', trend: 'up' as const, color: '#9FC5A8' },
            { id: 'avg-consultation-time', label: 'Avg Consultation Time', value: '18 min', change: '-2 min', trend: 'down' as const, color: '#BFD9C3' },
            { id: 'patient-satisfaction', label: 'Patient Satisfaction', value: '4.9/5', change: '+0.1', trend: 'up' as const, color: '#7FB88E' },
            { id: 'follow-ups-pending', label: 'Follow-ups Pending', value: '8', change: '-3', trend: 'down' as const, color: '#9FC5A8' },
            { id: 'referrals-made', label: 'Referrals This Month', value: '15', change: '+5', trend: 'up' as const, color: '#BFD9C3' }
        ];

        const rangeMultipliers: Record<string, number> = {
            day: 0.1,
            week: 0.4,
            month: 1,
            year: 12
        };

        const multiplier = rangeMultipliers[range] || 1;

        return baseMetrics.map(metric => ({
            ...metric,
            value: typeof metric.value === 'number' 
                ? Math.round(metric.value * multiplier)
                : metric.value
        }));
    }
}

class ChartDataService {
    generatePatientFlow(range: string): ChartData {
        const labels = this.getLabelsForRange(range);
        const baseData = [8, 12, 10, 15, 11, 6, 9, 13, 11, 14, 12, 7];
        
        return {
            labels,
            datasets: [{
                label: 'My Patient Consultations',
                data: baseData.slice(0, labels.length),
                borderColor: '#7FB88E',
                backgroundColor: 'rgba(127, 184, 142, 0.1)'
            }]
        };
    }

    generateAppointmentTypes(): ChartData {
        return {
            labels: ['Consultation', 'Follow-up', 'Check-up', 'Emergency', 'Telehealth'],
            datasets: [{
                label: 'My Appointments',
                data: [25, 18, 15, 8, 12],
                backgroundColor: ['#7FB88E', '#9FC5A8', '#BFD9C3', '#DFE9DF', '#8CA795']
            }]
        };
    }

    generateRevenueAnalysis(range: string): ChartData {
        const labels = this.getMonthLabelsForRange(range);
        const baseData = [45, 52, 48, 65, 58, 62, 55, 60, 58, 67, 63, 70];
        
        return {
            labels,
            datasets: [{
                label: 'My Consultation Hours',
                data: baseData.slice(0, labels.length),
                borderColor: '#7FB88E',
                backgroundColor: 'rgba(127, 184, 142, 0.1)'
            }]
        };
    }

    generateReferralPatterns(): ChartData {
        return {
            labels: ['Cardiology', 'Orthopedics', 'Neurology', 'Dermatology', 'Psychiatry'],
            datasets: [{
                label: 'My Referrals',
                data: [8, 6, 5, 4, 3],
                backgroundColor: '#9FC5A8'
            }]
        };
    }

    private getLabelsForRange(range: string): string[] {
        switch (range) {
            case 'day':
                return ['8am', '10am', '12pm', '2pm', '4pm', '6pm'];
            case 'week':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            case 'month':
                return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
            case 'year':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            default:
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        }
    }

    private getMonthLabelsForRange(range: string): string[] {
        switch (range) {
            case 'day':
                return ['Today'];
            case 'week':
                return ['This Week', 'Last Week'];
            case 'month':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
            case 'year':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            default:
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
        }
    }
}

class AnalyticsController {
    private metricsService: MetricsService;
    private chartDataService: ChartDataService;

    constructor() {
        this.metricsService = new MetricsService();
        this.chartDataService = new ChartDataService();
    }

    async getAnalytics(range: string): Promise<AnalyticsResponse> {
        const validRanges = ['day', 'week', 'month', 'year'];
        const normalizedRange = validRanges.includes(range) ? range : 'month';

        return {
            metrics: this.metricsService.calculateMetrics(normalizedRange),
            patientFlow: this.chartDataService.generatePatientFlow(normalizedRange),
            appointmentTypes: this.chartDataService.generateAppointmentTypes(),
            revenueAnalysis: this.chartDataService.generateRevenueAnalysis(normalizedRange),
            referralPatterns: this.chartDataService.generateReferralPatterns()
        };
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const range = searchParams.get('range') || 'month';
        
        const controller = new AnalyticsController();
        const data = await controller.getAnalytics(range);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Analytics API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch analytics data' },
            { status: 500 }
        );
    }
}