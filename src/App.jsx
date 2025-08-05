import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from 'react-hot-toast'
import useAuthStore from './store/authStore'

// Componentes
import Layout from './components/Layout'
import Dashboard from './components/Dashboard'
import Categorias from './components/Categorias'
import Transacoes from './components/Transacoes'
import Metas from './components/Metas'
import Insights from './components/Insights'
import LoginForm from './components/auth/LoginForm'
import RegisterForm from './components/auth/RegisterForm'

// Criar instância do QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutos
    },
  },
})

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showLogin, setShowLogin] = useState(true)
  const { isAuthenticated, checkAuth, isLoading } = useAuthStore()

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuth()
  }, [])

  // Renderizar conteúdo baseado na aba ativa
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'categorias':
        return <Categorias />
      case 'transacoes':
        return <Transacoes />
      case 'metas':
        return <Metas />
      case 'insights':
        return <Insights />
      default:
        return <Dashboard />
    }
  }

  // Se não estiver autenticado, mostrar tela de login/registro
  if (!isAuthenticated) {
    return (
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center p-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Finanças Pessoais
              </h1>
              <p className="text-gray-600">
                Gerencie suas finanças de forma inteligente
              </p>
            </div>

            <div className="card">
              {showLogin ? (
                <LoginForm 
                  onToggle={() => setShowLogin(false)}
                  isLoading={isLoading}
                />
              ) : (
                <RegisterForm 
                  onToggle={() => setShowLogin(true)}
                  isLoading={isLoading}
                />
              )}
            </div>
          </div>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </QueryClientProvider>
    )
  }

  // Interface principal da aplicação
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Layout
          activeTab={activeTab}
          onTabChange={setActiveTab}
        >
          {renderContent()}
        </Layout>
      </div>

      {/* Configuração do React Query Devtools (apenas em desenvolvimento) */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools 
          initialIsOpen={false} 
          position="bottom-right"
        />
      )}

      {/* Configuração do Toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#059669',
              color: '#fff',
            },
          },
          error: {
            style: {
              background: '#dc2626',
              color: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  )
}

export default App