import React, { useState, useRef, useEffect } from 'react';
import type { StatusCode } from '../types';

interface StatusFilterMultiSelectProps {
  selectedStatuses: StatusCode[];
  onStatusChange: (statuses: StatusCode[]) => void;
  statusOptions: StatusCode[];
  placeholder?: string;
}

const StatusFilterMultiSelect: React.FC<StatusFilterMultiSelectProps> = ({
  selectedStatuses,
  onStatusChange,
  statusOptions,
  placeholder = 'Buscar status...',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter available options based on input and exclude already selected items
  const filteredOptions = statusOptions.filter((option) => {
    const isAlreadySelected = selectedStatuses.some(
      (s) => s.codigo === option.codigo
    );
    const matchesSearch =
      option.descricao.toLowerCase().includes(inputValue.toLowerCase()) ||
      option.codigo.toString().includes(inputValue);
    return !isAlreadySelected && matchesSearch;
  });

  // Handle clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when filtered options change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredOptions]);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && e.key !== 'ArrowDown') return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setIsOpen(true);
        setHighlightedIndex((prev) =>
          prev < filteredOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredOptions[highlightedIndex]) {
          handleSelectStatus(filteredOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setInputValue('');
        break;
      default:
        break;
    }
  };

  const handleSelectStatus = (status: StatusCode) => {
    onStatusChange([...selectedStatuses, status]);
    setInputValue('');
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const handleRemoveStatus = (codigo: number) => {
    onStatusChange(selectedStatuses.filter((s) => s.codigo !== codigo));
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Input Container */}
      <div className="border border-gray-300 rounded-md bg-white shadow-sm">
        {/* Selected Tags */}
        {selectedStatuses.length > 0 && (
          <div className="flex flex-wrap gap-2 p-2">
            {selectedStatuses.map((status) => (
              <div
                key={status.codigo}
                className="flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
              >
                <span>
                  {status.codigo} - {status.descricao}
                </span>
                <button
                  onClick={() => handleRemoveStatus(status.codigo)}
                  className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none font-bold"
                  aria-label={`Remove ${status.descricao}`}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          placeholder={selectedStatuses.length === 0 ? placeholder : ''}
          className={`w-full px-3 py-2 outline-none text-gray-700 ${
            selectedStatuses.length > 0 ? 'border-t border-gray-200' : ''
          }`}
        />
      </div>

      {/* Dropdown Menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 max-h-64 overflow-y-auto"
        >
          {filteredOptions.map((option, index) => (
            <button
              key={option.codigo}
              onClick={() => handleSelectStatus(option)}
              className={`w-full text-left px-4 py-3 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                index === highlightedIndex
                  ? 'bg-blue-50 text-blue-900'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium">
                {option.codigo} - {option.descricao}
              </div>
              <div className="text-xs text-gray-500">
                {option.categoria}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {isOpen && filteredOptions.length === 0 && inputValue.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
          <p className="text-sm text-gray-500 text-center">
            Nenhum status encontrado
          </p>
        </div>
      )}

      {/* Empty State When All Selected */}
      {isOpen && filteredOptions.length === 0 && inputValue.length === 0 && selectedStatuses.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 p-4">
          <p className="text-sm text-gray-500 text-center">
            Todos os status foram selecionados
          </p>
        </div>
      )}
    </div>
  );
};

export default StatusFilterMultiSelect;
