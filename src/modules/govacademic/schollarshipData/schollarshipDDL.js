// DDL and helpers for Scholarship Requests (org_citizen_request-like)
// Copied from govconsul/cardData with adjusted request types

// Request Types for scholarship
export const requestTypes = [
  { list_id: 901, code: 'ACTIVATION', label: 'Activation' },
  { list_id: 902, code: 'RENOUVELLEMENT', label: 'Renouvellement' },
  { list_id: 903, code: 'RECLAMATION', label: 'Réclamation' },
];

// Statuses (same set as cardData)
export const requestStatuses = [
  { list_id: 501, code: 'PENDING', label: 'En attente' },
  { list_id: 502, code: 'IN_PROGRESS', label: 'En cours' },
  { list_id: 503, code: 'APPROVED', label: 'Approuvée' },
  { list_id: 504, code: 'REJECTED', label: 'Rejetée' },
  { list_id: 505, code: 'CLOSED', label: 'Clôturée' },
];

export const getStatusLabel = (id) => requestStatuses.find(s => s.list_id === id)?.label || 'N/A';
export const getRequestTypeLabel = (id) => requestTypes.find(t => t.list_id === id)?.label || 'N/A';

// Keep dynamic schema identical to cardData (no change requested to fields)
export const requestTypeExtraColumns = {
  901: {
    label: 'Activation',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
  902: {
    label: 'Renouvellement',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
  903: {
    label: 'Réclamation',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
};

// Mock Users (subset)
export const govUsers = [
  { user_id: 1, full_name: 'Admin Principal' },
  { user_id: 2, full_name: 'Agent Bourse 1' },
  { user_id: 3, full_name: 'Agent Bourse 2' },
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

// Mock Requests for scholarship
export const mockSchollarshipRequests = [
  {
    request_id: 40001,
    citizen_id: 1001,
    org_id: defaultOrgId,
    request_type_id: 901,
    request_title: 'Activation bourse',
    request_description: 'Activation initiale',
    request_status_id: 501,
    request_date: new Date().toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 0,
    extra_data: {
      passport_number: 'NIA123456',
      applicant_address: 'Paris 15e',
      delivery_office: 'Ambassade - Paris',
      card_validity_years: 1,
      urgency: false,
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
    request_id: 40002,
    citizen_id: 1002,
    org_id: defaultOrgId,
    request_type_id: 902,
    request_title: 'Renouvellement bourse',
    request_description: 'Renouvellement annuel',
    request_status_id: 502,
    request_date: new Date(Date.now() - 86400000).toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 0,
    extra_data: {
      passport_number: 'NIB987654',
      applicant_address: 'Lyon 3e',
      delivery_office: 'Consulat - Lyon',
      card_validity_years: 1,
      urgency: true,
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
