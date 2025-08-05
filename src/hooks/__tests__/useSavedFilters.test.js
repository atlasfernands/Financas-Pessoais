import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSavedFilters } from '../../hooks/useSavedFilters';

describe('useSavedFilters', () => {
  const mockFilter = {
    dateRange: { start: '2025-01-01', end: '2025-12-31' },
    categories: ['Alimentação', 'Transporte'],
    types: ['despesa'],
    searchTerm: 'teste'
  };

  beforeEach(() => {
    localStorage.clear();
  });

  it('inicia com lista vazia de filtros', () => {
    const { result } = renderHook(() => useSavedFilters());
    expect(result.current.savedFilters).toEqual([]);
  });

  it('salva um novo filtro corretamente', () => {
    const { result } = renderHook(() => useSavedFilters());
    
    act(() => {
      result.current.saveFilter(mockFilter, 'Meu Filtro');
    });
    
    expect(result.current.savedFilters).toHaveLength(1);
    expect(result.current.savedFilters[0]).toEqual(
      expect.objectContaining({
        name: 'Meu Filtro',
        ...mockFilter
      })
    );
  });

  it('atualiza um filtro existente', () => {
    const { result } = renderHook(() => useSavedFilters());
    
    // Salva filtro inicial
    act(() => {
      result.current.saveFilter(mockFilter, 'Filtro Original');
    });
    
    const filtroId = result.current.savedFilters[0].id;
    
    // Atualiza o filtro
    act(() => {
      result.current.updateFilter(filtroId, {
        name: 'Filtro Atualizado',
        searchTerm: 'novo teste'
      });
    });
    
    expect(result.current.savedFilters[0].name).toBe('Filtro Atualizado');
    expect(result.current.savedFilters[0].searchTerm).toBe('novo teste');
  });

  it('remove um filtro corretamente', () => {
    const { result } = renderHook(() => useSavedFilters());
    
    // Salva filtro
    act(() => {
      result.current.saveFilter(mockFilter, 'Filtro para Remover');
    });
    
    const filtroId = result.current.savedFilters[0].id;
    
    // Remove o filtro
    act(() => {
      result.current.deleteFilter(filtroId);
    });
    
    expect(result.current.savedFilters).toHaveLength(0);
  });

  it('aplica um filtro como ativo', () => {
    const { result } = renderHook(() => useSavedFilters());
    
    // Salva filtro
    act(() => {
      result.current.saveFilter(mockFilter, 'Filtro para Aplicar');
    });
    
    const filtro = result.current.savedFilters[0];
    
    // Aplica o filtro
    act(() => {
      result.current.applyFilter(filtro);
    });
    
    expect(result.current.activeFilter).toEqual(filtro);
  });

  it('persiste filtros no localStorage', () => {
    const { result } = renderHook(() => useSavedFilters());
    
    // Salva filtro
    act(() => {
      result.current.saveFilter(mockFilter, 'Filtro Persistente');
    });
    
    // Recria o hook para simular recarregamento
    const { result: novoResult } = renderHook(() => useSavedFilters());
    
    expect(novoResult.current.savedFilters).toHaveLength(1);
    expect(novoResult.current.savedFilters[0]).toEqual(
      expect.objectContaining({
        name: 'Filtro Persistente'
      })
    );
  });
});
