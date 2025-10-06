import React, { useMemo, useState } from 'react';
import SubscriptionForm from './subscriptionForm';
import {
  mockSubscriptionRequests,
  subscriptionStatuses,
  getStatusLabel,
  getCitizenName,
  subscriptionTypes,
  getSubscriptionTypeLabel,
} from './subscriptionDDL';

const SubscriptionTable = () => {
  const [items, setItems] = useState(mockSubscriptionRequests);
  const [selected, setSelected] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('request_date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const filteredAndSorted = useMemo(() => {
    let list = items;
    if (typeFilter) list = list.filter(r => Number(r.request_type_id) === Number(typeFilter));
    if (statusFilter) list = list.filter(r => Number(r.request_status_id) === Number(statusFilter));
    if (fromDate) list = list.filter(r => new Date(r.request_date).getTime() >= new Date(fromDate).getTime());
    if (toDate) list = list.filter(r => new Date(r.request_date).getTime() <= new Date(toDate).getTime());
    if (filterValue) list = list.filter(r => getCitizenName(r.citizen_id).toLowerCase().includes(filterValue.toLowerCase()));

    const sorted = [...list].sort((a, b) => {
      const av = (sortField === 'citizen') ? getCitizenName(a.citizen_id) : (a[sortField] ?? '');
      const bv = (sortField === 'citizen') ? getCitizenName(b.citizen_id) : (b[sortField] ?? '');
      const cmp = String(av).localeCompare(String(bv));
      return sortDirection === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [items, filterValue, sortField, sortDirection, typeFilter, statusFilter, fromDate, toDate]);

  const handleRowClick = (row) => setSelected(selected?.request_id === row.request_id ? null : row);
  const handleSort = (field) => {
    if (sortField === field) setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
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

  const handleAdd = () => setIsAdding(true);
  const handleCancelAdd = () => setIsAdding(false);
  const handleSaveAdd = (data) => {
    const newId = Math.max(0, ...items.map(i => i.request_id)) + 1;
    const now = new Date().toISOString();
    const toInsert = { ...data, request_id: newId, created: now, createdby: 1, updated: now, updatedby: 1 };
    setItems((prev) => [...prev, toInsert]);
    setIsAdding(false);
    alert('Inscription ajoutée avec succès');
  };

  const handleEdit = () => { if (!selected) return; setEditItem(selected); setIsEditing(true); };
  const handleCancelEdit = () => { setIsEditing(false); setEditItem(null); };
  const handleSaveEdit = (data) => {
    const now = new Date().toISOString();
    const updated = { ...data, updated: now, updatedby: 1 };
    setItems((prev) => prev.map((it) => it.request_id === updated.request_id ? updated : it));
    if (selected?.request_id === updated.request_id) setSelected(updated);
    setIsEditing(false); setEditItem(null);
    alert('Inscription mise à jour avec succès');
  };

  const handleDelete = () => {
    if (!selected) return;
    if (window.confirm(`Supprimer l'inscription #${selected.request_id} ?`)) {
      setItems(items.filter(i => i.request_id !== selected.request_id));
      setSelected(null);
      alert('Inscription supprimée');
    }
  };

  // Edit/Add modes
  if (isEditing && editItem) return <SubscriptionForm initial={editItem} onSave={handleSaveEdit} onCancel={handleCancelEdit} />;
  if (isAdding) return <SubscriptionForm initial={null} onSave={handleSaveAdd} onCancel={handleCancelAdd} />;

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
            <p className="text-gray-600">Liste et gestion des inscriptions</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvelle inscription
            </button>
            {selected && (
              <>
                <button onClick={handleEdit} className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-xs">Éditer</button>
                <button onClick={handleDelete} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs">Supprimer</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="px-6 mb-4 flex-shrink-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 w-full sm:max-w-2xl">
              <input
                type="text"
                placeholder={`Rechercher par nom...`}
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm text-gray-600">{filteredAndSorted.length} inscription(s)</div>
              <button
                onClick={() => { setFilterValue(''); setTypeFilter(''); setStatusFilter(''); setFromDate(''); setToDate(''); }}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Type:</label>
              <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Tous</option>
                {subscriptionTypes.map(t => (<option key={t.list_id} value={t.list_id}>{t.label}</option>))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">Statut:</label>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500">
                <option value="">Tous</option>
                {subscriptionStatuses.map(s => (<option key={s.list_id} value={s.list_id}>{s.label}</option>))}
              </select>
            </div>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('request_id')}>
                  <div className="flex items-center space-x-1"><span>ID</span>{getSortIcon('request_id')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('citizen')}>
                  <div className="flex items-center space-x-1"><span>Citoyen</span>{getSortIcon('citizen')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('request_status_id')}>
                  <div className="flex items-center space-x-1"><span>Statut</span>{getSortIcon('request_status_id')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('request_date')}>
                  <div className="flex items-center space-x-1"><span>Date</span>{getSortIcon('request_date')}</div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSorted.map((r) => (
                <tr key={r.request_id} onClick={() => handleRowClick(r)} className={`cursor-pointer transition-colors ${selected?.request_id === r.request_id ? 'bg-green-50 border-l-4 border-green-500' : 'hover:bg-gray-50'}`}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{r.request_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCitizenName(r.citizen_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getSubscriptionTypeLabel(r.request_type_id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${r.request_status_id === 503 ? 'bg-green-100 text-green-800' : r.request_status_id === 504 ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                      {getStatusLabel(r.request_status_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.request_date).toLocaleString('fr-FR')}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(r.amount || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'XOF' })}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center gap-2">
                      <button onClick={(e) => { e.stopPropagation(); setEditItem(r); setIsEditing(true); }} className="px-3 py-1 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-xs" title="Éditer">Éditer</button>
                      <button onClick={(e) => { e.stopPropagation(); if (window.confirm(`Supprimer l'inscription #${r.request_id} ?`)) { setItems((prev) => prev.filter(i => i.request_id !== r.request_id)); if (selected?.request_id === r.request_id) setSelected(null); alert('Inscription supprimée'); } }} className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-xs" title="Supprimer">Supprimer</button>
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune inscription trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">Aucune inscription ne correspond aux critères de recherche.</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer info */}
      <div className="px-6 py-4 flex-shrink-0 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>Affichage de {filteredAndSorted.length} inscription(s) sur {items.length} total</div>
          <div className="flex items-center space-x-2">
            <span>Trié par: {sortField} ({sortDirection === 'asc' ? 'croissant' : 'décroissant'})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
