import React, { useState, useMemo } from 'react';
import { 
  employeeActivities, 
  activityTypes, 
  activityStatus, 
  activityTypeColumns,
  getEmployeeName,
  getUserName 
} from './employeActivityDDL';
import EmployeActivityForm from './EmployeActivityForm';

const EmployeActivityTable = () => {
  const [activities, setActivities] = useState(employeeActivities);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [filterActivityType, setFilterActivityType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [sortField, setSortField] = useState('created');
  const [sortDirection, setSortDirection] = useState('desc');
  const [isEditing, setIsEditing] = useState(false);
  const [activityToEdit, setActivityToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Filter and sort activities
  const filteredAndSortedActivities = useMemo(() => {
    let filtered = activities;

    // Filter by activity type
    if (filterActivityType) {
      filtered = filtered.filter(activity => 
        activity.activity_type_id === parseInt(filterActivityType)
      );
    }

    // Filter by status
    if (filterStatus) {
      filtered = filtered.filter(activity => 
        activity.activity_status_id === parseInt(filterStatus)
      );
    }

    // Sort activities
    return filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'employee_name') {
        aValue = getEmployeeName(a.gov_employe_id);
        bValue = getEmployeeName(b.gov_employe_id);
      } else if (sortField === 'activity_type') {
        aValue = activityTypes[a.activity_type_id]?.label || '';
        bValue = activityTypes[b.activity_type_id]?.label || '';
      } else if (sortField === 'status') {
        aValue = activityStatus[a.activity_status_id]?.label || '';
        bValue = activityStatus[b.activity_status_id]?.label || '';
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [activities, filterActivityType, filterStatus, sortField, sortDirection]);

  // Get dynamic columns based on selected activity type filter
  const getDynamicColumns = () => {
    if (!filterActivityType) return [];
    return activityTypeColumns[parseInt(filterActivityType)]?.extraColumns || [];
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
  const handleAddActivity = () => {
    setIsAdding(true);
    setActivityToEdit(null);
  };

  const handleEditActivity = (activity) => {
    setIsEditing(true);
    setActivityToEdit(activity);
  };

  const handleViewActivity = (activity) => {
    // For now, just select the activity - could open a view modal later
    setSelectedActivity(activity);
  };

  const handleDeleteActivity = (activity) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette opération ?')) {
      setActivities(prev => prev.filter(a => a.activity_id !== activity.activity_id));
      if (selectedActivity?.activity_id === activity.activity_id) {
        setSelectedActivity(null);
      }
    }
  };

  const handleSaveEdit = (updatedActivity) => {
    setActivities(prev => 
      prev.map(activity => 
        activity.activity_id === updatedActivity.activity_id 
          ? updatedActivity 
          : activity
      )
    );
    setIsEditing(false);
    setActivityToEdit(null);
  };

  const handleSaveNewActivity = (newActivity) => {
    setActivities(prev => [...prev, newActivity]);
    setIsAdding(false);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setActivityToEdit(null);
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
    const status = activityStatus[statusId];
    if (!status) return null;

    const colorClasses = {
      yellow: 'bg-yellow-100 text-yellow-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      blue: 'bg-blue-100 text-blue-800',
      gray: 'bg-gray-100 text-gray-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[status.color] || colorClasses.gray}`}>
        {status.label}
      </span>
    );
  };

  const getActivityTypeBadge = (typeId) => {
    const type = activityTypes[typeId];
    if (!type) return null;

    const colorClasses = {
      blue: 'bg-blue-100 text-blue-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      purple: 'bg-purple-100 text-purple-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      gray: 'bg-gray-100 text-gray-800',
      indigo: 'bg-indigo-100 text-indigo-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[type.color] || colorClasses.gray}`}>
        {type.label}
      </span>
    );
  };

  const dynamicColumns = getDynamicColumns();

  // Conditional rendering for form modes
  if (isEditing && activityToEdit) {
    return (
      <EmployeActivityForm
        activity={activityToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (isAdding) {
    return (
      <EmployeActivityForm
        activity={null}
        onSave={handleSaveNewActivity}
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
           {/*<h2 className="text-2xl font-bold text-gray-900">Opérations des Employés</h2> */}
            <p className="text-gray-600">Gestion unifiée de toutes les opérations des employés</p>
          </div>
          <button 
            onClick={handleAddActivity}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Nouvelle Opération
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Type d'Opération</label>
            <select
              value={filterActivityType}
              onChange={(e) => setFilterActivityType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les types</option>
              {Object.entries(activityTypes).map(([id, type]) => (
                <option key={id} value={id}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1 min-w-48">
            <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(activityStatus).map(([id, status]) => (
                <option key={id} value={id}>{status.label}</option>
              ))}
            </select>
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
                onClick={() => handleSort('activity_id')}
              >
                ID
                {sortField === 'activity_id' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('employee_name')}
              >
                Employé
                {sortField === 'employee_name' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('activity_type')}
              >
                Type
                {sortField === 'activity_type' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('activity_title')}
              >
                Titre
                {sortField === 'activity_title' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('start_date')}
              >
                Date Début
                {sortField === 'start_date' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('end_date')}
              >
                Date Fin
                {sortField === 'end_date' && (
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
              
              {/* Dynamic columns based on activity type filter */}
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
            {filteredAndSortedActivities.map((activity) => (
              <tr 
                key={activity.activity_id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedActivity?.activity_id === activity.activity_id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedActivity(activity)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activity.activity_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getEmployeeName(activity.gov_employe_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getActivityTypeBadge(activity.activity_type_id)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                  {activity.activity_title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activity.start_date ? new Date(activity.start_date).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {activity.end_date ? new Date(activity.end_date).toLocaleDateString('fr-FR') : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getStatusBadge(activity.activity_status_id)}
                </td>
                
                {/* Dynamic columns data */}
                {dynamicColumns.map((column) => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatValue(activity.extra_data?.[column.key], column.type)}
                  </td>
                ))}
                
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditActivity(activity);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    Éditer
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteActivity(activity);
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
        
        {filteredAndSortedActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p>Aucune activité trouvée</p>
            <p className="text-sm">Ajustez vos filtres ou créez une nouvelle activité.</p>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Total: {filteredAndSortedActivities.length} activité(s)</span>
          <span>
            En attente: {filteredAndSortedActivities.filter(a => a.activity_status_id === 1).length} | 
            Approuvé: {filteredAndSortedActivities.filter(a => a.activity_status_id === 2).length} | 
            En cours: {filteredAndSortedActivities.filter(a => a.activity_status_id === 4).length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeActivityTable;
