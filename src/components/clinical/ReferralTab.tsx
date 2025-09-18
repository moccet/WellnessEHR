'use client';

import { useState, useEffect } from 'react';
import { Patient } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RecordingInterface from './RecordingInterface';
import PatientSelector from './PatientSelector';
import { MicrophoneIcon, DocumentIcon, SendIcon, AttachmentIcon, InfoIcon, ClockIcon } from '@/components/ui/Icons';
import styles from './ReferralTab.module.css';

interface ReferralData {
    specialty: string;
    priority: string;
    reasonForReferral: string;
    referralLetter: string;
}

interface ReferralTabProps {
    patient?: Patient | null;
    patients?: Patient[];
    onSave: (data: ReferralData) => void;
    onPatientSelect?: (patient: Patient) => void;
}

const specialties = [
    'Cardiology',
    'Orthopedics',
    'Neurology',
    'Gastroenterology',
    'Dermatology',
    'Endocrinology',
    'Oncology',
    'Rheumatology',
    'Psychiatry',
    'Ophthalmology',
    'ENT',
    'Urology',
    'Gynecology',
    'Respiratory Medicine',
    'Nephrology'
];

const priorities = [
    'Routine',
    'Urgent',
    'Emergency',
    '2-week rule'
];

export default function ReferralTab({
    patient,
    patients = [],
    onSave,
    onPatientSelect
}: ReferralTabProps) {
    const [specialty, setSpecialty] = useState('');
    const [priority, setPriority] = useState('');
    const [reasonForReferral, setReasonForReferral] = useState('');
    const [referralLetter, setReferralLetter] = useState('');

    // Auto-generate referral letter when key fields change
    useEffect(() => {
        if (specialty && patient?.name) {
            const letter = generateReferralLetter(patient.name, specialty, reasonForReferral);
            setReferralLetter(letter);
        }
    }, [specialty, patient?.name, reasonForReferral]);

    const generateReferralLetter = (patientName: string, specialtyType: string, reason: string) => {
        return `Dear Colleague,

I would be grateful if you could see ${patientName} for specialist assessment and management.

Clinical Summary:
${reason || '[Auto-generated from consultation notes]'}

Relevant Investigations:
[Lab results will be attached]

Current Medications:
[Auto-populated from patient record]

Thank you for seeing this patient.

Yours sincerely,
Dr. Pravin Shakti`;
    };

    const handleReasonTranscript = (transcript: string) => {
        setReasonForReferral(transcript);
    };

    const handleSave = () => {
        const referralData: ReferralData = {
            specialty,
            priority,
            reasonForReferral,
            referralLetter
        };
        onSave(referralData);
    };

    const handleSendReferral = () => {
        handleSave();
        // Additional logic for sending referral
        console.log('Referral sent successfully');
    };

    const handleAttachDocuments = () => {
        alert('Document Attachment\n\nAvailable attachments:\n• Recent consultation notes\n• Lab results\n• Imaging reports\n• Previous referrals\n• Care plan\n\n[This would open the document selection interface]');
    };

    // If no patient is selected, show patient selector
    if (!patient && onPatientSelect) {
        return (
            <PatientSelector
                patients={patients}
                onPatientSelect={onPatientSelect}
                title="Select Patient for Referral"
                subtitle="Choose a patient to create a specialist referral"
            />
        );
    }

    return (
        <div className={styles.referralTab}>
            {/* Patient Info Header */}
            {patient && (
                <div className={styles.patientHeader}>
                    <div className={styles.patientInfo}>
                        <div className={styles.patientAvatar}>
                            {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className={styles.patientDetails}>
                            <h3 className={styles.patientName}>{patient.name}</h3>
                            <p className={styles.patientMeta}>
                                {patient.age} years • NHS: {patient.nhs} • {patient.service}
                            </p>
                        </div>
                    </div>
                    {onPatientSelect && (
                        <Button
                            size="sm"
                            onClick={() => onPatientSelect(null as any)}
                        >
                            Change Patient
                        </Button>
                    )}
                </div>
            )}

            {/* Header with Record button */}
            <div className={styles.tabHeader}>
                <h2 className={styles.tabTitle}>Specialist Referral</h2>
                <div className={styles.headerActions}>
                    <Button
                        size="sm"
                        onClick={() => alert('Voice recording started for referral notes\n\n[This would activate voice recording for the referral reason field]')}
                    >
                        <MicrophoneIcon size={16} />
                        Record
                    </Button>
                    <Button
                        size="sm"
                        onClick={() => alert('SOAP Note Integration\n\n[This would import relevant sections from the current consultation SOAP note into the referral letter]')}
                    >
                        <DocumentIcon size={16} />
                        Generate SOAP
                    </Button>
                </div>
            </div>

            {/* Referral Information Section */}
            <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>Referral Information</h3>

                <div className={styles.formGrid}>
                    <div className={styles.formField}>
                        <label className={styles.label}>SPECIALTY</label>
                        <select
                            className={styles.select}
                            value={specialty}
                            onChange={(e) => setSpecialty(e.target.value)}
                        >
                            <option value="">Select specialty...</option>
                            {specialties.map((spec) => (
                                <option key={spec} value={spec}>
                                    {spec}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.formField}>
                        <label className={styles.label}>PRIORITY</label>
                        <select
                            className={styles.select}
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="">Select priority...</option>
                            {priorities.map((prio) => (
                                <option key={prio} value={prio}>
                                    {prio}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className={styles.formField}>
                    <label className={styles.label}>REASON FOR REFERRAL</label>
                    <RecordingInterface onTranscript={handleReasonTranscript} />
                    <textarea
                        className={styles.textarea}
                        placeholder="Clinical indication..."
                        value={reasonForReferral}
                        onChange={(e) => setReasonForReferral(e.target.value)}
                        rows={4}
                    />
                </div>
            </div>

            {/* Referral Letter Section */}
            <div className={styles.formSection}>
                <h3 className={styles.sectionTitle}>REFERRAL LETTER</h3>

                <div className={styles.letterContainer}>
                    <textarea
                        className={styles.letterTextarea}
                        value={referralLetter}
                        onChange={(e) => setReferralLetter(e.target.value)}
                        rows={15}
                    />
                </div>

                {/* Action Buttons */}
                <div className={styles.actionButtons}>
                    <Button
                        variant="primary"
                        onClick={handleSendReferral}
                        className={styles.sendButton}
                    >
                        <SendIcon size={16} />
                        Send Referral
                    </Button>
                    <Button
                        onClick={handleAttachDocuments}
                        className={styles.attachButton}
                    >
                        <AttachmentIcon size={16} />
                        Attach Documents
                    </Button>
                </div>
            </div>

            {/* Additional Features */}
            <div className={styles.additionalFeatures}>
                <div className={styles.featureCard}>
                    <h4 className={styles.featureTitle}>
                        <InfoIcon size={16} style={{ marginRight: '8px' }} />
                        Smart Suggestions
                    </h4>
                    <p className={styles.featureText}>
                        AI will suggest appropriate specialists based on symptoms and diagnosis
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <h4 className={styles.featureTitle}>
                        <DocumentIcon size={16} style={{ marginRight: '8px' }} />
                        Document Automation
                    </h4>
                    <p className={styles.featureText}>
                        Consultation notes and test results automatically attached
                    </p>
                </div>

                <div className={styles.featureCard}>
                    <h4 className={styles.featureTitle}>
                        <ClockIcon size={16} style={{ marginRight: '8px' }} />
                        Follow-up Tracking
                    </h4>
                    <p className={styles.featureText}>
                        Automatic reminders for referral responses and patient follow-up
                    </p>
                </div>
            </div>
        </div>
    );
}