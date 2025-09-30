import React, { useState } from 'react';
import { COLORS } from '../../constants/color/colors';
import Sidebar from './components/Sidebar';
import EmployeList from '../../modules/govemployee/employedata/EmployeList';
import EmployeOperations from '../../modules/govemployee/employeoperations/EmployeOperations';
import AssetTable from '../../modules/govlogistique/procurement/AssetTable';
import InventoryTable from '../../modules/govlogistique/inventory/InventoryTable';
import CommunicationTable from '../../modules/govcommunication/communication/CommunicationTable';
import CitizenTable from '../../modules/govcitizen/citizen/CitizenTable';
import JobofferTable from '../../modules/govcitizen/joboffer/JobofferTable';
import JobapplicationTable from '../../modules/govcitizen/jobapplication/JobapplicationTable';
import EventTable from '../../modules/govsecurity/securityevent/eventTable';
import UserTable from '../../modules/govsecurity/suser/userTable';
import AccountTable from '../../modules/govfinance/account/accountTable';
import TransactionTable from '../../modules/govfinance/transaction/transactionTable';
import CardTable from '../../modules/govconsul/cardData/cardTable';
import AppointmentTable from '../../modules/govconsul/appointmentData/appointmentTable';
const Home = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [currentUser] = useState({
    name: 'Administrateur',
    role: 'Gestionnaire Principal',
    avatar: null
  });

  const handleNavigation = (path) => {
    console.log('Navigation vers:', path);
    // Handle different navigation paths
    switch(path) {
      case '/citizens/database':
        setCurrentView('citizens-database');
        break;
      case '/citizens/offres-emploi':
        setCurrentView('citizens-joboffers');
        break;
      case '/citizens/candidatures':
        setCurrentView('citizens-applications');
        break;
      case '/employees/list':
        setCurrentView('employees-list');
        break;
      case '/employees/operations':
        setCurrentView('employees-operations');
        break;
        case '/consul/demandes':
          setCurrentView('consul-requests');
          break;
      case '/logistics/procurement':
        setCurrentView('logistics-procurement');
        break;
      case '/logistics/inventory':
        setCurrentView('logistics-inventory');
        break;
      case '/consul/rendez-vous':
        setCurrentView('consul-appointments');
        break;
      case '/communication/announcements':
        setCurrentView('communication-announcements');
        break;
      case '/security/events':
        setCurrentView('security-events');
        break;
      case '/security/access':
        setCurrentView('security-users');
        break;
      case '/finance/accounts':
        setCurrentView('finance-accounts');
        break;
      case '/finance/transactions':
        setCurrentView('finance-transactions');
        break;
      default:
        setCurrentView('dashboard');
    }
  };

  // Dashboard statistics
  const stats = [
    {
      title: 'Employés Actifs',
      value: '35',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      change: '+12%',
      changeType: 'positive'
    },
    {
      title: 'Demandes en Cours',
      value: '89',
      icon: (
        <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      change: '+5%',
      changeType: 'positive'
    },
    {
      title: 'Services Consulaires',
      value: '234',
      icon: (
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      change: '+8%',
      changeType: 'positive'
    },
    {
      title: 'Incidents Sécurité',
      value: '3',
      icon: (
        <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      ),
      change: '-2',
      changeType: 'negative'
    }
  ];

  // Recent activities
  const recentActivities = [
    {
      id: 1,
      type: 'employee',
      message: 'Nouvel employé ajouté: Yahouza ADAMOU',
      time: 'Il y a 2 heures',
      icon: '👤'
    },
    {
      id: 2,
      type: 'visa',
      message: 'Demande de prise en charge approuvée pour Yahaya MAIJIMAA',
      time: 'Il y a 3 heures',
      icon: '📋'
    },
    {
      id: 3,
      type: 'security',
      message: 'Mise à jour des protocoles de sécurité',
      time: 'Il y a 5 heures',
      icon: '🔒'
    },
    {
      id: 4,
      type: 'finance',
      message: 'Rapport financier mensuel généré',
      time: 'Il y a 1 jour',
      icon: '💰'
    }
  ];

  const renderMainContent = () => {
    switch(currentView) {
      case 'citizens-database':
        return <CitizenTable />;
      case 'citizens-joboffers':
        return <JobofferTable />;
      case 'citizens-applications':
        return <JobapplicationTable />;
      case 'employees-list':
        return <EmployeList />;
      case 'employees-operations':
        return <EmployeOperations />;
      case 'consul-requests':
          return <CardTable />;
      case 'consul-appointments':
        return <AppointmentTable />;
      case 'logistics-procurement':
        return <AssetTable />;
      case 'logistics-inventory':
        return <InventoryTable />;
      case 'communication-announcements':
        return <CommunicationTable />;
      case 'security-events':
        return <EventTable />;
      case 'security-users':
        return <UserTable />;
      case 'finance-accounts':
        return <AccountTable />;
      case 'finance-transactions':
        return <TransactionTable />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <>
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} ce mois
                </p>
              </div>
              <div className="flex-shrink-0">
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Activités Récentes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <span className="text-2xl">{activity.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Actions Rapides</h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <button 
                onClick={() => handleNavigation('/employees/list')}
                className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Voir Liste Employés
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Nouvelle Demande
              </button>
              
              <button className="w-full flex items-center justify-center px-4 py-3 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Générer Rapport
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">État du Système</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Serveurs: Opérationnels</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Base de données: Connectée</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded-full mr-3"></div>
              <span className="text-sm text-gray-700">Maintenance: Programmée</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar onNavigation={handleNavigation} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentView === 'dashboard' ? 'Tableau de Bord' :
                 currentView === 'employees-list' ? 'Liste des Employés' :
                 currentView === 'employees-affectations' ? 'Affectations' :
                 currentView === 'employees-missions' ? 'Missions' :
                 currentView === 'employees-conges' ? 'Congés' :
                 currentView === 'employees-evaluations' ? 'Évaluations' :
                 currentView === 'communication-announcements' ? 'Gestion des Communications' :
                 currentView === 'security-events' ? 'Événements de Sécurité' :
                 currentView === 'security-users' ? 'Utilisateurs (Sécurité)' :
                 currentView === 'finance-accounts' ? 'Comptes' :
                 currentView === 'finance-transactions' ? 'Transactions' :
                 currentView === 'citizens-database' ? 'Liste de Citoyens' :
                 currentView === 'citizens-joboffers' ? "Offres d'emploi" :
                 currentView === 'citizens-applications' ? 'Candidatures' : 'Tableau de Bord'}
              </h1>
              <p className="text-sm text-gray-600">
                {currentView === 'dashboard' ? "Application de gestion de l'ambassade" :
                 currentView.startsWith('employees-') ? 'Module de gestion des employés' :
                 (currentView === 'logistics-procurement' || currentView === 'logistics-inventory') ? 'Module Logistique' :
                 currentView === 'communication-announcements' ? 'Module Communication' :
                 (currentView === 'security-events' || currentView === 'security-users') ? 'Module Sécurité' :
                 (currentView === 'finance-accounts' || currentView === 'finance-transactions') ? 'Module Finance' :
                 (currentView === 'citizens-database' || currentView === 'citizens-joboffers' || currentView === 'citizens-applications') ? 'Module Citoyens' : ''}
              </p>
              {currentView !== 'dashboard' && (
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className="mt-2 text-sm text-green-600 hover:text-green-800 flex items-center"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour au tableau de bord
                </button>
              )}
            </div>
            
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="text-xs text-gray-600">{currentUser.role}</p>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {currentUser.name.charAt(0)}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-2">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
};

export default Home;
