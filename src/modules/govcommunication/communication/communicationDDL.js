// communicationDDL.js
// Mock DDL-like data and helpers for org_communication

// Reference lists (simulate org_reference_list)
export const communicationTypes = {
  1: { label: 'Message interne' },
  2: { label: 'Message public' },
  3: { label: 'Invitation' },
  4: { label: 'Événement' },
};

export const communicationStatus = {
  1: { label: 'Brouillon' },
  2: { label: 'Planifiée' },
  3: { label: 'Envoyée' },
  4: { label: 'Annulée' },
};

// Dynamic extra_data field definitions per communication type (for forms)
export const communicationTypeColumns = {
  1: { // Message interne
    extraColumns: [
      { key: 'importance', label: 'Importance', type: 'text' },
      { key: 'piece_jointe', label: 'Pièce jointe (nom)', type: 'text' },
    ],
  },
  2: { // Message public
    extraColumns: [
      { key: 'canal', label: 'Canal', type: 'text' },
      { key: 'hashtag', label: 'Hashtag', type: 'text' },
    ],
  },
  3: { // Invitation
    extraColumns: [
      { key: 'lieu', label: 'Lieu', type: 'text' },
      { key: 'programme', label: 'Programme', type: 'text' },
    ],
  },
  4: { // Événement
    extraColumns: [
      { key: 'lieu', label: 'Lieu', type: 'text' },
      { key: 'programme', label: 'Programme', type: 'text' },
      { key: 'livestream', label: 'Diffusion en direct', type: 'boolean' },
    ],
  },
};

export const mockUsers = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
  { id: 4, name: 'Diane' },
];

// Sample data simulating rows in org_communication
export const orgCommunications = [
  {
    org_communication_id: 101,
    org_id: 'ORG-001',
    communication_type_id: 1,
    communication_status_id: 3,
    title: 'Note interne: maintenance',
    message: 'Interruption des services samedi 14h-16h',
    start_date: '2025-08-12',
    end_date: '2025-08-12',
    recipients: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }],
    extra_data: { importance: 'Haute', piece_jointe: 'maintenance.pdf' },
    created: '2025-08-09T09:00:00Z',
    createdby: 1,
  },
  {
    org_communication_id: 102,
    org_id: 'ORG-001',
    communication_type_id: 2,
    communication_status_id: 2,
    title: 'Annonce publique: journée citoyenne',
    message: 'Rejoignez-nous pour la journée citoyenne',
    start_date: '2025-09-01',
    end_date: '2025-09-01',
    recipients: [{ id: 'public', name: 'Grand public' }],
    extra_data: { canal: 'Facebook', hashtag: '#CivDay' },
    created: '2025-08-08',
    createdby: 2,
  },
  {
    org_communication_id: 103,
    org_id: 'ORG-001',
    communication_type_id: 3,
    communication_status_id: 1,
    title: 'Invitation: réunion de coordination',
    message: 'Réunion avec partenaires',
    start_date: '2025-08-15',
    end_date: '2025-08-15',
    recipients: [{ id: 3, name: 'Charlie' }, { id: 4, name: 'Diane' }],
    extra_data: { lieu: 'Salle A', programme: 'Ordre du jour joint' },
    created: '2025-08-07',
    createdby: 1,
  },
  {
    org_communication_id: 104,
    org_id: 'ORG-001',
    communication_type_id: 4,
    communication_status_id: 3,
    title: 'Événement: Forum économique',
    message: 'Forum annuel des investisseurs',
    start_date: '2025-10-05',
    end_date: '2025-10-05',
    recipients: [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }, { id: 3, name: 'Charlie' }],
    extra_data: { lieu: 'Centre des Congrès', programme: 'Panels & ateliers', livestream: true },
    created: '2025-08-06',
    createdby: 3,
  },
];

export const getTypeLabel = (typeId) => communicationTypes[typeId]?.label || '-';
export const getStatusLabel = (statusId) => communicationStatus[statusId]?.label || '-';

export const getStatusBadge = (statusId) => {
  const label = getStatusLabel(statusId);
  const map = {
    Brouillon: 'bg-gray-100 text-gray-800',
    Planifiée: 'bg-yellow-100 text-yellow-800',
    Envoyée: 'bg-green-100 text-green-800',
    Annulée: 'bg-red-100 text-red-800',
  };
  const cls = map[label] || 'bg-gray-100 text-gray-800';
  return (
    `<span class="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${cls}">${label}</span>`
  );
};

// Collect dynamic extra_data columns across a set of communications
export const deriveExtraColumns = (items) => {
  const keys = new Set();
  items.forEach((it) => {
    if (it?.extra_data && typeof it.extra_data === 'object') {
      Object.keys(it.extra_data).forEach((k) => keys.add(k));
    }
  });
  // Return ordered list of column defs
  return Array.from(keys).map((k) => ({ key: k, label: k.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) }));
};

export const formatDate = (iso) => (iso ? new Date(iso).toLocaleString('fr-FR') : '-');
