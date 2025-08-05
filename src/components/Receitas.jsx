import { TrendingUp, Plus, DollarSign, Calendar, Tag } from 'lucide-react'
import { useState } from 'react'
import { useFinancialData } from '../hooks/useFinancialData'

const Receitas = () => {
    const { receitas, adicionarReceita, removerReceita } = useFinancialData()
    const [novaReceita, setNovaReceita] = useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: '',
        recorrente: false
    })
    const [showForm, setShowForm] = useState(false)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const categorias = [
        'Salário',
        'Freelance',
        'Investimentos',
        'Vendas',
        'Bônus',
        'Outros'
    ]

    const handleAdicionarReceita = () => {
        if (!novaReceita.descricao || !novaReceita.valor || !novaReceita.data) {
            alert('Preencha todos os campos obrigatórios')
            return
        }

        adicionarReceita(novaReceita)
        setNovaReceita({
            descricao: '',
            valor: '',
            categoria: '',
            data: '',
            recorrente: false
        })
        setShowForm(false)
    }

    const totalReceitas = receitas.reduce((total, receita) => total + receita.valor, 0)
    const receitasMes = receitas.filter(r => {
        const hoje = new Date()
        const dataReceita = new Date(r.data)
        return dataReceita.getMonth() === hoje.getMonth() && 
               dataReceita.getFullYear() === hoje.getFullYear()
    })
    const totalMes = receitasMes.reduce((total, receita) => total + receita.valor, 0)

    return (
        <div className="receitas">
            <div className="section-header">
                <h2>📈 Receitas</h2>
                <p>Gerencie suas entradas financeiras</p>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">
                        <TrendingUp size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Geral</h3>
                        <span className="stat-value">{formatCurrency(totalReceitas)}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Calendar size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Este Mês</h3>
                        <span className="stat-value">{formatCurrency(totalMes)}</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon">
                        <Tag size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total de Registros</h3>
                        <span className="stat-value">{receitas.length}</span>
                    </div>
                </div>
            </div>

            <div className="actions-bar">
                <button 
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={20} />
                    Nova Receita
                </button>
            </div>

            {showForm && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>➕ Nova Receita</h3>
                        
                        <div className="form-group">
                            <label>Descrição</label>
                            <input
                                type="text"
                                value={novaReceita.descricao}
                                onChange={(e) => setNovaReceita({...novaReceita, descricao: e.target.value})}
                                placeholder="Ex: Salário, Freelance..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor</label>
                            <input
                                type="number"
                                value={novaReceita.valor}
                                onChange={(e) => setNovaReceita({...novaReceita, valor: e.target.value})}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoria</label>
                            <select
                                value={novaReceita.categoria}
                                onChange={(e) => setNovaReceita({...novaReceita, categoria: e.target.value})}
                            >
                                <option value="">Selecione...</option>
                                {categorias.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Data</label>
                            <input
                                type="date"
                                value={novaReceita.data}
                                onChange={(e) => setNovaReceita({...novaReceita, data: e.target.value})}
                            />
                        </div>

                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={novaReceita.recorrente}
                                    onChange={(e) => setNovaReceita({...novaReceita, recorrente: e.target.checked})}
                                />
                                Receita Recorrente
                            </label>
                        </div>

                        <div className="form-actions">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowForm(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={handleAdicionarReceita}
                            >
                                Adicionar Receita
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="receitas-list">
                <h3>📋 Lista de Receitas</h3>
                
                {receitas.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhuma receita cadastrada</p>
                    </div>
                ) : (
                    <div className="list-content">
                        {receitas.map(receita => (
                            <div key={receita.id} className="receita-item">
                                <div className="item-info">
                                    <h4>{receita.descricao}</h4>
                                    <p className="categoria">{receita.categoria}</p>
                                    <p className="data">
                                        {new Date(receita.data).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="item-valor">
                                    <span className="valor">{formatCurrency(receita.valor)}</span>
                                    {receita.recorrente && (
                                        <span className="badge recorrente">Recorrente</span>
                                    )}
                                </div>
                                <div className="item-actions">
                                    <button 
                                        className="btn-delete"
                                        onClick={() => removerReceita(receita.id)}
                                    >
                                        Remover
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Receitas 