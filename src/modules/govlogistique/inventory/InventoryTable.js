import React, { useState, useMemo } from 'react';
import { 
  organizationAssets, 
  assetTypes, 
  assetStatus 
} from '../procurement/assetDDL';

const InventoryTable = () => {
  const [sortField, setSortField] = useState('asset_type_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [filterAssetType, setFilterAssetType] = useState('');

  // Calculate inventory summary from procurement data
  const inventorySummary = useMemo(() => {
    const summary = {};

    organizationAssets.forEach(asset => {
      const key = `${asset.asset_type_id}-${asset.asset_name}`;
      const assetTypeName = assetTypes[asset.asset_type_id]?.label || 'Type Inconnu';
      
      if (!summary[key]) {
        summary[key] = {
          asset_type_id: asset.asset_type_id,
          asset_type_name: assetTypeName,
          asset_name: asset.asset_name,
          asset_code: asset.asset_code || '-',
          quantity: 0,
          total_cost: 0,
          costs: [],
          assets: []
        };
      }

      // Add to summary
      const quantity = parseInt(asset.quantity, 10) || 1; // Default to 1 if quantity is not set
      const cost = parseFloat(asset.acquisition_cost) || 0;
      
      summary[key].quantity += quantity;
      summary[key].total_cost += cost * quantity; // Multiply cost by quantity for total cost
      summary[key].costs.push(...Array(quantity).fill(cost)); // Add one entry per item for cost calculations
      summary[key].assets.push(asset);
    });

    // Calculate average unit cost and convert to array
    return Object.values(summary).map(item => ({
      ...item,
      average_unit_cost: item.costs.length > 0 
        ? item.costs.reduce((sum, cost) => sum + cost, 0) / item.costs.length 
        : 0,
      total_value: item.total_cost
    }));
  }, []);

  // Filter and sort inventory
  const filteredAndSortedInventory = useMemo(() => {
    let filtered = inventorySummary;

    // Apply asset type filter
    if (filterAssetType) {
      filtered = filtered.filter(item => 
        item.asset_type_id.toString() === filterAssetType
      );
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Handle different data types
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [inventorySummary, filterAssetType, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Calculate totals for summary
  const totalQuantity = filteredAndSortedInventory.reduce((sum, item) => sum + item.quantity, 0);
  const totalValue = filteredAndSortedInventory.reduce((sum, item) => sum + item.total_value, 0);
  const averageValue = filteredAndSortedInventory.length > 0 
    ? totalValue / filteredAndSortedInventory.length 
    : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getAssetTypeBadgeColor = (assetTypeId) => {
    const colors = {
      1: 'bg-blue-100 text-blue-800',     // VEHICULE
      2: 'bg-green-100 text-green-800',   // MOBILIER
      3: 'bg-purple-100 text-purple-800', // ELECTRONIQUE
      4: 'bg-red-100 text-red-800',       // MEDICAMENT
      5: 'bg-yellow-100 text-yellow-800', // FOURNITURE
      6: 'bg-indigo-100 text-indigo-800', // EQUIPEMENT
      7: 'bg-gray-100 text-gray-800'      // IMMOBILIER
    };
    return colors[assetTypeId] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Inventaire Organisationnel</h2>
            <p className="text-gray-600">Résumé de l'inventaire par type et nom d'actif</p>
          </div>
          <div className="flex space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Exporter
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Rapport
            </button>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{filteredAndSortedInventory.length}</div>
            <div className="text-sm text-blue-600">Types d'Actifs</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{totalQuantity}</div>
            <div className="text-sm text-green-600">Quantité Totale</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{formatCurrency(totalValue)}</div>
            <div className="text-sm text-purple-600">Valeur Totale</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">{formatCurrency(averageValue)}</div>
            <div className="text-sm text-orange-600">Valeur Moyenne</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type d'Actif
            </label>
            <select
              value={filterAssetType}
              onChange={(e) => setFilterAssetType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(assetTypes).map(([id, type]) => (
                <option key={id} value={id}>{type.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('asset_type_name')}
                >
                  Type d'Actif
                  {sortField === 'asset_type_name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('asset_name')}
                >
                  Nom de l'Actif
                  {sortField === 'asset_name' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('asset_code')}
                >
                  Code
                  {sortField === 'asset_code' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('quantity')}
                >
                  Quantité
                  {sortField === 'quantity' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('average_unit_cost')}
                >
                  Coût Unitaire Moyen
                  {sortField === 'average_unit_cost' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('total_value')}
                >
                  Valeur Totale
                  {sortField === 'total_value' && (
                    <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedInventory.map((item, index) => (
                <tr 
                  key={`${item.asset_type_id}-${item.asset_name}-${index}`}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getAssetTypeBadgeColor(item.asset_type_id)}`}>
                      {item.asset_type_name}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div className="font-medium">{item.asset_name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {item.asset_code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {item.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(item.average_unit_cost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatCurrency(item.total_value)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">
                      Détails
                    </button>
                    <button className="text-green-600 hover:text-green-900">
                      Historique
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredAndSortedInventory.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500 text-lg">Aucun élément d'inventaire trouvé</div>
              <p className="text-gray-400 mt-2">Ajustez vos filtres ou ajoutez des actifs dans la section Approvisionnement</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
