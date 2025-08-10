import React, { useMemo, useState } from 'react';
import { orgTransactions, transactionTypes, paymentModes, statuses, getLabelById } from './transactionDDL';
import TransactionForm from './transactionForm';

const TransactionTable = () => {
  const [items, setItems] = useState(orgTransactions);
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [filters, setFilters] = useState({
    q: '',
    account_id: '',
    type: '',
    mode: '',
    status: '',
    from: '',
    to: '',
  });
  const [sortField, setSortField] = useState('transaction_date');
  const [sortDirection, setSortDirection] = useState('desc');

  const handleSort = (field) => {
    if (field === sortField) setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDirection('asc'); }
  };

  const filtered = useMemo(() => {
    let arr = [...items];
    const { q, account_id, type, mode, status, from, to } = filters;

    if (q) {
      const t = q.toLowerCase();
      arr = arr.filter((it) =>
        (it.transaction_code || '').toLowerCase().includes(t) ||
        (it.description || '').toLowerCase().includes(t) ||
        (it.reference_number || '').toLowerCase().includes(t)
      );
    }
    if (account_id) arr = arr.filter((it) => String(it.account_id) === String(account_id));
    if (type) arr = arr.filter((it) => String(it.transaction_type_id) === String(type));
    if (mode) arr = arr.filter((it) => String(it.payment_mode_id) === String(mode));
    if (status) arr = arr.filter((it) => String(it.status_id) === String(status));
    if (from) arr = arr.filter((it) => String(it.transaction_date) >= String(from));
    if (to) arr = arr.filter((it) => String(it.transaction_date) <= String(to));

    arr.sort((a, b) => {
      const vA = a[sortField];
      const vB = b[sortField];
      if (sortField === 'transaction_date') {
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
    if (data.transaction_id) {
      setItems((prev) => prev.map((it) => it.transaction_id === data.transaction_id ? { ...it, ...data } : it));
    } else {
      const nextId = Math.max(0, ...items.map((i) => i.transaction_id || 0)) + 1;
      setItems((prev) => [{ ...data, transaction_id: nextId, created: new Date().toISOString() }, ...prev]);
    }
    setShowForm(false);
    setSelected(null);
  };

  const totalDebit = filtered.reduce((sum, t) => sum + Number(t.debit || 0), 0);
  const totalCredit = filtered.reduce((sum, t) => sum + Number(t.credit || 0), 0);

  if (showForm) {
    return (
      <TransactionForm
        initial={selected}
        onCancel={() => { setShowForm(false); setSelected(null); }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header: title, actions, filters */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Transactions</h2>
          <div>
            {selected && (
              <button className="px-3 py-2 border rounded-md mr-2" onClick={() => setShowForm(true)}>Éditer</button>
            )}
            <button className="px-3 py-2 bg-green-600 text-white rounded-md" onClick={() => { setSelected(null); setShowForm(true); }}>+ Nouvelle Transaction</button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
          <input placeholder="Rechercher (code, ref, description)" value={filters.q} onChange={(e) => setFilters((f) => ({ ...f, q: e.target.value }))} className="px-3 py-2 border rounded-md md:col-span-2" />
          <input placeholder="Compte (ID)" value={filters.account_id} onChange={(e) => setFilters((f) => ({ ...f, account_id: e.target.value }))} className="px-3 py-2 border rounded-md" />
          <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Type</option>
            {transactionTypes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <select value={filters.mode} onChange={(e) => setFilters((f) => ({ ...f, mode: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Mode</option>
            {paymentModes.map(t => <option key={t.list_id} value={t.list_id}>{t.label}</option>)}
          </select>
          <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="px-3 py-2 border rounded-md">
            <option value="">Statut</option>
            {statuses.map(s => <option key={s.list_id} value={s.list_id}>{s.label}</option>)}
          </select>
          <div className="grid grid-cols-2 gap-2 md:col-span-2">
            <input type="date" value={filters.from} onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))} className="px-3 py-2 border rounded-md" />
            <input type="date" value={filters.to} onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))} className="px-3 py-2 border rounded-md" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={() => handleSort('transaction_date')}>
                Date {sortField === 'transaction_date' && (<span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>)}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mode</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Débit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crédit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Référence</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((t) => (
              <tr key={t.transaction_id} className={`hover:bg-gray-50 cursor-pointer ${selected?.transaction_id === t.transaction_id ? 'bg-blue-50' : ''}`} onClick={() => setSelected(t)}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.transaction_date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.transaction_code}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(transactionTypes, t.transaction_type_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(paymentModes, t.payment_mode_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(t.debit || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{Number(t.credit || 0).toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.reference_number}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getLabelById(statuses, t.status_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900 mr-3" onClick={(ev) => { ev.stopPropagation(); setSelected(t); setShowForm(true); }}>Éditer</button>
                  <button className="text-red-600 hover:text-red-900" onClick={(ev) => { ev.stopPropagation(); /* TODO delete */ }}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Flux Totale: </span>
            <span className="font-semibold">
            {totalDebit.toFixed(2) - totalCredit.toFixed(2)}
            </span>
          </div>
          <div>
            <span className="text-gray-600">Totale débit: </span>
            <span className="font-semibold">
            {totalDebit.toFixed(2)}
            </span>
          </div>
          <div className="flex space-x-4">
              <span className="text-green-600">Totale crédit: </span>
              <span className="font-semibold">{totalCredit.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionTable;
