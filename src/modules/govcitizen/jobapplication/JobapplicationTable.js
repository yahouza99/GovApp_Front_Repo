import React, { useMemo, useState } from 'react';
import { orgJobApplications, applicationStatuses, formatDateTime, offerTitleById } from './jobapplicationDDL';
import JobapplicationForm from './JobapplicationForm';

const JobapplicationTable = () => {
  const [items, setItems] = useState(orgJobApplications);
  const [filterName, setFilterName] = useState('');
  const [filterOffer, setFilterOffer] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('application_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const getStatusLabel = (id) => applicationStatuses?.[id]?.label || '-';

  const filteredAndSorted = useMemo(() => {
    let data = [...items];

    if (filterName.trim()) {
      const q = filterName.trim().toLowerCase();
      data = data.filter((a) => a.full_name?.toLowerCase().includes(q));
    }
    if (filterOffer.trim()) {
      const q = filterOffer.trim().toLowerCase();
      data = data.filter((a) => offerTitleById(a.job_offer_id).toLowerCase().includes(q));
    }
    if (filterStatus) {
      data = data.filter((a) => a.status_id === parseInt(filterStatus, 10));
    }

    data.sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (sortField.includes('date')) {
        return (new Date(av) - new Date(bv)) * dir;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });

    return data;
  }, [items, filterName, filterOffer, filterStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const handleUploadResume = (application, file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const base64 = typeof result === 'string' ? result.split(',')[1] : null;
      if (!base64) return;
      const updated = { ...application, resume_file: base64 };
      setItems((prev) => prev.map((it) => it.job_application_id === application.job_application_id ? updated : it));
    };
    reader.readAsDataURL(file);
  };

  if (showForm) {
    return (
      <JobapplicationForm
        application={selected}
        onSave={(saved) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.job_application_id === saved.job_application_id);
            if (idx >= 0) { const copy = [...prev]; copy[idx] = saved; return copy; }
            return [saved, ...prev];
          });
          setShowForm(false);
          setSelected(null);
        }}
        onCancel={() => { setShowForm(false); setSelected(null); }}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-gray-600">Liste des candidatures</p>
          </div>
          <button onClick={() => { setSelected(null); setShowForm(true); }} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            + Nouvelle Candidature
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Candidat</label>
            <input value={filterName} onChange={(e) => setFilterName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rechercher par nom" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Offre</label>
            <input value={filterOffer} onChange={(e) => setFilterOffer(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rechercher par offre" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Tous</option>
              {Object.entries(applicationStatuses).map(([id, s]) => (<option key={id} value={id}>{s.label}</option>))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setFilterName(''); setFilterOffer(''); setFilterStatus(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Réinitialiser</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('full_name')}>
                Candidat {sortField === 'full_name' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Offre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CV</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('application_date')}>
                Candidature {sortField === 'application_date' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entretien</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((a) => (
              <tr key={a.job_application_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.job_application_id === a.job_application_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(a)}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{a.full_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{offerTitleById(a.job_offer_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {a.resume_file ? (
                    <a
                      href={`data:application/pdf;base64,${a.resume_file}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Ouvrir le CV
                    </a>
                  ) : (
                    <label className="px-3 py-1 border rounded-md cursor-pointer hover:bg-gray-50 inline-flex items-center">
                      Charger PDF
                      <input
                        type="file"
                        accept="application/pdf,.pdf"
                        className="hidden"
                        onChange={(e) => { e.stopPropagation(); handleUploadResume(a, e.target.files?.[0] || null); e.target.value = ''; }}
                      />
                    </label>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusLabel(a.status_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(a.application_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(a.interview_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(e) => { e.stopPropagation(); setSelected(a); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); /* delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSorted.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucune candidature trouvée</div>
        )}
      </div>
    </div>
  );
};

export default JobapplicationTable;
