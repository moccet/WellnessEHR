import { Patient } from './types';

export function getPatientInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('');
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getCurrentDate(): string {
  return new Date().toLocaleDateString('en-GB', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function checkDrugInteraction(drugName: string): boolean {
  const dangerousCombinations = ['ibuprofen', 'aspirin', 'warfarin'];
  return dangerousCombinations.some(drug => 
    drugName.toLowerCase().includes(drug)
  );
}

export function generatePatientId(): string {
  return `P${Date.now().toString().slice(-3)}`;
}

export function filterPatients(patients: Patient[], status?: string): Patient[] {
  if (!status || status === 'all') return patients;
  return patients.filter(p => p.status === status);
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'waiting': return 'var(--accent-warning)';
    case 'active': return 'var(--accent-success)';
    case 'completed': return 'var(--text-muted)';
    default: return 'var(--text-secondary)';
  }
}

export function getPriorityColor(priority: 'low' | 'medium' | 'high'): string {
  switch (priority) {
    case 'high': return 'var(--accent-danger)';
    case 'medium': return 'var(--accent-warning)';
    case 'low': return 'var(--accent-info)';
  }
}

export function simulateVoiceRecognition(): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const commands = [
        "Show Mrs. Smith's last HbA1c",
        "Schedule follow-up appointment",
        "Order blood tests for diabetes panel",
        "Generate prescription for hypertension"
      ];
      resolve(commands[Math.floor(Math.random() * commands.length)]);
    }, 2000);
  });
}

export function generateSOAPNote(patientName: string): string {
  return `SOAP Note for ${patientName}

Subjective:
Patient presents with chief complaint as documented.

Objective:
Vital signs stable. Physical examination findings as noted.

Assessment:
Clinical assessment based on history and examination.

Plan:
Treatment plan and follow-up recommendations documented.`;
}

export function validatePrescription(prescription: {
  name: string;
  dose: string;
  frequency: string;
  duration: string;
}): boolean {
  return !!(prescription.name && prescription.dose && prescription.frequency && prescription.duration);
}