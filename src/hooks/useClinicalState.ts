'use client';

import { useState, useCallback, useEffect } from 'react';
import { ClinicalState, Patient, Prescription } from '@/lib/types';

const initialState: ClinicalState = {
    currentView: 'dashboard',
    currentPatient: null,
    currentPanelTab: 'consultation',
    isRecording: false,
    recordingTime: 0,
    prescriptions: [],
    videoCallActive: false,
    aiActive: false,
    voiceActive: false,
    morningDashboardSeen: false,
    clinicalPanelOpen: false,
    photoModalOpen: false,
    daySummaryOpen: false,
};

export function useClinicalState() {
    const [state, setState] = useState<ClinicalState>(initialState);

    const updateState = useCallback((updates: Partial<ClinicalState>) => {
        setState(prev => ({ ...prev, ...updates }));
    }, []);

    const setCurrentView = useCallback((view: ClinicalState['currentView']) => {
        updateState({ currentView: view });
    }, [updateState]);

    const setCurrentPatient = useCallback((patient: Patient | null) => {
        updateState({ currentPatient: patient });
    }, [updateState]);

    const openPatient = useCallback((patient: Patient) => {
        updateState({
            currentPatient: patient,
            clinicalPanelOpen: true,
            currentPanelTab: 'consultation'
        });
    }, [updateState]);

    const closePanel = useCallback(() => {
        updateState({
            clinicalPanelOpen: false,
            currentPatient: null
        });
    }, [updateState]);

    const setPanelTab = useCallback((tab: ClinicalState['currentPanelTab']) => {
        updateState({ currentPanelTab: tab });
    }, [updateState]);

    const toggleRecording = useCallback(() => {
        updateState({ isRecording: !state.isRecording });
    }, [state.isRecording, updateState]);

    const updateRecordingTime = useCallback((time: number) => {
        updateState({ recordingTime: time });
    }, [updateState]);

    const addPrescription = useCallback((prescription: Prescription) => {
        updateState({
            prescriptions: [...state.prescriptions, prescription]
        });
    }, [state.prescriptions, updateState]);

    const removePrescription = useCallback((index: number) => {
        const newPrescriptions = state.prescriptions.filter((_, i) => i !== index);
        updateState({ prescriptions: newPrescriptions });
    }, [state.prescriptions, updateState]);

    const clearPrescriptions = useCallback(() => {
        updateState({ prescriptions: [] });
    }, [updateState]);

    const toggleVideoCall = useCallback(() => {
        updateState({ videoCallActive: !state.videoCallActive });
    }, [state.videoCallActive, updateState]);

    const toggleAI = useCallback(() => {
        updateState({ aiActive: !state.aiActive });
    }, [state.aiActive, updateState]);

    const toggleVoice = useCallback(() => {
        updateState({ voiceActive: !state.voiceActive });
    }, [state.voiceActive, updateState]);

    const showMorningDashboard = useCallback(() => {
        updateState({ morningDashboardSeen: false });
    }, [updateState]);

    const closeMorningDashboard = useCallback(() => {
        updateState({ morningDashboardSeen: true });
    }, [updateState]);

    const togglePhotoModal = useCallback(() => {
        updateState({ photoModalOpen: !state.photoModalOpen });
    }, [state.photoModalOpen, updateState]);

    const toggleDaySummary = useCallback(() => {
        updateState({ daySummaryOpen: !state.daySummaryOpen });
    }, [state.daySummaryOpen, updateState]);

    // Initialize morning dashboard on first load
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!state.morningDashboardSeen) {
                showMorningDashboard();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return {
        state,
        actions: {
            updateState,
            setCurrentView,
            setCurrentPatient,
            openPatient,
            closePanel,
            setPanelTab,
            toggleRecording,
            updateRecordingTime,
            addPrescription,
            removePrescription,
            clearPrescriptions,
            toggleVideoCall,
            toggleAI,
            toggleVoice,
            showMorningDashboard,
            closeMorningDashboard,
            togglePhotoModal,
            toggleDaySummary,
        }
    };
}