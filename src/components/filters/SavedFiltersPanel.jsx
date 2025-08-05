import { useState } from 'react';
import { StarIcon, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useSavedFilters } from '../hooks/useSavedFilters';

const SavedFiltersPanel = ({ currentFilter, onApplyFilter }) => {
  const { savedFilters, saveFilter, deleteFilter, applyFilter } = useSavedFilters();
  const [filterName, setFilterName] = useState('');
  const [isAddingFilter, setIsAddingFilter] = useState(false);

  const handleSaveFilter = () => {
    if (!filterName.trim()) return;
    
    const newFilter = saveFilter(currentFilter, filterName);
    setFilterName('');
    setIsAddingFilter(false);
    
    // Aplicar o filtro recém-criado
    if (onApplyFilter) {
      onApplyFilter(newFilter);
    }
  };

  const handleApplyFilter = (filter) => {
    const appliedFilter = applyFilter(filter);
    if (onApplyFilter) {
      onApplyFilter(appliedFilter);
    }
  };

  return (
    <div className="saved-filters-panel bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Filtros Salvos</h3>
        <button
          onClick={() => setIsAddingFilter(!isAddingFilter)}
          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
        >
          {isAddingFilter ? 'Cancelar' : 'Salvar Filtro Atual'}
        </button>
      </div>

      {/* Formulário para salvar novo filtro */}
      {isAddingFilter && (
        <div className="mb-4 flex gap-2">
          <input
            type="text"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
            placeholder="Nome do filtro"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            onClick={handleSaveFilter}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Salvar
          </button>
        </div>
      )}

      {/* Lista de filtros salvos */}
      <div className="space-y-2">
        {savedFilters.map((filter) => (
          <div
            key={filter.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
          >
            <div className="flex-1">
              <h4 className="font-medium">{filter.name}</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Usado: {new Date(filter.lastUsed).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleApplyFilter(filter)}
                className="p-2 text-indigo-600 hover:text-indigo-700"
                title="Aplicar filtro"
              >
                {filter.isActive ? <StarIconSolid className="h-5 w-5" /> : <StarIcon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => deleteFilter(filter.id)}
                className="p-2 text-red-600 hover:text-red-700"
                title="Excluir filtro"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}

        {savedFilters.length === 0 && (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">
            Nenhum filtro salvo ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default SavedFiltersPanel;
