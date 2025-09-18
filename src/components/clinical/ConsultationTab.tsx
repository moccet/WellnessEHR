'use client';

import { useState } from 'react';
import { VitalSigns } from '@/lib/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import RecordingInterface from './RecordingInterface';
import styles from './ConsultationTab.module.css';

interface ConsultationTabProps {
    onSave: (data: {
        chiefComplaint: string;
        vitals: VitalSigns;
        assessment: string;
    }) => void;
}

export default function ConsultationTab({ onSave }: ConsultationTabProps) {
    const [chiefComplaint, setChiefComplaint] = useState('');
    const [vitals, setVitals] = useState<VitalSigns>({});
    const [assessment, setAssessment] = useState('');

    const handleSave = () => {
        onSave({
            chiefComplaint,
            vitals,
            assessment
        });
    };

    const handleRecordingComplete = (transcript: string) => {
        setChiefComplaint(transcript);
    };

    return (
        <div className={styles.consultationTab}>
            <div className={styles.formSection}>
                <div className={styles.formTitle}>
                    Chief Complaint
                </div>
                <RecordingInterface onTranscript={handleRecordingComplete} />
                <textarea
                    className={styles.textarea}
                    placeholder="Chief complaint notes..."
                    value={chiefComplaint}
                    onChange={(e) => setChiefComplaint(e.target.value)}
                    rows={4}
                />
            </div>

            <div className={styles.formSection}>
                <div className={styles.formTitle}>Physical Examination</div>
                <div className={styles.formGrid}>
                    <Input
                        label="Temperature"
                        placeholder="36.5°C"
                        value={vitals.temperature || ''}
                        onChange={(e) => setVitals(prev => ({ ...prev, temperature: e.target.value }))}
                    />
                    <Input
                        label="Blood Pressure"
                        placeholder="120/80"
                        value={vitals.bloodPressure || ''}
                        onChange={(e) => setVitals(prev => ({ ...prev, bloodPressure: e.target.value }))}
                    />
                    <Input
                        label="Heart Rate"
                        placeholder="72 bpm"
                        value={vitals.heartRate || ''}
                        onChange={(e) => setVitals(prev => ({ ...prev, heartRate: e.target.value }))}
                    />
                    <Input
                        label="O2 Saturation"
                        placeholder="98%"
                        value={vitals.oxygenSaturation || ''}
                        onChange={(e) => setVitals(prev => ({ ...prev, oxygenSaturation: e.target.value }))}
                    />
                </div>
            </div>

            <div className={styles.formSection}>
                <div className={styles.formTitle}>Assessment & Plan</div>
                <textarea
                    className={styles.textarea}
                    placeholder="Clinical assessment and treatment plan..."
                    value={assessment}
                    onChange={(e) => setAssessment(e.target.value)}
                    rows={6}
                />
                <div className={styles.actionSection}>
                    <Button variant="primary" onClick={handleSave}>
                        Save Consultation
                    </Button>
                </div>
            </div>
        </div>
    );
}