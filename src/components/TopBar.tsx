import React from 'react';
import { authService } from '../services/auth';
import { useIntegration } from '../context/IntegrationContext';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const username = localStorage.getItem('username') || 'Usuário';
  const { currentIntegration } = useIntegration();

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  const getBorderColor = () => {
    const colors: Record<string, string> = {
      nike: 'border-b-blue-500',
      centauro: 'border-b-orange-500',
    };
    return colors[currentIntegration.id] || 'border-b-gray-500';
  };

  return (
    <header className={`bg-white shadow-sm border-b-2 ${getBorderColor()}`}>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Current integration title */}
            <div>
              <h1 className="text-lg font-semibold text-gray-800">
                {currentIntegration.displayName}
              </h1>
              <p className="text-xs text-gray-500 hidden sm:block">
                Gestão de Cargas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User info */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {username.charAt(0).toUpperCase()}
                </span>
              </div>
              <span className="text-sm text-gray-600">{username}</span>
            </div>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
