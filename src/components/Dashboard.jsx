import { 
  ChartBarIcon, 
  CurrencyDollarIcon, 
  ArrowTrendingUpIcon, 
  ArrowTrendingDownIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { 
  useTransactionSummary, 
  useCategories, 
  useChartData,
  useCategoryChartData
} from '../hooks/useQuery'
import FinancialChart from './charts/FinancialChart'

const Dashboard = () => {
  const { data: summary, isLoading: summaryLoading } = useTransactionSummary()
  const { data: categoriesData, isLoading: categoriesLoading } = useCategories()
  
  // Dados para gráficos
  const { data: chartData, isLoading: chartDataLoading } = useChartData('6months')
  const { data: categoryChartData, isLoading: categoryChartLoading } = useCategoryChartData('current')

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value || 0)
  }

  const stats = [
    {
      title: 'Total de Receitas',
      value: formatCurrency(summary?.receitas?.total),
      change: '+4.2%',
      changeType: 'positive',
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total de Despesas',
      value: formatCurrency(summary?.despesas?.total),
      change: '+2.1%',
      changeType: 'negative',
      icon: ArrowTrendingDownIcon,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      title: 'Saldo Líquido',
      value: formatCurrency(summary?.saldoLiquido),
      change: summary?.saldoLiquido >= 0 ? '+8.3%' : '-3.2%',
      changeType: summary?.saldoLiquido >= 0 ? 'positive' : 'negative',
      icon: CurrencyDollarIcon,
      color: summary?.saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600',
      bgColor: summary?.saldoLiquido >= 0 ? 'bg-green-50' : 'bg-red-50',
    },
    {
      title: 'Categorias Ativas',
      value: categoriesData?.total || 0,
      change: '+2',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
  ]

  if (summaryLoading || categoriesLoading || chartDataLoading || categoryChartLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-96"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-24 mb-3"></div>
              <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Financeiro
        </h1>
        <p className="text-gray-600 mt-1">
          Visão geral das suas finanças pessoais
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div key={index} className="card card-hover">
              <div className="flex items-center">
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    <p className={`ml-2 text-sm font-medium ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <FinancialChart
          data={chartData || [
            { name: 'Jan', receitas: 4500, despesas: 3200, saldo: 1300 },
            { name: 'Fev', receitas: 5200, despesas: 3800, saldo: 1400 },
            { name: 'Mar', receitas: 4800, despesas: 3500, saldo: 1300 },
            { name: 'Abr', receitas: 5500, despesas: 4200, saldo: 1300 },
            { name: 'Mai', receitas: 6000, despesas: 4500, saldo: 1500 },
            { name: 'Jun', receitas: 5800, despesas: 4100, saldo: 1700 },
          ]}
          type="line"
          title="Evolução Financeira (Últimos 6 meses)"
          height={300}
        />
        <FinancialChart
          data={categoryChartData || [
            { name: 'Moradia', value: 2500 },
            { name: 'Alimentação', value: 1200 },
            { name: 'Transporte', value: 800 },
            { name: 'Lazer', value: 600 },
            { name: 'Saúde', value: 400 },
          ]}
          type="pie"
          title="Distribuição por Categoria"
          height={300}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Últimas Transações
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Mock data - replace with actual transactions */}
            {[
              { name: 'Salário', amount: 5000, type: 'receita', date: 'Hoje' },
              { name: 'Supermercado', amount: -250, type: 'despesa', date: 'Ontem' },
              { name: 'Freelance', amount: 800, type: 'receita', date: '2 dias atrás' },
            ].map((transaction, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-3 ${
                    transaction.type === 'receita' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {transaction.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.date}
                    </p>
                  </div>
                </div>
                <p className={`text-sm font-medium ${
                  transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {formatCurrency(Math.abs(transaction.amount))}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Distribuição por Categoria
            </h3>
            <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
              Ver detalhes
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Mock data - replace with actual category data */}
            {[
              { name: 'Alimentação', percentage: 35, amount: 1250, color: 'bg-blue-500' },
              { name: 'Transporte', percentage: 25, amount: 800, color: 'bg-green-500' },
              { name: 'Lazer', percentage: 20, amount: 600, color: 'bg-yellow-500' },
              { name: 'Outros', percentage: 20, amount: 550, color: 'bg-gray-500' },
            ].map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${category.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">
                      {category.name}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(category.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {category.percentage}%
                    </p>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${category.color}`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Ações Rápidas
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
            <ArrowTrendingUpIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">
              Nova Receita
            </span>
          </button>
          
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
            <ArrowTrendingDownIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">
              Nova Despesa
            </span>
          </button>
          
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
            <ChartBarIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">
              Nova Categoria
            </span>
          </button>
          
          <button className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors duration-200">
            <CurrencyDollarIcon className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm font-medium text-gray-600">
              Nova Meta
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard