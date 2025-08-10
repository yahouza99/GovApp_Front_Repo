import React, { useState } from 'react';
import { eventTypes, severities, categories, statuses, govUsers, formatDateTime, getLabelById, getUserName } from './eventDDL';

const EventForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    security_event_id: initial?.security_event_id || null,
    org_id: initial?.org_id || 'AMB_NI_FR',
    event_type_id: initial?.event_type_id || '',
    severity_id: initial?.severity_id || '',
    category_id: initial?.category_id || '',
    title: initial?.title || '',
    description: initial?.description || '',
    event_date: initial?.event_date || new Date().toISOString(),
    location: initial?.location || '',
    reported_by: initial?.reported_by || '',
    assigned_to: initial?.assigned_to || '',
    status_id: initial?.status_id || '',
    actions_taken: initial?.actions_taken || '',
    attachment_url: initial?.attachment_url || '',
    attachment: initial?.attachment || null,
    extra_data: initial?.extra_data || {},
  }));
  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) { setForm((p) => ({ ...p, attachment: null })); return; }
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : null;
      setForm((p) => ({ ...p, attachment: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.title) e.title = 'Titre requis';
    if (!form.event_type_id) e.event_type_id = "Type d'événement requis";
    if (!form.severity_id) e.severity_id = 'Gravité requise';
    if (!form.status_id) e.status_id = 'Statut requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    onSave && onSave(payload);
  };

  // Simple extra_data editor (key/value)
  const [extraKey, setExtraKey] = useState('');
  const [extraVal, setExtraVal] = useState('');
  const addExtra = () => {
    if (!extraKey) return;
    setForm((p) => ({ ...p, extra_data: { ...(p.extra_data || {}), [extraKey]: extraVal } }));
    setExtraKey(''); setExtraVal('');
  };
  const removeExtra = (k) => setForm((p) => { const nd = { ...(p.extra_data || {}) }; delete nd[k]; return { ...p, extra_data: nd }; });

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">{form.security_event_id ? 'Éditer Événement' : 'Nouvel Événement'}</h2>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-3 py-2 border rounded-md">Annuler</button>
            <button type="submit" form="event-form" className="px-3 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
      <form id="event-form" onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type d'événement</label>
          <select value={form.event_type_id} onChange={(e) => handleChange('event_type_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {eventTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          {errors.event_type_id && <p className="text-xs text-red-600">{errors.event_type_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gravité</label>
          <select value={form.severity_id} onChange={(e) => handleChange('severity_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {severities.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
          {errors.severity_id && <p className="text-xs text-red-600">{errors.severity_id}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
          <select value={form.category_id} onChange={(e) => handleChange('category_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {categories.map(c => <option key={c.list_id} value={c.list_id}>{c.label}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
          <select value={form.status_id} onChange={(e) => handleChange('status_id', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {statuses.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
          {errors.status_id && <p className="text-xs text-red-600">{errors.status_id}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
          <input value={form.title} onChange={(e) => handleChange('title', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          {errors.title && <p className="text-xs text-red-600">{errors.title}</p>}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea rows={4} value={form.description} onChange={(e) => handleChange('description', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date de l'événement</label>
          <input type="datetime-local" value={form.event_date ? new Date(form.event_date).toISOString().slice(0,16) : ''} onChange={(e) => handleChange('event_date', new Date(e.target.value).toISOString())} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
          <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Signalé par</label>
          <select value={form.reported_by} onChange={(e) => handleChange('reported_by', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {govUsers.map(u => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Assigné à</label>
          <select value={form.assigned_to} onChange={(e) => handleChange('assigned_to', Number(e.target.value))} className="w-full px-3 py-2 border rounded-md">
            <option value="">Sélectionner</option>
            {govUsers.map(u => <option key={u.user_id} value={u.user_id}>{u.full_name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièce jointe (URL)</label>
          <input value={form.attachment_url} onChange={(e) => handleChange('attachment_url', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pièce jointe (Fichier)</label>
          {!form.attachment ? (
            <input type="file" onChange={handleFileChange} className="w-full" />
          ) : (
            <div className="flex items-center space-x-3">
              <a href={`data:application/octet-stream;base64,${form.attachment}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">Ouvrir</a>
              <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50">Remplacer
                <input type="file" onChange={handleFileChange} className="hidden" />
              </label>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Informations supplémentaires</label>
          <div className="flex space-x-2 mb-2">
            <input placeholder="Clé" value={extraKey} onChange={(e) => setExtraKey(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
            <input placeholder="Valeur" value={extraVal} onChange={(e) => setExtraVal(e.target.value)} className="flex-1 px-3 py-2 border rounded-md" />
            <button type="button" onClick={addExtra} className="px-3 py-2 border rounded-md">Ajouter</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(form.extra_data || {}).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-3 py-2 bg-gray-50 border rounded-md">
                <span className="text-sm text-gray-700 truncate mr-2">{k}: {String(v)}</span>
                <button type="button" onClick={() => removeExtra(k)} className="text-xs text-red-600">Supprimer</button>
              </div>
            ))}
          </div>
        </div>
      </form>
      </div>
    </div>
  );
};

export default EventForm;
