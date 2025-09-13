'use client';

import { Patient } from '@/lib/types';
import { getPatientInitials } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { 
  ConsultationIcon, 
  PrescriptionIcon, 
  ReferralIcon, 
  LabsIcon, 
  BillingIcon, 
  HistoryIcon 
} from '@/components/ui/Icons';
import styles from './ClinicalPanel.module.css';

interface ClinicalPanelProps {
  isOpen: boolean;
  patient: Patient | null;
  currentTab: string;
  onClose: () => void;
  onTabChange: (tab: string) => void;
  onSOAPGenerate: () => void;
  children: React.ReactNode;
}

const panelTabs = [
  { id: 'consultation', label: 'Consultation', icon: ConsultationIcon },
  { id: 'prescription', label: 'Prescribe', icon: PrescriptionIcon },
  { id: 'referral', label: 'Refer', icon: ReferralIcon },
  { id: 'labs', label: 'Labs', icon: LabsIcon },
  { id: 'billing', label: 'Billing', icon: BillingIcon },
  { id: 'history', label: 'History', icon: HistoryIcon },
];

const tabTitles: Record<string, string> = {
  consultation: 'Clinical Consultation',
  prescription: 'Electronic Prescription',
  referral: 'Specialist Referral',
  labs: 'Laboratory Orders',
  billing: 'Billing & Payment',
  history: 'Medical History'
};

export default function ClinicalPanel({
  isOpen,
  patient,
  currentTab,
  onClose,
  onTabChange,
  onSOAPGenerate,
  children
}: ClinicalPanelProps) {
  if (!isOpen || !patient) return null;

  return (
    <div className={`${styles.clinicalPanel} ${isOpen ? styles.active : ''}`}>
      <div className={styles.panelSidebar}>
        <div className={styles.panelPatient}>
          <div className={styles.patientHeader}>
            <div className={styles.patientAvatar}>
              {getPatientInitials(patient.name)}
            </div>
            <div className={styles.patientInfo}>
              <div className={styles.patientName}>{patient.name}</div>
              <div className={styles.patientId}>NHS: {patient.nhs}</div>
            </div>
          </div>
        </div>
        <nav className={styles.panelNav}>
          {panelTabs.map((tab) => (
            <div
              key={tab.id}
              className={`${styles.panelNavItem} ${currentTab === tab.id ? styles.active : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className={styles.tabIcon}>
                <tab.icon size={16} />
              </span>
              {tab.label}
            </div>
          ))}
        </nav>
      </div>
      <div className={styles.panelMain}>
        <div className={styles.panelHeader}>
          <h2 className={styles.panelTitle}>{tabTitles[currentTab] || 'Clinical Panel'}</h2>
          <div className={styles.panelTools}>
            <Button onClick={onSOAPGenerate} size="sm">
              Generate SOAP
            </Button>
            <Button onClick={onClose} size="sm">
              Close
            </Button>
          </div>
        </div>
        <div className={styles.panelContent}>
          {children}
        </div>
      </div>
    </div>
  );
}