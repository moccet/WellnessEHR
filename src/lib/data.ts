import { Patient, Service, StatsCard, Protocol, MorningDashboardData } from './types';

export const patients: Patient[] = [
    { id: 'P001', name: 'Olivia Randall', age: 37, nhs: 'XXX-XXX-2847', service: 'Executive Health Check', time: '09:00', status: 'waiting', hasNotes: true },
    { id: 'P002', name: 'Ethan Mitchell', age: 42, nhs: 'XXX-XXX-9183', service: 'Blood Tests', time: '09:30', status: 'waiting' },
    { id: 'P003', name: 'Hank Mardukas', age: 28, nhs: 'XXX-XXX-5624', service: 'ADHD Assessment', time: '10:00', status: 'active' },
    { id: 'P004', name: 'Lynn Chin', age: 45, nhs: 'XXX-XXX-7391', service: 'Weight Loss Consultation', time: '10:30', status: 'waiting', hasNotes: true },
    { id: 'P005', name: 'Sarah Thompson', age: 52, nhs: 'XXX-XXX-8234', service: 'Diabetes Review', time: '11:00', status: 'waiting' },
    { id: 'P006', name: 'Michael Brown', age: 34, nhs: 'XXX-XXX-4521', service: 'Mental Health Review', time: '11:30', status: 'waiting', hasNotes: true },
    { id: 'P007', name: 'Emma Wilson', age: 29, nhs: 'XXX-XXX-6782', service: 'Hormone Therapy', time: '12:00', status: 'waiting' },
    { id: 'P008', name: 'James Anderson', age: 61, nhs: 'XXX-XXX-3456', service: 'Hypertension Review', time: '14:00', status: 'waiting' },
    { id: 'P009', name: 'Sophie Martinez', age: 26, nhs: 'XXX-XXX-7890', service: 'Contraception Review', time: '14:30', status: 'waiting' },
    { id: 'P010', name: 'Robert Chen', age: 48, nhs: 'XXX-XXX-2341', service: 'Asthma Review', time: '15:00', status: 'waiting', hasNotes: true },
    { id: 'P011', name: 'Lisa Kumar', age: 39, nhs: 'XXX-XXX-5673', service: 'Migraine Consultation', time: '15:30', status: 'waiting' },
    { id: 'P012', name: 'David Park', age: 55, nhs: 'XXX-XXX-8901', service: 'Cholesterol Review', time: '16:00', status: 'waiting' },
    { id: 'P013', name: 'Anna Rodriguez', age: 31, nhs: 'XXX-XXX-4567', service: 'Skin Check', time: '16:30', status: 'waiting' },
    { id: 'P014', name: 'Thomas White', age: 44, nhs: 'XXX-XXX-1235', service: 'Back Pain Assessment', time: '17:00', status: 'waiting' }
];

export const services: Service[] = [
    { id: 's1', name: 'Blood Tests', duration: '15 min', icon: 'BT' },
    { id: 's2', name: 'Weight Loss', duration: '30 min', icon: 'WL' },
    { id: 's3', name: 'Executive Health', duration: '90 min', icon: 'EH' },
    { id: 's4', name: 'ADHD Assessment', duration: '60 min', icon: 'AD' },
    { id: 's5', name: 'Mental Health', duration: '50 min', icon: 'MH' },
    { id: 's6', name: 'Hormone Therapy', duration: '30 min', icon: 'HT' }
];

export const statsCards: StatsCard[] = [
    {
        id: 'consultations',
        label: "Today's Consultations",
        value: '14',
        change: '16% vs yesterday',
        changeType: 'positive',
        revenue: '£1,680'
    },
    {
        id: 'revenue',
        label: 'Revenue Today',
        value: '£8.4k',
        change: '22% vs average',
        changeType: 'positive'
    },
    {
        id: 'pending',
        label: 'Pending Actions',
        value: '7',
        change: '3 urgent',
        hasNotes: true
    },
    {
        id: 'satisfaction',
        label: 'Patient Satisfaction',
        value: '4.9',
        change: '0.2 this week',
        changeType: 'positive'
    }
];

export const protocols: Protocol[] = [
    {
        id: 'chest-pain',
        title: 'Chest Pain Assessment',
        steps: 'ECG → Troponin → Risk Score → Disposition'
    },
    {
        id: 'diabetes',
        title: 'Type 2 Diabetes Initial',
        steps: 'HbA1c → Metformin → Lifestyle → Follow-up'
    },
    {
        id: 'hypertension',
        title: 'Hypertension Management',
        steps: '24hr BP → ACE/ARB → Monitor → Titrate'
    }
];

export const morningDashboardData: MorningDashboardData = {
    greeting: 'Good Morning, Dr. Shakti',
    date: new Date().toLocaleDateString('en-GB', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }),
    schedule: {
        totalPatients: 14,
        firstPatient: 'Olivia Randall - 9:00 AM',
        videoConsults: 3
    },
    actionItems: {
        labResults: 2,
        prescriptionRenewals: 5,
        insuranceForms: 1
    },
    clinicalAlerts: [
        {
            message: 'Flu vaccine stock: 12 remaining',
            priority: 'medium',
            type: 'warning'
        },
        {
            message: "Mrs. Chen's HbA1c improved to 6.8",
            priority: 'low',
            type: 'success'
        },
        {
            message: 'Weather Alert: Migraine triggers high',
            priority: 'low',
            type: 'info'
        }
    ],
    teamUpdates: [
        { message: 'Nurse Sarah prepped Room 3' },
        { message: 'Dr. Williams covering lunch (12-1 PM)' },
        { message: 'New COVID protocols in effect' }
    ]
};