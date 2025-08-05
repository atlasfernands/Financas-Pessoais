import { useState, useEffect } from 'react';
import { filterStorage } from '../services/FilterStorage';

export const useSavedFilters = () => {
  const [savedFilters, setSavedFilters] = useState([]);
  const [activeFilter, setActiveFilter] = useState(null);

  useEffect(() => {
    loadSavedFilters();
  }, []);

  const loadSavedFilters = () => {
    const filters = filterStorage.getSavedFilters();
    setSavedFilters(filters);
  };

  const saveFilter = (filter, name) => {
    const filterToSave = {
      ...filter,
      name,
      lastUsed: new Date().toISOString()
    };
    
    const savedFilter = filterStorage.saveFilter(filterToSave);
    if (savedFilter) {
      setSavedFilters(prev => [...prev, savedFilter]);
    }
    return savedFilter;
  };

  const updateFilter = (id, updatedFilter) => {
    const updated = filterStorage.updateFilter(id, updatedFilter);
    if (updated) {
      loadSavedFilters();
      if (activeFilter?.id === id) {
        setActiveFilter(updated);
      }
    }
    return updated;
  };

  const deleteFilter = (id) => {
    const success = filterStorage.deleteFilter(id);
    if (success) {
      setSavedFilters(prev => prev.filter(f => f.id !== id));
      if (activeFilter?.id === id) {
        setActiveFilter(null);
      }
    }
    return success;
  };

  const applyFilter = (id) => {
    const filter = filterStorage.getFilterById(id);
    if (filter) {
      const updatedFilter = filterStorage.updateFilterUsage(id);
      setActiveFilter(updatedFilter || filter);
      loadSavedFilters(); // Atualiza a lista com as novas informações de uso
      return updatedFilter || filter;
    }
    return null;
  };

  return {
    savedFilters,
    activeFilter,
    saveFilter,
    updateFilter,
    deleteFilter,
    applyFilter
  };
};
