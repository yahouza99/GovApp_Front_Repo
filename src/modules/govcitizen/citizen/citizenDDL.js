// Citizen DDL-like definitions, mock data, and helpers

export const citizenTypes = {
  1: { label: 'Étudiant' },
  2: { label: 'Professionnel' },
  3: { label: 'Professionnel en mission' },
  4: { label: 'Diplomate' },
  5: { label: 'Citoyen de passage / touriste' },
  6: { label: 'Réfugié / demandeur d asile' },
};

export const sexes = {
  1: { label: 'Masculin' },
  2: { label: 'Féminin' },
};

// Dynamic fields per citizen type (extra_data)
// Configure similarly to other modules
export const citizenTypeColumns = {
  1: [ // Étudiant
    { key: 'institution', label: 'Institution', type: 'text' },
    { key: 'field_of_study', label: 'Filière', type: 'text' },
    { key: 'student_id', label: 'Code étudiant', type: 'text' },
    { key: 'level', label: 'Niveau', type: 'text' },
    { key: 'school_year', label: 'Année scolaire', type: 'text' },
    { key: 'scholarship_type', label: 'Type de bourse', type: 'text' },
  ],
  2: [ // Professionnel
    { key: 'company', label: 'Entreprise', type: 'text' },
    { key: 'position', label: 'Poste', type: 'text' },
    { key: 'work_permit', label: 'Permis de travail', type: 'boolean' },
    { key: 'contract_type', label: 'Type de contrat', type: 'text' },
    { key: 'contract_duration', label: 'Durée du contrat', type: 'text' },
    { key: 'contract_start_date', label: 'Date de début du contrat', type: 'date' },
  ],
  3: [ // Professionnel en mission
    { key: 'mission_location', label: 'Lieu de Mission', type: 'text' },
    { key: 'accommodation', label: 'Hébergement', type: 'text' },
    { key: 'start_date', label: 'Date de début', type: 'date' },
    { key: 'end_date', label: 'Date de fin', type: 'date' },
    { key: 'mission_objective', label: 'Objectif de mission', type: 'text' },
  ],
  4: [ //   Diplomate
    { key: 'diplomatic_rank', label: 'Grade diplomatique', type: 'text' },
    { key: 'arrival_date', label: 'Date d\'arrivée', type: 'date' },
    { key: 'departure_date', label: 'Date de départ', type: 'date' },
    { key: 'diplomatic_card_number', label: 'Numéro de carte diplomatique', type: 'text' },
    { key: 'diplomatic_card_validity', label: 'Validité de la carte diplomatique', type: 'text' },
  ],
  5: [ // Citoyen de passage / touriste
    { key: 'reason_for_visit', label: 'Motif de visite', type: 'text' },
    { key: 'arrival_date', label: 'Date d\'arrivée', type: 'date' },
    { key: 'departure_date', label: 'Date de départ', type: 'date' },
    { key: 'accommodation', label: 'Hébergement', type: 'text' },
  ],
  6: [ // Réfugié / demandeur d asile
    { key: 'arrival_date', label: 'Date d\'arrivée', type: 'date' },
    { key: 'case_number', label: 'Numéro de dossier', type: 'text' },
    { key: 'current_status', label: 'Statut actuel', type: 'text' },
    { key: 'shelter_address', label: 'Adresse de l\'asile', type: 'text' },
  ],
};

export const orgCitizens = [
  {
    citizen_id: 1,
    org_id: 'AMB-NIGER-PARIS',
    citizen_last_name: 'ADAMOU',
    citizen_first_name: 'Yahouza',
    sex_id: 1,
    birth_date: '1990-05-12',
    birth_place: 'Niamey',
    nationality_id: 1001,
    citizen_type_id: 1,
    telephone: '+33 6 12 34 56 78',
    email: 'yahouza@example.com',
    address: '10 Rue de Paris',
    city_id: 2001,
    country_id: 3001,
    passport_number: 'NIG123456',
    cni_number: 'CNI987654',
    attached_date: '2023-01-02',
    detached_date: null,
    photo_url: '',
    extra_data: {
      institution: 'Université de Paris',
      field_of_study: 'Informatique',
      student_id: 'UP2023-001',
      level: 'Licence 3',
      school_year: '2022-2023',
      scholarship_type: 'Boursier National',
    },
    created: '2023-01-02T10:00:00Z',
  },
  {
    citizen_id: 2,
    org_id: 'AMB-NIGER-PARIS',
    citizen_last_name: 'MAHAMANE',
    citizen_first_name: 'Aisha',
    sex_id: 2,
    birth_date: '1988-03-22',
    birth_place: 'Zinder',
    nationality_id: 1001,
    citizen_type_id: 2,
    telephone: '+33 6 98 76 54 32',
    email: 'aisha@example.com',
    address: '5 Avenue Victor Hugo',
    city_id: 2002,
    country_id: 3001,
    passport_number: 'NIG654321',
    cni_number: 'CNI123456',
    attached_date: '2022-09-15',
    detached_date: null,
    photo_url: '',
    extra_data: {
      company: 'TechPro',
      position: 'Ingénieure',
      work_permit: true,
      contract_type: 'CDI',
      contract_start_date: '2023-09-15',
      contract_duration: 'Indéfini',
    },
    created: '2022-09-15T12:00:00Z',
  },
  {
    citizen_id: 3,
    org_id: 'AMB-NIGER-PARIS',
    citizen_last_name: 'ISSOUFOU',
    citizen_first_name: 'Salif',
    sex_id: 1,
    birth_date: '1979-11-02',
    birth_place: 'Maradi',
    nationality_id: 1001,
    citizen_type_id: 3,
    telephone: '+33 7 11 22 33 44',
    email: 'salif@example.com',
    address: '12 Rue Lafayette',
    city_id: 2003,
    country_id: 3001,
    passport_number: 'NIG777888',
    cni_number: 'CNI567890',
    attached_date: '2021-05-20',
    detached_date: null,
    photo_url: '',
    extra_data: {
      company: 'Ministère de l\'Économie',
      position: 'Conseiller Technique',
      mission_objective: 'Négociations commerciales',
      mission_location: 'Paris',
      accommodation: 'Hôtel',
      start_date: '2023-04-01',
      end_date: '2024-04-01',
    },
    created: '2021-05-20T09:30:00Z',
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

// Given a list of citizens (usually filtered by type), derive extra_data columns
export const deriveExtraColumns = (list) => {
  const keys = new Set();
  list.forEach((c) => {
    if (c && c.extra_data) {
      Object.keys(c.extra_data).forEach((k) => keys.add(k));
    }
  });
  // Build labels from citizenTypeColumns mapping if possible
  const labelMap = Object.values(citizenTypeColumns)
    .flat()
    .reduce((acc, f) => {
      acc[f.key] = f.label;
      return acc;
    }, {});

  return Array.from(keys).map((k) => ({ key: k, label: labelMap[k] || k }));
};
