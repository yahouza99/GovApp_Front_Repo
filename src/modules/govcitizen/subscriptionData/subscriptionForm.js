import React, { useEffect, useState } from 'react';
import {
  subscriptionTypes,
  subscriptionStatuses,
  subscriptionTypeExtraColumns,
  citizens,
  defaultOrgId,
  getSubscriptionTypeLabel,
} from './subscriptionDDL';

const SubscriptionForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    request_id: initial?.request_id || null,
    citizen_id: initial?.citizen_id || '',
    org_id: initial?.org_id || defaultOrgId,
    request_type_id: initial?.request_type_id || 1001, // Étudiant par défaut
    request_title: initial?.request_title || "Inscription",
    request_description: initial?.request_description || '',
    request_status_id: initial?.request_status_id || 501,
    request_date: initial?.request_date || new Date().toISOString(),
    processed_date: initial?.processed_date || null,
    from_user: initial?.from_user || '',
    to_user: initial?.to_user || '',
    amount: initial?.amount ?? 0,
    extra_data: initial?.extra_data || {},
    file_1: initial?.file_1 || null,
    file_2: initial?.file_2 || null,
    file_3: initial?.file_3 || null,
  }));

  const [errors, setErrors] = useState({});
  const [citizenQuery, setCitizenQuery] = useState('');
  const [showCitizenList, setShowCitizenList] = useState(false);

  useEffect(() => {
    const sel = citizens.find(c => c.citizen_id === form.citizen_id);
    if (sel) setCitizenQuery(`${sel.first_name} ${sel.last_name} • ${sel.passport_number}`);
  }, [form.citizen_id]);

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const handleExtraChange = (key, value, type) => {
    let v = value;
    if (type === 'number') v = value === '' ? '' : Number(value);
    if (type === 'boolean') v = value === 'true' || value === true;
    setForm((p) => ({ ...p, extra_data: { ...(p.extra_data || {}), [key]: v } }));
  };

  const handleFile = (field, file) => {
    if (!file) { setForm((p) => ({ ...p, [field]: null })); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : null;
      setForm((p) => ({ ...p, [field]: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.citizen_id) e.citizen_id = 'Citoyen requis';
    if (!form.request_type_id) e.request_type_id = 'Type requis';
    if (!form.request_title) e.request_title = 'Titre requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...form,
      amount: Number(form.amount || 0),
      request_date: form.request_date || new Date().toISOString(),
    };
    onSave && onSave(payload);
  };

  const dynamicFields = subscriptionTypeExtraColumns[Number(form.request_type_id)]?.extraColumns || [];

  const renderDynamicField = (f) => {
    const value = form.extra_data?.[f.key] ?? '';
    switch (f.type) {
      case 'boolean':
        return (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
            <select
              value={String(value)}
              onChange={(e) => handleExtraChange(f.key, e.target.value, f.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sélectionner</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        );
      case 'date':
        return (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleExtraChange(f.key, e.target.value, f.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      case 'number':
        return (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
            <input
              type="number"
              value={value}
              onChange={(e) => handleExtraChange(f.key, e.target.value, f.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      default:
        return (
          <div key={f.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{f.label}</label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleExtraChange(f.key, e.target.value, f.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{form.request_id ? 'Éditer l\'inscription' : 'Nouvelle inscription'}</h2>
          </div>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Annuler</button>
            <button type="submit" form="subscription-form" className="px-4 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
            <button type="button" onClick={() => window.print()} className="px-4 py-2 border rounded-md bg-blue-600 text-white">Imprimer</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <form id="subscription-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Citoyen *</label>
            <input
              type="text"
              placeholder="Rechercher nom, prénom, passeport..."
              value={citizenQuery}
              onChange={(e) => { setCitizenQuery(e.target.value); setShowCitizenList(true); }}
              onFocus={() => setShowCitizenList(true)}
              onBlur={() => setTimeout(() => setShowCitizenList(false), 150)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.citizen_id ? 'border-red-500' : 'border-gray-300'}`}
            />
            {showCitizenList && citizenQuery.trim() && (
              <div className="absolute z-20 mt-1 w-full max-h-64 overflow-auto bg-white border border-gray-200 rounded-md shadow-lg">
                {citizens
                  .filter(c =>
                    `${c.first_name} ${c.last_name} ${c.passport_number}`.toLowerCase().includes(citizenQuery.toLowerCase())
                  )
                  .slice(0, 8)
                  .map(c => {
                    const label = `${c.first_name} ${c.last_name} • ${c.passport_number}`;
                    return (
                      <div
                        key={c.citizen_id}
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => { handleChange('citizen_id', c.citizen_id); setCitizenQuery(label); setShowCitizenList(false); }}
                        className="px-3 py-2 cursor-pointer hover:bg-green-50"
                      >
                        {label}
                      </div>
                    );
                  })}
                {citizens.filter(c => `${c.first_name} ${c.last_name} ${c.passport_number}`.toLowerCase().includes(citizenQuery.toLowerCase())).length === 0 && (
                  <div className="px-3 py-2 text-sm text-gray-500">Aucun résultat</div>
                )}
              </div>
            )}
            {errors.citizen_id && <p className="text-red-500 text-sm mt-1">{errors.citizen_id}</p>}
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type d'inscription *</label>
            <select
              value={form.request_type_id}
              onChange={(e) => handleChange('request_type_id', Number(e.target.value))}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.request_type_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              {subscriptionTypes.map(t => (
                <option key={t.list_id} value={t.list_id}>{t.label}</option>
              ))}
            </select>
            {errors.request_type_id && <p className="text-red-500 text-sm mt-1">{errors.request_type_id}</p>}
          </div>

          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-900 mb-2">
              Informations — {getSubscriptionTypeLabel(form.request_type_id)}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dynamicFields.map((f) => renderDynamicField(f))}
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Fichiers associés</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier 1</label>
                {!form.file_1 ? (
                  <label className="px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 inline-block">
                    Ajouter fichier 1
                    <input type="file" onChange={(e) => handleFile('file_1', e.target.files?.[0])} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center space-x-3">
                    <a href={`data:application/octet-stream;base64,${form.file_1}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Ouvrir fichier_1.pdf</a>
                    <a href={`data:application/pdf;base64,${form.file_1}`} download={`fichier_1.pdf`} className="px-3 py-1 border rounded-md hover:bg-gray-50">Télécharger</a>
                    <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50">Remplacer<input type="file" onChange={(e) => handleFile('file_1', e.target.files?.[0])} className="hidden" /></label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier 2</label>
                {!form.file_2 ? (
                  <label className="px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 inline-block">
                    Ajouter fichier 2
                    <input type="file" onChange={(e) => handleFile('file_2', e.target.files?.[0])} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center space-x-3">
                    <a href={`data:application/octet-stream;base64,${form.file_2}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Ouvrir fichier_2.pdf</a>
                    <a href={`data:application/pdf;base64,${form.file_2}`} download={`fichier_2.pdf`} className="px-3 py-1 border rounded-md hover:bg-gray-50">Télécharger</a>
                    <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50">Remplacer<input type="file" onChange={(e) => handleFile('file_2', e.target.files?.[0])} className="hidden" /></label>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier 3</label>
                {!form.file_3 ? (
                  <label className="px-3 py-2 border rounded-md cursor-pointer hover:bg-gray-50 inline-block">
                    Ajouter fichier 3
                    <input type="file" onChange={(e) => handleFile('file_3', e.target.files?.[0])} className="hidden" />
                  </label>
                ) : (
                  <div className="flex items-center space-x-3">
                    <a href={`data:application/octet-stream;base64,${form.file_3}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Ouvrir fichier_3.pdf</a>
                    <a href={`data:application/pdf;base64,${form.file_3}`} download={`fichier_3.pdf`} className="px-3 py-1 border rounded-md hover:bg-gray-50">Télécharger</a>
                    <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50">Remplacer<input type="file" onChange={(e) => handleFile('file_3', e.target.files?.[0])} className="hidden" /></label>
                  </div>
                )}
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubscriptionForm;
