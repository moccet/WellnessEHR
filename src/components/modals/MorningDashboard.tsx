'use client';

import { MorningDashboardData } from '@/lib/types';
import Button from '@/components/ui/Button';
import styles from './MorningDashboard.module.css';

interface MorningDashboardProps {
    isOpen: boolean;
    data: MorningDashboardData;
    onClose: () => void;
}

export default function MorningDashboard({ isOpen, data, onClose }: MorningDashboardProps) {
    if (!isOpen) return null;

    return (
        <div className={styles.morningDashboard}>
            <div className={styles.morningHeader}>
                <h1 className={styles.morningGreeting}>{data.greeting}</h1>
                <p className={styles.morningDate}>{data.date}</p>
            </div>

            <div className={styles.morningGrid}>
                <div className={styles.morningCard}>
                    <h3 className={styles.morningCardTitle}>Today's Schedule</h3>
                    <div className={styles.morningCardContent}>
                        <div className={styles.prepItem}>
                            <span>{data.schedule.totalPatients} patients scheduled</span>
                            <span className={styles.prepPriority}>Full Day</span>
                        </div>
                        <div className={styles.prepItem}>
                            <span>First: {data.schedule.firstPatient}</span>
                            <span className={`${styles.prepPriority} ${styles.urgent}`}>Urgent Review</span>
                        </div>
                        <div className={styles.prepItem}>
                            <span>{data.schedule.videoConsults} Video Consultations</span>
                        </div>
                    </div>
                </div>

                <div className={styles.morningCard}>
                    <h3 className={styles.morningCardTitle}>Action Items</h3>
                    <div className={styles.morningCardContent}>
                        <div className={styles.prepItem}>
                            <span>{data.actionItems.labResults} Lab Results to Review</span>
                            <span className={`${styles.prepPriority} ${styles.urgent}`}>Priority</span>
                        </div>
                        <div className={styles.prepItem}>
                            <span>{data.actionItems.prescriptionRenewals} Prescription Renewals</span>
                        </div>
                        <div className={styles.prepItem}>
                            <span>{data.actionItems.insuranceForms} Insurance Form Pending</span>
                        </div>
                    </div>
                </div>

                <div className={styles.morningCard}>
                    <h3 className={styles.morningCardTitle}>Clinical Alerts</h3>
                    <div className={styles.morningCardContent}>
                        {data.clinicalAlerts.map((alert, index) => (
                            <div key={index} className={styles.prepItem}>
                                <span>{alert.message}</span>
                                <span className={`${styles.prepPriority} ${styles[alert.priority]}`}>
                                    {alert.type}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.morningCard}>
                    <h3 className={styles.morningCardTitle}>Team Updates</h3>
                    <div className={styles.morningCardContent}>
                        {data.teamUpdates.map((update, index) => (
                            <div key={index} className={styles.prepItem}>
                                <span>{update.message}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Button
                className={styles.startDayBtn}
                variant="primary"
                size="lg"
                onClick={onClose}
            >
                Start My Day
            </Button>
        </div>
    );
}