import React, { useMemo, useState } from 'react';
import { orgAccounts, accountTypes, currencies, getLabelById } from './accountDDL';
import { orgTransactions } from '../transaction/transactionDDL';
import AccountForm from './accountForm';

const computeTotalsByAccount = (transactions) => {
  const map = new Map();
  for (const t of transactions) {
    const key = t.account_id;
    const prev = map.get(key) || { debit: 0, credit: 0 };
    prev.debit += Number(t.debit || 0);
    prev.credit += Number(t.credit || 0);
    map.set(key, prev);
  }
  return map;
};

const AccountTable = () => {
  const [items, setItems] = useState(orgAccounts);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({ q: '', type: '', currency: '' });
  const [sortField, setSortField] = useState('account_code');
  const [sortDirection, setSortDirection] = useState('asc');

  const totalsMap = useMemo(() => computeTotalsByAccount(orgTransactions), []);

  const handleSort = (field) => {
    if (field === sortField) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const enriched = useMemo(() => {
    return items.map((acc) => {
      const totals = totalsMap.get(acc.account_id) || { debit: 0, credit: 0 };
      return { ...acc, total_debit: totals.debit, total_credit: totals.credit, balance: totals.debit - totals.credit };
    });
  }, [items, totalsMap]);

  const filtered = useMemo(() => {
    let arr = [...enriched];
    const { q, type, currency } = filters;

    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter((it) =>
        (it.account_code || '').toLowerCase().includes(t) ||
        (it.account_name || '').toLowerCase().includes(t)
      );
    }
    if (type) arr = arr.filter((it) => String(it.account_type_id) === String(type));
    if (currency) arr = arr.filter((it) => String(it.currency_id) === String(currency));

    arr.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (['total_debit', 'total_credit', 'balance'].includes(sortField)) {
        const nA = Number(vA || 0);
        const nB = Number(vB || 0);
        return sortDirection === 'asc' ? nA - nB : nB - nA;
      }
      const sA = String(vA).toLowerCase();
      const sB = String(vB).toLowerCase();
      if (sA < sB) return sortDirection === 'asc' ? -1 : 1;
      if (sA > sB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return arr;
  }, [enriched, filters, sortField, sortDirection]);

  const handleSave = (data) => {
    if (data.account_id) {
      setItems((prev) => prev.map((it) => it.account_id === data.account_id ? { ...it, ...data } : it));
    } else {
      const nextId = Math.max(0, ...items.map((i) => i.account_id || 0)) + 1;
      setItems((prev) => [{ ...data, account_id: nextId, created: new Date().toISOString() }, ...prev]);
    }
    setShowForm(false);
    setSelected(null);
  };

  if (showForm) {
    return (
      <AccountForm
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
          <h2 className="text-lg font-semibold text-gray-900">Comptes</h2>
          <div>
            {selected && (
              <button className="px-3 py-2 border rounded-md mr-2" onClick={() => setShowForm(true)}>Éditer</button>
            )}
            <button className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={() => { setSelected(null); setShowForm(true); }}>+ Nouveau Compte</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input placeholder="Rechercher (code, nom)" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} className="px-3 py-2 border rounded-md md:col-span-2" />
          <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Type</option>
            {accountTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <select value={filters.currency} onChange={(e) => setFilters((f) => ({ ...f, currency: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Devise</option>
            {currencies.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <div></div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('account_code')}>
                Code {sortField === 'account_code' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Devise</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_debit')}>Débit total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('total_credit')}>Crédit total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('balance')}>Solde (Débit - Crédit)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((a) => (
              <tr key={a.account_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.account_id === a.account_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(a)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.account_code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{a.account_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(accountTypes, a.account_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(currencies, a.currency_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(a.total_debit || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(a.total_credit || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(a.balance || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(ev) => { ev.stopPropagation(); setSelected(a); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(ev) => { ev.stopPropagation(); /* TODO: delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountTable;
