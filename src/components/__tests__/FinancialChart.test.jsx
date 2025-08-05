import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import FinancialChart from '../charts/FinancialChart'

describe('FinancialChart', () => {
  const mockData = [
    { name: 'Jan', receitas: 4500, despesas: 3200, saldo: 1300 },
    { name: 'Fev', receitas: 5200, despesas: 3800, saldo: 1400 },
  ]

  it('renderiza o gráfico com título', () => {
    render(
      <FinancialChart
        data={mockData}
        type="line"
        title="Teste Gráfico"
        height={300}
      />
    )

    expect(screen.getByText('Teste Gráfico')).toBeInTheDocument()
  })

  it('renderiza gráfico de linha por padrão', () => {
    render(
      <FinancialChart
        data={mockData}
        title="Gráfico de Linha"
      />
    )

    expect(screen.getByText('Gráfico de Linha')).toBeInTheDocument()
  })

  it('renderiza gráfico de pizza com dados corretos', () => {
    const pieData = [
      { name: 'Moradia', value: 2500 },
      { name: 'Alimentação', value: 1200 },
    ]

    render(
      <FinancialChart
        data={pieData}
        type="pie"
        title="Gráfico de Pizza"
      />
    )

    expect(screen.getByText('Gráfico de Pizza')).toBeInTheDocument()
  })

  it('renderiza gráfico de barras', () => {
    render(
      <FinancialChart
        data={mockData}
        type="bar"
        title="Gráfico de Barras"
      />
    )

    expect(screen.getByText('Gráfico de Barras')).toBeInTheDocument()
  })

  it('renderiza gráfico de área', () => {
    render(
      <FinancialChart
        data={mockData}
        type="area"
        title="Gráfico de Área"
      />
    )

    expect(screen.getByText('Gráfico de Área')).toBeInTheDocument()
  })

  it('exibe mensagem para tipo de gráfico não suportado', () => {
    render(
      <FinancialChart
        data={mockData}
        type="invalid"
        title="Gráfico Inválido"
      />
    )

    expect(screen.getByText('Tipo de gráfico não suportado')).toBeInTheDocument()
  })

  it('renderiza sem título quando não fornecido', () => {
    render(
      <FinancialChart
        data={mockData}
        type="line"
      />
    )

    // Não deve ter título
    expect(screen.queryByRole('heading')).not.toBeInTheDocument()
  })
}) 