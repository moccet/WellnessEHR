export enum ErrorCode {
    // API Connection Errors (1000-1099)
    API_CONNECTION_FAILED = 'EHR-1001',
    API_TIMEOUT = 'EHR-1002',
    API_UNAUTHORIZED = 'EHR-1003',
    API_FORBIDDEN = 'EHR-1004',
    API_NOT_FOUND = 'EHR-1005',
    API_SERVER_ERROR = 'EHR-1006',
    API_BAD_REQUEST = 'EHR-1007',
    API_RATE_LIMITED = 'EHR-1008',

    // Data Validation Errors (1100-1199)
    INVALID_PATIENT_DATA = 'EHR-1101',
    INVALID_NHS_NUMBER = 'EHR-1102',
    MISSING_REQUIRED_FIELD = 'EHR-1103',
    INVALID_DATE_FORMAT = 'EHR-1104',
    INVALID_MEDICATION_DATA = 'EHR-1105',
    INVALID_CONSULTATION_DATA = 'EHR-1106',
    INVALID_BILLING_DATA = 'EHR-1107',

    // Database Errors (1200-1299)
    DATABASE_CONNECTION_FAILED = 'EHR-1201',
    DATABASE_QUERY_FAILED = 'EHR-1202',
    DATABASE_CONSTRAINT_VIOLATION = 'EHR-1203',
    DATABASE_TRANSACTION_FAILED = 'EHR-1204',
    DATABASE_DEADLOCK = 'EHR-1205',

    // Authentication & Authorization Errors (1300-1399)
    USER_NOT_AUTHENTICATED = 'EHR-1301',
    USER_NOT_AUTHORIZED = 'EHR-1302',
    INVALID_SESSION = 'EHR-1303',
    SESSION_EXPIRED = 'EHR-1304',
    INVALID_CREDENTIALS = 'EHR-1305',
    ACCOUNT_LOCKED = 'EHR-1306',

    // Clinical Data Errors (1400-1499)
    CONSULTATION_NOT_FOUND = 'EHR-1401',
    PRESCRIPTION_NOT_FOUND = 'EHR-1402',
    LAB_ORDER_NOT_FOUND = 'EHR-1403',
    REFERRAL_NOT_FOUND = 'EHR-1404',
    PATIENT_NOT_FOUND = 'EHR-1405',
    CLINICAL_DATA_CORRUPT = 'EHR-1406',
    MEDICAL_HISTORY_INCOMPLETE = 'EHR-1407',

    // Billing System Errors (1500-1599)
    INVOICE_NOT_FOUND = 'EHR-1501',
    PAYMENT_PROCESSING_FAILED = 'EHR-1502',
    INSURANCE_CLAIM_FAILED = 'EHR-1503',
    BILLING_CALCULATION_ERROR = 'EHR-1504',
    PAYMENT_GATEWAY_ERROR = 'EHR-1505',
    REFUND_PROCESSING_FAILED = 'EHR-1506',

    // Analytics & Reporting Errors (1600-1699)
    ANALYTICS_DATA_UNAVAILABLE = 'EHR-1601',
    REPORT_GENERATION_FAILED = 'EHR-1602',
    METRICS_CALCULATION_ERROR = 'EHR-1603',
    CHART_RENDERING_FAILED = 'EHR-1604',
    DATA_AGGREGATION_ERROR = 'EHR-1605',

    // System Integration Errors (1700-1799)
    EXTERNAL_SERVICE_UNAVAILABLE = 'EHR-1701',
    NHS_API_INTEGRATION_FAILED = 'EHR-1702',
    PHARMACY_SYSTEM_ERROR = 'EHR-1703',
    LAB_SYSTEM_INTEGRATION_FAILED = 'EHR-1704',
    REFERRAL_SYSTEM_ERROR = 'EHR-1705',

    // Frontend/UI Errors (1800-1899)
    COMPONENT_RENDER_ERROR = 'EHR-1801',
    STATE_MANAGEMENT_ERROR = 'EHR-1802',
    NAVIGATION_ERROR = 'EHR-1803',
    FORM_SUBMISSION_ERROR = 'EHR-1804',
    FILE_UPLOAD_ERROR = 'EHR-1805',
    PRINT_FUNCTION_ERROR = 'EHR-1806',

    // Security Errors (1900-1999)
    SECURITY_BREACH_DETECTED = 'EHR-1901',
    UNAUTHORIZED_DATA_ACCESS = 'EHR-1902',
    DATA_ENCRYPTION_FAILED = 'EHR-1903',
    AUDIT_LOG_FAILURE = 'EHR-1904',
    COMPLIANCE_VIOLATION = 'EHR-1905',
    SUSPICIOUS_ACTIVITY = 'EHR-1906'
}

export interface ErrorDetails {
    code: ErrorCode;
    message: string;
    description: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    suggestedActions: string[];
    technicalDetails?: string;
}

export const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDetails> = {
    [ErrorCode.API_CONNECTION_FAILED]: {
        code: ErrorCode.API_CONNECTION_FAILED,
        message: 'API Connection Failed',
        description: 'Unable to establish connection with backend API service',
        severity: 'critical',
        category: 'API Connection',
        suggestedActions: [
            'Check network connectivity',
            'Verify API server status',
            'Check firewall settings',
            'Contact system administrator'
        ]
    },
    [ErrorCode.API_TIMEOUT]: {
        code: ErrorCode.API_TIMEOUT,
        message: 'API Request Timeout',
        description: 'API request exceeded maximum timeout duration',
        severity: 'high',
        category: 'API Connection',
        suggestedActions: [
            'Retry the operation',
            'Check network speed',
            'Verify server performance',
            'Increase timeout settings if appropriate'
        ]
    },
    [ErrorCode.API_UNAUTHORIZED]: {
        code: ErrorCode.API_UNAUTHORIZED,
        message: 'API Access Unauthorized',
        description: 'Request lacks valid authentication credentials',
        severity: 'high',
        category: 'API Connection',
        suggestedActions: [
            'Check authentication token',
            'Re-login to system',
            'Verify user permissions',
            'Contact administrator for access'
        ]
    },
    [ErrorCode.ANALYTICS_DATA_UNAVAILABLE]: {
        code: ErrorCode.ANALYTICS_DATA_UNAVAILABLE,
        message: 'Analytics Data Unavailable',
        description: 'Unable to retrieve analytics data from backend service',
        severity: 'high',
        category: 'Analytics',
        suggestedActions: [
            'Check analytics service status',
            'Verify data pipeline integrity',
            'Check database connectivity',
            'Review data processing logs'
        ]
    },
    [ErrorCode.PATIENT_NOT_FOUND]: {
        code: ErrorCode.PATIENT_NOT_FOUND,
        message: 'Patient Record Not Found',
        description: 'Requested patient record does not exist in system',
        severity: 'medium',
        category: 'Clinical Data',
        suggestedActions: [
            'Verify patient ID or NHS number',
            'Check for typos in search criteria',
            'Ensure patient is registered in system',
            'Contact data management team'
        ]
    },
    [ErrorCode.BILLING_CALCULATION_ERROR]: {
        code: ErrorCode.BILLING_CALCULATION_ERROR,
        message: 'Billing Calculation Error',
        description: 'Error occurred during billing amount calculation',
        severity: 'high',
        category: 'Billing',
        suggestedActions: [
            'Verify service pricing data',
            'Check calculation algorithms',
            'Review input parameters',
            'Contact billing administrator'
        ]
    },
    [ErrorCode.DATABASE_CONNECTION_FAILED]: {
        code: ErrorCode.DATABASE_CONNECTION_FAILED,
        message: 'Database Connection Failed',
        description: 'Unable to establish connection with database server',
        severity: 'critical',
        category: 'Database',
        suggestedActions: [
            'Check database server status',
            'Verify connection strings',
            'Check database credentials',
            'Contact database administrator immediately'
        ]
    },
    [ErrorCode.COMPONENT_RENDER_ERROR]: {
        code: ErrorCode.COMPONENT_RENDER_ERROR,
        message: 'Component Rendering Error',
        description: 'React component failed to render properly',
        severity: 'high',
        category: 'Frontend',
        suggestedActions: [
            'Refresh the page',
            'Clear browser cache',
            'Check browser console for details',
            'Report to development team'
        ]
    },
    [ErrorCode.SECURITY_BREACH_DETECTED]: {
        code: ErrorCode.SECURITY_BREACH_DETECTED,
        message: 'Security Breach Detected',
        description: 'Potential security breach or unauthorized access detected',
        severity: 'critical',
        category: 'Security',
        suggestedActions: [
            'Immediately secure the system',
            'Change all passwords',
            'Review audit logs',
            'Contact security team URGENTLY'
        ]
    }
    // Additional error definitions would go here...
};

export class EHRError extends Error {
    public readonly code: ErrorCode;
    public readonly severity: 'low' | 'medium' | 'high' | 'critical';
    public readonly category: string;
    public readonly timestamp: Date;
    public readonly userAgent?: string;
    public readonly userId?: string;
    public readonly sessionId?: string;
    public readonly additionalData?: Record<string, any>;

    constructor(
        code: ErrorCode,
        message?: string,
        additionalData?: Record<string, any>
    ) {
        const errorDef = ERROR_DEFINITIONS[code];
        super(message || errorDef?.message || 'Unknown EHR Error');
        
        this.name = 'EHRError';
        this.code = code;
        this.severity = errorDef?.severity || 'medium';
        this.category = errorDef?.category || 'Unknown';
        this.timestamp = new Date();
        this.userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : undefined;
        this.additionalData = additionalData;

        // Capture stack trace
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, EHRError);
        }
    }

    public getErrorDetails(): ErrorDetails | undefined {
        return ERROR_DEFINITIONS[this.code];
    }

    public toJSON() {
        return {
            code: this.code,
            message: this.message,
            severity: this.severity,
            category: this.category,
            timestamp: this.timestamp,
            userAgent: this.userAgent,
            userId: this.userId,
            sessionId: this.sessionId,
            stack: this.stack,
            additionalData: this.additionalData
        };
    }
}