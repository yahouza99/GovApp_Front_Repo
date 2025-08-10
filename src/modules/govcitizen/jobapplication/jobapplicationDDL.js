// Job Application DDL-like definitions, mock data, and helpers aligned with org_job_application
import { orgJobOffers } from '../joboffer/jobofferDDL';

export const applicationStatuses = {
  1: { label: 'Reçu' },
  2: { label: 'En cours' },
  3: { label: 'Accepté' },
  4: { label: 'Rejeté' },
};

// Minimal education/work mode preference references can be shared or simplified
export const educationLevels = {
  1: { label: 'Licence' },
  2: { label: 'Master' },
  3: { label: 'Doctorat' },
};

export const workModePreferences = {
  1: { label: 'Présentiel' },
  2: { label: 'Télétravail' },
  3: { label: 'Hybride' },
};

export const orgJobApplications = [
  {
    job_application_id: 101,
    job_offer_id: 1,
    citizen_id: null,
    full_name: 'Amadou Boubacar',
    email: 'amadou@example.com',
    phone: '+33 6 12 34 56 78',
    address: '12 Rue de Paris, 75001 Paris',
    country_id: 3001,
    resume_url: 'https://example.com/cv/amadou.pdf',
    resume_file: null,
    cover_letter_url: '',
    portfolio_url: '',
    other_documents_url: '',
    education_level_id: 2,
    experience_years: 4,
    work_mode_preference_id: 3,
    languages: 'Français (C1); Anglais (B2)',
    application_date: '2025-08-09T10:30:00Z',
    status_id: 2,
    interview_date: '',
    interview_notes: '',
    recruiter_notes: '',
    created: '2025-08-09T10:30:00Z',
  },
  {
    job_application_id: 102,
    job_offer_id: 2,
    citizen_id: null,
    full_name: 'Seynabou Diallo',
    email: 'seynabou@example.com',
    phone: '+33 7 22 33 44 55',
    address: 'Lyon, France',
    country_id: 3001,
    resume_url: '',
    resume_file: null,
    cover_letter_url: '',
    portfolio_url: 'https://portfolio.example.com/seynabou',
    other_documents_url: '',
    education_level_id: 1,
    experience_years: 2,
    work_mode_preference_id: 2,
    languages: 'Français (B2); Anglais (B2)',
    application_date: '2025-08-10T08:15:00Z',
    status_id: 1,
    interview_date: '',
    interview_notes: '',
    recruiter_notes: '',
    created: '2025-08-10T08:15:00Z',
  },
];

export const formatDateTime = (d) => {
  if (!d) return '-';
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleString();
  } catch {
    return '-';
  }
};

export const offerTitleById = (id) => {
  const offer = orgJobOffers.find((o) => o.job_offer_id === id);
  return offer ? offer.job_title : '-';
};
