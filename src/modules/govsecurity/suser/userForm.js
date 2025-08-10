import React, { useState } from 'react';
import { userTypes, getLabelById } from './userDDL';

const UserForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    user_id: initial?.user_id || null,
    username: initial?.username || '',
    password_hash: initial?.password_hash || '',
    email: initial?.email || '',
    full_name: initial?.full_name || '',
    org_id: initial?.org_id || 'AMB_NI_FR',
    user_type_id: initial?.user_type_id || '',
    is_active: initial?.is_active ?? true,
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.username) e.username = "Nom d'utilisateur requis";
    if (!form.user_id && !form.password_hash) e.password_hash = 'Mot de passe requis';
    if (!form.user_type_id) e.user_type_id = 'Type utilisateur requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    onSave && onSave(payload);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{form.user_id ? 'Éditer Utilisateur' : 'Nouvel Utilisateur'}</h2>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-3 py-2 border rounded-md">Annuler</button>
            <button type="submit" form="user-form" className="px-3 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
      <form id="user-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
          <input value={form.username} onChange={(e) => handleChange('username', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.username && <p className="text-xs text-red-600">{errors.username}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input type="password" value={form.password_hash} onChange={(e) => handleChange('password_hash', e.target.value)} className="w-full px-3 py-2 border rounded-md" placeholder={form.user_id ? '(laisser vide pour inchangé)' : ''} />
          {errors.password_hash && <p className="text-xs text-red-600">{errors.password_hash}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
          <input value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Organisation</label>
          <input value={form.org_id} onChange={(e) => handleChange('org_id', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type d'utilisateur</label>
          <select value={form.user_type_id} onChange={(e) => handleChange('user_type_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {userTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          {errors.user_type_id && <p className="text-xs text-red-600">{errors.user_type_id}</p>}
        </div>

        <div className="flex items-center space-x-2">
          <input id="is_active" type="checkbox" checked={!!form.is_active} onChange={(e) => handleChange('is_active', e.target.checked)} />
          <label htmlFor="is_active" className="text-sm text-gray-700">Actif</label>
        </div>
      </form>
      </div>
    </div>
  );
};

export default UserForm;
