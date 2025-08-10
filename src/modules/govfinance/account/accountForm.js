import React, { useState } from 'react';
import { accountTypes, currencies } from './accountDDL';

const AccountForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    account_id: initial?.account_id || null,
    org_id: initial?.org_id || 'AMB_NI_FR',
    account_code: initial?.account_code || '',
    account_name: initial?.account_name || '',
    account_type_id: initial?.account_type_id || '',
    currency_id: initial?.currency_id || '',
    description: initial?.description || '',
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.account_code) e.account_code = 'Code requis';
    if (!form.account_name) e.account_name = 'Nom requis';
    if (!form.account_type_id) e.account_type_id = 'Type requis';
    if (!form.currency_id) e.currency_id = 'Devise requise';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave && onSave({ ...form });
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{form.account_id ? 'Éditer Compte' : 'Nouveau Compte'}</h2>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-3 py-2 border rounded-md">Annuler</button>
            <button type="submit" form="account-form" className="px-3 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
      <form id="account-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium">Code</label>
          <input value={form.account_code} onChange={(e) => handleChange('account_code', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.account_code && <p className="text-xs text-red-600">{errors.account_code}</p>}
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium">Nom</label>
          <input value={form.account_name} onChange={(e) => handleChange('account_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.account_name && <p className="text-xs text-red-600">{errors.account_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium">Type</label>
          <select value={form.account_type_id} onChange={(e) => handleChange('account_type_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {accountTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          {errors.account_type_id && <p className="text-xs text-red-600">{errors.account_type_id}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium">Devise</label>
          <select value={form.currency_id} onChange={(e) => handleChange('currency_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {currencies.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          {errors.currency_id && <p className="text-xs text-red-600">{errors.currency_id}</p>}
        </div>
        <div className="md:col-span-3">
          <label className="block text-sm font-medium">Description</label>
          <textarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>
      </form>
      </div>
    </div>
  );
};

export default AccountForm;
