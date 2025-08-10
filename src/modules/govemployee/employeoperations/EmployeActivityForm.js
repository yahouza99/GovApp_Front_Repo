import React, { useState, useEffect } from 'react';
import { 
  activityTypes, 
  activityStatus, 
  activityTypeColumns,
  getEmployeeName,
  getUserName 
} from './employeActivityDDL';

const EmployeActivityForm = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    gov_employe_id: '',
    activity_type_id: '',
    org_id: 'ORG001',
    activity_title: '',
    activity_description: '',
    start_date: '',
    end_date: '',
    amount: '',
    activity_status_id: 1, // PENDING by default
    extra_data: {},
    from_user: 1,
    to_user: 1
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Mock employee data for dropdown
  const employees = [
    { id: 1, name: 'Jean Dupont' },
    { id: 2, name: 'Marie Martin' },
    { id: 3, name: 'Pierre Dubois' },
    { id: 4, name: 'Sophie Laurent' }
  ];

  useEffect(() => {
    if (activity) {
      setFormData({
        gov_employe_id: activity.gov_employe_id,
        activity_type_id: activity.activity_type_id,
        org_id: activity.org_id || 'ORG001',
        activity_title: activity.activity_title,
        activity_description: activity.activity_description || '',
        start_date: activity.start_date || '',
        end_date: activity.end_date || '',
        amount: activity.amount || '',
        activity_status_id: activity.activity_status_id,
        extra_data: activity.extra_data || {},
        from_user: activity.from_user || 1,
        to_user: activity.to_user || 1
      });
    }
  }, [activity]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleExtraDataChange = (key, value, type) => {
    let processedValue = value;
    
    if (type === 'boolean') {
      processedValue = value === 'true';
    } else if (type === 'number' || type === 'currency') {
      processedValue = value ? parseFloat(value) : null;
    }

    setFormData(prev => ({
      ...prev,
      extra_data: {
        ...prev.extra_data,
        [key]: processedValue
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.gov_employe_id) {
      newErrors.gov_employe_id = 'Employé requis';
    }
    if (!formData.activity_type_id) {
      newErrors.activity_type_id = 'Type d\'opération requis';
    }
    if (!formData.activity_title.trim()) {
      newErrors.activity_title = 'Titre requis';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Date de début requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const operationData = {
        ...formData,
        activity_id: activity?.activity_id || Date.now(), // Generate ID for new operations
        created: activity?.created || new Date().toISOString(),
        createdby: activity?.createdby || 1,
        updated: new Date().toISOString(),
        updatedby: 1
      };

      onSave(operationData);
    } catch (error) {
      console.error('Error saving operation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDynamicFields = () => {
    if (!formData.activity_type_id) return [];
    return activityTypeColumns[parseInt(formData.activity_type_id)]?.extraColumns || [];
  };

  const renderDynamicField = (field) => {
    const value = formData.extra_data[field.key] || '';
    
    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <select
              value={value.toString()}
              onChange={(e) => handleExtraDataChange(field.key, e.target.value, field.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Sélectionner</option>
              <option value="true">Oui</option>
              <option value="false">Non</option>
            </select>
          </div>
        );
      
      case 'date':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="date"
              value={value}
              onChange={(e) => handleExtraDataChange(field.key, e.target.value, field.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      
      case 'number':
      case 'currency':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="number"
              step={field.type === 'currency' ? '0.01' : '1'}
              value={value}
              onChange={(e) => handleExtraDataChange(field.key, e.target.value, field.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      
      default: // text
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {field.label}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleExtraDataChange(field.key, e.target.value, field.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
    }
  };

  const dynamicFields = getDynamicFields();

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {activity ? 'Éditer l\'Opération' : 'Nouvelle Opération'}
            </h2>
            <p className="text-gray-600">
              {activity ? 'Modifier les détails de l\'opération' : 'Créer une nouvelle opération pour un employé'}
            </p>
          </div>
          <button
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employé *
                </label>
                <select
                  name="gov_employe_id"
                  value={formData.gov_employe_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.gov_employe_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un employé</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>{emp.name}</option>
                  ))}
                </select>
                {errors.gov_employe_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.gov_employe_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type d'Opération *
                </label>
                <select
                  name="activity_type_id"
                  value={formData.activity_type_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.activity_type_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un type</option>
                  {Object.entries(activityTypes).map(([id, type]) => (
                    <option key={id} value={id}>{type.label}</option>
                  ))}
                </select>
                {errors.activity_type_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.activity_type_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre *
                </label>
                <input
                  type="text"
                  name="activity_title"
                  value={formData.activity_title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.activity_title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.activity_title && (
                  <p className="text-red-500 text-sm mt-1">{errors.activity_title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Statut
                </label>
                <select
                  name="activity_status_id"
                  value={formData.activity_status_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.entries(activityStatus).map(([id, status]) => (
                    <option key={id} value={id}>{status.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Début *
                </label>
                <input
                  type="date"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.start_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.start_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.start_date}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date de Fin
                </label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="activity_description"
                  value={formData.activity_description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Fields based on Activity Type */}
          {dynamicFields.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails Spécifiques - {activityTypes[formData.activity_type_id]?.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicFields.map(field => renderDynamicField(field))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Enregistrement...' : (activity ? 'Mettre à jour' : 'Créer')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeActivityForm;
