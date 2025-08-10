import React, { useMemo, useState } from 'react';
import { orgCitizens, citizenTypes, deriveExtraColumns, formatDate } from './citizenDDL';
import CitizenForm from './CitizenForm';

const CitizenTable = () => {
  const [items, setItems] = useState(orgCitizens);
  const [filterLastName, setFilterLastName] = useState('');
  const [filterFirstName, setFilterFirstName] = useState('');
  const [filterPassport, setFilterPassport] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const filteredAndSorted = useMemo(() => {
    let data = [...items];

    if (filterLastName.trim()) {
      const q = filterLastName.trim().toLowerCase();
      data = data.filter((c) => c.citizen_last_name?.toLowerCase().includes(q));
    }
    if (filterFirstName.trim()) {
      const q = filterFirstName.trim().toLowerCase();
      data = data.filter((c) => c.citizen_first_name?.toLowerCase().includes(q));
    }
    if (filterPassport.trim()) {
      const q = filterPassport.trim().toLowerCase();
      data = data.filter((c) => c.passport_number?.toLowerCase().includes(q));
    }
    if (filterType) {
      data = data.filter((c) => c.citizen_type_id === parseInt(filterType, 10));
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
  }, [items, filterLastName, filterFirstName, filterPassport, filterType, sortField, sortDirection]);

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
    const label = citizenTypes[id]?.label || '-';
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
        {label}
      </span>
    );
  };

  // Conditional rendering for form mode (match AssetTable pattern)
  if (showForm) {
    return (
      <CitizenForm
        citizen={selected}
        onSave={(saved) => {
          setItems((prev) => {
            const idx = prev.findIndex((x) => x.citizen_id === saved.citizen_id);
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
            <p className="text-gray-600">Liste officielle des citoyens</p>
          </div>
          <button
            onClick={() => { setSelected(null); setShowForm(true); }}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            + Nouveau Citoyen
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
            <input
              value={filterLastName}
              onChange={(e) => setFilterLastName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Rechercher par nom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
            <input
              value={filterFirstName}
              onChange={(e) => setFilterFirstName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Rechercher par prénom"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Passeport</label>
            <input
              value={filterPassport}
              onChange={(e) => setFilterPassport(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Rechercher par passeport"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous</option>
              {Object.entries(citizenTypes).map(([id, t]) => (
                <option key={id} value={id}>{t.label}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => { setFilterLastName(''); setFilterFirstName(''); setFilterPassport(''); setFilterType(''); }}
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
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('citizen_last_name')}
              >
                Nom {sortField === 'citizen_last_name' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('citizen_first_name')}
              >
                Prénom {sortField === 'citizen_first_name' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('passport_number')}
              >
                Passeport {sortField === 'passport_number' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attachement</th>
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
              <tr key={c.citizen_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.citizen_id === c.citizen_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(c)}>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.citizen_last_name}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{c.citizen_first_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getTypeBadge(c.citizen_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.passport_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDate(c.attached_date)}</td>
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
          <div className="text-center py-8 text-gray-500">Aucun citoyen trouvé</div>
        )}
      </div>
    </div>
  );
};

export default CitizenTable;
