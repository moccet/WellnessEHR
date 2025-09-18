'use client';

import { StatsCard } from '@/lib/types';
import { useState, useEffect } from 'react';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import styles from './StatsCards.module.css';

interface DashboardStats {
    id: string;
    label: string;
    value: string;
    change?: string;
    trend?: 'up' | 'down' | 'stable';
    icon?: string;
}

interface StatsCardsProps {
    stats?: StatsCard[];
    onCardClick: (id: string) => void;
    onTeamNoteClick?: (e: React.MouseEvent) => void;
}

export default function StatsCards({ stats: propStats, onCardClick, onTeamNoteClick }: StatsCardsProps) {
    const [stats, setStats] = useState<DashboardStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (propStats) {
            setStats(propStats.map(stat => ({
                id: stat.id,
                label: stat.label,
                value: stat.value,
                change: stat.change,
                trend: stat.changeType === 'positive' ? 'up' : 'down'
            })));
            setLoading(false);
        } else {
            fetchStats();
        }
    }, [propStats]);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/dashboard');
            if (!response.ok) {
                throw new Error(`Dashboard API failed with status ${response.status}: ${response.statusText}`);
            }
            const data = await response.json();
            if (!data.stats) {
                throw new Error('Dashboard API returned no stats data');
            }
            setStats(data.stats);
        } catch (error) {
            console.error('DASHBOARD API ERROR:', error);
            throw new Error(`Failed to fetch dashboard stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.statsRow}>
                <LoadingSkeleton variant="metric" count={4} />
            </div>
        );
    }
    return (
        <div className={styles.statsRow}>
            {stats.map((stat) => (
                <div
                    key={stat.id}
                    className={styles.statCard}
                    onClick={() => onCardClick(stat.id)}
                >
                    <div className={styles.statLabel}>{stat.label}</div>
                    <div className={styles.statValue}>{stat.value}</div>
                    {stat.change && (
                        <div className={`${styles.statChange} ${stat.trend === 'up' ? styles.positive : ''}`}>
                            {stat.change}
                        </div>
                    )}
                    {stat.icon && (
                        <span className={styles.statIcon}>{stat.icon}</span>
                    )}
                </div>
            ))}
        </div>
    );
}