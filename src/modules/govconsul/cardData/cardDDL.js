// DDL and helpers for Consular Card Requests (org_citizen_request)
// Inspired by existing module DDLs across the project

// Request Types (subset focused on Consular Card)
export const requestTypes = [
  { list_id: 201, code: 'CONSULAR_CARD', label: 'Carte consulaire' },
  { list_id: 202, code: 'VISA', label: 'Visa' },
  { list_id: 203, code: 'ETAT_CIVIL', label: 'État civil' },
  { list_id: 204, code: 'PRISE_EN_CHARGE', label: 'Prise en charge' },
];

// Statuses
export const requestStatuses = [
  { list_id: 501, code: 'PENDING', label: 'En attente' },
  { list_id: 502, code: 'IN_PROGRESS', label: 'En cours' },
  { list_id: 503, code: 'APPROVED', label: 'Approuvée' },
  { list_id: 504, code: 'REJECTED', label: 'Rejetée' },
  { list_id: 505, code: 'CLOSED', label: 'Clôturée' },
];

export const getStatusLabel = (id) => requestStatuses.find(s => s.list_id === id)?.label || 'N/A';
export const getRequestTypeLabel = (id) => requestTypes.find(t => t.list_id === id)?.label || 'N/A';

// Dynamic extra_data schema per request type
// For Carte Consulaire we capture key information used in processing
export const requestTypeExtraColumns = {
  201: {
    label: 'Carte consulaire',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
  202: {
    label: 'Visa',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
  203: {
    label: 'Prise en charge',
    extraColumns: [
      { key: 'passport_number', label: 'Numéro de passeport', type: 'text' },
      { key: 'applicant_address', label: 'Adresse du demandeur', type: 'text' },
      { key: 'delivery_office', label: 'Lieu de délivrance', type: 'text' },
      { key: 'card_validity_years', label: "Validité (années)", type: 'number' },
      { key: 'urgency', label: 'Urgent', type: 'boolean' },
    ],
  },
  204: {
    label: 'État civil',
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
  { user_id: 2, full_name: 'Agent Consulaire 1' },
  { user_id: 3, full_name: 'Agent Consulaire 2' },
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

// Mock Requests (only Carte consulaire for this module)
export const mockCardRequests = [
  {
    request_id: 30001,
    citizen_id: 1001,
    org_id: defaultOrgId,
    request_type_id: 201,
    request_title: 'Demande de carte consulaire',
    request_description: 'Première demande de carte consulaire',
    request_status_id: 501,
    request_date: new Date().toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 15000.0,
    extra_data: {
      passport_number: 'NIA123456',
      applicant_address: 'Paris 15e',
      delivery_office: 'Ambassade - Paris',
      card_validity_years: 3,
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
    request_id: 30002,
    citizen_id: 1002,
    org_id: defaultOrgId,
    request_type_id: 201,
    request_title: 'Renouvellement carte consulaire',
    request_description: 'Renouvellement pour expiration',
    request_status_id: 502,
    request_date: new Date(Date.now() - 86400000).toISOString(),
    processed_date: null,
    from_user: 2,
    to_user: 3,
    amount: 15000.0,
    extra_data: {
      passport_number: 'NIB987654',
      applicant_address: 'Lyon 3e',
      delivery_office: 'Consulat - Lyon',
      card_validity_years: 3,
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
