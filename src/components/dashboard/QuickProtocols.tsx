'use client';

import { Protocol } from '@/lib/types';
import styles from './QuickProtocols.module.css';

interface QuickProtocolsProps {
    protocols: Protocol[];
    onProtocolClick: (protocolId: string) => void;
}

export default function QuickProtocols({ protocols, onProtocolClick }: QuickProtocolsProps) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>Quick Protocols</h2>
            </div>
            <div className={styles.content}>
                {protocols.map((protocol) => (
                    <div
                        key={protocol.id}
                        className={styles.protocolCard}
                        onClick={() => onProtocolClick(protocol.id)}
                    >
                        <div className={styles.protocolTitle}>{protocol.title}</div>
                        <div className={styles.protocolSteps}>{protocol.steps}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}