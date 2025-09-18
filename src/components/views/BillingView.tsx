'use client';

import { useState, useEffect } from 'react';
import styles from './BillingView.module.css';
import { BillingIcon } from '@/components/ui/Icons';
import LoadingSkeleton, { LoadingList } from '@/components/ui/LoadingSkeleton';

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

interface PaymentMethod {
    id: string;
    type: 'cash' | 'card' | 'insurance' | 'bank_transfer';
    label: string;
    icon: string;
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


const paymentMethods: PaymentMethod[] = [
    { id: 'cash', type: 'cash', label: 'Cash Payment', icon: '💵' },
    { id: 'card', type: 'card', label: 'Card Payment', icon: '💳' },
    { id: 'insurance', type: 'insurance', label: 'Insurance Claim', icon: '🏥' },
    { id: 'transfer', type: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' }
];

export default function BillingView() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [metrics, setMetrics] = useState<BillingMetrics | null>(null);
    const [revenueChart, setRevenueChart] = useState<RevenueChart | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'paid' | 'pending' | 'overdue'>('all');
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        fetchBillingData();
    }, []);

    const fetchBillingData = async () => {
        setLoading(true);
        try {
            const response = await fetch('/api/billing');
            if (!response.ok) {
                throw new Error(`Billing API failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.invoices || !data.metrics || !data.revenueChart) {
                throw new Error('Billing API returned incomplete data structure');
            }
            setInvoices(data.invoices);
            setMetrics(data.metrics);
            setRevenueChart(data.revenueChart);
        } catch (error) {
            console.error('BILLING API ERROR:', error);
            throw new Error(`Failed to fetch billing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const handleProcessPayment = (invoiceId: string, method: PaymentMethod) => {
        const invoice = invoices.find(inv => inv.id === invoiceId);
        if (invoice) {
            alert(`Processing ${method.label} for ${invoice.patientName}\nAmount: $${invoice.amount}\n\n[This would process the payment through the selected gateway]`);
            setInvoices(prev => prev.map(inv => 
                inv.id === invoiceId ? { ...inv, status: 'paid' } : inv
            ));
        }
    };

    const handleSendReminder = (invoice: Invoice) => {
        alert(`Sending payment reminder to ${invoice.patientName}\n\nInvoice: ${invoice.id}\nAmount Due: $${invoice.amount}\nDue Date: ${invoice.dueDate}\n\n[This would send an automated reminder via email/SMS]`);
    };

    const handleGenerateStatement = () => {
        alert('Generating monthly billing statement...\n\n[This would generate a PDF statement with all transactions]');
    };

    const handleInsuranceClaim = (invoice: Invoice) => {
        alert(`Submitting insurance claim for ${invoice.patientName}\n\nClaim Amount: $${invoice.amount}\nServices: ${invoice.services.join(', ')}\n\n[This would submit the claim to the insurance provider]`);
    };

    const filteredInvoices = invoices.filter(invoice => 
        selectedFilter === 'all' || invoice.status === selectedFilter
    );

    const getStatusColor = (status: Invoice['status']) => {
        switch (status) {
            case 'paid': return '#4CAF50';
            case 'pending': return '#FFA726';
            case 'overdue': return '#EF5350';
            case 'cancelled': return '#9E9E9E';
            default: return '#757575';
        }
    };

    const renderRevenueChart = () => {
        if (!revenueChart) return null;

        const maxValue = Math.max(...revenueChart.data);
        const chartHeight = 200;

        return (
            <svg viewBox={`0 0 600 ${chartHeight}`} className={styles.revenueChart}>
                {revenueChart.data.map((value, index) => {
                    const barWidth = 500 / revenueChart.data.length;
                    const barHeight = (value / maxValue) * (chartHeight - 40);
                    const x = index * barWidth + 50;
                    const y = chartHeight - barHeight - 20;

                    return (
                        <g key={index}>
                            <rect
                                x={x}
                                y={y}
                                width={barWidth * 0.8}
                                height={barHeight}
                                fill="#7FB88E"
                                className={styles.chartBar}
                            />
                            <text
                                x={x + barWidth * 0.4}
                                y={chartHeight - 5}
                                className={styles.chartLabel}
                                textAnchor="middle"
                            >
                                {revenueChart.labels[index]}
                            </text>
                            <text
                                x={x + barWidth * 0.4}
                                y={y - 5}
                                className={styles.chartValue}
                                textAnchor="middle"
                            >
                                ${(value / 1000).toFixed(0)}k
                            </text>
                        </g>
                    );
                })}
            </svg>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <LoadingSkeleton variant="text" width="200px" height="32px" />
                    <LoadingSkeleton variant="text" width="250px" height="40px" />
                </div>
                <div className={styles.metricsGrid}>
                    <LoadingSkeleton variant="metric" count={4} />
                </div>
                <div className={styles.contentGrid}>
                    <div className={styles.invoicesSection}>
                        <LoadingList items={5} />
                    </div>
                    <div className={styles.sidePanel}>
                        <LoadingSkeleton variant="chart" />
                        <LoadingSkeleton variant="card" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <BillingIcon size={24} className={styles.titleIcon} />
                    Billing & Payments
                </h1>
                <div className={styles.headerActions}>
                    <button 
                        className={styles.actionButton}
                        onClick={() => alert('Opening new invoice form...\n\n[This would open a form to create a new invoice]')}
                    >
                        New Invoice
                    </button>
                    <button 
                        className={styles.actionButton}
                        onClick={handleGenerateStatement}
                    >
                        Generate Statement
                    </button>
                </div>
            </div>

            {metrics && (
                <div className={styles.metricsGrid}>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Total Revenue (MTD)</div>
                        <div className={styles.metricValue}>${metrics.totalRevenue.toLocaleString()}</div>
                        <div className={styles.metricChange}>↑ 8% from last month</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Pending Payments</div>
                        <div className={styles.metricValue} style={{ color: '#FFA726' }}>
                            ${metrics.pendingPayments.toLocaleString()}
                        </div>
                        <div className={styles.metricSubtext}>Awaiting payment</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Overdue Amount</div>
                        <div className={styles.metricValue} style={{ color: '#EF5350' }}>
                            ${metrics.overdueAmount.toLocaleString()}
                        </div>
                        <div className={styles.metricSubtext}>Requires attention</div>
                    </div>
                    <div className={styles.metricCard}>
                        <div className={styles.metricLabel}>Collection Rate</div>
                        <div className={styles.metricValue}>{metrics.collectionRate}%</div>
                        <div className={styles.metricChange}>↑ 2% improvement</div>
                    </div>
                </div>
            )}

            <div className={styles.contentGrid}>
                <div className={styles.invoicesSection}>
                    <div className={styles.sectionHeader}>
                        <h2 className={styles.sectionTitle}>Recent Invoices</h2>
                        <div className={styles.filterTabs}>
                            {(['all', 'paid', 'pending', 'overdue'] as const).map(filter => (
                                <button
                                    key={filter}
                                    className={`${styles.filterTab} ${selectedFilter === filter ? styles.active : ''}`}
                                    onClick={() => setSelectedFilter(filter)}
                                >
                                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.invoicesList} stagger-children`}>
                        {filteredInvoices.map(invoice => (
                            <div 
                                key={invoice.id} 
                                className={styles.invoiceCard}
                                onClick={() => setSelectedInvoice(invoice)}
                            >
                                <div className={styles.invoiceHeader}>
                                    <div>
                                        <div className={styles.invoiceId}>{invoice.id}</div>
                                        <div className={styles.patientName}>{invoice.patientName}</div>
                                    </div>
                                    <div className={styles.invoiceAmount}>${invoice.amount}</div>
                                </div>
                                <div className={styles.invoiceDetails}>
                                    <div className={styles.invoiceServices}>
                                        {invoice.services.join(', ')}
                                    </div>
                                    <div className={styles.invoiceFooter}>
                                        <span className={styles.invoiceDate}>{invoice.date}</span>
                                        <span 
                                            className={styles.invoiceStatus}
                                            style={{ backgroundColor: getStatusColor(invoice.status) }}
                                        >
                                            {invoice.status}
                                        </span>
                                    </div>
                                </div>
                                {invoice.status === 'pending' && (
                                    <div className={styles.invoiceActions}>
                                        <button 
                                            className={styles.smallButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSendReminder(invoice);
                                            }}
                                        >
                                            Send Reminder
                                        </button>
                                        <button 
                                            className={styles.smallButton}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleInsuranceClaim(invoice);
                                            }}
                                        >
                                            Insurance Claim
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.sidePanel}>
                    <div className={styles.chartSection}>
                        <h3 className={styles.sectionTitle}>Revenue Trend</h3>
                        {renderRevenueChart()}
                    </div>

                    <div className={styles.paymentSection}>
                        <h3 className={styles.sectionTitle}>Quick Payment</h3>
                        <div className={styles.paymentMethods}>
                            {paymentMethods.map(method => (
                                <button
                                    key={method.id}
                                    className={styles.paymentMethod}
                                    onClick={() => {
                                        if (selectedInvoice && selectedInvoice.status !== 'paid') {
                                            handleProcessPayment(selectedInvoice.id, method);
                                        } else {
                                            alert('Please select an unpaid invoice first');
                                        }
                                    }}
                                >
                                    <span className={styles.paymentIcon}>{method.icon}</span>
                                    <span className={styles.paymentLabel}>{method.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.quickActions}>
                        <h3 className={styles.sectionTitle}>Quick Actions</h3>
                        <button 
                            className={styles.quickAction}
                            onClick={() => alert('Opening payment reconciliation...\n\n[This would open the reconciliation interface]')}
                        >
                            Reconcile Payments
                        </button>
                        <button 
                            className={styles.quickAction}
                            onClick={() => alert('Exporting financial report...\n\n[This would generate and download a financial report]')}
                        >
                            Export Report
                        </button>
                        <button 
                            className={styles.quickAction}
                            onClick={() => alert('Opening insurance portal...\n\n[This would redirect to insurance claim management]')}
                        >
                            Insurance Portal
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}