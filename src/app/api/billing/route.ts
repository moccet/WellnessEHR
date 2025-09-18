import { NextRequest, NextResponse } from 'next/server';

interface Invoice {
    id: string;
    patientName: string;
    patientNHS: string;
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'overdue' | 'cancelled';
    services: string[];
    dueDate?: string;
}

interface BillingMetrics {
    totalRevenue: number;
    pendingPayments: number;
    overdueAmount: number;
    averagePaymentTime: number;
    collectionRate: number;
    insuranceClaims: number;
}

interface RevenueChart {
    labels: string[];
    data: number[];
}

interface BillingResponse {
    invoices: Invoice[];
    metrics: BillingMetrics;
    revenueChart: RevenueChart;
}

class InvoiceService {
    private invoices: Invoice[] = [
        {
            id: 'INV-001',
            patientName: 'Olivia Randall',
            patientNHS: 'XXX-XXX-2847',
            date: '2025-09-15',
            amount: 250,
            status: 'paid',
            services: ['Consultation', 'Blood Test']
        },
        {
            id: 'INV-002',
            patientName: 'Michael Chen',
            patientNHS: 'XXX-XXX-2848',
            date: '2025-09-16',
            amount: 180,
            status: 'pending',
            services: ['Follow-up'],
            dueDate: '2025-09-30'
        },
        {
            id: 'INV-003',
            patientName: 'Jessica Williams',
            patientNHS: 'XXX-XXX-2849',
            date: '2025-09-14',
            amount: 450,
            status: 'overdue',
            services: ['Procedure', 'Consultation'],
            dueDate: '2025-09-17'
        },
        {
            id: 'INV-004',
            patientName: 'Tom Anderson',
            patientNHS: 'XXX-XXX-2850',
            date: '2025-09-18',
            amount: 320,
            status: 'pending',
            services: ['Emergency Visit'],
            dueDate: '2025-10-02'
        },
        {
            id: 'INV-005',
            patientName: 'Sarah Thompson',
            patientNHS: 'XXX-XXX-2851',
            date: '2025-09-17',
            amount: 150,
            status: 'paid',
            services: ['Telehealth Consultation']
        },
        {
            id: 'INV-006',
            patientName: 'Robert Martinez',
            patientNHS: 'XXX-XXX-2852',
            date: '2025-09-16',
            amount: 580,
            status: 'pending',
            services: ['Surgery', 'Post-op Care'],
            dueDate: '2025-10-01'
        }
    ];

    async getInvoices(status?: string): Promise<Invoice[]> {
        if (status && ['paid', 'pending', 'overdue', 'cancelled'].includes(status)) {
            return this.invoices.filter(inv => inv.status === status);
        }
        return this.invoices;
    }

    async createInvoice(invoice: Omit<Invoice, 'id'>): Promise<Invoice> {
        const newInvoice: Invoice = {
            ...invoice,
            id: `INV-${String(this.invoices.length + 1).padStart(3, '0')}`
        };
        this.invoices.push(newInvoice);
        return newInvoice;
    }

    async updateInvoiceStatus(id: string, status: Invoice['status']): Promise<Invoice | null> {
        const index = this.invoices.findIndex(inv => inv.id === id);
        if (index !== -1) {
            this.invoices[index].status = status;
            return this.invoices[index];
        }
        return null;
    }
}

class BillingMetricsService {
    calculateMetrics(invoices: Invoice[]): BillingMetrics {
        const paidInvoices = invoices.filter(inv => inv.status === 'paid');
        const pendingInvoices = invoices.filter(inv => inv.status === 'pending');
        const overdueInvoices = invoices.filter(inv => inv.status === 'overdue');

        const totalRevenue = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0) +
                           pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0) * 0.9;

        const pendingPayments = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
        const overdueAmount = overdueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

        const collectionRate = invoices.length > 0 
            ? Math.round((paidInvoices.length / invoices.length) * 100)
            : 0;

        return {
            totalRevenue: Math.round(totalRevenue),
            pendingPayments,
            overdueAmount,
            averagePaymentTime: 12,
            collectionRate,
            insuranceClaims: Math.floor(invoices.length * 0.6)
        };
    }

    generateRevenueChart(): RevenueChart {
        const currentMonth = new Date().getMonth();
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const labels = [];
        const data = [];
        const baseRevenue = 90000;
        
        for (let i = 5; i >= 0; i--) {
            const monthIndex = (currentMonth - i + 12) % 12;
            labels.push(months[monthIndex]);
            data.push(baseRevenue + Math.random() * 40000 + i * 5000);
        }

        return {
            labels,
            data: data.map(v => Math.round(v))
        };
    }
}

class PaymentProcessor {
    async processPayment(invoiceId: string, method: string, amount: number): Promise<boolean> {
        console.log(`Processing ${method} payment of $${amount} for invoice ${invoiceId}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return Math.random() > 0.1;
    }

    async submitInsuranceClaim(invoice: Invoice): Promise<string> {
        console.log(`Submitting insurance claim for invoice ${invoice.id}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return `CLAIM-${Date.now()}`;
    }
}

class BillingController {
    private invoiceService: InvoiceService;
    private metricsService: BillingMetricsService;
    private paymentProcessor: PaymentProcessor;

    constructor() {
        this.invoiceService = new InvoiceService();
        this.metricsService = new BillingMetricsService();
        this.paymentProcessor = new PaymentProcessor();
    }

    async getBillingData(status?: string): Promise<BillingResponse> {
        const invoices = await this.invoiceService.getInvoices(status);
        const metrics = this.metricsService.calculateMetrics(invoices);
        const revenueChart = this.metricsService.generateRevenueChart();

        return {
            invoices,
            metrics,
            revenueChart
        };
    }

    async processPayment(invoiceId: string, method: string, amount: number): Promise<boolean> {
        const success = await this.paymentProcessor.processPayment(invoiceId, method, amount);
        
        if (success) {
            await this.invoiceService.updateInvoiceStatus(invoiceId, 'paid');
        }
        
        return success;
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const status = searchParams.get('status') || undefined;
        
        const controller = new BillingController();
        const data = await controller.getBillingData(status);
        
        return NextResponse.json(data);
    } catch (error) {
        console.error('Billing API error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch billing data' },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, invoiceId, method, amount } = body;
        
        const controller = new BillingController();
        
        if (action === 'process-payment') {
            const success = await controller.processPayment(invoiceId, method, amount);
            return NextResponse.json({ success });
        }
        
        return NextResponse.json(
            { error: 'Invalid action' },
            { status: 400 }
        );
    } catch (error) {
        console.error('Billing API error:', error);
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}