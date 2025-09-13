'use client';

import { Service } from '@/lib/types';
import Button from '@/components/ui/Button';
import styles from './QuickServices.module.css';

interface QuickServicesProps {
  services: Service[];
  onServiceClick: (serviceId: string) => void;
  onViewAll: () => void;
}

export default function QuickServices({ services, onServiceClick, onViewAll }: QuickServicesProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Quick Services</h2>
        <Button onClick={onViewAll} size="sm">
          View All
        </Button>
      </div>
      <div className={styles.content}>
        <div className={styles.servicesGrid}>
          {services.map((service) => (
            <div
              key={service.id}
              className={styles.serviceCard}
              onClick={() => onServiceClick(service.id)}
            >
              <div className={styles.serviceIcon}>{service.icon}</div>
              <div className={styles.serviceName}>{service.name}</div>
              <div className={styles.serviceDuration}>{service.duration}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}