import React, { useMemo, useState } from 'react';
import { orgJobOffers, jobTypes, workModes, educationLevels, experienceLevels, jobStatuses, currencies, formatDate } from './jobofferDDL';
import JobofferForm from './JobofferForm';

const JobofferTable = () => {
  const [items, setItems] = useState(orgJobOffers);
  const [filterTitle, setFilterTitle] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let data = [...items];

    if (filterTitle.trim()) {
      const q = filterTitle.trim().toLowerCase();
      data = data.filter((o) => o.job_title?.toLowerCase().includes(q));
    }
    if (filterCompany.trim()) {
      const q = filterCompany.trim().toLowerCase();
      data = data.filter((o) => o.company_name?.toLowerCase().includes(q));
    }
    if (filterLocation.trim()) {
      const q = filterLocation.trim().toLowerCase();
      data = data.filter((o) => o.location?.toLowerCase().includes(q));
    }
    if (filterStatus) {
      data = data.filter((o) => o.status_id === parseInt(filterStatus, 10));
    }

    data.sort((a, b) => {
      const dir = sortDirection === 'asc' ? 1 : -1;
      const av = a[sortField];
      const bv = b[sortField];
      if (av == null && bv == null) return 0;
      if (av == null) return 1;
      if (bv == null) return -1;
      if (sortField.includes('date') || sortField === 'created') {
        return (new Date(av) - new Date(bv)) * dir;
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return av.localeCompare(bv) * dir;
      }
      return (av > bv ? 1 : av < bv ? -1 : 0) * dir;
    });

    return data;
  }, [items, filterTitle, filterCompany, filterLocation, filterStatus, sortField, sortDirection]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getBadge = (map, id) => map?.[id]?.label || '-';
  const getCurrency = (id) => currencies?.[id]?.code || '';

  // Conditional rendering for form mode (match AssetTable pattern)
  if (showForm) {
    return (
      <JobofferForm
        offer={selected}
        onSave={(saved) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.job_offer_id === saved.job_offer_id);
            if (idx >= 0) {
              const copy = [...prev];
              copy[idx] = saved;
              return copy;
            }
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
            <p className="text-gray-600">Liste des offres d'emploi</p>
          </div>
          <button
            onClick={() => { setSelected(null); setShowForm(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Nouvelle Offre
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intitulé</label>
            <input value={filterTitle} onChange={(e) => setFilterTitle(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rechercher par intitulé" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Entreprise</label>
            <input value={filterCompany} onChange={(e) => setFilterCompany(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rechercher par entreprise" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
            <input value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Rechercher par localisation" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
              <option value="">Tous</option>
              {Object.entries(jobStatuses).map(([id, s]) => (<option key={id} value={id}>{s.label}</option>))}
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={() => { setFilterTitle(''); setFilterCompany(''); setFilterLocation(''); setFilterStatus(''); }} className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">Réinitialiser</button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('job_title')}>
                Intitulé {sortField === 'job_title' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Entreprise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localisation</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Période</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Salaire</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((o) => (
              <tr key={o.job_offer_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.job_offer_id === o.job_offer_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(o)}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{o.job_title}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{o.company_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBadge(jobTypes, o.job_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBadge(workModes, o.work_mode_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{o.location || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${formatDate(o.start_date)} → ${formatDate(o.end_date)}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{`${o.salary_min ?? '-'} - ${o.salary_max ?? '-'} ${getCurrency(o.currency_id)}`}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getBadge(jobStatuses, o.status_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(e) => { e.stopPropagation(); setSelected(o); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); /* delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucune offre trouvée</div>
        )}
      </div>
    </div>
  );
};

export default JobofferTable;
