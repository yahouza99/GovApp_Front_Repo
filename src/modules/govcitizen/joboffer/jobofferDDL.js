// Job Offer DDL-like definitions, mock data, and helpers aligned with org_job_offer

export const jobTypes = {
  1: { label: 'CDI' },
  2: { label: 'CDD' },
  3: { label: 'Stage' },
  4: { label: 'Freelance' },
};

export const workModes = {
  1: { label: 'Présentiel' },
  2: { label: 'Télétravail' },
  3: { label: 'Hybride' },
};

export const educationLevels = {
  1: { label: 'Licence' },
  2: { label: 'Master' },
  3: { label: 'Doctorat' },
};

export const experienceLevels = {
  1: { label: 'Junior' },
  2: { label: 'Confirmé' },
  3: { label: 'Senior' },
};

export const jobStatuses = {
  1: { label: 'Ouverte' },
  2: { label: 'Fermée' },
  3: { label: 'Annulée' },
};

export const currencies = {
  1: { code: 'EUR', label: 'Euro' },
  2: { code: 'USD', label: 'US Dollar' },
  3: { code: 'XOF', label: 'Franc CFA' },
};

export const orgJobOffers = [
  {
    job_offer_id: 1,
    org_id: 'AMB-NIGER-PARIS',
    company_name: 'Ambassade du Niger',
    job_title: 'Chargé de Communication',
    job_description: 'Gestion des communications internes et externes.',
    job_type_id: 2,
    work_mode_id: 3,
    education_level_id: 2,
    experience_level_id: 2,
    industry_id: 5001,
    language_requirements: 'Français (C1), Anglais (B2)',
    location: 'Paris',
    country_id: 3001,
    salary_min: 2800,
    salary_max: 3500,
    currency_id: 1,
    benefits: 'Transport, repas',
    start_date: '2025-10-01',
    end_date: '2025-09-30',
    status_id: 1,
    created: '2025-08-01T09:00:00Z',
  },
  {
    job_offer_id: 2,
    org_id: 'AMB-NIGER-PARIS',
    company_name: 'TechPro',
    job_title: 'Développeur Full-Stack',
    job_description: 'Développement d\'applications web.',
    job_type_id: 1,
    work_mode_id: 2,
    education_level_id: 1,
    experience_level_id: 1,
    industry_id: 5002,
    language_requirements: 'Français (B2), Anglais (B2)',
    location: 'Télétravail',
    country_id: 3001,
    salary_min: 3200,
    salary_max: 4200,
    currency_id: 1,
    benefits: 'Mutuelle, tickets restaurant',
    start_date: '2025-09-01',
    end_date: '2025-08-31',
    status_id: 1,
    created: '2025-08-05T11:30:00Z',
  },
];

export const formatDate = (d) => {
  if (!d) return '-';
  try {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString();
  } catch {
    return '-';
  }
};
