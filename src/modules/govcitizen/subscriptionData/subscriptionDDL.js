// DDL and helpers for Citizen Subscriptions (org_citizen_subscription-like)
// Copied from govconsul/cardData with adjusted subscription types

// Subscription Types
export const subscriptionTypes = [
  { list_id: 1001, code: 'ETUDIANT', label: 'Étudiant' },
  { list_id: 1002, code: 'PROFESSIONNEL', label: 'Professionnel' },
  { list_id: 1003, code: 'TOURISTE', label: 'Touriste' },
  { list_id: 1004, code: 'EXPATRIE', label: 'Expatrié' },
  { list_id: 1005, code: 'DIPLOMATE', label: 'Diplomate en mission' },
];

// Statuses (reuse from requests)
export const subscriptionStatuses = [
  { list_id: 501, code: 'PENDING', label: 'En attente' },
  { list_id: 502, code: 'IN_PROGRESS', label: 'En cours' },
  { list_id: 503, code: 'APPROVED', label: 'Approuvée' },
  { list_id: 504, code: 'REJECTED', label: 'Rejetée' },
  { list_id: 505, code: 'CLOSED', label: 'Clôturée' },
];

export const getStatusLabel = (id) => subscriptionStatuses.find(s => s.list_id === id)?.label || 'N/A';
export const getSubscriptionTypeLabel = (id) => subscriptionTypes.find(t => t.list_id === id)?.label || 'N/A';

// Extra fields based on org_citizen_subscription DDL
// Show fields relevant to the selected subscription type only
export const subscriptionTypeExtraColumns = {
  1001: {
    label: 'Étudiant',
    extraColumns: [
      { key: 'annee_academique', label: 'Année académique', type: 'text' },
      { key: 'etablissement', label: 'Établissement', type: 'text' },
      { key: 'formation', label: 'Formation', type: 'text' },
      { key: 'cycle_id', label: 'Cycle (ID)', type: 'number' },
      { key: 'niveau_id', label: 'Niveau (ID)', type: 'number' },
    ],
  },
  1002: {
    label: 'Professionnel',
    extraColumns: [
      { key: 'societe', label: 'Société', type: 'text' },
      { key: 'poste', label: 'Poste', type: 'text' },
      { key: 'secteur_id', label: 'Secteur (ID)', type: 'number' },
      { key: 'contrat_type_id', label: 'Type de contrat (ID)', type: 'number' },
    ],
  },
  1003: {
    label: 'Touriste',
    extraColumns: [
      { key: 'motif_visite', label: 'Motif de la visite', type: 'text' },
      { key: 'duree_sejour', label: 'Durée du séjour (jours)', type: 'number' },
      { key: 'hebergement', label: 'Hébergement', type: 'text' },
    ],
  },
  1004: {
    label: 'Expatrié',
    extraColumns: [
      { key: 'societe', label: 'Société', type: 'text' },
      { key: 'poste', label: 'Poste', type: 'text' },
      { key: 'secteur_id', label: 'Secteur (ID)', type: 'number' },
      { key: 'contrat_type_id', label: 'Type de contrat (ID)', type: 'number' },
      { key: 'pays_residence', label: 'Pays de résidence', type: 'text' },
      { key: 'date_arrivee', label: "Date d'arrivée", type: 'date' },
      { key: 'date_depart_prevue', label: 'Date de départ prévue', type: 'date' },
    ],
  },
  1005: {
    label: 'Diplomate en mission',
    extraColumns: [
      { key: 'mission_id', label: 'Type de mission (ID)', type: 'number' },
      { key: 'fonction_diplomatique', label: 'Fonction diplomatique', type: 'text' },
      { key: 'institution_origine', label: "Institution d'origine", type: 'text' },
    ],
  },
};

// Mock Users (subset)
export const govUsers = [
  { user_id: 1, full_name: 'Admin Principal' },
  { user_id: 2, full_name: 'Agent Citoyen 1' },
  { user_id: 3, full_name: 'Agent Citoyen 2' },
];
export const getUserName = (id) => govUsers.find(u => u.user_id === id)?.full_name || '—';

// Mock Citizens (subset)
export const citizens = [
  { citizen_id: 1001, first_name: 'Amina', last_name: 'Diallo', passport_number: 'NIA123456' },
  { citizen_id: 1002, first_name: 'Moussa', last_name: 'Traoré', passport_number: 'NIB987654' },
  { citizen_id: 1003, first_name: 'Hawa', last_name: 'Abdou', passport_number: 'NIF678901' },
];
export const getCitizenName = (id) => {
  const c = citizens.find(cz => cz.citizen_id === id);
  return c ? `${c.first_name} ${c.last_name}` : '—';
};

// Helper: default org id
export const defaultOrgId = 'AMB_NI_FR';

// Mock Subscriptions
export const mockSubscriptionRequests = [
  {
    request_id: 50001,
    citizen_id: 1001,
    org_id: defaultOrgId,
    request_type_id: 1001, // Étudiant
    request_title: "Inscription — Étudiant",
    request_description: "Inscription académique 2024-2025",
    request_status_id: 501,
    request_date: new Date().toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 0,
    extra_data: {
      annee_academique: '2024-2025',
      etablissement: 'Université de Paris',
      formation: 'Licence Informatique',
      cycle_id: 101,
      niveau_id: 1,
      societe: '',
      poste: '',
    },
    created: new Date().toISOString(),
    createdby: 1,
    updated: new Date().toISOString(),
    updatedby: 1,
    file_1: null,
    file_2: null,
    file_3: null,
  },
  {
    request_id: 50002,
    citizen_id: 1002,
    org_id: defaultOrgId,
    request_type_id: 1002, // Professionnel
    request_title: "Inscription — Professionnel",
    request_description: "Déclaration d'activité",
    request_status_id: 502,
    request_date: new Date(Date.now() - 86400000).toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 0,
    extra_data: {
      societe: 'ACME Corp',
      poste: 'Ingénieur',
      secteur_id: 2101,
      contrat_type_id: 3101,
    },
    created: new Date().toISOString(),
    createdby: 1,
    updated: new Date().toISOString(),
    updatedby: 1,
    file_1: null,
    file_2: null,
    file_3: null,
  },
];
