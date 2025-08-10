import React, { useEffect, useMemo, useState } from 'react';
import { citizenTypes, sexes, citizenTypeColumns } from './citizenDDL';

const CitizenForm = ({ citizen, onSave, onCancel }) => {
  const isEdit = Boolean(citizen);
  const [form, setForm] = useState(() => ({
    citizen_id: citizen?.citizen_id || undefined,
    org_id: citizen?.org_id || 'AMB-NIGER-PARIS',
    citizen_last_name: citizen?.citizen_last_name || '',
    citizen_first_name: citizen?.citizen_first_name || '',
    sex_id: citizen?.sex_id || '',
    birth_date: citizen?.birth_date || '',
    birth_place: citizen?.birth_place || '',
    nationality_id: citizen?.nationality_id || '',
    citizen_type_id: citizen?.citizen_type_id || '',
    telephone: citizen?.telephone || '',
    email: citizen?.email || '',
    address: citizen?.address || '',
    city_id: citizen?.city_id || '',
    country_id: citizen?.country_id || '',
    passport_number: citizen?.passport_number || '',
    cni_number: citizen?.cni_number || '',
    attached_date: citizen?.attached_date || '',
    detached_date: citizen?.detached_date || '',
    photo_url: citizen?.photo_url || '',
    extra_data: citizen?.extra_data || {},
  }));

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const extraFields = useMemo(() => {
    const typeId = form.citizen_type_id ? parseInt(form.citizen_type_id, 10) : null;
    return typeId ? (citizenTypeColumns[typeId] || []) : [];
  }, [form.citizen_type_id]);

  const validate = () => {
    const e = {};
    if (!form.citizen_last_name?.trim()) e.citizen_last_name = 'Nom requis';
    if (!form.citizen_first_name?.trim()) e.citizen_first_name = 'Prénom requis';
    if (!form.passport_number?.trim()) e.passport_number = 'Passeport requis';
    if (form.detached_date && form.attached_date && new Date(form.detached_date) < new Date(form.attached_date)) {
      e.detached_date = 'La date de détachement doit être postérieure à la date d\'attachement';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleExtraChange = (key, value) => {
    setForm((prev) => ({ ...prev, extra_data: { ...prev.extra_data, [key]: value } }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      citizen_id: form.citizen_id || Date.now(),
      created: form.created || new Date().toISOString(),
      updated: isEdit ? new Date().toISOString() : undefined,
    };
    // simulate save
    setTimeout(() => {
      onSave?.(payload);
      setSaving(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{isEdit ? 'Modifier Citoyen' : 'Nouveau Citoyen'}</h2>
        <div className="space-x-2">
          <button onClick={onCancel} type="button" className="px-4 py-2 border rounded-md">Annuler</button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input value={form.citizen_last_name} onChange={(e) => handleChange('citizen_last_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.citizen_last_name && <p className="text-xs text-red-600 mt-1">{errors.citizen_last_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input value={form.citizen_first_name} onChange={(e) => handleChange('citizen_first_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.citizen_first_name && <p className="text-xs text-red-600 mt-1">{errors.citizen_first_name}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.citizen_type_id} onChange={(e) => handleChange('citizen_type_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(citizenTypes).map(([id, t]) => (
                <option key={id} value={id}>{t.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sexe</label>
            <select value={form.sex_id} onChange={(e) => handleChange('sex_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(sexes).map(([id, s]) => (
                <option key={id} value={id}>{s.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de Naissance</label>
            <input type="date" value={form.birth_date} onChange={(e) => handleChange('birth_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lieu de Naissance</label>
            <input value={form.birth_place} onChange={(e) => handleChange('birth_place', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passeport</label>
            <input value={form.passport_number} onChange={(e) => handleChange('passport_number', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.passport_number && <p className="text-xs text-red-600 mt-1">{errors.passport_number}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.telephone} onChange={(e) => handleChange('telephone', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'attachement</label>
            <input type="date" value={form.attached_date} onChange={(e) => handleChange('attached_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date de détachement</label>
            <input type="date" value={form.detached_date} onChange={(e) => handleChange('detached_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.detached_date && <p className="text-xs text-red-600 mt-1">{errors.detached_date}</p>}
          </div>
        </div>

        {extraFields.length > 0 && (
          <div className="mt-6 bg-blue-50 p-4 rounded-lg">
            <h3 className="text-md font-semibold mb-2">Informations supplémentaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {extraFields.map((f) => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === 'boolean' ? (
                    <select value={form.extra_data?.[f.key] ? 'true' : 'false'} onChange={(e) => handleExtraChange(f.key, e.target.value === 'true')} className="w-full px-3 py-2 border rounded-md">
                      <option value="false">Non</option>
                      <option value="true">Oui</option>
                    </select>
                  ) : (
                    <input value={form.extra_data?.[f.key] || ''} onChange={(e) => handleExtraChange(f.key, e.target.value)} className="w-full px-3 py-2 border rounded-md" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default CitizenForm;
