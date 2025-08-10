import React, { useState } from 'react';
import { transactionTypes, paymentModes, statuses } from './transactionDDL';

const TransactionForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    transaction_id: initial?.transaction_id || null,
    org_id: initial?.org_id || 'AMB_NI_FR',
    transaction_code: initial?.transaction_code || '',
    transaction_date: initial?.transaction_date || new Date().toISOString().slice(0, 10),
    account_id: initial?.account_id || '',
    transaction_type_id: initial?.transaction_type_id || '',
    service_type_id: initial?.service_type_id || '',
    payment_mode_id: initial?.payment_mode_id || '',
    debit: initial?.debit ?? 0,
    credit: initial?.credit ?? 0,
    reference_number: initial?.reference_number || '',
    description: initial?.description || '',
    status_id: initial?.status_id || 31,
    counterparty_rib: initial?.counterparty_rib || '',
    linked_table: initial?.linked_table || '',
    linked_id: initial?.linked_id || '',
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.transaction_code) e.transaction_code = 'Code requis';
    if (!form.transaction_date) e.transaction_date = 'Date requise';
    if (!form.account_id) e.account_id = 'Compte requis';
    if (!form.transaction_type_id) e.transaction_type_id = 'Type requis';
    if ((Number(form.debit) || 0) === 0 && (Number(form.credit) || 0) === 0) e.amount = 'Débit ou Crédit obligatoire';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form, debit: Number(form.debit || 0), credit: Number(form.credit || 0) };
    onSave && onSave(payload);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{form.transaction_id ? 'Éditer Transaction' : 'Nouvelle Transaction'}</h2>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-3 py-2 border rounded-md">Annuler</button>
            <button type="submit" form="transaction-form" className="px-3 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
      <form id="transaction-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Code</label>
          <input value={form.transaction_code} onChange={(e) => handleChange('transaction_code', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.transaction_code && <p className="text-xs text-red-600">{errors.transaction_code}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Date</label>
          <input type="date" value={form.transaction_date} onChange={(e) => handleChange('transaction_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.transaction_date && <p className="text-xs text-red-600">{errors.transaction_date}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Compte (ID)</label>
          <input type="number" value={form.account_id} onChange={(e) => handleChange('account_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md" placeholder="ex: 9001" />
          {errors.account_id && <p className="text-xs text-red-600">{errors.account_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Type</label>
          <select value={form.transaction_type_id} onChange={(e) => handleChange('transaction_type_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {transactionTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          {errors.transaction_type_id && <p className="text-xs text-red-600">{errors.transaction_type_id}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Mode Paiement</label>
          <select value={form.payment_mode_id} onChange={(e) => handleChange('payment_mode_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">(optionnel)</option>
            {paymentModes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium">Débit</label>
          <input type="number" step="0.01" value={form.debit} onChange={(e) => handleChange('debit', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium">Crédit</label>
          <input type="number" step="0.01" value={form.credit} onChange={(e) => handleChange('credit', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium">Référence</label>
          <input value={form.reference_number} onChange={(e) => handleChange('reference_number', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div className="md:col-span-3">
          <label className="block text-sm font-medium">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium">Statut</label>
          <select value={form.status_id} onChange={(e) => handleChange('status_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            {statuses.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">RIB contrepartie</label>
          <input value={form.counterparty_rib} onChange={(e) => handleChange('counterparty_rib', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium">Lien (table)</label>
          <input value={form.linked_table} onChange={(e) => handleChange('linked_table', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium">Lien (ID)</label>
          <input value={form.linked_id} onChange={(e) => handleChange('linked_id', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </form>
      </div>
    </div>
  );
};

export default TransactionForm;
