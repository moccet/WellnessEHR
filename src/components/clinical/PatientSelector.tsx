'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import { getPatientInitials } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ChevronRightIcon, PatientsIcon, UserPlusIcon, FileTextIcon } from '@/components/ui/Icons';
import styles from './PatientSelector.module.css';

interface PatientSelectorProps {
    patients: Patient[];
    onPatientSelect: (patient: Patient) => void;
    title?: string;
    subtitle?: string;
}

export default function PatientSelector({
    patients,
    onPatientSelect,
    title = "Select Patient for Referral",
    subtitle = "Choose a patient to create a specialist referral"
}: PatientSelectorProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    const filteredPatients = patients.filter(patient => {
        const matchesSearch = searchQuery === '' ||
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.nhs.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.service.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilter = selectedFilter === 'all' || patient.status === selectedFilter;

        return matchesSearch && matchesFilter;
    });

    const recentPatients = patients.slice(0, 5); // Show last 5 patients as recent

    return (
        <div className={styles.patientSelector}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <p className={styles.subtitle}>{subtitle}</p>
            </div>

            {/* Quick Access - Recent Patients */}
            <div className={styles.quickSection}>
                <h3 className={styles.sectionTitle}>Recent Patients</h3>
                <div className={styles.recentGrid}>
                    {recentPatients.map((patient) => (
                        <div
                            key={patient.id}
                            className={styles.recentCard}
                            onClick={() => onPatientSelect(patient)}
                        >
                            <div className={styles.recentAvatar}>
                                {getPatientInitials(patient.name)}
                            </div>
                            <div className={styles.recentInfo}>
                                <div className={styles.recentName}>{patient.name}</div>
                                <div className={styles.recentDetails}>{patient.age} years</div>
                            </div>
                            <div className={styles.recentAction}>
                                <ChevronRightIcon size={16} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Search and Filter Section */}
            <div className={styles.searchSection}>
                <h3 className={styles.sectionTitle}>Search All Patients</h3>

                <div className={styles.searchControls}>
                    <div className={styles.searchInputContainer}>
                        <Input
                            placeholder="Search by name, NHS number, or service..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className={styles.filterButtons}>
                        {['all', 'waiting', 'active', 'completed'].map((filter) => (
                            <button
                                key={filter}
                                className={`${styles.filterBtn} ${selectedFilter === filter ? styles.active : ''}`}
                                onClick={() => setSelectedFilter(filter)}
                            >
                                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Patient List */}
                <div className={styles.patientList}>
                    {filteredPatients.length === 0 ? (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>
                                <PatientsIcon size={48} color="var(--text-muted)" />
                            </div>
                            <h4 className={styles.emptyTitle}>No patients found</h4>
                            <p className={styles.emptyText}>
                                {searchQuery ? 'Try adjusting your search criteria' : 'No patients match the selected filter'}
                            </p>
                        </div>
                    ) : (
                        filteredPatients.map((patient) => (
                            <div
                                key={patient.id}
                                className={styles.patientRow}
                                onClick={() => onPatientSelect(patient)}
                            >
                                <div className={styles.patientAvatar}>
                                    {getPatientInitials(patient.name)}
                                </div>
                                <div className={styles.patientInfo}>
                                    <div className={styles.patientName}>{patient.name}</div>
                                    <div className={styles.patientDetails}>
                                        {patient.age} years • NHS: {patient.nhs}
                                    </div>
                                    <div className={styles.patientService}>{patient.service}</div>
                                </div>
                                <div className={styles.patientStatus}>
                                    <span className={`${styles.statusBadge} ${styles[patient.status]}`}>
                                        {patient.status}
                                    </span>
                                </div>
                                <div className={styles.patientAction}>
                                    <Button size="sm">
                                        Create Referral
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Alternative Actions */}
            <div className={styles.alternativeActions}>
                <div className={styles.actionCard}>
                    <h4 className={styles.actionTitle}>
                        <UserPlusIcon size={20} style={{ marginRight: '8px' }} />
                        Create New Patient
                    </h4>
                    <p className={styles.actionText}>Register a new patient and create referral</p>
                    <Button
                        size="sm"
                        onClick={() => alert('New Patient Registration\n\nThis would open the patient registration form to:\n• Collect demographics\n• Record medical history\n• Verify insurance\n• Create new patient record\n\nAfter registration, you can immediately create a referral.')}
                    >
                        <UserPlusIcon size={16} />
                        New Patient
                    </Button>
                </div>

                <div className={styles.actionCard}>
                    <h4 className={styles.actionTitle}>
                        <FileTextIcon size={20} style={{ marginRight: '8px' }} />
                        External Referral
                    </h4>
                    <p className={styles.actionText}>Create referral for patient not in system</p>
                    <Button
                        size="sm"
                        onClick={() => alert('External Referral\n\nCreate a referral for:\n• Patients from other practices\n• Emergency referrals\n• Patients not yet in system\n\nThis allows manual entry of patient details for immediate referral processing.')}
                    >
                        <FileTextIcon size={16} />
                        External Referral
                    </Button>
                </div>
            </div>
        </div>
    );
}