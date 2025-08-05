import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Instância do axios
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autenticação
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Tratar erros de autenticação
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      
      // Redirecionar para login se não estiver já na página de login
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
      
      toast.error('Sessão expirada. Faça login novamente.');
      return Promise.reject(error);
    }
    
    // Tratar outros erros
    const message = error.response?.data?.error || 'Erro interno do servidor';
    
    // Não mostrar toast para certos erros específicos
    const silentErrors = ['Credenciais inválidas', 'Usuário já existe'];
    if (!silentErrors.some(silent => message.includes(silent))) {
      toast.error(message);
    }
    
    return Promise.reject(error);
  }
);

// Serviços de autenticação
export const authService = {
  // Registrar usuário
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Login
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    
    if (response.data.token) {
      localStorage.setItem('auth_token', response.data.token);
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout
  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.warn('Erro no logout:', error);
    } finally {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    }
  },

  // Obter dados do usuário atual
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data.user;
  },

  // Atualizar perfil
  updateProfile: async (userData) => {
    const response = await api.put('/auth/profile', userData);
    
    if (response.data.user) {
      localStorage.setItem('user_data', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Alterar senha
  changePassword: async (passwordData) => {
    const response = await api.put('/auth/password', passwordData);
    return response.data;
  },
};

// Serviços de categorias
export const categoryService = {
  // Listar categorias
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/categories?${params}`);
    return response.data;
  },

  // Obter categoria por ID
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data.category;
  },

  // Criar categoria
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },

  // Atualizar categoria
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },

  // Deletar categoria
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },

  // Obter estatísticas
  getStats: async () => {
    const response = await api.get('/categories/stats/overview');
    return response.data.stats;
  },
};

// Serviços de transações
export const transactionService = {
  // Listar transações
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/transactions?${params}`);
    return response.data;
  },

  // Obter transação por ID
  getById: async (id) => {
    const response = await api.get(`/transactions/${id}`);
    return response.data.transaction;
  },

  // Criar transação
  create: async (transactionData) => {
    const response = await api.post('/transactions', transactionData);
    return response.data;
  },

  // Atualizar transação
  update: async (id, transactionData) => {
    const response = await api.put(`/transactions/${id}`, transactionData);
    return response.data;
  },

  // Deletar transação
  delete: async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  },

  // Obter resumo financeiro
  getSummary: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/transactions/stats/summary?${params}`);
    return response.data.summary;
  },
};

// Serviços de metas
export const goalService = {
  // Listar metas
  getAll: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/goals?${params}`);
    return response.data;
  },

  // Criar meta
  create: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  // Obter estatísticas
  getStats: async () => {
    const response = await api.get('/goals/stats/overview');
    return response.data.stats;
  },
};

// Serviços de insights
export const insightService = {
  // Obter visão geral financeira
  getFinancialOverview: async (period = 'month') => {
    const response = await api.get(`/insights/financial-overview?period=${period}`);
    return response.data;
  },
};

// Função utilitária para verificar se o usuário está autenticado
export const isAuthenticated = () => {
  const token = localStorage.getItem('auth_token');
  const userData = localStorage.getItem('user_data');
  
  if (!token || !userData) {
    return false;
  }
  
  try {
    // Verificar se o token não está expirado (simples verificação)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000;
    
    if (payload.exp < now) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    return false;
  }
};

// Função para obter dados do usuário do localStorage
export const getCurrentUserData = () => {
  try {
    const userData = localStorage.getItem('user_data');
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    return null;
  }
};

export default api;