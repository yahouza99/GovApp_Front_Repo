// Finance Accounts DDL helpers, reference lists, and mock data

export const accountTypes = [
  { list_id: 200, label: 'Actif' },
  { list_id: 201, label: 'Passif' },
  { list_id: 202, label: 'Charge' },
  { list_id: 203, label: 'Produit' },
];

export const currencies = [
  { list_id: 300, label: 'XOF' },
  { list_id: 301, label: 'EUR' },
  { list_id: 302, label: 'USD' },
];

export const orgAccounts = [
  {
    account_id: 9001,
    org_id: 'AMB_NI_FR',
    account_code: '512',
    account_name: 'Banque Courante',
    account_type_id: 200,
    currency_id: 301,
    description: 'Compte bancaire courant',
    created: '2025-08-01T09:00:00Z',
    createdby: 1,
  },
  {
    account_id: 9002,
    org_id: 'AMB_NI_FR',
    account_code: '6061',
    account_name: 'Budget Fonctionnement',
    account_type_id: 202,
    currency_id: 301,
    description: 'Compte de charges de fonctionnement',
    created: '2025-08-01T09:00:00Z',
    createdby: 1,
  },
  {
    account_id: 9003,
    org_id: 'AMB_NI_FR',
    account_code: '512B',
    account_name: 'Compte Bourse',
    account_type_id: 200,
    currency_id: 301,
    description: 'Compte dédié aux bourses',
    created: '2025-08-03T09:00:00Z',
    createdby: 1,
  },
];

export const getLabelById = (arr, id) => arr.find((x) => x.list_id === id)?.label || '';
