import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import TransactionForm from '../transactions/TransactionForm'

describe('TransactionForm', () => {
  const mockCategories = [
    { id: 1, name: 'Moradia', type: 'despesa' },
    { id: 2, name: 'Alimentação', type: 'despesa' },
    { id: 3, name: 'Salário', type: 'receita' },
  ]

  const mockOnSave = vi.fn()
  const mockOnCancel = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza formulário para nova transação', () => {
    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Nova Transação')).toBeInTheDocument()
    expect(screen.getByLabelText('Descrição')).toBeInTheDocument()
    expect(screen.getByLabelText('Valor')).toBeInTheDocument()
    expect(screen.getByLabelText('Categoria')).toBeInTheDocument()
    expect(screen.getByLabelText('Data')).toBeInTheDocument()
  })

  it('renderiza formulário para editar transação', () => {
    const mockTransaction = {
      id: 1,
      description: 'Teste',
      amount: -100,
      type: 'despesa',
      category: 'Moradia',
      date: '2024-01-01',
      notes: 'Observação teste',
    }

    render(
      <TransactionForm
        transaction={mockTransaction}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    expect(screen.getByText('Editar Transação')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Teste')).toBeInTheDocument()
    expect(screen.getByDisplayValue('100')).toBeInTheDocument()
  })

  it('valida campos obrigatórios', async () => {
    const user = userEvent.setup()

    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    // Tentar salvar sem preencher campos obrigatórios
    const saveButton = screen.getByText('Salvar')
    await user.click(saveButton)

    // Verificar se os erros aparecem
    await waitFor(() => {
      expect(screen.getByText('Descrição é obrigatória')).toBeInTheDocument()
      expect(screen.getByText('Valor deve ser maior que zero')).toBeInTheDocument()
      expect(screen.getByText('Categoria é obrigatória')).toBeInTheDocument()
    })

    expect(mockOnSave).not.toHaveBeenCalled()
  })

  it('salva transação com dados válidos', async () => {
    const user = userEvent.setup()

    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    // Preencher formulário
    await user.type(screen.getByLabelText('Descrição'), 'Teste Transação')
    await user.type(screen.getByLabelText('Valor'), '100')
    await user.selectOptions(screen.getByLabelText('Categoria'), 'Moradia')
    await user.type(screen.getByLabelText('Data'), '2024-01-01')

    // Salvar
    const saveButton = screen.getByText('Salvar')
    await user.click(saveButton)

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith({
        description: 'Teste Transação',
        amount: -100, // Negativo porque é despesa
        type: 'despesa',
        category: 'Moradia',
        date: '2024-01-01',
        notes: '',
        isRecurring: false,
        recurringFrequency: 'monthly',
        id: undefined
      })
    })
  })

  it('filtra categorias por tipo de transação', async () => {
    const user = userEvent.setup()

    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    // Mudar para receita
    const receitaRadio = screen.getByLabelText('Receita')
    await user.click(receitaRadio)

    // Verificar se apenas categorias de receita aparecem
    const categorySelect = screen.getByLabelText('Categoria')
    expect(categorySelect).toHaveDisplayValue('Selecione uma categoria')
    
    // Verificar opções disponíveis
    const options = Array.from(categorySelect.options)
    expect(options).toHaveLength(2) // Selecione + Salário
    expect(options[1].text).toBe('Salário')
  })

  it('cancela formulário', async () => {
    const user = userEvent.setup()

    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    const cancelButton = screen.getByText('Cancelar')
    await user.click(cancelButton)

    expect(mockOnCancel).toHaveBeenCalled()
  })

  it('habilita campos de recorrência quando marcado', async () => {
    const user = userEvent.setup()

    render(
      <TransactionForm
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        categories={mockCategories}
      />
    )

    const recurringCheckbox = screen.getByLabelText('Transação recorrente')
    await user.click(recurringCheckbox)

    expect(screen.getByLabelText('Frequência')).toBeInTheDocument()
  })
}) 