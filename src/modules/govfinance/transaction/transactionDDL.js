// Finance Transactions DDL helpers, reference lists, and mock data

export const transactionTypes = [
  { list_id: 1, label: 'Facture' },
  { list_id: 2, label: 'Paiement' },
  { list_id: 3, label: 'Versement budgétaire' },
  { list_id: 4, label: 'Versement bourse' },
];

export const paymentModes = [
  { list_id: 21, label: 'Cash' },
  { list_id: 22, label: 'Virement' },
  { list_id: 23, label: 'Carte bancaire' },
];

export const statuses = [
  { list_id: 31, label: 'Brouillon' },
  { list_id: 32, label: 'Validé' },
  { list_id: 33, label: 'Annulé' },
];

export const orgTransactions = [
  {
    transaction_id: 5001,
    org_id: 'AMB_NI_FR',
    transaction_code: 'TRX-2025-00001',
    transaction_date: '2025-08-01',
    account_id: 9001,
    transaction_type_id: 2,
    payment_mode_id: 21,
    debit: 0.00,
    credit: 250.00,
    reference_number: 'RC-001',
    description: 'Paiement frais carte consulaire',
    status_id: 32,
    counterparty_rib: '',
    linked_table: 'org_consul_card',
    linked_id: 'A0001',
    created: '2025-08-01T10:00:00Z',
  },
  {
    transaction_id: 5002,
    org_id: 'AMB_NI_FR',
    transaction_code: 'TRX-2025-00002',
    transaction_date: '2025-08-02',
    account_id: 9002,
    transaction_type_id: 3,
    payment_mode_id: 22,
    debit: 10000.00,
    credit: 0.00,
    reference_number: 'VB-2025-08',
    description: 'Versement budgétaire Août',
    status_id: 32,
    counterparty_rib: 'FR761234...',
    linked_table: '',
    linked_id: '',
    created: '2025-08-02T09:30:00Z',
  },
  {
    transaction_id: 5003,
    org_id: 'AMB_NI_FR',
    transaction_code: 'TRX-2025-00003',
    transaction_date: '2025-08-05',
    account_id: 9003,
    transaction_type_id: 4,
    payment_mode_id: 22,
    debit: 0.00,
    credit: 1500.00,
    reference_number: 'VBRS-0003',
    description: 'Versement bourse étudiants',
    status_id: 32,
    counterparty_rib: 'FR761234...',
    linked_table: 'scholarship_payment',
    linked_id: 'B2025-01',
    created: '2025-08-10T11:15:00Z',
  },
  {
    transaction_id: 5004,
    org_id: 'AMB_NI_FR',
    transaction_code: 'TRX-2025-00004',
    transaction_date: '2025-08-10',
    account_id: 9003,
    transaction_type_id: 4,
    payment_mode_id: 22,
    debit: 0.00,
    credit: 1500.00,
    reference_number: 'VBRS-0004',
    description: 'Versement bourse étudiants',
    status_id: 32,
    counterparty_rib: 'FR761234...',
    linked_table: 'scholarship_payment',
    linked_id: 'B2025-01',
    created: '2025-08-10T11:15:00Z',
  },
];

export const formatDate = (v) => {
  if (!v) return '';
  try {
    const d = new Date(v);
    return d.toISOString().slice(0, 10);
  } catch (e) {
    return String(v);
  }
};

export const getLabelById = (arr, id) => arr.find((x) => x.list_id === id)?.label || '';
