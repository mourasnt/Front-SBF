import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllIntegrations } from '../config/integrations';
import { useIntegration } from '../context/IntegrationContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const navigate = useNavigate();
  const { currentIntegration, setIntegration } = useIntegration();
  const integrations = getAllIntegrations();

  const handleIntegrationChange = (integrationId: string) => {
    setIntegration(integrationId);
    navigate(`/${integrationId}/dashboard`);
  };

  const getIntegrationColorClasses = (integrationId: string, isActive: boolean) => {
    const colors: Record<string, { active: string; hover: string; icon: string }> = {
      nike: {
        active: 'bg-blue-600 text-white',
        hover: 'hover:bg-blue-50 text-gray-700',
        icon: 'bg-blue-500',
      },
      centauro: {
        active: 'bg-orange-600 text-white',
        hover: 'hover:bg-orange-50 text-gray-700',
        icon: 'bg-orange-500',
      },
    };
    const colorConfig = colors[integrationId] || colors.nike;
    return isActive ? colorConfig.active : colorConfig.hover;
  };

  const getIconBgClass = (integrationId: string) => {
    const iconColors: Record<string, string> = {
      nike: 'bg-blue-500',
      centauro: 'bg-orange-500',
    };
    return iconColors[integrationId] || 'bg-gray-500';
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-800">SBF Integrações</h1>
              <button
                onClick={onToggle}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">Gestão de Cargas</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
              Integrações
            </p>
            <ul className="space-y-2">
              {integrations.map((integration) => {
                const isActive = currentIntegration.id === integration.id;
                return (
                  <li key={integration.id}>
                    <button
                      onClick={() => handleIntegrationChange(integration.id)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors font-medium
                        ${getIntegrationColorClasses(integration.id, isActive)}
                      `}
                    >
                      <span
                        className={`
                          w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold
                          ${isActive ? 'bg-white/20' : getIconBgClass(integration.id)}
                        `}
                      >
                        {integration.name.charAt(0)}
                      </span>
                      <div className="text-left">
                        <span className="block">{integration.name}</span>
                        <span className={`text-xs ${isActive ? 'text-white/70' : 'text-gray-500'}`}>
                          {integration.description}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Quick Stats */}
            <div className="mt-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">
                Integração Atual
              </p>
              <div className={`p-4 rounded-lg bg-gradient-to-r ${currentIntegration.color.gradient} text-white`}>
                <p className="font-semibold">{currentIntegration.displayName}</p>
                <p className="text-sm text-white/80 mt-1">{currentIntegration.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {currentIntegration.features.tracking && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">Tracking</span>
                  )}
                  {currentIntegration.features.uploadXml && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded">XML</span>
                  )}
                </div>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-400 text-center">
              SBF Integrações v2.0
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
