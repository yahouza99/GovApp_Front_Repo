import React, { useEffect, useState } from 'react';
import {
  communicationTypes,
  communicationStatus,
  communicationTypeColumns,
} from './communicationDDL';

const CommunicationForm = ({ communication, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    org_id: 'ORG-001',
    communication_type_id: '',
    communication_status_id: 1, // Brouillon par défaut
    title: '',
    message: '',
    start_date: '',
    end_date: '',
    extra_data: {},
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (communication) {
      setFormData({
        org_id: communication.org_id || 'ORG-001',
        communication_type_id: communication.communication_type_id ?? '',
        communication_status_id: communication.communication_status_id ?? 1,
        title: communication.title || '',
        message: communication.message || '',
        start_date: communication.start_date || '',
        end_date: communication.end_date || '',
        extra_data: communication.extra_data || {},
      });
    }
  }, [communication]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleExtraDataChange = (key, value, type) => {
    let processed = value;
    if (type === 'boolean') processed = value === 'true';
    else if (type === 'number' || type === 'currency') processed = value ? parseFloat(value) : '';

    setFormData((prev) => ({
      ...prev,
      extra_data: {
        ...prev.extra_data,
        [key]: processed,
      },
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.communication_type_id) newErrors.communication_type_id = "Type requis";
    if (!formData.title.trim()) newErrors.title = "Titre requis";
    if (!formData.start_date) newErrors.start_date = "Date début requise";
    if (formData.end_date && formData.start_date && new Date(formData.end_date) < new Date(formData.start_date)) {
      newErrors.end_date = "La date de fin doit être postérieure ou égale à la date de début";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Simuler un appel API
      await new Promise((res) => setTimeout(res, 800));

      const payload = {
        ...formData,
        org_communication_id: communication?.org_communication_id || Date.now(),
        created: communication?.created || new Date().toISOString(),
        createdby: communication?.createdby || 1,
        updated: new Date().toISOString(),
        updatedby: 1,
      };

      onSave && onSave(payload);
    } catch (err) {
      console.error('Error saving communication:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getDynamicFields = () => {
    if (!formData.communication_type_id) return [];
    return communicationTypeColumns[parseInt(formData.communication_type_id, 10)]?.extraColumns || [];
  };

  const renderDynamicField = (field) => {
    const value = formData.extra_data?.[field.key] ?? '';

    switch (field.type) {
      case 'boolean':
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
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
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
            <input
              type="number"
              step={field.type === 'currency' ? '0.01' : '1'}
              value={value}
              onChange={(e) => handleExtraDataChange(field.key, e.target.value, field.type)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        );
      default:
        return (
          <div key={field.key} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">{field.label}</label>
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
              {communication ? 'Éditer la Communication' : 'Nouvelle Communication'}
            </h2>
            <p className="text-gray-600">
              {communication ? 'Modifier les détails de la communication' : "Créer une nouvelle communication"}
            </p>
          </div>
          <button onClick={onCancel} className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">✕</button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations Générales</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type *</label>
                <select
                  name="communication_type_id"
                  value={formData.communication_type_id}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.communication_type_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionner un type</option>
                  {Object.entries(communicationTypes).map(([id, t]) => (
                    <option key={id} value={id}>{t.label}</option>
                  ))}
                </select>
                {errors.communication_type_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.communication_type_id}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Statut</label>
                <select
                  name="communication_status_id"
                  value={formData.communication_status_id}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {Object.entries(communicationStatus).map(([id, s]) => (
                    <option key={id} value={id}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Début *</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Fin</label>
                <input
                  type="date"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                {errors.end_date && (
                  <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
                )}
              </div>
            </div>
          </div>

          {/* Champs dynamiques selon le Type */}
          {dynamicFields.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Détails Spécifiques - {communicationTypes[formData.communication_type_id]?.label}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dynamicFields.map((field) => renderDynamicField(field))}
              </div>
            </div>
          )}

          {/* Actions */}
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
              {isLoading ? 'Enregistrement...' : communication ? 'Mettre à jour' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CommunicationForm;
