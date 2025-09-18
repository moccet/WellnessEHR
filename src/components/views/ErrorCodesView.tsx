'use client';

import { useState } from 'react';
import { ErrorCode, ERROR_DEFINITIONS, ErrorDetails } from '@/lib/errorCodes';
import styles from './ErrorCodesView.module.css';

export default function ErrorCodesView() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

    const errorEntries = Object.entries(ERROR_DEFINITIONS);
    
    const categories = [...new Set(errorEntries.map(([_, details]) => details.category))];
    const severities = ['low', 'medium', 'high', 'critical'];

    const filteredErrors = errorEntries.filter(([code, details]) => {
        const matchesSearch = 
            code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            details.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
            details.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'all' || details.category === selectedCategory;
        const matchesSeverity = selectedSeverity === 'all' || details.severity === selectedSeverity;

        return matchesSearch && matchesCategory && matchesSeverity;
    });

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'critical': return '#d32f2f';
            case 'high': return '#f57c00';
            case 'medium': return '#fbc02d';
            case 'low': return '#388e3c';
            default: return '#757575';
        }
    };

    const getCategoryColor = (category: string) => {
        const colors: Record<string, string> = {
            'API Connection': '#1976d2',
            'Database': '#7b1fa2',
            'Clinical Data': '#388e3c',
            'Billing': '#f57c00',
            'Analytics': '#5e35b1',
            'Security': '#d32f2f',
            'Frontend': '#00796b',
            'System Integration': '#616161'
        };
        return colors[category] || '#757575';
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    🚨 EHR Error Code Reference
                </h1>
                <p className={styles.subtitle}>
                    Comprehensive error code system for troubleshooting and incident reporting
                </p>
            </div>

            <div className={styles.filters}>
                <div className={styles.searchContainer}>
                    <input
                        type="text"
                        placeholder="Search error codes, messages, or descriptions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterRow}>
                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <label className={styles.filterLabel}>Severity:</label>
                        <select
                            value={selectedSeverity}
                            onChange={(e) => setSelectedSeverity(e.target.value)}
                            className={styles.filterSelect}
                        >
                            <option value="all">All Severities</option>
                            {severities.map(severity => (
                                <option key={severity} value={severity}>
                                    {severity.charAt(0).toUpperCase() + severity.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className={styles.stats}>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{errorEntries.length}</div>
                    <div className={styles.statLabel}>Total Error Codes</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{categories.length}</div>
                    <div className={styles.statLabel}>Categories</div>
                </div>
                <div className={styles.statCard}>
                    <div className={styles.statValue}>{filteredErrors.length}</div>
                    <div className={styles.statLabel}>Filtered Results</div>
                </div>
            </div>

            <div className={styles.errorList}>
                {filteredErrors.map(([code, details]) => (
                    <div key={code} className={styles.errorCard}>
                        <div className={styles.errorHeader}>
                            <div className={styles.errorCodeBadge}>
                                {code}
                            </div>
                            <div 
                                className={styles.severityBadge}
                                style={{ backgroundColor: getSeverityColor(details.severity) }}
                            >
                                {details.severity.toUpperCase()}
                            </div>
                            <div 
                                className={styles.categoryBadge}
                                style={{ backgroundColor: getCategoryColor(details.category) }}
                            >
                                {details.category}
                            </div>
                        </div>

                        <div className={styles.errorContent}>
                            <h3 className={styles.errorMessage}>{details.message}</h3>
                            <p className={styles.errorDescription}>{details.description}</p>

                            <div className={styles.suggestedActions}>
                                <h4 className={styles.actionsTitle}>Suggested Actions:</h4>
                                <ul className={styles.actionsList}>
                                    {details.suggestedActions.map((action, index) => (
                                        <li key={index} className={styles.actionItem}>
                                            {action}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {details.technicalDetails && (
                                <div className={styles.technicalDetails}>
                                    <h4 className={styles.technicalTitle}>Technical Details:</h4>
                                    <p className={styles.technicalText}>{details.technicalDetails}</p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {filteredErrors.length === 0 && (
                <div className={styles.noResults}>
                    <h3>No error codes found</h3>
                    <p>Try adjusting your search criteria or filters</p>
                </div>
            )}

            <div className={styles.footer}>
                <div className={styles.footerContent}>
                    <h3>Error Code Format</h3>
                    <p>
                        <strong>EHR-XXXX</strong> where XXXX is a 4-digit number:
                    </p>
                    <ul>
                        <li><strong>1000-1099:</strong> API Connection Errors</li>
                        <li><strong>1100-1199:</strong> Data Validation Errors</li>
                        <li><strong>1200-1299:</strong> Database Errors</li>
                        <li><strong>1300-1399:</strong> Authentication & Authorization</li>
                        <li><strong>1400-1499:</strong> Clinical Data Errors</li>
                        <li><strong>1500-1599:</strong> Billing System Errors</li>
                        <li><strong>1600-1699:</strong> Analytics & Reporting</li>
                        <li><strong>1700-1799:</strong> System Integration</li>
                        <li><strong>1800-1899:</strong> Frontend/UI Errors</li>
                        <li><strong>1900-1999:</strong> Security Errors</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}