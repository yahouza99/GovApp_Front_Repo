import React, { useState } from 'react';
import {
  appointmentTypes,
  services,
  documentTypes,
  citizenships,
  citizenCategories,
  defaultOrgId,
  getAppointmentTypeLabel,
  getServiceLabel,
  getDocumentTypeLabel,
  getCitizenshipLabel,
  getCitizenCategoryLabel,
} from './appointmentDDL';

const AppointmentForm = ({ initial, onCancel, onSave }) => {
  const [form, setForm] = useState(() => ({
    appointment_id: initial?.appointment_id || null,
    org_id: initial?.org_id || defaultOrgId,
    first_name: initial?.first_name || '',
    last_name: initial?.last_name || '',
    email: initial?.email || '',
    phone: initial?.phone || '',
    appointment_date: initial?.appointment_date || '',
    appointment_time: initial?.appointment_time || '',
    notes: initial?.notes || '',
    appointment_type_id: initial?.appointment_type_id || appointmentTypes[0]?.list_id || '',
    service_id: initial?.service_id || services[0]?.list_id || '',
    document_type_id: initial?.document_type_id || documentTypes[0]?.list_id || '',
    citizenship_id: initial?.citizenship_id || citizenships[0]?.list_id || '',
    citizen_type_id: initial?.citizen_type_id || citizenCategories[0]?.list_id || '',
    created: initial?.created || null,
    createdby: initial?.createdby || 1,
    updated: initial?.updated || null,
    updatedby: initial?.updatedby || 1,
  }));

  const [errors, setErrors] = useState({});

  const handleChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Prénom requis';
    if (!form.last_name.trim()) e.last_name = 'Nom requis';
    if (!form.appointment_date) e.appointment_date = 'Date requise';
    if (!form.appointment_time) e.appointment_time = 'Heure requise';
    if (!form.appointment_type_id) e.appointment_type_id = 'Type requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e && e.preventDefault();
    if (!validate()) return;
    const payload = { ...form };
    onSave && onSave(payload);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{form.appointment_id ? 'Éditer le rendez-vous' : 'Nouveau rendez-vous'}</h2>
            <p className="text-gray-600">{getAppointmentTypeLabel(form.appointment_type_id)} • {getServiceLabel(form.service_id)}</p>
          </div>
          <div className="space-x-2">
            <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Annuler</button>
            <button type="button" onClick={() => window.print()} className="px-4 py-2 border rounded-md">Imprimer</button>
            <button type="submit" form="appointment-form" className="px-4 py-2 bg-green-600 text-white rounded-md">Enregistrer</button>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form id="appointment-form" onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations citoyen</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                <input
                  value={form.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                <input
                  value={form.last_name}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                <input
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Rendez-vous</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                <input
                  type="date"
                  value={form.appointment_date}
                  onChange={(e) => handleChange('appointment_date', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.appointment_date ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.appointment_date && <p className="text-red-500 text-sm mt-1">{errors.appointment_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Heure *</label>
                <input
                  type="time"
                  value={form.appointment_time}
                  onChange={(e) => handleChange('appointment_time', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.appointment_time ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.appointment_time && <p className="text-red-500 text-sm mt-1">{errors.appointment_time}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de rendez-vous *</label>
                <select
                  value={form.appointment_type_id}
                  onChange={(e) => handleChange('appointment_type_id', Number(e.target.value))}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${errors.appointment_type_id ? 'border-red-500' : 'border-gray-300'}`}
                >
                  {appointmentTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
                </select>
                {errors.appointment_type_id && <p className="text-red-500 text-sm mt-1">{errors.appointment_type_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Service</label>
                <select
                  value={form.service_id}
                  onChange={(e) => handleChange('service_id', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {services.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Document</label>
                <select
                  value={form.document_type_id}
                  onChange={(e) => handleChange('document_type_id', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {documentTypes.map(d => <option key={d.list_id} value={d.list_id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nationalité</label>
                <select
                  value={form.citizenship_id}
                  onChange={(e) => handleChange('citizenship_id', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {citizenships.map(c => <option key={c.list_id} value={c.list_id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie</label>
                <select
                  value={form.citizen_type_id}
                  onChange={(e) => handleChange('citizen_type_id', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {citizenCategories.map(c => <option key={c.list_id} value={c.list_id}>{c.label}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;
