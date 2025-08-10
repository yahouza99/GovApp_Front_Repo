// Employee Activity DDL and Mock Data based on gov_employe_activity table

// Reference data for activity types
export const activityTypes = {
  1: { name: 'CONGE', label: 'Congé', color: 'blue' },
  2: { name: 'MISSION', label: 'Mission', color: 'green' },
  3: { name: 'DEMISSION', label: 'Démission', color: 'red' },
  4: { name: 'EVALUATION', label: 'Évaluation', color: 'purple' },
  5: { name: 'PROMOTION', label: 'Promotion', color: 'yellow' },
  6: { name: 'ABSENCE', label: 'Absence', color: 'gray' },
  7: { name: 'AFFECTATION', label: 'Affectation', color: 'indigo' }
};

// Reference data for activity status
export const activityStatus = {
  1: { name: 'PENDING', label: 'En attente', color: 'yellow' },
  2: { name: 'APPROVED', label: 'Approuvé', color: 'green' },
  3: { name: 'REJECTED', label: 'Rejeté', color: 'red' },
  4: { name: 'IN_PROGRESS', label: 'En cours', color: 'blue' },
  5: { name: 'COMPLETED', label: 'Terminé', color: 'gray' }
};

// Dynamic column configurations based on activity type
export const activityTypeColumns = {
  1: { // CONGE
    extraColumns: [
      { key: 'conge_type', label: 'Type de Congé', type: 'text' },
      { key: 'replacement_employee', label: 'Remplaçant', type: 'text' },
      { key: 'medical_certificate', label: 'Certificat Médical', type: 'boolean' }
    ]
  },
  2: { // MISSION
    extraColumns: [
      { key: 'mission_location', label: 'Lieu de Mission', type: 'text' },
      { key: 'transport_type', label: 'Transport', type: 'text' },
      { key: 'accommodation', label: 'Hébergement', type: 'text' },
      { key: 'daily_allowance', label: 'Indemnité Journalière', type: 'currency' }
    ]
  },
  3: { // DEMISSION
    extraColumns: [
      { key: 'resignation_reason', label: 'Motif de Démission', type: 'text' },
      { key: 'notice_period', label: 'Préavis (jours)', type: 'number' },
      { key: 'final_work_date', label: 'Dernier Jour de Travail', type: 'date' }
    ]
  },
  4: { // EVALUATION
    extraColumns: [
      { key: 'evaluation_period', label: 'Période d\'Évaluation', type: 'text' },
      { key: 'overall_score', label: 'Note Globale', type: 'number' },
      { key: 'evaluator_name', label: 'Évaluateur', type: 'text' },
      { key: 'next_evaluation_date', label: 'Prochaine Évaluation', type: 'date' }
    ]
  },
  5: { // PROMOTION
    extraColumns: [
      { key: 'previous_position', label: 'Ancien Poste', type: 'text' },
      { key: 'new_position', label: 'Nouveau Poste', type: 'text' },
      { key: 'salary_increase', label: 'Augmentation Salaire', type: 'currency' },
      { key: 'effective_date', label: 'Date d\'Effet', type: 'date' }
    ]
  },
  6: { // ABSENCE
    extraColumns: [
      { key: 'absence_type', label: 'Type d\'Absence', type: 'text' },
      { key: 'is_justified', label: 'Justifiée', type: 'boolean' },
      { key: 'justification_document', label: 'Document Justificatif', type: 'text' }
    ]
  },
  7: { // AFFECTATION
    extraColumns: [
      { key: 'previous_department', label: 'Ancien Service', type: 'text' },
      { key: 'new_department', label: 'Nouveau Service', type: 'text' },
      { key: 'transfer_reason', label: 'Motif de Mutation', type: 'text' },
      { key: 'temporary_assignment', label: 'Affectation Temporaire', type: 'boolean' }
    ]
  }
};

// Mock employee activities data
export const employeeActivities = [
  {
    activity_id: 1,
    gov_employe_id: 1,
    activity_type_id: 1, // CONGE
    org_id: 'ORG001',
    activity_title: 'Congé Annuel - Été 2024',
    activity_description: 'Congé annuel pour les vacances d\'été',
    start_date: '2024-07-15',
    end_date: '2024-07-30',
    amount: null,
    activity_status_id: 2, // APPROVED
    extra_data: {
      conge_type: 'Congé payé',
      replacement_employee: 'Marie Dubois',
      medical_certificate: false
    },
    created: '2024-06-15T10:00:00',
    createdby: 1,
    updated: '2024-06-20T14:30:00',
    updatedby: 2,
    from_user: 1,
    to_user: 2
  },
  {
    activity_id: 2,
    gov_employe_id: 2,
    activity_type_id: 2, // MISSION
    org_id: 'ORG001',
    activity_title: 'Mission Diplomatique - Dakar',
    activity_description: 'Mission officielle au consulat de Dakar',
    start_date: '2024-08-10',
    end_date: '2024-08-20',
    amount: 2500.00,
    activity_status_id: 4, // IN_PROGRESS
    extra_data: {
      mission_location: 'Dakar, Sénégal',
      transport_type: 'Avion',
      accommodation: 'Hôtel Teranga',
      daily_allowance: 125.00
    },
    created: '2024-07-01T09:15:00',
    createdby: 2,
    updated: '2024-08-01T11:20:00',
    updatedby: 3,
    from_user: 2,
    to_user: 3
  },
  {
    activity_id: 3,
    gov_employe_id: 3,
    activity_type_id: 5, // PROMOTION
    org_id: 'ORG001',
    activity_title: 'Promotion - Chef de Service',
    activity_description: 'Promotion au poste de Chef de Service Consulaire',
    start_date: '2024-09-01',
    end_date: null,
    amount: 500.00,
    activity_status_id: 2, // APPROVED
    extra_data: {
      previous_position: 'Agent Consulaire',
      new_position: 'Chef de Service Consulaire',
      salary_increase: 500.00,
      effective_date: '2024-09-01'
    },
    created: '2024-07-15T16:45:00',
    createdby: 3,
    updated: '2024-08-05T10:15:00',
    updatedby: 1,
    from_user: 3,
    to_user: 1
  },
  {
    activity_id: 4,
    gov_employe_id: 1,
    activity_type_id: 4, // EVALUATION
    org_id: 'ORG001',
    activity_title: 'Évaluation Annuelle 2024',
    activity_description: 'Évaluation des performances pour l\'année 2024',
    start_date: '2024-08-01',
    end_date: '2024-08-15',
    amount: null,
    activity_status_id: 1, // PENDING
    extra_data: {
      evaluation_period: 'Janvier 2024 - Juillet 2024',
      overall_score: null,
      evaluator_name: 'Jean Martin',
      next_evaluation_date: '2025-08-01'
    },
    created: '2024-07-25T08:30:00',
    createdby: 1,
    updated: null,
    updatedby: null,
    from_user: 1,
    to_user: 1
  },
  {
    activity_id: 5,
    gov_employe_id: 4,
    activity_type_id: 3, // DEMISSION
    org_id: 'ORG001',
    activity_title: 'Démission - Raisons Personnelles',
    activity_description: 'Démission pour raisons personnelles et familiales',
    start_date: '2024-08-15',
    end_date: '2024-09-15',
    amount: null,
    activity_status_id: 1, // PENDING
    extra_data: {
      resignation_reason: 'Raisons personnelles et familiales',
      notice_period: 30,
      final_work_date: '2024-09-15'
    },
    created: '2024-08-01T14:20:00',
    createdby: 4,
    updated: null,
    updatedby: null,
    from_user: 4,
    to_user: 2
  },
  {
    activity_id: 6,
    gov_employe_id: 2,
    activity_type_id: 7, // AFFECTATION
    org_id: 'ORG001',
    activity_title: 'Affectation - Service Visa',
    activity_description: 'Mutation vers le service des visas',
    start_date: '2024-08-20',
    end_date: null,
    amount: null,
    activity_status_id: 2, // APPROVED
    extra_data: {
      previous_department: 'Service Consulaire',
      new_department: 'Service Visa',
      transfer_reason: 'Réorganisation des services',
      temporary_assignment: false
    },
    created: '2024-07-10T11:00:00',
    createdby: 2,
    updated: '2024-07-20T15:45:00',
    updatedby: 1,
    from_user: 1,
    to_user: 2
  }
];

// Helper function to get employee name by ID (mock data)
export const getEmployeeName = (employeId) => {
  const employees = {
    1: 'Jean Dupont',
    2: 'Marie Martin',
    3: 'Pierre Dubois',
    4: 'Sophie Laurent'
  };
  return employees[employeId] || `Employé ${employeId}`;
};

// Helper function to get user name by ID (mock data)
export const getUserName = (userId) => {
  const users = {
    1: 'Admin Système',
    2: 'Chef RH',
    3: 'Directeur',
    4: 'Secrétaire'
  };
  return users[userId] || `Utilisateur ${userId}`;
};
