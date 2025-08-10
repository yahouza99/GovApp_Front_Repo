import React, { useState, useMemo } from 'react';
import { 
  organizationAssets, 
  assetTypes, 
  assetStatus, 
  assetTypeColumns,
  getOrganizationName,
  getUserName 
} from './assetDDL';
import AssetForm from './AssetForm';

const AssetTable = () => {
  const [assets, setAssets] = useState(organizationAssets);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [filterAssetType, setFilterAssetType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Filter and sort assets
  const filteredAndSortedAssets = useMemo(() => {
    let filtered = assets;

    // Filter by asset type
    if (filterAssetType) {
      filtered = filtered.filter(asset => 
        asset.asset_type_id === parseInt(filterAssetType)
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(asset => 
        asset.asset_status_id === parseInt(filterStatus)
      );
    }

    // Filter by date range
    if (filterDateFrom) {
      filtered = filtered.filter(asset => 
        new Date(asset.acquisition_date) >= new Date(filterDateFrom)
      );
    }
    if (filterDateTo) {
      filtered = filtered.filter(asset => 
        new Date(asset.acquisition_date) <= new Date(filterDateTo)
      );
    }

    // Sort assets
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'asset_type') {
        aValue = assetTypes[a.asset_type_id]?.label || '';
        bValue = assetTypes[b.asset_type_id]?.label || '';
      } else if (sortField === 'status') {
        aValue = assetStatus[a.asset_status_id]?.label || '';
        bValue = assetStatus[b.asset_status_id]?.label || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [assets, filterAssetType, filterStatus, filterDateFrom, filterDateTo, sortField, sortDirection]);

  // Get dynamic columns based on selected asset type filter
  const getDynamicColumns = () => {
    if (!filterAssetType) return [];
    return assetTypeColumns[parseInt(filterAssetType)]?.extraColumns || [];
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Handler functions for form operations
  const handleAddAsset = () => {
    setIsAdding(true);
    setAssetToEdit(null);
  };

  const handleEditAsset = (asset) => {
    setIsEditing(true);
    setAssetToEdit(asset);
  };

  const handleDeleteAsset = (asset) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet actif ?')) {
      setAssets(prev => prev.filter(a => a.asset_id !== asset.asset_id));
      if (selectedAsset?.asset_id === asset.asset_id) {
        setSelectedAsset(null);
      }
    }
  };

  const handleSaveEdit = (updatedAsset) => {
    setAssets(prev => 
      prev.map(asset => 
        asset.asset_id === updatedAsset.asset_id 
          ? updatedAsset 
          : asset
      )
    );
    setIsEditing(false);
    setAssetToEdit(null);
  };

  const handleSaveNewAsset = (newAsset) => {
    setAssets(prev => [...prev, newAsset]);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setAssetToEdit(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const formatValue = (value, type) => {
    if (value === null || value === undefined) return '-';
    
    switch (type) {
      case 'boolean':
        return value ? 'Oui' : 'Non';
      case 'currency':
        return new Intl.NumberFormat('fr-FR', {
          style: 'currency',
          currency: 'EUR'
        }).format(value);
      case 'date':
        return new Date(value).toLocaleDateString('fr-FR');
      case 'number':
        return value.toString();
      default:
        return value.toString();
    }
  };

  const getStatusBadge = (statusId) => {
    const status = assetStatus[statusId];
    if (!status) return null;

    const colorClasses = {
      green: 'bg-green-100 text-green-800',
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800',
      red: 'bg-red-100 text-red-800',
      orange: 'bg-orange-100 text-orange-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status.color] || colorClasses.gray}`}>
        {status.label}
      </span>
    );
  };

  const getAssetTypeBadge = (typeId) => {
    const type = assetTypes[typeId];
    if (!type) return null;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      purple: 'bg-purple-100 text-purple-800',
      red: 'bg-red-100 text-red-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[type.color] || colorClasses.gray}`}>
        {type.label}
      </span>
    );
  };

  const dynamicColumns = getDynamicColumns();

  // Conditional rendering for form modes
  if (isEditing && assetToEdit) {
    return (
      <AssetForm
        asset={assetToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (isAdding) {
    return (
      <AssetForm
        asset={null}
        onSave={handleSaveNewAsset}
        onCancel={handleCancelAdd}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
          <div>
            {/*<h2 className="text-2xl font-bold text-gray-900">Gestion des Approvisionnements</h2>*/}
            <p className="text-gray-600">Inventaire et gestion des actifs organisationnels</p>
          </div>
          <button 
            onClick={handleAddAsset}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Ajouter un Actif
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'Actif</label>
            <select
              value={filterAssetType}
              onChange={(e) => setFilterAssetType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(assetTypes).map(([id, type]) => (
                <option key={id} value={id}>{type.label}</option>
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
              <option value="">Tous les statuts</option>
              {Object.entries(assetStatus).map(([id, status]) => (
                <option key={id} value={id}>{status.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Acquisition (De)</label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date Acquisition (À)</label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
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
                onClick={() => handleSort('asset_type')}
              >
                Type
                {sortField === 'asset_type' && (
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
                onClick={() => handleSort('acquisition_cost')}
              >
                Coût
                {sortField === 'acquisition_cost' && (
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
                onClick={() => handleSort('location')}
              >
                Localisation
                {sortField === 'location' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('acquisition_date')}
              >
                Date Acquisition
                {sortField === 'acquisition_date' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                Statut
                {sortField === 'status' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              
              {/* Dynamic columns based on asset type filter */}
              {dynamicColumns.map((column) => (
                <th 
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
              
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedAssets.map((asset) => (
              <tr 
                key={asset.asset_id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedAsset?.asset_id === asset.asset_id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedAsset(asset)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getAssetTypeBadge(asset.asset_type_id)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                  <div className="flex items-center">
                    {asset.asset_image_url && (
                      <div className="flex-shrink-0 h-8 w-8 mr-3">
                        <img 
                          className="h-8 w-8 rounded object-cover" 
                          src={asset.asset_image_url} 
                          alt={asset.asset_name}
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    <div className="truncate">{asset.asset_name}</div>
                  </div>
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                  {asset.asset_code || '-'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {asset.acquisition_cost ? formatValue(asset.acquisition_cost, 'currency') : '-'}
                </td>
                
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900 font-medium">
                  {asset.quantity || 0}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {asset.location || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {asset.acquisition_date ? new Date(asset.acquisition_date).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getStatusBadge(asset.asset_status_id)}
                </td>
                
                
                {/* Dynamic columns data */}
                {dynamicColumns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(asset.extra_data?.[column.key], column.type)}
                  </td>
                ))}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAsset(asset);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAsset(asset);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredAndSortedAssets.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p>Aucun actif trouvé</p>
            <p className="text-sm">Ajustez vos filtres ou créez un nouvel actif.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">Total: </span>
            <span className="font-semibold">{filteredAndSortedAssets.length} actif(s)</span>
          </div>
          <div>
            <span className="text-gray-600">Valeur totale: </span>
            <span className="font-semibold">
              {formatValue(
                filteredAndSortedAssets.reduce((sum, asset) => sum + (asset.acquisition_cost || 0), 0),
                'currency'
              )}
            </span>
          </div>
          <div className="flex space-x-4">
            <span>
              <span className="text-green-600">Disponible: </span>
              <span className="font-semibold">{filteredAndSortedAssets.filter(a => a.asset_status_id === 1).length}</span>
            </span>
            <span>
              <span className="text-blue-600">En utilisation: </span>
              <span className="font-semibold">{filteredAndSortedAssets.filter(a => a.asset_status_id === 2).length}</span>
            </span>
            <span>
              <span className="text-yellow-600">Maintenance: </span>
              <span className="font-semibold">{filteredAndSortedAssets.filter(a => a.asset_status_id === 3).length}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetTable;
