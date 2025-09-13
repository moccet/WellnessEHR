'use client';

import { useState } from 'react';
import { 
  DashboardIcon, 
  PatientsIcon, 
  ServicesIcon, 
  PrescriptionIcon, 
  LabIcon, 
  ReferralIcon, 
  BillingIcon, 
  AnalyticsIcon 
} from '@/components/ui/Icons';
import styles from './Sidebar.module.css';

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  isMobileOpen?: boolean;
  onMobileToggle?: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: DashboardIcon },
  { id: 'patients', label: 'Patients', Icon: PatientsIcon },
  { id: 'services', label: 'Services', Icon: ServicesIcon },
  { id: 'prescriptions', label: 'Prescriptions', Icon: PrescriptionIcon },
  { id: 'labs', label: 'Lab Orders', Icon: LabIcon },
  { id: 'referrals', label: 'Referrals', Icon: ReferralIcon },
  { id: 'billing', label: 'Billing', Icon: BillingIcon },
  { id: 'analytics', label: 'Analytics', Icon: AnalyticsIcon },
];

export default function Sidebar({ 
  currentView, 
  onViewChange, 
  isMobileOpen = false,
  onMobileToggle 
}: SidebarProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <nav 
      className={`${styles.sidebar} ${isMobileOpen ? styles.mobileOpen : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.header}>
        <div className={styles.logo}>W</div>
      </div>
      
      <div className={styles.navSection}>
        {navItems.map((item) => {
          const { Icon } = item;
          return (
            <div
              key={item.id}
              className={`${styles.navItem} ${currentView === item.id ? styles.active : ''}`}
              onClick={() => {
                onViewChange(item.id);
                if (onMobileToggle) onMobileToggle();
              }}
            >
              <div className={styles.navIcon}>
                <Icon size={20} />
              </div>
              <span className={`${styles.navLabel} ${isHovered ? styles.visible : ''}`}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}