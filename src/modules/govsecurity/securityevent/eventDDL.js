// Security Events DDL helpers, reference lists, and mock data

export const eventTypes = [
  { list_id: 1, label: 'Incident' },
  { list_id: 2, label: 'Alerte' },
  { list_id: 3, label: 'Inspection' },
  { list_id: 4, label: 'Menace' },
  { list_id: 5, label: 'Exercice' },
];

export const severities = [
  { list_id: 10, label: 'Mineur' },
  { list_id: 11, label: 'Majeur' },
  { list_id: 12, label: 'Critique' },
];

export const categories = [
  { list_id: 20, label: 'Physique' },
  { list_id: 21, label: 'Informatique' },
  { list_id: 22, label: 'RH' },
  { list_id: 23, label: 'Diplomatique' },
  { list_id: 24, label: 'Autre' },
];

export const statuses = [
  { list_id: 30, label: 'Ouvert' },
  { list_id: 31, label: 'En cours' },
  { list_id: 32, label: 'Résolu' },
  { list_id: 33, label: 'Archivé' },
];

// Minimal mock users for reported_by / assigned_to
export const govUsers = [
  { user_id: 1, full_name: 'Admin Sécurité' },
  { user_id: 2, full_name: 'Opérateur 1' },
  { user_id: 3, full_name: 'Opérateur 2' },
];

export const orgSecurityEvents = [
  {
    security_event_id: 1001,
    org_id: 'AMB_NI_FR',
    event_type_id: 1,
    severity_id: 11,
    category_id: 20,
    title: 'Intrusion suspecte',
    description: 'Personne non autorisée repérée près de l\'entrée secondaire.',
    event_date: '2025-08-09T20:15:00Z',
    location: 'Entrée secondaire',
    reported_by: 2,
    assigned_to: 1,
    status_id: 31,
    actions_taken: 'Patrouille envoyée, verrouillage temporaire.',
    attachment_url: '',
    attachment: null,
    extra_data: { camera_id: 'CAM-12', badge_detected: false },
    created: '2025-08-09T20:20:00Z',
  },
  {
    security_event_id: 1002,
    org_id: 'AMB_NI_FR',
    event_type_id: 3,
    severity_id: 10,
    category_id: 21,
    title: 'Inspection système',
    description: 'Inspection programmée du système de contrôle d\'accès.',
    event_date: '2025-08-08T10:00:00Z',
    location: 'Salle serveur',
    reported_by: 1,
    assigned_to: 3,
    status_id: 30,
    actions_taken: 'Checklist préparée.',
    attachment_url: '',
    attachment: null,
    extra_data: { checklist_id: 'CHK-08', scope: 'Contrôle d\'accès' },
    created: '2025-08-08T09:45:00Z',
  },
];

export const formatDateTime = (v) => {
  if (!v) return '';
  try {
    const d = new Date(v);
    return d.toLocaleString();
  } catch (e) {
    return String(v);
  }
};

export const getLabelById = (arr, id) => arr.find((x) => x.list_id === id)?.label || '';
export const getUserName = (id) => govUsers.find((u) => u.user_id === id)?.full_name || '';
