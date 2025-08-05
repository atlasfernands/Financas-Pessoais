import { Tag, Plus, DollarSign, Calendar, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { useFinancialData } from '../hooks/useFinancialData'

const Despesas = () => {
    const { despesas, adicionarDespesa, removerDespesa } = useFinancialData()
    const [novaDespesa, setNovaDespesa] = useState({
        descricao: '',
        valor: '',
        categoria: '',
        data: '',
        recorrente: false,
        prioridade: 'media'
    })
    const [showForm, setShowForm] = useState(false)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const categorias = [
        'Moradia',
        'Alimentação',
        'Transporte',
        'Saúde',
        'Educação',
        'Lazer',
        'Vestuário',
        'Contas',
        'Outros'
    ]

    const handleAdicionarDespesa = () => {
        if (!novaDespesa.descricao || !novaDespesa.valor || !novaDespesa.data) {
            alert('Preencha todos os campos obrigatórios')
            return
        }

        adicionarDespesa(novaDespesa)
        setNovaDespesa({
            descricao: '',
            valor: '',
            categoria: '',
            data: '',
            recorrente: false,
            prioridade: 'media'
        })
        setShowForm(false)
    }

    const totalDespesas = despesas.reduce((total, despesa) => total + despesa.valor, 0)
    const despesasMes = despesas.filter(d => {
        const hoje = new Date()
        const dataDespesa = new Date(d.data)
        return dataDespesa.getMonth() === hoje.getMonth() && 
               dataDespesa.getFullYear() === hoje.getFullYear()
    })
    const totalMes = despesasMes.reduce((total, despesa) => total + despesa.valor, 0)

    const getPrioridadeColor = (prioridade) => {
        switch (prioridade) {
            case 'alta': return 'red'
            case 'media': return 'orange'
            case 'baixa': return 'green'
            default: return 'gray'
        }
    }

    const getPrioridadeLabel = (prioridade) => {
        switch (prioridade) {
            case 'alta': return 'Alta'
            case 'media': return 'Média'
            case 'baixa': return 'Baixa'
            default: return 'Média'
        }
    }

    return (
        <div className="despesas">
            <div className="section-header">
                <h2>💸 Despesas</h2>
                <p>Controle seus gastos e despesas</p>
            </div>

            <div className="stats-overview">
                <div className="stat-card">
                    <div className="stat-icon">
                        <Tag size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total Geral</h3>
                        <span className="stat-value">{formatCurrency(totalDespesas)}</span>
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
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stat-content">
                        <h3>Total de Registros</h3>
                        <span className="stat-value">{despesas.length}</span>
                    </div>
                </div>
            </div>

            <div className="actions-bar">
                <button 
                    className="btn-primary"
                    onClick={() => setShowForm(true)}
                >
                    <Plus size={20} />
                    Nova Despesa
                </button>
            </div>

            {showForm && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>➕ Nova Despesa</h3>
                        
                        <div className="form-group">
                            <label>Descrição</label>
                            <input
                                type="text"
                                value={novaDespesa.descricao}
                                onChange={(e) => setNovaDespesa({...novaDespesa, descricao: e.target.value})}
                                placeholder="Ex: Aluguel, Conta de luz..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor</label>
                            <input
                                type="number"
                                value={novaDespesa.valor}
                                onChange={(e) => setNovaDespesa({...novaDespesa, valor: e.target.value})}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Categoria</label>
                            <select
                                value={novaDespesa.categoria}
                                onChange={(e) => setNovaDespesa({...novaDespesa, categoria: e.target.value})}
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
                                value={novaDespesa.data}
                                onChange={(e) => setNovaDespesa({...novaDespesa, data: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Prioridade</label>
                            <select
                                value={novaDespesa.prioridade}
                                onChange={(e) => setNovaDespesa({...novaDespesa, prioridade: e.target.value})}
                            >
                                <option value="baixa">Baixa</option>
                                <option value="media">Média</option>
                                <option value="alta">Alta</option>
                            </select>
                        </div>

                        <div className="form-group checkbox">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={novaDespesa.recorrente}
                                    onChange={(e) => setNovaDespesa({...novaDespesa, recorrente: e.target.checked})}
                                />
                                Despesa Recorrente
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
                                onClick={handleAdicionarDespesa}
                            >
                                Adicionar Despesa
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="despesas-list">
                <h3>📋 Lista de Despesas</h3>
                
                {despesas.length === 0 ? (
                    <div className="empty-state">
                        <p>Nenhuma despesa cadastrada</p>
                    </div>
                ) : (
                    <div className="list-content">
                        {despesas.map(despesa => (
                            <div key={despesa.id} className="despesa-item">
                                <div className="item-info">
                                    <h4>{despesa.descricao}</h4>
                                    <p className="categoria">{despesa.categoria}</p>
                                    <p className="data">
                                        {new Date(despesa.data).toLocaleDateString('pt-BR')}
                                    </p>
                                </div>
                                <div className="item-valor">
                                    <span className="valor">{formatCurrency(despesa.valor)}</span>
                                    <span 
                                        className={`badge prioridade ${despesa.prioridade}`}
                                        style={{backgroundColor: getPrioridadeColor(despesa.prioridade)}}
                                    >
                                        {getPrioridadeLabel(despesa.prioridade)}
                                    </span>
                                    {despesa.recorrente && (
                                        <span className="badge recorrente">Recorrente</span>
                                    )}
                                </div>
                                <div className="item-actions">
                                    <button 
                                        className="btn-delete"
                                        onClick={() => removerDespesa(despesa.id)}
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

export default Despesas 