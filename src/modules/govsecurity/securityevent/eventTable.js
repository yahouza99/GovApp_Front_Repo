import React, { useMemo, useState } from 'react';
import { orgSecurityEvents, eventTypes, severities, categories, statuses, getLabelById, getUserName, formatDateTime } from './eventDDL';
import EventForm from './eventForm';

const EventTable = () => {
  const [items, setItems] = useState(orgSecurityEvents);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    q: '',
    event_type_id: '',
    severity_id: '',
    status_id: '',
  });

  const [sortField, setSortField] = useState('event_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (field === sortField) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filtered = useMemo(() => {
    let arr = [...items];
    const { q, event_type_id, severity_id, status_id } = filters;
    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter((it) =>
        (it.title || '').toLowerCase().includes(t) ||
        (it.description || '').toLowerCase().includes(t) ||
        (it.location || '').toLowerCase().includes(t)
      );
    }
    if (event_type_id) arr = arr.filter((it) => String(it.event_type_id) === String(event_type_id));
    if (severity_id) arr = arr.filter((it) => String(it.severity_id) === String(severity_id));
    if (status_id) arr = arr.filter((it) => String(it.status_id) === String(status_id));

    arr.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (vA == null && vB == null) return 0;
      if (vA == null) return 1;
      if (vB == null) return -1;
      if (sortField === 'event_date' || sortField === 'created') {
        const dA = new Date(vA).getTime();
        const dB = new Date(vB).getTime();
        return sortDirection === 'asc' ? dA - dB : dB - dA;
      }
      const sA = String(vA).toLowerCase();
      const sB = String(vB).toLowerCase();
      if (sA < sB) return sortDirection === 'asc' ? -1 : 1;
      if (sA > sB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [items, filters, sortField, sortDirection]);

  const handleSave = (data) => {
    if (data.security_event_id) {
      // update
      setItems((prev) => prev.map((it) => it.security_event_id === data.security_event_id ? data : it));
    } else {
      const nextId = Math.max(0, ...items.map((i) => i.security_event_id || 0)) + 1;
      setItems((prev) => [{ ...data, security_event_id: nextId, created: new Date().toISOString() }, ...prev]);
    }
    setShowForm(false);
    setSelected(null);
  };

  if (showForm) {
    return (
      <EventForm
        initial={selected}
        onCancel={() => { setShowForm(false); setSelected(null); }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Événements de Sécurité</h2>
          <div>
            {selected && (
              <button className="px-3 py-2 border rounded-md mr-2" onClick={() => setShowForm(true)}>Éditer</button>
            )}
            <button className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={() => { setSelected(null); setShowForm(true); }}>+ Nouvel Événement</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Rechercher (titre, lieu...)" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} className="px-3 py-2 border rounded-md md:col-span-2" />
          <select value={filters.event_type_id} onChange={(e) => setFilters((f) => ({ ...f, event_type_id: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Type</option>
            {eventTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <select value={filters.severity_id} onChange={(e) => setFilters((f) => ({ ...f, severity_id: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Gravité</option>
            {severities.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
          <select value={filters.status_id} onChange={(e) => setFilters((f) => ({ ...f, status_id: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Statut</option>
            {statuses.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('event_date')}>
                Date {sortField === 'event_date' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gravité</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Lieu</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigné</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((e) => (
              <tr key={e.security_event_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.security_event_id === e.security_event_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(e)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(e.event_date)}</td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate" title={e.title}>{e.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(eventTypes, e.event_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(severities, e.severity_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(statuses, e.status_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{e.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getUserName(e.assigned_to)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(ev) => { ev.stopPropagation(); setSelected(e); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(ev) => { ev.stopPropagation(); /* TODO: implement delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;
