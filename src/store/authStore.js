import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { authService, getCurrentUserData, isAuthenticated } from '../services/api';
import toast from 'react-hot-toast';

const useAuthStore = create()(
  devtools(
    persist(
      (set, get) => ({
        // Estado
        user: getCurrentUserData(),
        isLoading: false,
        isAuthenticated: isAuthenticated(),

        // Ações de autenticação
        login: async (credentials) => {
          set({ isLoading: true });
          
          try {
            const response = await authService.login(credentials);
            
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success(`Bem-vindo(a), ${response.user.name}!`);
            return { success: true, user: response.user };
            
          } catch (error) {
            set({ isLoading: false });
            
            const message = error.response?.data?.error || 'Erro ao fazer login';
            toast.error(message);
            
            return { success: false, error: message };
          }
        },

        register: async (userData) => {
          set({ isLoading: true });
          
          try {
            const response = await authService.register(userData);
            
            set({
              user: response.user,
              isAuthenticated: true,
              isLoading: false,
            });
            
            toast.success(`Conta criada com sucesso! Bem-vindo(a), ${response.user.name}!`);
            return { success: true, user: response.user };
            
          } catch (error) {
            set({ isLoading: false });
            
            const message = error.response?.data?.error || 'Erro ao criar conta';
            toast.error(message);
            
            return { success: false, error: message };
          }
        },

        logout: async () => {
          set({ isLoading: true });
          
          try {
            await authService.logout();
            
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            
            toast.success('Logout realizado com sucesso!');
            
          } catch (error) {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
            
            console.error('Erro no logout:', error);
          }
        },

        updateProfile: async (userData) => {
          set({ isLoading: true });
          
          try {
            const response = await authService.updateProfile(userData);
            
            set({
              user: response.user,
              isLoading: false,
            });
            
            toast.success('Perfil atualizado com sucesso!');
            return { success: true, user: response.user };
            
          } catch (error) {
            set({ isLoading: false });
            
            const message = error.response?.data?.error || 'Erro ao atualizar perfil';
            toast.error(message);
            
            return { success: false, error: message };
          }
        },

        changePassword: async (passwordData) => {
          set({ isLoading: true });
          
          try {
            await authService.changePassword(passwordData);
            
            set({ isLoading: false });
            
            toast.success('Senha alterada com sucesso!');
            return { success: true };
            
          } catch (error) {
            set({ isLoading: false });
            
            const message = error.response?.data?.error || 'Erro ao alterar senha';
            toast.error(message);
            
            return { success: false, error: message };
          }
        },

        // Ação para verificar autenticação
        checkAuth: () => {
          const authenticated = isAuthenticated();
          const userData = getCurrentUserData();
          
          set({
            isAuthenticated: authenticated,
            user: authenticated ? userData : null,
          });
          
          return authenticated;
        },

        // Ação para limpar estado (usar em casos de erro)
        clearAuth: () => {
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthStore;