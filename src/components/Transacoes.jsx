import { useState } from 'react'
import { PlusIcon } from '@heroicons/react/24/outline'
import TransactionList from './transactions/TransactionList'
import TransactionForm from './transactions/TransactionForm'
import AdvancedFilters from './filters/AdvancedFilters'
import { useTransactions, useCategories } from '../hooks/useQuery'

const Transacoes = () => {
  const [showForm, setShowForm] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)
  const [activeFilters, setActiveFilters] = useState({})

  const { data: transactions = [], isLoading, refetch } = useTransactions(activeFilters)
  const { data: categories = [] } = useCategories()

  const handleAddTransaction = () => {
    setEditingTransaction(null)
    setShowForm(true)
  }

  const handleEditTransaction = (transaction) => {
    setEditingTransaction(transaction)
    setShowForm(true)
  }

  const handleDeleteTransaction = async (transactionId) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      // TODO: Implementar delete via API
      console.log('Deletar transação:', transactionId)
      refetch()
    }
  }

  const handleSaveTransaction = async (transactionData) => {
    try {
      // TODO: Implementar save via API
      console.log('Salvar transação:', transactionData)
      setShowForm(false)
      setEditingTransaction(null)
      refetch()
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
    }
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingTransaction(null)
  }

  const handleApplyFilters = (filters) => {
    setActiveFilters(filters)
  }

  const handleClearFilters = () => {
    setActiveFilters({})
  }

  if (isLoading) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Transações
          </h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas receitas e despesas
          </p>
        </div>
        
        <button
          onClick={handleAddTransaction}
          className="btn-primary flex items-center"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Nova Transação
        </button>
      </div>

      {/* Filtros Avançados */}
      <AdvancedFilters
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        categories={categories}
      />

      {/* Lista de Transações */}
      <TransactionList
        transactions={transactions}
        onEdit={handleEditTransaction}
        onDelete={handleDeleteTransaction}
      />

      {/* Formulário Modal */}
      {showForm && (
        <TransactionForm
          transaction={editingTransaction}
          onSave={handleSaveTransaction}
          onCancel={handleCancelForm}
          categories={categories}
        />
      )}
    </div>
  )
}

export default Transacoes