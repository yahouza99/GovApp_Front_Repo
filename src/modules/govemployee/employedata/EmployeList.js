import React, { useState, useMemo } from 'react';
import { employeeddl, referenceData } from './employeeddl';
import EmployeEdit from './EmployeEdit';

const EmployeList = () => {
  const [employees, setEmployees] = useState(employeeddl);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [filterField, setFilterField] = useState('gov_employe_last_name');
  const [filterValue, setFilterValue] = useState('');
  const [sortField, setSortField] = useState('gov_employe_last_name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [isEditing, setIsEditing] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = employees;

    // Apply filter
    if (filterValue) {
      filtered = employees.filter(employee => {
        const fieldValue = employee[filterField]?.toString().toLowerCase() || '';
        return fieldValue.includes(filterValue.toLowerCase());
      });
    }

    // Apply sort
    filtered.sort((a, b) => {
      const aValue = a[sortField]?.toString().toLowerCase() || '';
      const bValue = b[sortField]?.toString().toLowerCase() || '';
      
      if (sortDirection === 'asc') {
        return aValue.localeCompare(bValue);
      } else {
        return bValue.localeCompare(aValue);
      }
    });

    return filtered;
  }, [employees, filterField, filterValue, sortField, sortDirection]);

  const handleRowClick = (employee) => {
    setSelectedEmployee(selectedEmployee?.gov_employe_id === employee.gov_employe_id ? null : employee);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleEdit = () => {
    if (selectedEmployee) {
      setEmployeeToEdit(selectedEmployee);
      setIsEditing(true);
    }
  };

  const handleSaveEdit = (updatedEmployee) => {
    // Update the employee in the list
    setEmployees(prevEmployees => 
      prevEmployees.map(emp => 
        emp.gov_employe_id === updatedEmployee.gov_employe_id ? updatedEmployee : emp
      )
    );
    
    // Update selected employee if it's the same one
    if (selectedEmployee?.gov_employe_id === updatedEmployee.gov_employe_id) {
      setSelectedEmployee(updatedEmployee);
    }
    
    // Close edit mode
    setIsEditing(false);
    setEmployeeToEdit(null);
    
    alert('Employé mis à jour avec succès!');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEmployeeToEdit(null);
  };

  const handleAddEmployee = () => {
    setIsAdding(true);
  };

  const handleSaveNewEmployee = (newEmployee) => {
    // Generate new ID (in real app, this would come from backend)
    const newId = Math.max(...employees.map(emp => emp.gov_employe_id), 0) + 1;
    
    const employeeWithId = {
      ...newEmployee,
      gov_employe_id: newId,
      created: new Date().toISOString(),
      createdby: 1, // Current user ID
      updated: new Date().toISOString(),
      updatedby: 1
    };
    
    // Add the new employee to the list
    setEmployees(prevEmployees => [...prevEmployees, employeeWithId]);
    
    // Close add mode
    setIsAdding(false);
    
    alert('Nouvel employé ajouté avec succès!');
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
  };

  const handleDelete = () => {
    if (selectedEmployee) {
      if (window.confirm(`Êtes-vous sûr de vouloir supprimer l'employé ${selectedEmployee.gov_employe_first_name} ${selectedEmployee.gov_employe_last_name} ?`)) {
        setEmployees(employees.filter(emp => emp.gov_employe_id !== selectedEmployee.gov_employe_id));
        setSelectedEmployee(null);
        alert('Employé supprimé avec succès');
      }
    }
  };

  // Helper functions to get reference data labels
  const getSexLabel = (sexId) => referenceData.sex[sexId] || 'N/A';
  const getMaritalStatusLabel = (statusId) => referenceData.maritalStatus[statusId] || 'N/A';
  const getNationalityLabel = (nationalityId) => referenceData.nationality[nationalityId] || 'N/A';
  const getContractTypeLabel = (contractId) => referenceData.contractType[contractId] || 'N/A';
  const getStatusLabel = (statusId) => referenceData.status[statusId] || 'N/A';
  const getRoleLabel = (roleId) => referenceData.roles[roleId] || 'N/A';
  const getPositionLabel = (positionId) => referenceData.positions[positionId] || 'N/A';
  const getDirectionLabel = (directionId) => referenceData.directions[directionId] || 'N/A';
  const getServiceLabel = (serviceId) => referenceData.services[serviceId] || 'N/A';

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getSortIcon = (field) => {
    if (sortField !== field) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  // If in edit mode, render the EmployeEdit component
  if (isEditing && employeeToEdit) {
    return (
      <EmployeEdit
        employee={employeeToEdit}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  // If in add mode, render the EmployeEdit component with empty employee
  if (isAdding) {
    return (
      <EmployeEdit
        employee={null}
        onSave={handleSaveNewEmployee}
        onCancel={handleCancelAdd}
      />
    );
  }

  return (
    <div className="h-full flex flex-col bg-white rounded-lg shadow-sm">
      <div className="p-2 flex-shrink-0">
        <div className="flex items-center justify-between mb-1">
          <div>
           {/**  <h2 className="text-2xl font-bold text-gray-900">Liste des Employés</h2> */}
            <p className="text-gray-600">Gestion et consultation des données des employés</p>
          </div>
          <button
            onClick={handleAddEmployee}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Ajouter
          </button>
        </div>
      </div>
      
      {/* Action Buttons - Show when employee is selected */}
      {selectedEmployee && (
        <div className="mx-6 mb-2 p-1 bg-green-50 border border-green-200 rounded-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-green-800 font-medium">
                Employé sélectionné: {selectedEmployee.gov_employe_first_name} {selectedEmployee.gov_employe_last_name}
              </span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Éditer
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search and Filter Controls */}
      <div className="px-6 mb-4 flex-shrink-0">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Filtrer par:</label>
            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            >
              <option value="gov_employe_last_name">Nom</option>
              <option value="gov_employe_first_name">Prénom</option>
              <option value="gov_employe_matricule">Matricule</option>
              <option value="gov_employe_email">Email</option>
              <option value="gov_employe_telephone">Téléphone</option>
              <option value="gov_employe_birth_place">Lieu de naissance</option>
            </select>
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder={`Rechercher par ${filterField}...`}
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>
          <div className="text-sm text-gray-600 flex items-center">
            {filteredAndSortedEmployees.length} employé(s) trouvé(s)
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="flex-1 mx-6 mb-4 bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col">
        <div className="flex-1 overflow-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_matricule')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Matricule</span>
                    {getSortIcon('gov_employe_matricule')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_last_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Nom</span>
                    {getSortIcon('gov_employe_last_name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_first_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Prénom</span>
                    {getSortIcon('gov_employe_first_name')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_position_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Poste</span>
                    {getSortIcon('gov_employe_position_id')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_direction_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Direction</span>
                    {getSortIcon('gov_employe_direction_id')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Email</span>
                    {getSortIcon('gov_employe_email')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_telephone')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Téléphone</span>
                    {getSortIcon('gov_employe_telephone')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_hired_date')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Date d'embauche</span>
                    {getSortIcon('gov_employe_hired_date')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('gov_employe_status_id')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Statut</span>
                    {getSortIcon('gov_employe_status_id')}
                  </div>
                </th>
              </tr>
            </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedEmployees.map((employee) => (
              <tr
                key={employee.gov_employe_id}
                onClick={() => handleRowClick(employee)}
                className={`cursor-pointer transition-colors ${
                  selectedEmployee?.gov_employe_id === employee.gov_employe_id
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'hover:bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.gov_employe_matricule}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                  {employee.gov_employe_last_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.gov_employe_first_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getPositionLabel(employee.gov_employe_position_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {getDirectionLabel(employee.gov_employe_direction_id)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <a href={`mailto:${employee.gov_employe_email}`} className="text-green-600 hover:text-green-800">
                    {employee.gov_employe_email}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.gov_employe_telephone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {formatDate(employee.gov_employe_hired_date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.gov_employe_status_id === 1 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {getStatusLabel(employee.gov_employe_status_id)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredAndSortedEmployees.length === 0 && (
          <div className="text-center py-8">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun employé trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun employé ne correspond aux critères de recherche.
            </p>
          </div>
        )}
        </div>
      </div>

      {/* Table Info */}
      <div className="px-6 py-4 flex-shrink-0 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between text-sm text-gray-700">
          <div>
            Affichage de {filteredAndSortedEmployees.length} employé(s) sur {employees.length} total
          </div>
          <div className="flex items-center space-x-2">
            <span>Trié par: {sortField.replace('gov_employe_', '').replace('_', ' ')} ({sortDirection === 'asc' ? 'croissant' : 'décroissant'})</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeList;
