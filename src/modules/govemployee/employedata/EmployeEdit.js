import React, { useState, useEffect } from 'react';
import { referenceData } from './employeeddl';

const EmployeEdit = ({ employee, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    gov_employe_matricule: '',
    gov_employe_first_name: '',
    gov_employe_last_name: '',
    gov_employe_email: '',
    gov_employe_telephone: '',
    gov_employe_birth_date: '',
    gov_employe_birth_place: '',
    gov_employe_sex_id: 1,
    gov_employe_marital_status_id: 1,
    gov_employe_nationality_id: 1,
    gov_employe_address: '',
    gov_employe_hired_date: '',
    gov_employe_contract_type_id: 1,
    gov_employe_status_id: 1,
    gov_employe_role_id: 1,
    gov_employe_position_id: 1,
    gov_employe_direction_id: 1,
    gov_employe_service_id: 1,
    gov_employe_salary: 0,
    gov_employe_emergency_contact: '',
    gov_employe_emergency_phone: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form with employee data
  useEffect(() => {
    if (employee) {
      setFormData({
        gov_employe_matricule: employee.gov_employe_matricule || '',
        gov_employe_first_name: employee.gov_employe_first_name || '',
        gov_employe_last_name: employee.gov_employe_last_name || '',
        gov_employe_email: employee.gov_employe_email || '',
        gov_employe_telephone: employee.gov_employe_telephone || '',
        gov_employe_birth_date: employee.gov_employe_birth_date || '',
        gov_employe_birth_place: employee.gov_employe_birth_place || '',
        gov_employe_sex_id: employee.gov_employe_sex_id || 1,
        gov_employe_marital_status_id: employee.gov_employe_marital_status_id || 1,
        gov_employe_nationality_id: employee.gov_employe_nationality_id || 1,
        gov_employe_address: employee.gov_employe_address || '',
        gov_employe_hired_date: employee.gov_employe_hired_date || '',
        gov_employe_contract_type_id: employee.gov_employe_contract_type_id || 1,
        gov_employe_status_id: employee.gov_employe_status_id || 1,
        gov_employe_role_id: employee.gov_employe_role_id || 1,
        gov_employe_position_id: employee.gov_employe_position_id || 1,
        gov_employe_direction_id: employee.gov_employe_direction_id || 1,
        gov_employe_service_id: employee.gov_employe_service_id || 1,
        gov_employe_salary: employee.gov_employe_salary || 0,
        gov_employe_emergency_contact: employee.gov_employe_emergency_contact || '',
        gov_employe_emergency_phone: employee.gov_employe_emergency_phone || ''
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation
    if (!formData.gov_employe_matricule.trim()) {
      newErrors.gov_employe_matricule = 'Le matricule est requis';
    }
    if (!formData.gov_employe_first_name.trim()) {
      newErrors.gov_employe_first_name = 'Le prénom est requis';
    }
    if (!formData.gov_employe_last_name.trim()) {
      newErrors.gov_employe_last_name = 'Le nom est requis';
    }
    if (!formData.gov_employe_email.trim()) {
      newErrors.gov_employe_email = 'L\'email est requis';
    } else if (!/\S+@\S+\.\S+/.test(formData.gov_employe_email)) {
      newErrors.gov_employe_email = 'Format d\'email invalide';
    }
    if (!formData.gov_employe_telephone.trim()) {
      newErrors.gov_employe_telephone = 'Le téléphone est requis';
    }
    if (!formData.gov_employe_birth_date) {
      newErrors.gov_employe_birth_date = 'La date de naissance est requise';
    }
    if (!formData.gov_employe_hired_date) {
      newErrors.gov_employe_hired_date = 'La date d\'embauche est requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Call the onSave callback with updated employee data
      onSave({
        ...employee,
        ...formData,
        updated: new Date().toISOString(),
        updatedby: 1 // Current user ID
      });
      
    } catch (error) {
      console.error('Error saving employee:', error);
      alert('Erreur lors de la sauvegarde. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return dateString.split('T')[0]; // Extract YYYY-MM-DD from ISO string
  };

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {employee ? 'Édition Employé' : 'Ajouter Employé'}
            </h2>
            <p className="text-gray-600">
              {employee 
                ? `Modification des informations de ${employee.gov_employe_first_name} ${employee.gov_employe_last_name}`
                : 'Création d\'un nouvel employé'
              }
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Informations personnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informations Personnelles
            </h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Matricule *
              </label>
              <input
                type="text"
                name="gov_employe_matricule"
                value={formData.gov_employe_matricule}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_matricule ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_matricule && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_matricule}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                name="gov_employe_first_name"
                value={formData.gov_employe_first_name}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_first_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_first_name && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                name="gov_employe_last_name"
                value={formData.gov_employe_last_name}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_last_name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_last_name && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_last_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="gov_employe_email"
                value={formData.gov_employe_email}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_email && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone *
              </label>
              <input
                type="tel"
                name="gov_employe_telephone"
                value={formData.gov_employe_telephone}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_telephone ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_telephone && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_telephone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date de naissance *
              </label>
              <input
                type="date"
                name="gov_employe_birth_date"
                value={formatDate(formData.gov_employe_birth_date)}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_birth_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_birth_date && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_birth_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu de naissance
              </label>
              <input
                type="text"
                name="gov_employe_birth_place"
                value={formData.gov_employe_birth_place}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexe
              </label>
              <select
                name="gov_employe_sex_id"
                value={formData.gov_employe_sex_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.sex).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                État civil
              </label>
              <select
                name="gov_employe_marital_status_id"
                value={formData.gov_employe_marital_status_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.maritalStatus).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nationalité
              </label>
              <select
                name="gov_employe_nationality_id"
                value={formData.gov_employe_nationality_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.nationality).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Adresse
              </label>
              <textarea
                name="gov_employe_address"
                value={formData.gov_employe_address}
                onChange={handleInputChange}
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Informations professionnelles */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">
              Informations Professionnelles
            </h3>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date d'embauche *
              </label>
              <input
                type="date"
                name="gov_employe_hired_date"
                value={formatDate(formData.gov_employe_hired_date)}
                onChange={handleInputChange}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.gov_employe_hired_date ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.gov_employe_hired_date && (
                <p className="text-red-500 text-sm mt-1">{errors.gov_employe_hired_date}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type de contrat
              </label>
              <select
                name="gov_employe_contract_type_id"
                value={formData.gov_employe_contract_type_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.contractType).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                name="gov_employe_status_id"
                value={formData.gov_employe_status_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.status).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                name="gov_employe_role_id"
                value={formData.gov_employe_role_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.roles).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Poste
              </label>
              <select
                name="gov_employe_position_id"
                value={formData.gov_employe_position_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.positions).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Direction
              </label>
              <select
                name="gov_employe_direction_id"
                value={formData.gov_employe_direction_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.directions).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service
              </label>
              <select
                name="gov_employe_service_id"
                value={formData.gov_employe_service_id}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {Object.entries(referenceData.services).map(([id, label]) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Salaire
              </label>
              <input
                type="number"
                name="gov_employe_salary"
                value={formData.gov_employe_salary}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Contact d'urgence
              </label>
              <input
                type="text"
                name="gov_employe_emergency_contact"
                value={formData.gov_employe_emergency_contact}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone d'urgence
              </label>
              <input
                type="tel"
                name="gov_employe_emergency_phone"
                value={formData.gov_employe_emergency_phone}
                onChange={handleInputChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>
        </div>
      </form>

      {/* Action buttons */}
      <div className="p-4 border-t border-gray-200 flex-shrink-0">
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Annuler
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sauvegarde...
              </>
            ) : (
              'Sauvegarder'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeEdit;
