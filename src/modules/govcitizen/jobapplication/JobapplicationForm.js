import React, { useState } from 'react';
import { orgJobOffers } from '../joboffer/jobofferDDL';
import { applicationStatuses, educationLevels, workModePreferences } from './jobapplicationDDL';

const JobapplicationForm = ({ application, onSave, onCancel }) => {
  const isEdit = Boolean(application);
  const [form, setForm] = useState(() => ({
    job_application_id: application?.job_application_id || undefined,
    job_offer_id: application?.job_offer_id || '',
    citizen_id: application?.citizen_id || '',
    full_name: application?.full_name || '',
    email: application?.email || '',
    phone: application?.phone || '',
    address: application?.address || '',
    country_id: application?.country_id || '',
    resume_url: application?.resume_url || '',
    resume_file: application?.resume_file || null,
    cover_letter_url: application?.cover_letter_url || '',
    portfolio_url: application?.portfolio_url || '',
    other_documents_url: application?.other_documents_url || '',
    education_level_id: application?.education_level_id || '',
    experience_years: application?.experience_years ?? '',
    work_mode_preference_id: application?.work_mode_preference_id || '',
    languages: application?.languages || '',
    application_date: application?.application_date || '',
    status_id: application?.status_id || 1,
    interview_date: application?.interview_date || '',
    interview_notes: application?.interview_notes || '',
    recruiter_notes: application?.recruiter_notes || '',
    created: application?.created || undefined,
  }));

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setForm((prev) => ({ ...prev, resume_file: null }));
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      // result is base64 string (data URL). Extract base64 payload after comma
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : null;
      setForm((prev) => ({ ...prev, resume_file: base64 }));
    };
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.job_offer_id) e.job_offer_id = "Offre d'emploi requise";
    if (!form.full_name?.trim()) e.full_name = 'Nom complet requis';
    if (!form.email?.trim()) e.email = 'Email requis';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      job_application_id: form.job_application_id || Date.now(),
      application_date: form.application_date || new Date().toISOString(),
      created: form.created || new Date().toISOString(),
      updated: isEdit ? new Date().toISOString() : undefined,
    };
    setTimeout(() => {
      onSave?.(payload);
      setSaving(false);
    }, 400);
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">{isEdit ? 'Modifier Candidature' : 'Nouvelle Candidature'}</h2>
        <div className="space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md">Annuler</button>
          <button onClick={handleSubmit} disabled={saving} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50">
            {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-4 overflow-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Offre d'emploi</label>
            <select value={form.job_offer_id} onChange={(e) => handleChange('job_offer_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {orgJobOffers.map((o) => (
                <option key={o.job_offer_id} value={o.job_offer_id}>{o.job_title}</option>
              ))}
            </select>
            {errors.job_offer_id && <p className="text-xs text-red-600 mt-1">{errors.job_offer_id}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
            <input value={form.full_name} onChange={(e) => handleChange('full_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.full_name && <p className="text-xs text-red-600 mt-1">{errors.full_name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
            <input value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'études</label>
            <select value={form.education_level_id} onChange={(e) => handleChange('education_level_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(educationLevels).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Années d'expérience</label>
            <input type="number" value={form.experience_years} onChange={(e) => handleChange('experience_years', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Préférence de mode</label>
            <select value={form.work_mode_preference_id} onChange={(e) => handleChange('work_mode_preference_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(workModePreferences).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Langues</label>
            <input value={form.languages} onChange={(e) => handleChange('languages', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV (URL)</label>
            <input value={form.resume_url} onChange={(e) => handleChange('resume_url', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">CV (Fichier PDF)</label>
            {!form.resume_file ? (
              <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="w-full" />
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href={`data:application/pdf;base64,${form.resume_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Ouvrir le CV
                </a>
                <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50">
                  Remplacer
                  <input type="file" accept="application/pdf,.pdf" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Lettre de motivation (URL)</label>
            <input value={form.cover_letter_url} onChange={(e) => handleChange('cover_letter_url', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio (URL)</label>
            <input value={form.portfolio_url} onChange={(e) => handleChange('portfolio_url', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Autres documents (URL)</label>
            <input value={form.other_documents_url} onChange={(e) => handleChange('other_documents_url', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select value={form.status_id} onChange={(e) => handleChange('status_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              {Object.entries(applicationStatuses).map(([id, s]) => (<option key={id} value={id}>{s.label}</option>))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date d'entretien</label>
            <input type="datetime-local" value={form.interview_date} onChange={(e) => handleChange('interview_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes d'entretien</label>
            <textarea rows={3} value={form.interview_notes} onChange={(e) => handleChange('interview_notes', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes recruteur</label>
            <textarea rows={3} value={form.recruiter_notes} onChange={(e) => handleChange('recruiter_notes', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobapplicationForm;
