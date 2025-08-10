// Asset DDL and Mock Data based on org_asset table

// Reference data for asset types
export const assetTypes = {
  1: { name: 'VEHICULE', label: 'Véhicule', color: 'blue' },
  2: { name: 'MOBILIER', label: 'Mobilier', color: 'green' },
  3: { name: 'ELECTRONIQUE', label: 'Électronique', color: 'purple' },
  4: { name: 'MEDICAMENT', label: 'Médicament', color: 'red' },
  5: { name: 'FOURNITURE', label: 'Fourniture', color: 'yellow' },
  6: { name: 'EQUIPEMENT', label: 'Équipement', color: 'indigo' },
  7: { name: 'IMMOBILIER', label: 'Immobilier', color: 'gray' }
};

// Reference data for asset status
export const assetStatus = {
  1: { name: 'AVAILABLE', label: 'Disponible', color: 'green' },
  2: { name: 'IN_USE', label: 'En utilisation', color: 'blue' },
  3: { name: 'MAINTENANCE', label: 'En maintenance', color: 'yellow' },
  4: { name: 'RETIRED', label: 'Retiré', color: 'gray' },
  5: { name: 'DAMAGED', label: 'Endommagé', color: 'red' },
  6: { name: 'PENDING', label: 'En attente', color: 'orange' }
};

// Dynamic column configurations based on asset type
export const assetTypeColumns = {
  1: { // VEHICULE
    extraColumns: [
      { key: 'brand', label: 'Marque', type: 'text' },
      { key: 'model', label: 'Modèle', type: 'text' },
      { key: 'year', label: 'Année', type: 'number' },
      { key: 'license_plate', label: 'Plaque d\'Immatriculation', type: 'text' },
      { key: 'fuel_type', label: 'Type de Carburant', type: 'text' },
      { key: 'mileage', label: 'Kilométrage', type: 'number' }
    ]
  },
  2: { // MOBILIER
    extraColumns: [
      { key: 'material', label: 'Matériau', type: 'text' },
      { key: 'color', label: 'Couleur', type: 'text' },
      { key: 'dimensions', label: 'Dimensions', type: 'text' },
      { key: 'weight', label: 'Poids (kg)', type: 'number' },
      { key: 'manufacturer', label: 'Fabricant', type: 'text' }
    ]
  },
  3: { // ELECTRONIQUE
    extraColumns: [
      { key: 'brand', label: 'Marque', type: 'text' },
      { key: 'model', label: 'Modèle', type: 'text' },
      { key: 'serial_number', label: 'Numéro de Série', type: 'text' },
      { key: 'warranty_expiry', label: 'Fin de Garantie', type: 'date' },
      { key: 'specifications', label: 'Spécifications', type: 'text' }
    ]
  },
  4: { // MEDICAMENT
    extraColumns: [
      { key: 'dosage', label: 'Dosage', type: 'text' },
      { key: 'expiry_date', label: 'Date d\'Expiration', type: 'date' },
      { key: 'batch_number', label: 'Numéro de Lot', type: 'text' },
      { key: 'manufacturer', label: 'Laboratoire', type: 'text' },
      { key: 'storage_temperature', label: 'Température de Stockage', type: 'text' },
      { key: 'quantity_in_stock', label: 'Quantité en Stock', type: 'number' }
    ]
  },
  5: { // FOURNITURE
    extraColumns: [
      { key: 'category', label: 'Catégorie', type: 'text' },
      { key: 'unit_of_measure', label: 'Unité de Mesure', type: 'text' },
      { key: 'quantity_in_stock', label: 'Quantité en Stock', type: 'number' },
      { key: 'minimum_stock', label: 'Stock Minimum', type: 'number' },
      { key: 'supplier', label: 'Fournisseur', type: 'text' }
    ]
  },
  6: { // EQUIPEMENT
    extraColumns: [
      { key: 'brand', label: 'Marque', type: 'text' },
      { key: 'model', label: 'Modèle', type: 'text' },
      { key: 'serial_number', label: 'Numéro de Série', type: 'text' },
      { key: 'maintenance_schedule', label: 'Calendrier de Maintenance', type: 'text' },
      { key: 'last_maintenance', label: 'Dernière Maintenance', type: 'date' },
      { key: 'next_maintenance', label: 'Prochaine Maintenance', type: 'date' }
    ]
  },
  7: { // IMMOBILIER
    extraColumns: [
      { key: 'property_type', label: 'Type de Propriété', type: 'text' },
      { key: 'surface_area', label: 'Surface (m²)', type: 'number' },
      { key: 'address', label: 'Adresse', type: 'text' },
      { key: 'rental_income', label: 'Revenu Locatif', type: 'currency' },
      { key: 'property_tax', label: 'Taxe Foncière', type: 'currency' }
    ]
  }
};

// Mock assets data
export const organizationAssets = [
  {
    asset_id: 1,
    org_id: 'ORG001',
    asset_type_id: 1, // VEHICULE
    asset_status_id: 2, // IN_USE
    asset_name: 'Toyota Camry 2022',
    asset_code: 'VEH001',
    acquisition_date: '2022-03-15',
    acquisition_cost: 28500.00,
    quantity:   200 ,
    location: 'Parking Principal',
    asset_image_url: 'https://example.com/images/toyota-camry.jpg',
    extra_data: {
      brand: 'Toyota',
      model: 'Camry',
      year: 2022,
      license_plate: 'ABC-123-DE',
      fuel_type: 'Essence',
      mileage: 15420
    },
    created: '2022-03-15T10:00:00',
    createdby: 1,
    updated: '2024-08-01T14:30:00',
    updatedby: 2
  },
  {
    asset_id: 2,
    org_id: 'ORG001',
    asset_type_id: 2, // MOBILIER
    asset_status_id: 1, // AVAILABLE
    asset_name: 'Bureau Exécutif en Chêne',
    asset_code: 'MOB001',
    acquisition_date: '2023-01-20',
    acquisition_cost: 1200.00,
    quantity:   100 ,
    location: 'Entrepôt - Étage 2',
    asset_image_url: 'https://example.com/images/executive-desk.jpg',
    extra_data: {
      material: 'Chêne massif',
      color: 'Brun foncé',
      dimensions: '180x90x75 cm',
      weight: 85,
      manufacturer: 'Mobilier Professionnel SA'
    },
    created: '2023-01-20T09:15:00',
    createdby: 2,
    updated: '2023-02-10T11:20:00',
    updatedby: 1
  },
  {
    asset_id: 3,
    org_id: 'ORG001',
    asset_type_id: 3, // ELECTRONIQUE
    asset_status_id: 2, // IN_USE
    asset_name: 'Ordinateur Portable Dell Latitude',
    asset_code: 'ELEC001',
    acquisition_date: '2023-09-10',
    acquisition_cost: 1850.00,
    quantity:   200 ,
    location: 'Bureau 205',
    asset_image_url: 'https://example.com/images/dell-laptop.jpg',
    extra_data: {
      brand: 'Dell',
      model: 'Latitude 5520',
      serial_number: 'DL2023091001',
      warranty_expiry: '2026-09-10',
      specifications: 'Intel i7, 16GB RAM, 512GB SSD'
    },
    created: '2023-09-10T16:45:00',
    createdby: 3,
    updated: '2024-01-15T10:15:00',
    updatedby: 2
  },
  {
    asset_id: 4,
    org_id: 'ORG001',
    asset_type_id: 4, // MEDICAMENT
    asset_status_id: 1, // AVAILABLE
    asset_name: 'Paracétamol 500mg',
    asset_code: 'MED001',
    acquisition_date: '2024-06-01',
    acquisition_cost: 45.80,
    quantity:   200 ,
    location: 'Pharmacie - Armoire A',
    asset_image_url: 'https://example.com/images/paracetamol.jpg',
    extra_data: {
      dosage: '500mg',
      expiry_date: '2026-05-30',
      batch_number: 'PAR240601',
      manufacturer: 'Laboratoire Pharmaceutique',
      storage_temperature: '15-25°C',
      quantity_in_stock: 500
    },
    created: '2024-06-01T08:30:00',
    createdby: 1,
    updated: '2024-07-15T12:45:00',
    updatedby: 3
  },
  {
    asset_id: 5,
    org_id: 'ORG001',
    asset_type_id: 5, // FOURNITURE
    asset_status_id: 1, // AVAILABLE
    asset_name: 'Papier A4 - Ramettes',
    asset_code: 'FOUR001',
    acquisition_date: '2024-07-20',
    acquisition_cost: 125.00,
    quantity:   200 ,
    location: 'Entrepôt - Section Fournitures',
    asset_image_url: 'https://example.com/images/a4-paper.jpg',
    extra_data: {
      category: 'Papeterie',
      unit_of_measure: 'Ramette',
      quantity_in_stock: 50,
      minimum_stock: 10,
      supplier: 'Fournitures Bureau Plus'
    },
    created: '2024-07-20T14:20:00',
    createdby: 2,
    updated: null,
    updatedby: null
  },
  {
    asset_id: 6,
    org_id: 'ORG001',
    asset_type_id: 6, // EQUIPEMENT
    asset_status_id: 3, // MAINTENANCE
    asset_name: 'Imprimante Laser HP LaserJet',
    asset_code: 'EQUIP001',
    acquisition_date: '2022-11-15',
    acquisition_cost: 650.00,
    quantity:   200 ,
    location: 'Bureau Principal',
    asset_image_url: 'https://example.com/images/hp-printer.jpg',
    extra_data: {
      brand: 'HP',
      model: 'LaserJet Pro 400',
      serial_number: 'HP2022111501',
      maintenance_schedule: 'Trimestrielle',
      last_maintenance: '2024-05-15',
      next_maintenance: '2024-08-15'
    },
    created: '2022-11-15T11:00:00',
    createdby: 3,
    updated: '2024-05-15T09:30:00',
    updatedby: 1
  }
];

// Helper function to get organization name by ID (mock data)
export const getOrganizationName = (orgId) => {
  const organizations = {
    'ORG001': 'Ambassade Principale',
    'ORG002': 'Consulat Général',
    'ORG003': 'Bureau Administratif'
  };
  return organizations[orgId] || orgId;
};

// Helper function to get user name by ID (mock data)
export const getUserName = (userId) => {
  const users = {
    1: 'Admin Système',
    2: 'Chef Logistique',
    3: 'Responsable Achats',
    4: 'Gestionnaire'
  };
  return users[userId] || `Utilisateur ${userId}`;
};
