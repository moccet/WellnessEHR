'use client';

import { useState } from 'react';
import { useClinicalState } from '@/hooks/useClinicalState';
import { patients, services, statsCards, protocols, morningDashboardData } from '@/lib/data';
import { Patient } from '@/lib/types';

// Layout components
import Sidebar from '@/components/layout/Sidebar';
import HeaderBar from '@/components/layout/HeaderBar';
import SmartActionsBar from '@/components/layout/SmartActionsBar';

// Dashboard components
import StatsCards from '@/components/dashboard/StatsCards';
import PatientQueue from '@/components/dashboard/PatientQueue';
import QuickProtocols from '@/components/dashboard/QuickProtocols';
import QuickServices from '@/components/dashboard/QuickServices';

// Clinical components
import ClinicalPanel from '@/components/clinical/ClinicalPanel';
import ConsultationTab from '@/components/clinical/ConsultationTab';
import ReferralTab from '@/components/clinical/ReferralTab';

// Modal and Floating components
import MorningDashboard from '@/components/modals/MorningDashboard';
import FloatingButtons from '@/components/floating/FloatingButtons';

// View components
import ReferralsView from '@/components/views/ReferralsView';

import styles from './page.module.css';

export default function ClinicalOS() {
  const { state, actions } = useClinicalState();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const handlePatientClick = (patient: Patient) => {
    actions.openPatient(patient);
  };

  const handleVideoCall = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      actions.setCurrentPatient(patient);
      actions.toggleVideoCall();
    }
  };

  const handleQuickPrescribe = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      actions.openPatient(patient);
      setTimeout(() => actions.setPanelTab('prescription'), 100);
    }
  };

  const handleQuickBill = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      actions.openPatient(patient);
      setTimeout(() => actions.setPanelTab('billing'), 100);
    }
  };

  const handleQuickRefer = (patientId: string) => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      actions.openPatient(patient);
      setTimeout(() => actions.setPanelTab('referral'), 100);
    }
  };

  const handleSmartAction = (action: string) => {
    switch (action) {
      case 'soap':
        if (state.currentPatient) {
          alert(`Generated SOAP note for ${state.currentPatient.name}`);
        } else {
          alert('Please select a patient first to generate SOAP note');
        }
        break;
      case 'prescribe':
        if (state.currentPatient) {
          actions.openPatient(state.currentPatient);
          setTimeout(() => actions.setPanelTab('prescription'), 100);
        } else {
          alert('Please select a patient first to create a prescription');
        }
        break;
      case 'labs':
        if (state.currentPatient) {
          actions.openPatient(state.currentPatient);
          setTimeout(() => actions.setPanelTab('labs'), 100);
        } else {
          alert('Please select a patient first to order labs');
        }
        break;
      case 'refer':
        if (state.currentPatient) {
          actions.openPatient(state.currentPatient);
          setTimeout(() => actions.setPanelTab('referral'), 100);
        } else {
          alert('Please select a patient first to create a referral');
        }
        break;
      case 'bill':
        if (state.currentPatient) {
          actions.openPatient(state.currentPatient);
          setTimeout(() => actions.setPanelTab('billing'), 100);
        } else {
          alert('Please select a patient first to process billing');
        }
        break;
      case 'letter':
        if (state.currentPatient) {
          alert(`Generated letter for ${state.currentPatient.name}`);
        } else {
          alert('Please select a patient first to generate a letter');
        }
        break;
      case 'summary':
        actions.toggleDaySummary();
        break;
    }
  };

  const handleProtocolClick = (protocolId: string) => {
    const protocol = protocols.find(p => p.id === protocolId);
    if (protocol) {
      if (state.currentPatient) {
        alert(`Applied ${protocol.title} protocol for ${state.currentPatient.name}\n\nSteps: ${protocol.steps}`);
        actions.openPatient(state.currentPatient);
        setTimeout(() => actions.setPanelTab('consultation'), 100);
      } else {
        alert(`${protocol.title} Protocol\n\nSteps: ${protocol.steps}\n\nPlease select a patient to apply this protocol.`);
      }
    }
  };

  const handleServiceClick = (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      if (state.currentPatient) {
        alert(`Started ${service.name} service for ${state.currentPatient.name}\n\nDuration: ${service.duration}`);
        actions.openPatient(state.currentPatient);
      } else {
        alert(`${service.name} Service\n\nDuration: ${service.duration}\n\nPlease select a patient to start this service.`);
      }
    }
  };

  const handleStatsClick = (statsId: string) => {
    const stat = statsCards.find(s => s.id === statsId);
    if (stat) {
      alert(`${stat.label} Details\n\nCurrent Value: ${stat.value}\n${stat.change ? `Change: ${stat.change}` : ''}`);
    }
  };

  const renderDashboard = () => (
    <div className={styles.dashboardGrid}>
      <StatsCards
        stats={statsCards}
        onCardClick={handleStatsClick}
        onTeamNoteClick={(e) => console.log('Team note clicked', e)}
      />
      <PatientQueue
        patients={patients}
        onPatientClick={handlePatientClick}
        onVideoCall={handleVideoCall}
        onQuickPrescribe={handleQuickPrescribe}
        onQuickBill={handleQuickBill}
        onQuickRefer={handleQuickRefer}
      />
      <QuickProtocols
        protocols={protocols}
        onProtocolClick={handleProtocolClick}
      />
      <QuickServices
        services={services}
        onServiceClick={handleServiceClick}
        onViewAll={() => actions.setCurrentView('services')}
      />
    </div>
  );

  const renderCurrentView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'patients':
        return (
          <div className={styles.viewContainer}>
            <h2 className={styles.viewTitle}>All Patients</h2>
            <PatientQueue
              patients={patients}
              onPatientClick={handlePatientClick}
              onVideoCall={handleVideoCall}
              onQuickPrescribe={handleQuickPrescribe}
              onQuickBill={handleQuickBill}
              onQuickRefer={handleQuickRefer}
            />
          </div>
        );
      case 'services':
        return (
          <div className={styles.viewContainer}>
            <h2 className={styles.viewTitle}>Clinical Services</h2>
            <div className={styles.servicesGrid}>
              {services.map((service) => (
                <div
                  key={service.id}
                  className={styles.serviceCard}
                  onClick={() => handleServiceClick(service.id)}
                >
                  <div className={styles.serviceIcon}>{service.icon}</div>
                  <div className={styles.serviceName}>{service.name}</div>
                  <div className={styles.serviceDuration}>{service.duration}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'referrals':
        return <ReferralsView patients={patients} />;
      default:
        return (
          <div className={styles.viewContainer}>
            <h2 className={styles.viewTitle}>
              {state.currentView.charAt(0).toUpperCase() + state.currentView.slice(1)}
            </h2>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  const renderPanelContent = () => {
    switch (state.currentPanelTab) {
      case 'consultation':
        return (
          <ConsultationTab
            onSave={(data) => {
              console.log('Consultation data:', data);
              actions.closePanel();
            }}
          />
        );
      case 'referral':
        return (
          <ReferralTab
            patient={state.currentPatient}
            patients={patients}
            onPatientSelect={(patient) => {
              if (patient) {
                actions.setCurrentPatient(patient);
              } else {
                // Return to patient selection
                actions.setCurrentPatient(null);
              }
            }}
            onSave={(data) => {
              console.log('Referral data:', data);
              // Show success message
              alert('Referral sent successfully!');
              actions.closePanel();
            }}
          />
        );
      default:
        return (
          <div className={styles.tabPlaceholder}>
            <h3>{state.currentPanelTab.charAt(0).toUpperCase() + state.currentPanelTab.slice(1)} Tab</h3>
            <p>This tab is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.clinicalOS}>
      {/* Morning Dashboard */}
      <MorningDashboard
        isOpen={!state.morningDashboardSeen}
        data={morningDashboardData}
        onClose={actions.closeMorningDashboard}
      />

      <Sidebar
        currentView={state.currentView}
        onViewChange={actions.setCurrentView}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <main className={styles.mainContent}>
        <HeaderBar
          onMenuToggle={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onVideoStart={() => {
            if (state.currentPatient) {
              actions.toggleVideoCall();
              alert(`Starting video call with ${state.currentPatient.name}`);
            } else {
              alert('Please select a patient first to start a video call');
            }
          }}
          onNewPatient={() => {
            alert('New Patient Registration\n\nFeatures:\n• Patient demographics\n• Medical history\n• Insurance information\n• Emergency contacts\n\n[This would open the patient registration form]');
          }}
          onAIToggle={actions.toggleAI}
        />

        <div className={styles.content}>
          {renderCurrentView()}
        </div>

        <SmartActionsBar onAction={handleSmartAction} />
      </main>

      {/* Floating Action Buttons */}
      <FloatingButtons
        onVoiceToggle={actions.toggleVoice}
        onPhotoCapture={actions.togglePhotoModal}
        isVoiceActive={state.voiceActive}
      />

      <ClinicalPanel
        isOpen={state.clinicalPanelOpen}
        patient={state.currentPatient}
        currentTab={state.currentPanelTab}
        onClose={actions.closePanel}
        onTabChange={actions.setPanelTab}
        onSOAPGenerate={() => {
          if (state.currentPatient) {
            alert(`SOAP Note Generated for ${state.currentPatient.name}\n\nSubjective: Patient reports primary concern\nObjective: Clinical findings and vital signs\nAssessment: Clinical impression and diagnosis\nPlan: Treatment plan and follow-up\n\n[This would generate a detailed SOAP note based on consultation data]`);
          } else {
            alert('Please select a patient to generate SOAP note');
          }
        }}
      >
        {renderPanelContent()}
      </ClinicalPanel>
    </div>
  );
}
