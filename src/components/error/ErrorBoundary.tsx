'use client';

import React from 'react';
import { ErrorCode, EHRError } from '@/lib/errorCodes';
import styles from './ErrorBoundary.module.css';

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
    errorInfo: React.ErrorInfo | null;
}

interface ErrorBoundaryProps {
    children: React.ReactNode;
    fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null
        };
    }

    static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
        return {
            hasError: true,
            error
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🚨 CRITICAL APPLICATION ERROR CAUGHT:', error);
        console.error('📍 Error Component Stack:', errorInfo.componentStack);
        console.error('📍 Error Details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        this.setState({
            error,
            errorInfo
        });

        // Report error to backend
        this.reportError(error, errorInfo);
    }

    private reportError = async (error: Error, errorInfo: React.ErrorInfo) => {
        try {
            const errorCode = error instanceof EHRError ? error.code : ErrorCode.COMPONENT_RENDER_ERROR;
            
            const reportData = {
                errorCode,
                message: error.message,
                stackTrace: error.stack,
                url: typeof window !== 'undefined' ? window.location.href : undefined,
                userId: undefined, // Would get from auth context
                sessionId: undefined, // Would get from session
                additionalData: {
                    componentStack: errorInfo.componentStack,
                    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
                    timestamp: new Date().toISOString(),
                    errorName: error.name
                }
            };

            const response = await fetch('/api/error-reporting', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(reportData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('✅ Error reported successfully:', result.reportId);
                
                if (result.escalationRequired) {
                    console.error('🚨 CRITICAL ERROR - ESCALATION TRIGGERED');
                }
            } else {
                console.error('❌ Failed to report error to backend');
            }
        } catch (reportingError) {
            console.error('❌ Error reporting failed:', reportingError);
        }
    };

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                const FallbackComponent = this.props.fallback;
                return (
                    <FallbackComponent 
                        error={this.state.error!} 
                        reset={this.handleReset} 
                    />
                );
            }

            return (
                <div className={styles.errorContainer}>
                    <div className={styles.errorHeader}>
                        <h1 className={styles.errorTitle}>🚨 CRITICAL APPLICATION ERROR</h1>
                        <p className={styles.errorSubtitle}>
                            The application has encountered a fatal error and cannot continue
                        </p>
                    </div>

                    <div className={styles.errorDetails}>
                        <h2>Error Details:</h2>
                        <div className={styles.errorMessage}>
                            <strong>Type:</strong> {this.state.error?.name || 'Unknown Error'}
                        </div>
                        <div className={styles.errorMessage}>
                            <strong>Message:</strong> {this.state.error?.message || 'No error message available'}
                        </div>
                        
                        {this.state.error?.stack && (
                            <details className={styles.errorStack}>
                                <summary>Stack Trace (Click to expand)</summary>
                                <pre>{this.state.error.stack}</pre>
                            </details>
                        )}

                        {this.state.errorInfo?.componentStack && (
                            <details className={styles.errorStack}>
                                <summary>Component Stack (Click to expand)</summary>
                                <pre>{this.state.errorInfo.componentStack}</pre>
                            </details>
                        )}
                    </div>

                    <div className={styles.errorActions}>
                        <button 
                            className={styles.retryButton}
                            onClick={this.handleReset}
                        >
                            🔄 Attempt Recovery
                        </button>
                        <button 
                            className={styles.reloadButton}
                            onClick={() => window.location.reload()}
                        >
                            🔃 Reload Application
                        </button>
                    </div>

                    <div className={styles.errorInstructions}>
                        <h3>Immediate Actions Required:</h3>
                        <ul>
                            <li>Check backend API service status</li>
                            <li>Verify database connectivity</li>
                            <li>Review server logs for related errors</li>
                            <li>Contact system administrator if error persists</li>
                        </ul>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;