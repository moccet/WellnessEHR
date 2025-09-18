'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import { VideoIcon, PlusIcon, MenuIcon } from '@/components/ui/Icons';
import styles from './HeaderBar.module.css';

interface HeaderBarProps {
    onMenuToggle: () => void;
    onVideoStart: () => void;
    onNewPatient: () => void;
    onAIToggle: () => void;
}

export default function HeaderBar({
    onMenuToggle,
    onVideoStart,
    onNewPatient,
    onAIToggle
}: HeaderBarProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // Simple search simulation
            const query = searchQuery.toLowerCase();
            if (query.includes('patient') || query.includes('sarah') || query.includes('smith')) {
                alert(`Search Results for "${searchQuery}":\n\n• Sarah Thompson - 52 years\n• Smith, John - 45 years\n• Patient records found: 2`);
            } else if (query.includes('service') || query.includes('blood') || query.includes('test')) {
                alert(`Search Results for "${searchQuery}":\n\n• Blood Tests - 15 min\n• Executive Health - 90 min\n• Services found: 2`);
            } else {
                alert(`Search Results for "${searchQuery}":\n\nNo exact matches found.\nTry searching for:\n• Patient names\n• Services\n• Medical conditions`);
            }
            setSearchQuery('');
        }
    };

    return (
        <header className={styles.headerBar}>
            <button className={styles.menuToggle} onClick={onMenuToggle}>
                <MenuIcon size={20} />
            </button>

            <form className={styles.searchContainer} onSubmit={handleSearch}>
                <input
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search patients, services, or ask AI..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                    type="button"
                    className={styles.searchAiBtn}
                    onClick={onAIToggle}
                >
                    AI
                </button>
            </form>

            <div className={styles.headerActions}>
                <Button onClick={onVideoStart}>
                    <VideoIcon size={18} />
                    Start Call
                </Button>
                <Button variant="primary" onClick={onNewPatient}>
                    <PlusIcon size={18} />
                    New Patient
                </Button>
            </div>
        </header>
    );
}