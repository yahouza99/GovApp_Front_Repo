import React, { useMemo, useState } from 'react';
import { orgUsers, userTypes, getLabelById, formatDateTime } from './userDDL';
import UserForm from './userForm';

const UserTable = () => {
  const [items, setItems] = useState(orgUsers);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({ q: '', user_type_id: '', is_active: '' });
  const [sortField, setSortField] = useState('username');
  const [sortDirection, setSortDirection] = useState('asc');

  const handleSort = (field) => {
    if (field === sortField) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filtered = useMemo(() => {
    let arr = [...items];
    const { q, user_type_id, is_active } = filters;
    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter((it) =>
        (it.username || '').toLowerCase().includes(t) ||
        (it.full_name || '').toLowerCase().includes(t) ||
        (it.email || '').toLowerCase().includes(t)
      );
    }
    if (user_type_id) arr = arr.filter((it) => String(it.user_type_id) === String(user_type_id));
    if (is_active !== '') arr = arr.filter((it) => String(!!it.is_active) === String(is_active === 'true'));

    arr.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (vA == null && vB == null) return 0;
      if (vA == null) return 1;
      if (vB == null) return -1;
      const sA = String(vA).toLowerCase();
      const sB = String(vB).toLowerCase();
      if (sA < sB) return sortDirection === 'asc' ? -1 : 1;
      if (sA > sB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [items, filters, sortField, sortDirection]);

  const handleSave = (data) => {
    if (data.user_id) {
      setItems((prev) => prev.map((it) => it.user_id === data.user_id ? { ...it, ...data } : it));
    } else {
      const nextId = Math.max(0, ...items.map((i) => i.user_id || 0)) + 1;
      setItems((prev) => [{ ...data, user_id: nextId, created: new Date().toISOString() }, ...prev]);
    }
    setShowForm(false);
    setSelected(null);
  };

  if (showForm) {
    return (
      <UserForm
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
          <h2 className="text-lg font-semibold text-gray-900">Utilisateurs</h2>
          <div>
            {selected && (
              <button className="px-3 py-2 border rounded-md mr-2" onClick={() => setShowForm(true)}>Éditer</button>
            )}
            <button className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={() => { setSelected(null); setShowForm(true); }}>+ Nouvel Utilisateur</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Rechercher (nom, email, login)" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} className="px-3 py-2 border rounded-md md:col-span-2" />
          <select value={filters.user_type_id} onChange={(e) => setFilters((f) => ({ ...f, user_type_id: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Type</option>
            {userTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <select value={filters.is_active} onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Actif ?</option>
            <option value="true">Actif</option>
            <option value="false">Inactif</option>
          </select>
          <div></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('username')}>
                Utilisateur {sortField === 'username' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom complet</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actif</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Créé</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((u) => (
              <tr key={u.user_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.user_id === u.user_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(u)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.username}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(userTypes, u.user_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{u.is_active ? 'Oui' : 'Non'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatDateTime(u.created)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(ev) => { ev.stopPropagation(); setSelected(u); setShowForm(true); }}>Éditer</button>
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

export default UserTable;
