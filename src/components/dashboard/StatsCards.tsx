'use client';

import { StatsCard } from '@/lib/types';
import styles from './StatsCards.module.css';

interface StatsCardsProps {
  stats: StatsCard[];
  onCardClick: (id: string) => void;
  onTeamNoteClick?: (e: React.MouseEvent) => void;
}

export default function StatsCards({ stats, onCardClick, onTeamNoteClick }: StatsCardsProps) {
  return (
    <div className={styles.statsRow}>
      {stats.map((stat) => (
        <div
          key={stat.id}
          className={styles.statCard}
          onClick={() => onCardClick(stat.id)}
        >
          <div className={styles.statLabel}>{stat.label}</div>
          <div className={styles.statValue}>{stat.value}</div>
          {stat.change && (
            <div className={`${styles.statChange} ${stat.changeType === 'positive' ? styles.positive : ''}`}>
              {stat.change}
            </div>
          )}
          {stat.revenue && (
            <span className={styles.costBadge}>{stat.revenue}</span>
          )}
          {stat.hasNotes && (
            <div 
              className={styles.teamNotes} 
              onClick={(e) => {
                e.stopPropagation();
                if (onTeamNoteClick) onTeamNoteClick(e);
              }}
            >
              !
            </div>
          )}
        </div>
      ))}
    </div>
  );
}