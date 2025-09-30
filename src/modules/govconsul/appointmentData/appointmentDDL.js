// DDL and helpers for Appointments (org_appointment)

export const defaultOrgId = 'AMBASSADE_DEFAULT';

// Reference lists (mocked on frontend)
export const appointmentTypes = [
  { list_id: 301, code: 'DEMANDE', label: 'Demande' },
  { list_id: 302, code: 'SUIVI', label: 'Suivi' },
  { list_id: 303, code: 'DEPOT', label: 'Dépôt de dossier' },
];

export const services = [
  { list_id: 401, code: 'CONSULAT', label: 'Consulat' },
  { list_id: 402, code: 'AFF_SOC', label: 'Affaires sociales' },
  { list_id: 403, code: 'ETAT_CIVIL', label: 'État civil' },
];

export const documentTypes = [
  { list_id: 501, code: 'VISA', label: 'Visa' },
  { list_id: 502, code: 'PASSEPORT', label: 'Passeport' },
  { list_id: 503, code: 'ATTEST', label: 'Attestation' },
];

export const citizenships = [
  { list_id: 601, code: 'NER', label: 'Nigérienne' },
  { list_id: 602, code: 'ETR', label: 'Étrangère' },
];

export const citizenCategories = [
  { list_id: 701, code: 'ETUD', label: 'Étudiant' },
  { list_id: 702, code: 'PRO', label: 'Professionnel' },
  { list_id: 703, code: 'AUTRE', label: 'Autre' },
];

export const getAppointmentTypeLabel = (id) => appointmentTypes.find(x => x.list_id === Number(id))?.label || 'N/A';
export const getServiceLabel = (id) => services.find(x => x.list_id === Number(id))?.label || 'N/A';
export const getDocumentTypeLabel = (id) => documentTypes.find(x => x.list_id === Number(id))?.label || 'N/A';
export const getCitizenshipLabel = (id) => citizenships.find(x => x.list_id === Number(id))?.label || 'N/A';
export const getCitizenCategoryLabel = (id) => citizenCategories.find(x => x.list_id === Number(id))?.label || 'N/A';

// Mock data
export const mockAppointments = [
  {
    appointment_id: 1,
    org_id: defaultOrgId,
    first_name: 'Amina',
    last_name: 'Diallo',
    email: 'amina@example.com',
    phone: '+33 6 11 22 33 44',
    appointment_date: '2025-10-05',
    appointment_time: '10:30',
    notes: 'Renouvellement de passeport',
    appointment_type_id: 301,
    service_id: 401,
    document_type_id: 502,
    citizenship_id: 601,
    citizen_type_id: 702,
    created: new Date().toISOString(),
    createdby: 1,
  },
  {
    appointment_id: 2,
    org_id: defaultOrgId,
    first_name: 'Moussa',
    last_name: 'Harouna',
    email: 'moussa@example.com',
    phone: '+33 7 22 33 44 55',
    appointment_date: '2025-10-06',
    appointment_time: '14:00',
    notes: 'Demande de visa',
    appointment_type_id: 301,
    service_id: 401,
    document_type_id: 501,
    citizenship_id: 601,
    citizen_type_id: 703,
    created: new Date().toISOString(),
    createdby: 1,
  },
];
