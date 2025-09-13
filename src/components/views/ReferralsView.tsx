'use client';

import { useState } from 'react';
import { Patient } from '@/lib/types';
import ReferralTab from '@/components/clinical/ReferralTab';
import Button from '@/components/ui/Button';
import { 
  PlusIcon, 
  ChevronLeftIcon, 
  FileTextIcon, 
  AnalyticsIcon, 
  PatientsIcon,
  TrendingUpIcon,
  ClockIcon,
  CheckCircleIcon
} from '@/components/ui/Icons';
import styles from './ReferralsView.module.css';

interface ReferralsViewProps {
  patients: Patient[];
}

export default function ReferralsView({ patients }: ReferralsViewProps) {
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock recent referrals data
  const recentReferrals = [
    {
      id: 'R001',
      patientName: 'Sarah Thompson',
      specialty: 'Cardiology',
      priority: 'Urgent',
      status: 'Pending',
      date: '2024-08-20',
      consultant: 'Dr. Smith'
    },
    {
      id: 'R002',
      patientName: 'Michael Brown',
      specialty: 'Orthopedics',
      priority: 'Routine',
      status: 'Accepted',
      date: '2024-08-19',
      consultant: 'Dr. Jones'
    },
    {
      id: 'R003',
      patientName: 'Emma Wilson',
      specialty: 'Dermatology',
      priority: '2-week rule',
      status: 'Completed',
      date: '2024-08-18',
      consultant: 'Dr. Davis'
    }
  ];

  const handleCreateNew = () => {
    setSelectedPatient(null);
    setShowCreateForm(true);
  };

  const handlePatientSelect = (patient: Patient | null) => {
    setSelectedPatient(patient);
    if (patient) {
      setShowCreateForm(true);
    } else {
      setShowCreateForm(false);
    }
  };

  const handleSaveReferral = (data: any) => {
    console.log('Saving referral:', data);
    alert('Referral sent successfully!');
    setShowCreateForm(false);
    setSelectedPatient(null);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'var(--accent-warning)';
      case 'accepted': return 'var(--accent-success)';
      case 'completed': return 'var(--text-muted)';
      case 'declined': return 'var(--accent-danger)';
      default: return 'var(--text-secondary)';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'emergency': return 'var(--accent-danger)';
      case 'urgent': return 'var(--accent-warning)';
      case '2-week rule': return 'var(--accent-warning)';
      case 'routine': return 'var(--accent-success)';
      default: return 'var(--text-secondary)';
    }
  };

  if (showCreateForm) {
    return (
      <div className={styles.createView}>
        <div className={styles.createHeader}>
          <Button onClick={() => setShowCreateForm(false)}>
            <ChevronLeftIcon size={16} />
            Back to Referrals
          </Button>
        </div>
        <ReferralTab
          patient={selectedPatient}
          patients={patients}
          onPatientSelect={handlePatientSelect}
          onSave={handleSaveReferral}
        />
      </div>
    );
  }

  return (
    <div className={styles.referralsView}>
      {/* Header */}
      <div className={styles.viewHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.viewTitle}>Referrals Management</h1>
          <p className={styles.viewSubtitle}>
            Create new referrals and track existing ones
          </p>
        </div>
        <Button variant="primary" onClick={handleCreateNew}>
          <PlusIcon size={16} />
          New Referral
        </Button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>12</div>
          <div className={styles.statLabel}>Pending Referrals</div>
          <div className={styles.statChange}>+3 this week</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>8</div>
          <div className={styles.statLabel}>Accepted Today</div>
          <div className={styles.statChange}>2 urgent</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>24h</div>
          <div className={styles.statLabel}>Avg Response Time</div>
          <div className={styles.statChange}>-4h from last month</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>94%</div>
          <div className={styles.statLabel}>Acceptance Rate</div>
          <div className={styles.statChange}>+2% this month</div>
        </div>
      </div>

      {/* Recent Referrals */}
      <div className={styles.referralsSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent Referrals</h2>
          <div className={styles.filterTabs}>
            <button className={`${styles.filterTab} ${styles.active}`}>All</button>
            <button className={styles.filterTab}>Pending</button>
            <button className={styles.filterTab}>Urgent</button>
            <button className={styles.filterTab}>Completed</button>
          </div>
        </div>

        <div className={styles.referralsList}>
          {recentReferrals.map((referral) => (
            <div key={referral.id} className={styles.referralCard}>
              <div className={styles.referralHeader}>
                <div className={styles.referralInfo}>
                  <h3 className={styles.referralPatient}>{referral.patientName}</h3>
                  <p className={styles.referralDetails}>
                    {referral.specialty} • {referral.date}
                  </p>
                </div>
                <div className={styles.referralMeta}>
                  <span 
                    className={styles.priorityBadge}
                    style={{ background: getPriorityColor(referral.priority) }}
                  >
                    {referral.priority}
                  </span>
                  <span 
                    className={styles.statusBadge}
                    style={{ background: getStatusColor(referral.status) }}
                  >
                    {referral.status}
                  </span>
                </div>
              </div>
              
              <div className={styles.referralContent}>
                <p className={styles.consultantInfo}>
                  Referred to: <strong>{referral.consultant}</strong>
                </p>
              </div>

              <div className={styles.referralActions}>
                <Button 
                  size="sm"
                  onClick={() => alert(`Referral Details - ${referral.id}\n\nPatient: ${referral.patientName}\nSpecialty: ${referral.specialty}\nPriority: ${referral.priority}\nStatus: ${referral.status}\nConsultant: ${referral.consultant}\nDate: ${referral.date}\n\n[This would open detailed referral view]`)}
                >
                  View Details
                </Button>
                <Button 
                  size="sm"
                  onClick={() => alert(`Follow Up - ${referral.patientName}\n\nActions available:\n• Contact specialist office\n• Check appointment status\n• Update patient\n• Schedule follow-up\n\n[This would open follow-up management]`)}
                >
                  Follow Up
                </Button>
                {referral.status === 'Pending' && (
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => alert(`Tracking Status - ${referral.id}\n\nCurrent Status: Pending\nSubmitted: ${referral.date}\nExpected Response: Within 48 hours\n\n[This would show real-time status tracking]`)}
                  >
                    Track Status
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className={styles.quickActions}>
        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>
            <FileTextIcon size={20} style={{ marginRight: '8px' }} />
            Template Library
          </h3>
          <p className={styles.actionText}>
            Access pre-written referral templates for common conditions
          </p>
          <Button 
            size="sm"
            onClick={() => alert('Referral Templates\n\nAvailable templates:\n• Cardiology - Chest pain evaluation\n• Orthopedics - Joint pain assessment\n• Dermatology - Skin lesion review\n• Neurology - Headache evaluation\n• Gastroenterology - GI symptoms\n\n[This would open the template library]')}
          >
            <FileTextIcon size={14} />
            Browse Templates
          </Button>
        </div>
        
        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>
            <AnalyticsIcon size={20} style={{ marginRight: '8px' }} />
            Referral Analytics
          </h3>
          <p className={styles.actionText}>
            View detailed analytics on referral patterns and outcomes
          </p>
          <Button 
            size="sm"
            onClick={() => alert('Referral Analytics Dashboard\n\nKey Metrics:\n• 94% acceptance rate (↑2%)\n• 24h avg response time (↓4h)\n• Top specialties: Cardiology, Ortho\n• Peak referral times: 10-11am\n• Outcome tracking available\n\n[This would open detailed analytics]')}
          >
            <AnalyticsIcon size={14} />
            View Analytics
          </Button>
        </div>
        
        <div className={styles.actionCard}>
          <h3 className={styles.actionTitle}>
            <PatientsIcon size={20} style={{ marginRight: '8px' }} />
            Directory
          </h3>
          <p className={styles.actionText}>
            Search consultant directory and specialist availability
          </p>
          <Button 
            size="sm"
            onClick={() => alert('Consultant Directory\n\nSearch by:\n• Specialty (Cardiology, Neurology...)\n• Location (Within 10 miles)\n• Availability (Next 2 weeks)\n• Wait times (< 4 weeks)\n• Ratings & reviews\n\n[This would open the specialist directory]')}
          >
            <PatientsIcon size={14} />
            Open Directory
          </Button>
        </div>
      </div>
    </div>
  );
}