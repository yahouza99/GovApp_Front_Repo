import React, { useState } from 'react';
import { TAILWIND_COLORS } from '../../../constants/color/colors';

const Sidebar = ({ onNavigation }) => {
  const [activeModule, setActiveModule] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Module configuration with navigation items
  const modules = [
    {
      id: 'govemployee',
      name: 'Employés',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
      ),
      subItems: [
        { name: 'Liste des employés', path: '/employees/list' },
        { name: 'Opérations employés', path: '/employees/operations' }
      ]
    },
    {
      id: 'govconsul',
      name: 'Consulat',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      subItems: [
        { name: 'Demandes consulaires', path: '/consul/demandes' },
        { name: 'Inscription Annuelle', path: '/consul/subscription' },
        { name: 'Rendez-vous', path: '/consul/rendez-vous' }
      ]
    },
    {
      id: 'govcitizen',
      name: 'Citoyens',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      subItems: [
        { name: 'Liste de citoyens', path: '/citizens/database' },
        { name: 'Offres d\'emploi', path: '/citizens/offres-emploi' },
        { name: 'Candidatures', path: '/citizens/candidatures' },
      ]
    },
    {
      id: 'govcommunication',
      name: 'Communication',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      subItems: [
        { name: 'Les communications', path: '/communication/announcements' },
        { name: 'Les réseaux sociaux', path: '/communication/social' }
      ]
    },
    {
      id: 'govsecurity',
      name: 'Sécurité',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      subItems: [
        { name: 'Role d\'accès utilisateur', path: '/security/access' },
        { name: 'Evenements', path: '/security/events' }
      ]
    },
    {
      id: 'govlogistique',
      name: 'Logistique',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      subItems: [
        { name: 'Inventaire', path: '/logistics/inventory' },
        { name: 'Approvisionnement', path: '/logistics/procurement' },
      ]
    },
    {
      id: 'govrepport',
      name: 'Rapports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      subItems: [
        { name: 'Generer un Rapport', path: '/reports/generate' }
      ]
    },
    {
      id: 'govacademic',
      name: 'Académiques',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
        </svg>
      ),
      subItems: [
        { name: 'Bourse', path: '/academic/bourse' }
      ]
    },
    {
      id: 'govfinance',
      name: 'Finance',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      subItems: [
        { name: 'Comptes', path: '/finance/accounts' },
        { name: 'Transactions', path: '/finance/transactions' }
      ]
    }
  ];

  const toggleModule = (moduleId) => {
    setActiveModule(activeModule === moduleId ? null : moduleId);
  };

  const handleNavigation = (path) => {
    console.log('Navigation vers:', path);
    // Call the parent navigation handler
    if (onNavigation) {
      onNavigation(path);
    }
  };

  return (
    <div className={`bg-gray-800 text-white transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-xl font-bold text-green-400">Ambassade Niger</h2>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d={isCollapsed ? "M9 5l7 7-7 7" : "M15 19l-7-7 7-7"} />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {modules.map((module) => (
            <div key={module.id}>
              {/* Module Button */}
              <button
                onClick={() => toggleModule(module.id)}
                className={`w-full flex items-center px-4 py-3 text-left hover:bg-gray-700 transition-colors ${
                  activeModule === module.id ? 'bg-green-600 text-white' : 'text-gray-300'
                }`}
              >
                <span className="flex-shrink-0">{module.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="ml-3 flex-1">{module.name}</span>
                    <svg 
                      className={`w-4 h-4 transition-transform ${
                        activeModule === module.id ? 'rotate-90' : ''
                      }`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </>
                )}
              </button>

              {/* Sub-items */}
              {!isCollapsed && activeModule === module.id && (
                <div className="bg-gray-900">
                  {module.subItems.map((subItem, index) => (
                    <button
                      key={index}
                      onClick={() => handleNavigation(subItem.path)}
                      className="w-full text-left px-12 py-2 text-sm text-gray-400 hover:text-orange-400 hover:bg-gray-800 transition-colors"
                    >
                      {subItem.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        {!isCollapsed && (
          <div className="text-xs text-gray-500">
            <p>Application de gestion</p>
            <p>de l'ambassade</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
