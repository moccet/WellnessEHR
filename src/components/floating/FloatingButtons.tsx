'use client';

import { useState } from 'react';
import { MicrophoneIcon, CameraIcon } from '@/components/ui/Icons';
import styles from './FloatingButtons.module.css';

interface FloatingButtonsProps {
    onVoiceToggle: () => void;
    onPhotoCapture: () => void;
    isVoiceActive?: boolean;
}

export default function FloatingButtons({
    onVoiceToggle,
    onPhotoCapture,
    isVoiceActive = false
}: FloatingButtonsProps) {
    return (
        <div className={styles.floatingContainer}>
            {/* Voice Command Button */}
            <button
                className={`${styles.voiceCommand} ${isVoiceActive ? styles.listening : ''}`}
                onClick={onVoiceToggle}
                title="Voice Commands"
            >
                <MicrophoneIcon size={24} />
            </button>

            {/* Photo Capture Button */}
            <button
                className={styles.photoCapture}
                onClick={onPhotoCapture}
                title="Clinical Photography"
            >
                <CameraIcon size={24} />
            </button>
        </div>
    );
}