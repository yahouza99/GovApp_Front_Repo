import React, { useMemo, useState } from 'react';
import {
  orgCommunications,
  communicationTypes,
  communicationStatus,
  deriveExtraColumns,
  formatDate,
} from './communicationDDL';
import CommunicationForm from './CommunicationForm';

const CommunicationTable = () => {
  const [items, setItems] = useState(orgCommunications);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let data = [...items];

    if (filterType) {
      data = data.filter(i => i.communication_type_id === parseInt(filterType, 10));
    }
    if (filterStatus) {
      data = data.filter(i => i.communication_status_id === parseInt(filterStatus, 10));
    }
    if (filterDateFrom) {
      data = data.filter(i => (i.start_date ? new Date(i.start_date) >= new Date(filterDateFrom) : true));
    }
    if (filterDateTo) {
      // inclusive until end of day
      const end = new Date(filterDateTo);
      end.setHours(23, 59, 59, 999);
      data = data.filter(i => (i.end_date ? new Date(i.end_date) <= end : true));
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
  }, [items, filterType, filterStatus, filterDateFrom, filterDateTo, sortField, sortDirection]);

  // Show extra_data columns only when a specific Type filter is applied (like AssetTable)
  const dynamicColumns = useMemo(() => {
    if (!filterType) return [];
    return deriveExtraColumns(filteredAndSorted);
  }, [filteredAndSorted, filterType]);

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getTypeBadge = (id) => {
    const label = communicationTypes[id]?.label || '-';
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
        {label}
      </span>
    );
  };

  const getStatusBadge = (id) => {
    const label = communicationStatus[id]?.label || '-';
    const map = {
      'Brouillon': 'bg-gray-100 text-gray-800',
      'Planifiée': 'bg-yellow-100 text-yellow-800',
      'Envoyée': 'bg-green-100 text-green-800',
      'Annulée': 'bg-red-100 text-red-800',
    };
    const cls = map[label] || 'bg-gray-100 text-gray-800';
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${cls}`}>
        {label}
      </span>
    );
  };

  // Recipients column intentionally not displayed per requirements

  // Conditional rendering for form mode (match AssetTable pattern)
  if (showForm) {
    return (
      <CommunicationForm
        communication={selected}
        onSave={(saved) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.org_communication_id === saved.org_communication_id);
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
           {/**  <h2 className="text-2xl font-bold text-gray-900">Gestion des Communications</h2> */}
            <p className="text-gray-600">Liste unifiée des communications</p>
          </div>
          <button
            onClick={() => { setSelected(null); setShowForm(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Nouvelle Communication
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous</option>
              {Object.entries(communicationTypes).map(([id, t]) => (
                <option key={id} value={id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous</option>
              {Object.entries(communicationStatus).map(([id, s]) => (
                <option key={id} value={id}>{s.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Début (De)</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Fin (À)</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setFilterType(''); setFilterStatus(''); setFilterDateFrom(''); setFilterDateTo(''); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Réinitialiser
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('title')}
              >
                Titre {sortField === 'title' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('start_date')}
              >
                Début {sortField === 'start_date' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('end_date')}
              >
                Fin {sortField === 'end_date' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              {dynamicColumns.map(col => (
                <th key={col.key} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {col.label}
                </th>
              ))}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSorted.map((c) => (
              <tr key={c.org_communication_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.org_communication_id === c.org_communication_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(c)}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getTypeBadge(c.communication_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(c.start_date)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(c.end_date)}</td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getStatusBadge(c.communication_status_id)}</td>
                {dynamicColumns.map(col => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {String(c.extra_data?.[col.key] ?? '-')}
                  </td>
                ))}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(e) => { e.stopPropagation(); setSelected(c); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(e) => { e.stopPropagation(); /* delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSorted.length === 0 && (
          <div className="text-center py-8 text-gray-500">Aucune communication trouvée</div>
        )}
      </div>
    </div>
  );
};

export default CommunicationTable;
