import { NextRequest, NextResponse } from 'next/server';
import { ErrorCode, EHRError } from '@/lib/errorCodes';

interface ErrorReport {
    id: string;
    timestamp: Date;
    errorCode: ErrorCode;
    message: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    userId?: string;
    sessionId?: string;
    userAgent?: string;
    url?: string;
    stackTrace?: string;
    additionalData?: Record<string, any>;
    environment: string;
    version: string;
    status: 'new' | 'acknowledged' | 'investigating' | 'resolved' | 'closed';
    assignedTo?: string;
    resolutionNotes?: string;
}

interface ErrorReportRequest {
    errorCode: ErrorCode;
    message: string;
    stackTrace?: string;
    url?: string;
    userId?: string;
    sessionId?: string;
    additionalData?: Record<string, any>;
}

interface ErrorReportResponse {
    success: boolean;
    reportId: string;
    message: string;
    escalationRequired?: boolean;
    immediateActions?: string[];
}

class ErrorReportingService {
    private reports: ErrorReport[] = [];

    async createErrorReport(reportData: ErrorReportRequest): Promise<ErrorReport> {
        const ehrError = new EHRError(reportData.errorCode, reportData.message, reportData.additionalData);
        const errorDetails = ehrError.getErrorDetails();

        const report: ErrorReport = {
            id: `ER-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date(),
            errorCode: reportData.errorCode,
            message: reportData.message,
            severity: errorDetails?.severity || 'medium',
            category: errorDetails?.category || 'Unknown',
            userId: reportData.userId,
            sessionId: reportData.sessionId,
            userAgent: reportData.additionalData?.userAgent,
            url: reportData.url,
            stackTrace: reportData.stackTrace,
            additionalData: reportData.additionalData,
            environment: process.env.NODE_ENV || 'development',
            version: process.env.APP_VERSION || '1.0.0',
            status: 'new'
        };

        this.reports.push(report);
        
        // Auto-escalate critical errors
        if (report.severity === 'critical') {
            await this.escalateCriticalError(report);
        }

        return report;
    }

    private async escalateCriticalError(report: ErrorReport): Promise<void> {
        console.error('🚨 CRITICAL ERROR ESCALATION:', {
            reportId: report.id,
            errorCode: report.errorCode,
            message: report.message,
            timestamp: report.timestamp
        });

        // In a real implementation, this would:
        // - Send to external monitoring service (Sentry, DataDog, etc.)
        // - Trigger alerts to on-call engineers
        // - Create tickets in bug tracking system
        // - Send notifications to management
        
        // Placeholder for external system integration
        await this.sendToExternalMonitoring(report);
        await this.notifyOnCallTeam(report);
        await this.createIncidentTicket(report);
    }

    private async sendToExternalMonitoring(report: ErrorReport): Promise<void> {
        // Placeholder for external monitoring service integration
        console.log('📊 Sending to external monitoring service:', report.id);
        
        // Example integration points:
        // - Sentry: Sentry.captureException(new Error(report.message))
        // - DataDog: DogStatsD.increment('ehr.error.critical')
        // - New Relic: newrelic.recordCustomEvent('EHRError', report)
        // - PagerDuty: triggerIncident(report)
    }

    private async notifyOnCallTeam(report: ErrorReport): Promise<void> {
        // Placeholder for on-call notification system
        console.log('📱 Notifying on-call team for report:', report.id);
        
        // Example notification channels:
        // - Slack: Send to #alerts channel
        // - Email: Send to engineering-alerts@company.com
        // - SMS: Send to on-call rotation
        // - Teams: Post to engineering team
    }

    private async createIncidentTicket(report: ErrorReport): Promise<void> {
        // Placeholder for ticket creation
        console.log('🎫 Creating incident ticket for report:', report.id);
        
        // Example ticket systems:
        // - Jira: Create high-priority bug ticket
        // - ServiceNow: Create incident record
        // - GitHub Issues: Create issue with error details
        // - Linear: Create bug report
    }

    async getErrorReports(filters?: {
        severity?: string;
        category?: string;
        status?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<ErrorReport[]> {
        let filteredReports = [...this.reports];

        if (filters?.severity) {
            filteredReports = filteredReports.filter(r => r.severity === filters.severity);
        }

        if (filters?.category) {
            filteredReports = filteredReports.filter(r => r.category === filters.category);
        }

        if (filters?.status) {
            filteredReports = filteredReports.filter(r => r.status === filters.status);
        }

        if (filters?.startDate) {
            const startDate = new Date(filters.startDate);
            filteredReports = filteredReports.filter(r => r.timestamp >= startDate);
        }

        if (filters?.endDate) {
            const endDate = new Date(filters.endDate);
            filteredReports = filteredReports.filter(r => r.timestamp <= endDate);
        }

        return filteredReports.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    }

    async updateReportStatus(
        reportId: string, 
        status: ErrorReport['status'], 
        assignedTo?: string,
        resolutionNotes?: string
    ): Promise<ErrorReport | null> {
        const report = this.reports.find(r => r.id === reportId);
        if (!report) return null;

        report.status = status;
        if (assignedTo) report.assignedTo = assignedTo;
        if (resolutionNotes) report.resolutionNotes = resolutionNotes;

        return report;
    }
}

class ErrorReportingController {
    private reportingService: ErrorReportingService;

    constructor() {
        this.reportingService = new ErrorReportingService();
    }

    async submitErrorReport(reportData: ErrorReportRequest): Promise<ErrorReportResponse> {
        const report = await this.reportingService.createErrorReport(reportData);
        const errorDetails = new EHRError(reportData.errorCode).getErrorDetails();

        const response: ErrorReportResponse = {
            success: true,
            reportId: report.id,
            message: `Error report ${report.id} created successfully`,
            escalationRequired: report.severity === 'critical',
            immediateActions: errorDetails?.suggestedActions
        };

        return response;
    }

    async getReports(filters?: any): Promise<ErrorReport[]> {
        return this.reportingService.getErrorReports(filters);
    }
}

export async function POST(request: NextRequest) {
    try {
        const reportData: ErrorReportRequest = await request.json();

        // Validate required fields
        if (!reportData.errorCode || !reportData.message) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: 'Missing required fields: errorCode and message' 
                },
                { status: 400 }
            );
        }

        // Validate error code exists
        if (!Object.values(ErrorCode).includes(reportData.errorCode)) {
            return NextResponse.json(
                { 
                    success: false, 
                    error: `Invalid error code: ${reportData.errorCode}` 
                },
                { status: 400 }
            );
        }

        const controller = new ErrorReportingController();
        const response = await controller.submitErrorReport(reportData);

        // Log critical errors immediately
        if (response.escalationRequired) {
            console.error('🚨 CRITICAL ERROR REPORTED:', {
                reportId: response.reportId,
                errorCode: reportData.errorCode,
                message: reportData.message,
                userId: reportData.userId,
                timestamp: new Date().toISOString()
            });
        }

        return NextResponse.json(response, { status: 201 });
    } catch (error) {
        console.error('Error reporting API failed:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to submit error report',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams;
        const filters = {
            severity: searchParams.get('severity') || undefined,
            category: searchParams.get('category') || undefined,
            status: searchParams.get('status') || undefined,
            startDate: searchParams.get('startDate') || undefined,
            endDate: searchParams.get('endDate') || undefined
        };

        const controller = new ErrorReportingController();
        const reports = await controller.getReports(filters);

        return NextResponse.json({
            success: true,
            reports,
            total: reports.length
        });
    } catch (error) {
        console.error('Error reports retrieval failed:', error);
        return NextResponse.json(
            { 
                success: false, 
                error: 'Failed to retrieve error reports' 
            },
            { status: 500 }
        );
    }
}