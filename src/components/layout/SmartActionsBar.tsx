'use client';

import styles from './SmartActionsBar.module.css';

interface SmartActionsBarProps {
  onAction: (action: string) => void;
}

const smartActions = [
  { id: 'soap', label: 'Generate SOAP', suggested: true },
  { id: 'prescribe', label: 'Quick Prescribe' },
  { id: 'labs', label: 'Order Labs' },
  { id: 'refer', label: 'Make Referral' },
  { id: 'bill', label: 'Process Billing', suggested: true },
  { id: 'letter', label: 'Generate Letter' },
  { id: 'summary', label: 'End Day Summary' },
];

export default function SmartActionsBar({ onAction }: SmartActionsBarProps) {
  return (
    <div className={styles.smartActionsBar}>
      {smartActions.map((action) => (
        <div
          key={action.id}
          className={`${styles.smartAction} ${action.suggested ? styles.suggested : ''}`}
          onClick={() => onAction(action.id)}
        >
          {action.label}
        </div>
      ))}
    </div>
  );
}