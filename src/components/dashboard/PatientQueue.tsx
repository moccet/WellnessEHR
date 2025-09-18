'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { getPatientInitials } from '@/lib/utils';
import { VideoIcon, PrescriptionIcon, BillingIcon, ReferralIcon } from '@/components/ui/Icons';
import styles from './PatientQueue.module.css';

interface PatientQueueProps {
    patients: Patient[];
    onPatientClick: (patient: Patient) => void;
    onVideoCall: (patientId: string) => void;
    onQuickPrescribe: (patientId: string) => void;
    onQuickBill: (patientId: string) => void;
    onQuickRefer?: (patientId: string) => void;
}

export default function PatientQueue({
    patients,
    onPatientClick,
    onVideoCall,
    onQuickPrescribe,
    onQuickBill,
    onQuickRefer
}: PatientQueueProps) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredPatients = patients.filter(p => {
        if (activeFilter === 'all') return true;
        return p.status === activeFilter;
    });

    return (
        <div className={styles.queueContainer}>
            <div className={styles.queueHeader}>
                <h2 className={styles.queueTitle}>Patient Queue</h2>
                <div className={styles.filterChips}>
                    {['all', 'waiting', 'active'].map((filter) => (
                        <button
                            key={filter}
                            className={`${styles.filterChip} ${activeFilter === filter ? styles.active : ''}`}
                            onClick={() => setActiveFilter(filter)}
                        >
                            {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className={styles.queueList}>
                {filteredPatients.map((patient) => (
                    <div
                        key={patient.id}
                        className={styles.queueItem}
                        onClick={() => onPatientClick(patient)}
                    >
                        <div className={styles.queueAvatar}>
                            {getPatientInitials(patient.name)}
                        </div>
                        <div className={styles.queueInfo}>
                            <div className={styles.queueName}>{patient.name}</div>
                            <div className={styles.queueDetails}>
                                {patient.age} years • {patient.service} • {patient.time}
                            </div>
                        </div>
                        {patient.hasNotes && (
                            <div className={styles.teamNotes}>!</div>
                        )}
                        <div className={styles.queueActions}>
                            <button
                                className={styles.quickBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onVideoCall(patient.id);
                                }}
                                title="Video Call"
                            >
                                <VideoIcon size={14} />
                            </button>
                            <button
                                className={styles.quickBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickPrescribe(patient.id);
                                }}
                                title="Prescribe"
                            >
                                <PrescriptionIcon size={14} />
                            </button>
                            <button
                                className={styles.quickBtn}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onQuickBill(patient.id);
                                }}
                                title="Bill"
                            >
                                <BillingIcon size={14} />
                            </button>
                            {onQuickRefer && (
                                <button
                                    className={styles.quickBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onQuickRefer(patient.id);
                                    }}
                                    title="Quick Referral"
                                >
                                    <ReferralIcon size={14} />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}