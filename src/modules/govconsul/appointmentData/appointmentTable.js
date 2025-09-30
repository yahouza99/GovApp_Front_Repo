import React, { useMemo, useState } from 'react';
import AppointmentForm from './appointmentForm';
import {
  mockAppointments,
  appointmentTypes,
  services,
  documentTypes,
  citizenships,
  citizenCategories,
  getAppointmentTypeLabel,
  getServiceLabel,
  getDocumentTypeLabel,
  getCitizenshipLabel,
  getCitizenCategoryLabel,
} from './appointmentDDL';

const AppointmentTable = () => {
  const [items, setItems] = useState(mockAppointments);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // search & filters
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');
  const [documentFilter, setDocumentFilter] = useState('');
  const [citizenshipFilter, setCitizenshipFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // sorting
  const [sortField, setSortField] = useState('appointment_date');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredAndSorted = useMemo(() => {
    let list = items;

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(r => `${r.first_name} ${r.last_name}`.toLowerCase().includes(q));
    }
    if (typeFilter) list = list.filter(r => Number(r.appointment_type_id) === Number(typeFilter));
    if (serviceFilter) list = list.filter(r => Number(r.service_id) === Number(serviceFilter));
    if (documentFilter) list = list.filter(r => Number(r.document_type_id) === Number(documentFilter));
    if (citizenshipFilter) list = list.filter(r => Number(r.citizenship_id) === Number(citizenshipFilter));
    if (categoryFilter) list = list.filter(r => Number(r.citizen_type_id) === Number(categoryFilter));
    if (fromDate) {
      const fd = new Date(fromDate).getTime();
      list = list.filter(r => new Date(r.appointment_date).getTime() >= fd);
    }
    if (toDate) {
      const td = new Date(toDate).getTime();
      list = list.filter(r => new Date(r.appointment_date).getTime() <= td);
    }

    const sorted = [...list].sort((a, b) => {
      const av = sortField === 'full_name'
        ? `${a.last_name} ${a.first_name}`
        : (a[sortField] ?? '');
      const bv = sortField === 'full_name'
        ? `${b.last_name} ${b.first_name}`
        : (b[sortField] ?? '');
      const cmp = String(av).localeCompare(String(bv));
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [items, query, typeFilter, serviceFilter, documentFilter, citizenshipFilter, categoryFilter, fromDate, toDate, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDirection('asc'); }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return (
      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    );
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  const handleRowClick = (row) => {
    setSelected(selected?.appointment_id === row.appointment_id ? null : row);
  };

  const handleAdd = () => setIsAdding(true);
  const handleCancelAdd = () => setIsAdding(false);
  const handleSaveAdd = (data) => {
    const newId = Math.max(0, ...items.map(i => i.appointment_id)) + 1;
    const now = new Date().toISOString();
    const toInsert = { ...data, appointment_id: newId, created: now, createdby: 1, updated: now, updatedby: 1 };
    setItems((prev) => [...prev, toInsert]);
    setIsAdding(false);
    alert('Rendez-vous ajouté');
  };

  const handleEdit = (row) => { setEditItem(row); setIsEditing(true); };
  const handleCancelEdit = () => { setIsEditing(false); setEditItem(null); };
  const handleSaveEdit = (data) => {
    const now = new Date().toISOString();
    const updated = { ...data, updated: now, updatedby: 1 };
    setItems((prev) => prev.map((it) => it.appointment_id === updated.appointment_id ? updated : it));
    if (selected?.appointment_id === updated.appointment_id) setSelected(updated);
    setIsEditing(false); setEditItem(null);
    alert('Rendez-vous mis à jour');
  };

  const handleDelete = (row) => {
    if (window.confirm(`Supprimer le rendez-vous #${row.appointment_id} ?`)) {
      setItems(prev => prev.filter(i => i.appointment_id !== row.appointment_id));
      if (selected?.appointment_id === row.appointment_id) setSelected(null);
      alert('Rendez-vous supprimé');
    }
  };

  // Switch to form modes
  if (isEditing && editItem) return <AppointmentForm initial={editItem} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
  if (isAdding) return <AppointmentForm initial={null} onSave={handleSaveAdd} onCancel={handleCancelAdd} />;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-gray-600">Liste et gestion des rendez-vous</p>
          </div>
          <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Rendez-vous
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-4 flex-shrink-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:max-w-2xl">
              <input
                type="text"
                placeholder="Rechercher par nom..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">{filteredAndSorted.length} rendez-vous</div>
              <button
                onClick={() => {
                  setQuery(''); setTypeFilter(''); setServiceFilter(''); setDocumentFilter(''); setCitizenshipFilter(''); setCategoryFilter(''); setFromDate(''); setToDate('');
                }}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Service:</label>
              <select value={serviceFilter} onChange={(e) => setServiceFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Tous</option>
                {services.map(s => (<option key={s.list_id} value={s.list_id}>{s.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Nationalité:</label>
              <select value={citizenshipFilter} onChange={(e) => setCitizenshipFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Toutes</option>
                {citizenships.map(c => (<option key={c.list_id} value={c.list_id}>{c.label}</option>))}
              </select>
            </div>
            {/*
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Catégorie:</label>
              <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Toutes</option>
                {citizenCategories.map(c => (<option key={c.list_id} value={c.list_id}>{c.label}</option>))}
              </select>
            </div> */}
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Du:</label>
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
              <label className="text-sm font-medium text-gray-700">Au:</label>
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 mx-6 mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('appointment_id')}>
                  <div className="flex items-center space-x-1"><span>ID</span>{getSortIcon('appointment_id')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('full_name')}>
                  <div className="flex items-center space-x-1"><span>Nom</span>{getSortIcon('full_name')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nationalité</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('appointment_date')}>
                  <div className="flex items-center space-x-1"><span>Date</span>{getSortIcon('appointment_date')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('appointment_time')}>
                  <div className="flex items-center space-x-1"><span>Heure</span>{getSortIcon('appointment_time')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSorted.map((r) => (
                <tr key={r.appointment_id} onClick={() => handleRowClick(r)} className={`cursor-pointer transition-colors ${selected?.appointment_id === r.appointment_id ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{r.appointment_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.last_name} {r.first_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getServiceLabel(r.service_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCitizenshipLabel(r.citizenship_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.appointment_date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{r.appointment_time}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); handleEdit(r); }} className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-xs">Éditer</button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(r); }} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs">Supprimer</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSorted.length === 0 && (
            <div className="text-center py-8">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun rendez-vous</h3>
              <p className="mt-1 text-sm text-gray-500">Aucun élément ne correspond aux critères.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 flex-shrink-0 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>Affichage de {filteredAndSorted.length} rendez-vous sur {items.length} total</div>
          <div className="flex items-center space-x-2">
            <span>Trié par: {sortField} ({sortDirection === 'asc' ? 'croissant' : 'décroissant'})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentTable;
