import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from '../components/Dashboard';

// Mock dos hooks necessários
vi.mock('../hooks/useQuery', () => ({
  useTransactionSummary: () => ({
    data: {
      total: 1000,
      receitas: 2000,
      despesas: 1000
    },
    isLoading: false
  }),
  useCategories: () => ({
    data: [
      { id: 1, name: 'Alimentação' },
      { id: 2, name: 'Transporte' }
    ],
    isLoading: false
  }),
  useGoalStats: () => ({
    data: { completed: 2, total: 5 },
    isLoading: false
  }),
  useChartData: () => ({
    data: [],
    isLoading: false
  }),
  useCategoryChartData: () => ({
    data: [],
    isLoading: false
  }),
  useTimelineData: () => ({
    data: [],
    isLoading: false
  })
}));

describe('Dashboard', () => {
  it('renderiza o dashboard corretamente', () => {
    render(<Dashboard />);
    
    // Verifica se os elementos principais estão presentes
    expect(screen.getByText(/Saldo Disponível/i)).toBeInTheDocument();
    expect(screen.getByText(/Receitas/i)).toBeInTheDocument();
    expect(screen.getByText(/Despesas/i)).toBeInTheDocument();
  });

  it('formata valores monetários corretamente', () => {
    render(<Dashboard />);
    
    // Verifica se o valor está formatado como moeda brasileira
    const valorFormatado = screen.getByText('R$ 2.000,00');
    expect(valorFormatado).toBeInTheDocument();
  });

  it('exibe loading state quando necessário', () => {
    // Redefine o mock para simular loading
    vi.mock('../hooks/useQuery', () => ({
      useTransactionSummary: () => ({
        data: null,
        isLoading: true
      }),
      useCategories: () => ({
        data: [],
        isLoading: true
      })
    }));

    render(<Dashboard />);
    
    // Verifica se o indicador de loading está presente
    const loadingElements = screen.getAllByTestId('loading-indicator');
    expect(loadingElements.length).toBeGreaterThan(0);
  });
});
