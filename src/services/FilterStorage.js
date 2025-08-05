const STORAGE_KEY = 'saved_filters';

class FilterStorage {
  getSavedFilters() {
    try {
      const filters = localStorage.getItem(STORAGE_KEY);
      return filters ? JSON.parse(filters) : [];
    } catch {
      return [];
    }
  }

  saveFilter(filter) {
    try {
      const filters = this.getSavedFilters();
      const newFilter = {
        ...filter,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        usageCount: 0
      };
      
      filters.push(newFilter);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
      return newFilter;
    } catch {
      return null;
    }
  }

  updateFilter(id, updatedFilter) {
    try {
      const filters = this.getSavedFilters();
      const index = filters.findIndex(f => f.id === id);
      
      if (index !== -1) {
        filters[index] = { 
          ...filters[index], 
          ...updatedFilter,
          lastModified: new Date().toISOString()
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        return filters[index];
      }
      return null;
    } catch {
      return null;
    }
  }

  deleteFilter(id) {
    try {
      const filters = this.getSavedFilters();
      const updatedFilters = filters.filter(f => f.id !== id);
      
      if (updatedFilters.length !== filters.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedFilters));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  getFilterById(id) {
    try {
      const filters = this.getSavedFilters();
      return filters.find(f => f.id === id) || null;
    } catch {
      return null;
    }
  }

  updateFilterUsage(id) {
    try {
      const filters = this.getSavedFilters();
      const index = filters.findIndex(f => f.id === id);
      
      if (index !== -1) {
        filters[index] = {
          ...filters[index],
          lastUsed: new Date().toISOString(),
          usageCount: (filters[index].usageCount || 0) + 1
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filters));
        return filters[index];
      }
      return null;
    } catch {
      return null;
    }
  }
}

// Exporta uma instância única da classe
export const filterStorage = new FilterStorage();
