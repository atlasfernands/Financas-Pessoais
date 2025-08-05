import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  categoryService,
  transactionService,
  goalService,
  insightService,
} from '../services/api';
import toast from 'react-hot-toast';

// Hooks para buscar dados
export const useCategories = (filters = {}) => {
  return useQuery({
    queryKey: ['categories', filters],
    queryFn: () => categoryService.getCategories(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useCategory = (id) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: () => categoryService.getCategory(id),
    enabled: !!id,
  });
};

export const useCategoryStats = () => {
  return useQuery({
    queryKey: ['categoryStats'],
    queryFn: () => categoryService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useTransactions = (filters = {}) => {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.getTransactions(filters),
    staleTime: 2 * 60 * 1000, // 2 minutos
  });
};

export const useTransaction = (id) => {
  return useQuery({
    queryKey: ['transaction', id],
    queryFn: () => transactionService.getTransaction(id),
    enabled: !!id,
  });
};

export const useTransactionSummary = (filters = {}) => {
  return useQuery({
    queryKey: ['transactionSummary', filters],
    queryFn: () => transactionService.getSummary(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Hook para dados de gráficos
export const useChartData = (period = '6months') => {
  return useQuery({
    queryKey: ['chartData', period],
    queryFn: () => transactionService.getChartData(period),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para dados de categorias para gráfico de pizza
export const useCategoryChartData = (period = 'current') => {
  return useQuery({
    queryKey: ['categoryChartData', period],
    queryFn: () => transactionService.getCategoryChartData(period),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para dados de evolução temporal
export const useTimelineData = (months = 6) => {
  return useQuery({
    queryKey: ['timelineData', months],
    queryFn: () => transactionService.getTimelineData(months),
    staleTime: 15 * 60 * 1000, // 15 minutos
  });
};

// Hooks para Metas
export const useGoals = (filters = {}) => {
  return useQuery({
    queryKey: ['goals', filters],
    queryFn: () => goalService.getGoals(filters),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

export const useGoalStats = () => {
  return useQuery({
    queryKey: ['goalStats'],
    queryFn: () => goalService.getStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hooks para Insights
export const useInsights = (period = 'month') => {
  return useQuery({
    queryKey: ['insights', period],
    queryFn: () => insightService.getInsights(period),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hooks para mutações
export const useCreateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      toast.success('Categoria criada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao criar categoria');
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      toast.success('Categoria atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar categoria');
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: categoryService.deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['categoryStats'] });
      toast.success('Categoria excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir categoria');
    },
  });
};

export const useCreateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.createTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['chartData'] });
      queryClient.invalidateQueries({ queryKey: ['categoryChartData'] });
      queryClient.invalidateQueries({ queryKey: ['timelineData'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao criar transação');
    },
  });
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => transactionService.updateTransaction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['chartData'] });
      queryClient.invalidateQueries({ queryKey: ['categoryChartData'] });
      queryClient.invalidateQueries({ queryKey: ['timelineData'] });
      toast.success('Transação atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar transação');
    },
  });
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transactionService.deleteTransaction,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['transactionSummary'] });
      queryClient.invalidateQueries({ queryKey: ['chartData'] });
      queryClient.invalidateQueries({ queryKey: ['categoryChartData'] });
      queryClient.invalidateQueries({ queryKey: ['timelineData'] });
      toast.success('Transação excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir transação');
    },
  });
};

export const useCreateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goalStats'] });
      toast.success('Meta criada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao criar meta');
    },
  });
};

export const useUpdateGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => goalService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goalStats'] });
      toast.success('Meta atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao atualizar meta');
    },
  });
};

export const useDeleteGoal = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: goalService.deleteGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goalStats'] });
      toast.success('Meta excluída com sucesso!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || 'Erro ao excluir meta');
    },
  });
};