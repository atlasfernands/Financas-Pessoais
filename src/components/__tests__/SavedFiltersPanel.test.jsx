import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SavedFiltersPanel from '../filters/SavedFiltersPanel';
import { useSavedFilters } from '../../hooks/useSavedFilters';

// Mock do hook useSavedFilters
vi.mock('../../hooks/useSavedFilters');

describe('SavedFiltersPanel', () => {
  const mockSavedFilters = [
    {
      id: 1,
      name: 'Filtro de Teste',
      lastUsed: '2025-08-05T10:00:00.000Z',
      // ... outras propriedades do filtro
    }
  ];

  const mockCurrentFilter = {
    dateRange: { start: '', end: '' },
    amountRange: { min: '', max: '' },
    categories: [],
    types: [],
    recurring: 'all',
    searchTerm: ''
  };

  const mockSaveFilter = vi.fn();
  const mockDeleteFilter = vi.fn();
  const mockApplyFilter = vi.fn();

  beforeEach(() => {
    useSavedFilters.mockReturnValue({
      savedFilters: mockSavedFilters,
      saveFilter: mockSaveFilter,
      deleteFilter: mockDeleteFilter,
      applyFilter: mockApplyFilter
    });
  });

  it('renderiza painel de filtros salvos', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    expect(screen.getByText('Filtros Salvos')).toBeInTheDocument();
  });

  it('mostra formulário para salvar novo filtro', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    
    fireEvent.click(screen.getByText('Salvar Filtro Atual'));
    expect(screen.getByPlaceholderText('Nome do filtro')).toBeInTheDocument();
  });

  it('salva novo filtro quando formulário é submetido', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    
    fireEvent.click(screen.getByText('Salvar Filtro Atual'));
    fireEvent.change(screen.getByPlaceholderText('Nome do filtro'), {
      target: { value: 'Novo Filtro' }
    });
    fireEvent.click(screen.getByText('Salvar'));
    
    expect(mockSaveFilter).toHaveBeenCalledWith(mockCurrentFilter, 'Novo Filtro');
  });

  it('exclui filtro quando botão de exclusão é clicado', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    
    const deleteButton = screen.getByTitle('Excluir filtro');
    fireEvent.click(deleteButton);
    
    expect(mockDeleteFilter).toHaveBeenCalledWith(mockSavedFilters[0].id);
  });

  it('aplica filtro quando botão de aplicar é clicado', () => {
    const mockOnApplyFilter = vi.fn();
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={mockOnApplyFilter} />);
    
    const applyButton = screen.getByTitle('Aplicar filtro');
    fireEvent.click(applyButton);
    
    expect(mockApplyFilter).toHaveBeenCalledWith(mockSavedFilters[0]);
    expect(mockOnApplyFilter).toHaveBeenCalled();
  });

  it('não salva filtro com nome vazio', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    
    fireEvent.click(screen.getByText('Salvar Filtro Atual'));
    fireEvent.click(screen.getByText('Salvar'));
    
    expect(mockSaveFilter).not.toHaveBeenCalled();
  });

  it('mostra mensagem quando não há filtros salvos', () => {
    useSavedFilters.mockReturnValue({
      savedFilters: [],
      saveFilter: mockSaveFilter,
      deleteFilter: mockDeleteFilter,
      applyFilter: mockApplyFilter
    });

    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    expect(screen.getByText('Nenhum filtro salvo ainda.')).toBeInTheDocument();
  });

  it('fecha formulário de novo filtro ao clicar em cancelar', () => {
    render(<SavedFiltersPanel currentFilter={mockCurrentFilter} onApplyFilter={() => {}} />);
    
    // Abre o formulário
    fireEvent.click(screen.getByText('Salvar Filtro Atual'));
    expect(screen.getByPlaceholderText('Nome do filtro')).toBeInTheDocument();
    
    // Fecha o formulário
    fireEvent.click(screen.getByText('Cancelar'));
    expect(screen.queryByPlaceholderText('Nome do filtro')).not.toBeInTheDocument();
  });
});
