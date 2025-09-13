'use client';

import { useState, useEffect, useCallback } from 'react';
import { formatTime } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { RecordIcon, StopIcon, PlayIcon, PauseIcon } from '@/components/ui/Icons';
import styles from './RecordingInterface.module.css';

interface RecordingInterfaceProps {
  onTranscript: (transcript: string) => void;
}

export default function RecordingInterface({ onTranscript }: RecordingInterfaceProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRecording && !isPaused) {
      interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => clearInterval(interval);
  }, [isRecording, isPaused]);

  const handleStartRecording = useCallback(() => {
    setIsRecording(true);
    setIsPaused(false);
    setRecordingTime(0);
  }, []);

  const handleStopRecording = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    
    // Simulate transcription
    setTimeout(() => {
      const sampleTranscripts = [
        "Patient presents with persistent headache for 3 days, describing it as throbbing pain on the right side.",
        "Chief complaint of chest tightness and shortness of breath, especially on exertion.",
        "Patient reports lower back pain radiating down the left leg, started after lifting heavy objects.",
        "Presenting with fatigue, dizziness, and occasional palpitations over the past week."
      ];
      const transcript = sampleTranscripts[Math.floor(Math.random() * sampleTranscripts.length)];
      onTranscript(transcript);
    }, 1000);
  }, [onTranscript]);

  const handlePauseRecording = useCallback(() => {
    setIsPaused(!isPaused);
  }, [isPaused]);

  return (
    <div className={styles.recordingBox}>
      <div className={`${styles.recordingWave} ${isRecording && !isPaused ? styles.active : ''}`}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={styles.waveBar} />
        ))}
      </div>
      
      <div className={styles.recordingContent}>
        <div className={styles.recordingStatus}>
          <div className={`${styles.recordDot} ${isRecording && !isPaused ? styles.active : ''}`} />
          <span className={styles.statusText}>
            {isRecording ? (isPaused ? 'Paused' : 'Recording...') : 'Ready to record'}
          </span>
        </div>
        
        <div className={styles.recordingTime}>
          {formatTime(recordingTime)}
        </div>
        
        <div className={styles.recordingControls}>
          {!isRecording ? (
            <Button onClick={handleStartRecording} variant="primary">
              <RecordIcon size={16} />
              Start Recording
            </Button>
          ) : (
            <>
              <Button onClick={handlePauseRecording}>
                {isPaused ? <PlayIcon size={16} /> : <PauseIcon size={16} />}
                {isPaused ? 'Resume' : 'Pause'}
              </Button>
              <Button onClick={handleStopRecording} variant="danger">
                <StopIcon size={16} />
                Stop Recording
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}