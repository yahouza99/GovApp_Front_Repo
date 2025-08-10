import React, { useMemo, useState } from 'react';
import { jobTypes, workModes, educationLevels, experienceLevels, jobStatuses, currencies } from './jobofferDDL';

const JobofferForm = ({ offer, onSave, onCancel }) => {
  const isEdit = Boolean(offer);
  const [form, setForm] = useState(() => ({
    job_offer_id: offer?.job_offer_id || undefined,
    org_id: offer?.org_id || 'AMB-NIGER-PARIS',
    company_name: offer?.company_name || '',
    job_title: offer?.job_title || '',
    job_description: offer?.job_description || '',
    job_type_id: offer?.job_type_id || '',
    work_mode_id: offer?.work_mode_id || '',
    education_level_id: offer?.education_level_id || '',
    experience_level_id: offer?.experience_level_id || '',
    industry_id: offer?.industry_id || '',
    language_requirements: offer?.language_requirements || '',
    location: offer?.location || '',
    country_id: offer?.country_id || '',
    salary_min: offer?.salary_min ?? '',
    salary_max: offer?.salary_max ?? '',
    currency_id: offer?.currency_id || '',
    benefits: offer?.benefits || '',
    start_date: offer?.start_date || '',
    end_date: offer?.end_date || '',
    status_id: offer?.status_id || 1,
    created: offer?.created || undefined,
  }));

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.job_title?.trim()) e.job_title = 'Intitulé requis';
    if (!form.job_description?.trim()) e.job_description = 'Description requise';
    if (form.salary_min !== '' && form.salary_max !== '' && Number(form.salary_min) > Number(form.salary_max)) {
      e.salary_max = 'Salaire max doit être supérieur au salaire min';
    }
    if (form.end_date && form.start_date && new Date(form.end_date) < new Date(form.start_date)) {
      e.end_date = 'Date limite antérieure à la date de début';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (name, value) => setForm((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    const payload = {
      ...form,
      job_offer_id: form.job_offer_id || Date.now(),
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
        <h2 className="text-xl font-semibold text-gray-900">{isEdit ? 'Modifier Offre' : 'Nouvelle Offre'}</h2>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
            <input value={form.company_name} onChange={(e) => handleChange('company_name', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé du poste</label>
            <input value={form.job_title} onChange={(e) => handleChange('job_title', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.job_title && <p className="text-xs text-red-600 mt-1">{errors.job_title}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.job_type_id} onChange={(e) => handleChange('job_type_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(jobTypes).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mode de travail</label>
            <select value={form.work_mode_id} onChange={(e) => handleChange('work_mode_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(workModes).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Niveau d'études</label>
            <select value={form.education_level_id} onChange={(e) => handleChange('education_level_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(educationLevels).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expérience</label>
            <select value={form.experience_level_id} onChange={(e) => handleChange('experience_level_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(experienceLevels).map(([id, t]) => (<option key={id} value={id}>{t.label}</option>))}
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} value={form.job_description} onChange={(e) => handleChange('job_description', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.job_description && <p className="text-xs text-red-600 mt-1">{errors.job_description}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Langues requises</label>
            <input value={form.language_requirements} onChange={(e) => handleChange('language_requirements', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input value={form.location} onChange={(e) => handleChange('location', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salaire min</label>
            <input type="number" value={form.salary_min} onChange={(e) => handleChange('salary_min', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salaire max</label>
            <input type="number" value={form.salary_max} onChange={(e) => handleChange('salary_max', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.salary_max && <p className="text-xs text-red-600 mt-1">{errors.salary_max}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
            <select value={form.currency_id} onChange={(e) => handleChange('currency_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              <option value="">Sélectionner</option>
              {Object.entries(currencies).map(([id, c]) => (<option key={id} value={id}>{c.label}</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Début du contrat</label>
            <input type="date" value={form.start_date} onChange={(e) => handleChange('start_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date limite</label>
            <input type="date" value={form.end_date} onChange={(e) => handleChange('end_date', e.target.value)} className="w-full px-3 py-2 border rounded-md" />
            {errors.end_date && <p className="text-xs text-red-600 mt-1">{errors.end_date}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select value={form.status_id} onChange={(e) => handleChange('status_id', e.target.value)} className="w-full px-3 py-2 border rounded-md">
              {Object.entries(jobStatuses).map(([id, s]) => (<option key={id} value={id}>{s.label}</option>))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
};

export default JobofferForm;
