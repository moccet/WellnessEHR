'use client';

import { useState, useEffect } from 'react';
import styles from './AnalyticsView.module.css';
import { AnalyticsIcon } from '@/components/ui/Icons';
import LoadingSkeleton, { LoadingGrid } from '@/components/ui/LoadingSkeleton';

interface MetricCard {
    id: string;
    label: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    color?: string;
}

interface ChartData {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        borderColor?: string;
        backgroundColor?: string;
    }[];
}

interface AnalyticsData {
    metrics: MetricCard[];
    patientFlow: ChartData;
    appointmentTypes: ChartData;
    revenueAnalysis: ChartData;
    referralPatterns: ChartData;
}


export default function AnalyticsView() {
    const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedTimeRange, setSelectedTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month');

    useEffect(() => {
        fetchAnalyticsData();
    }, [selectedTimeRange]);

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics?range=${selectedTimeRange}`);
            if (!response.ok) {
                throw new Error(`Analytics API failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            setAnalyticsData(data);
        } catch (error) {
            console.error('ANALYTICS API ERROR:', error);
            throw new Error(`Failed to fetch analytics data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    const renderLineChart = (data: ChartData, height: number = 200) => (
        <div className={styles.chartContainer} style={{ height }}>
            <svg viewBox={`0 0 400 ${height}`} className={styles.chart}>
                {data.datasets.map((dataset, idx) => {
                    const points = dataset.data.map((value, index) => {
                        const x = (index / (data.labels.length - 1)) * 380 + 10;
                        const y = height - (value / Math.max(...dataset.data)) * (height - 40) - 20;
                        return `${x},${y}`;
                    }).join(' ');

                    return (
                        <g key={idx}>
                            <polyline
                                points={points}
                                fill="none"
                                stroke={dataset.borderColor || '#7FB88E'}
                                strokeWidth="2"
                            />
                            {dataset.data.map((value, index) => {
                                const x = (index / (data.labels.length - 1)) * 380 + 10;
                                const y = height - (value / Math.max(...dataset.data)) * (height - 40) - 20;
                                return (
                                    <circle
                                        key={index}
                                        cx={x}
                                        cy={y}
                                        r="4"
                                        fill={dataset.borderColor || '#7FB88E'}
                                    />
                                );
                            })}
                        </g>
                    );
                })}
                {data.labels.map((label, index) => (
                    <text
                        key={index}
                        x={(index / (data.labels.length - 1)) * 380 + 10}
                        y={height - 5}
                        className={styles.chartLabel}
                        textAnchor="middle"
                    >
                        {label}
                    </text>
                ))}
            </svg>
        </div>
    );

    const renderBarChart = (data: ChartData, height: number = 200) => {
        const barWidth = 360 / data.labels.length;
        const dataset = data.datasets[0];
        const maxValue = Math.max(...dataset.data);

        return (
            <div className={styles.chartContainer} style={{ height }}>
                <svg viewBox={`0 0 400 ${height}`} className={styles.chart}>
                    {dataset.data.map((value, index) => {
                        const barHeight = (value / maxValue) * (height - 40);
                        const x = index * barWidth + 20;
                        const y = height - barHeight - 20;

                        return (
                            <g key={index}>
                                <rect
                                    x={x}
                                    y={y}
                                    width={barWidth * 0.8}
                                    height={barHeight}
                                    fill={Array.isArray(dataset.backgroundColor) 
                                        ? dataset.backgroundColor[index] 
                                        : dataset.backgroundColor || '#7FB88E'}
                                    className={styles.bar}
                                />
                                <text
                                    x={x + barWidth * 0.4}
                                    y={height - 5}
                                    className={styles.chartLabel}
                                    textAnchor="middle"
                                >
                                    {data.labels[index]}
                                </text>
                            </g>
                        );
                    })}
                </svg>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <LoadingSkeleton variant="text" width="200px" height="32px" />
                    <LoadingSkeleton variant="text" width="300px" height="40px" />
                </div>
                <div className={styles.metricsGrid}>
                    <LoadingSkeleton variant="metric" count={6} />
                </div>
                <LoadingGrid columns={2} rows={2} />
            </div>
        );
    }

    if (!analyticsData) {
        return (
            <div className={styles.container}>
                <div className={styles.errorState}>
                    <h2>CRITICAL ERROR: Analytics Data Unavailable</h2>
                    <p>API connection failed - check backend service immediately</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    <AnalyticsIcon size={24} className={styles.titleIcon} />
                    My Analytics
                </h1>
                <div className={styles.controls}>
                    <div className={styles.timeRangeSelector}>
                        {(['day', 'week', 'month', 'year'] as const).map(range => (
                            <button
                                key={range}
                                className={`${styles.timeRangeButton} ${selectedTimeRange === range ? styles.active : ''}`}
                                onClick={() => setSelectedTimeRange(range)}
                            >
                                {range.charAt(0).toUpperCase() + range.slice(1)}
                            </button>
                        ))}
                    </div>
                    <button className={styles.exportButton}>
                        Export Report
                    </button>
                </div>
            </div>

            <div className={styles.metricsGrid}>
                {analyticsData.metrics.map(metric => (
                    <div key={metric.id} className={styles.metricCard}>
                        <div className={styles.metricLabel}>{metric.label}</div>
                        <div className={styles.metricValue} style={{ color: metric.color }}>
                            {metric.value}
                        </div>
                        {metric.change && (
                            <div className={`${styles.metricChange} ${styles[metric.trend || 'stable']}`}>
                                {metric.trend === 'up' ? '↑' : metric.trend === 'down' ? '↓' : ''} {metric.change}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>My Daily Consultations</h3>
                    {renderLineChart(analyticsData.patientFlow)}
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>My Appointment Types</h3>
                    {renderBarChart(analyticsData.appointmentTypes)}
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>My Monthly Hours</h3>
                    {renderLineChart(analyticsData.revenueAnalysis)}
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>My Referral Specialties</h3>
                    {renderBarChart(analyticsData.referralPatterns)}
                </div>
            </div>
        </div>
    );
}