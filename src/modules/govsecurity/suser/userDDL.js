// Security Users DDL helpers, reference lists, and mock data (gov_user)

export const userTypes = [
  { list_id: 100, label: 'Admin' },
  { list_id: 101, label: 'Utilisateur local' },
  { list_id: 102, label: 'Utilisateur extérieur' },
  { list_id: 103, label: 'Chef' },
];

export const orgUsers = [
  {
    user_id: 1,
    username: 'admin',
    password_hash: '***',
    email: 'admin@example.com',
    full_name: 'Administrateur Système',
    org_id: 'AMB_NI_FR',
    user_type_id: 100,
    is_active: true,
    created: '2025-08-01T09:00:00Z',
    createdby: 'system',
    updated: '2025-08-05T10:00:00Z',
    updatedby: 'system'
  },
  {
    user_id: 2,
    username: 'oplocal',
    password_hash: '***',
    email: 'operateur@example.com',
    full_name: 'Opérateur Local',
    org_id: 'AMB_NI_FR',
    user_type_id: 101,
    is_active: true,
    created: '2025-08-02T10:00:00Z',
    createdby: 'admin',
    updated: '',
    updatedby: ''
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
