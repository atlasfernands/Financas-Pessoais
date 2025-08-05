import { Brain, TrendingUp, Download, Upload, Target, BarChart3, PieChart, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { useState, useEffect } from 'react'
import MemoryService from '../services/MemoryService'

const Memorias = () => {
    const [memories, setMemories] = useState(null)
    const [insights, setInsights] = useState([])
    const [evolucao, setEvolucao] = useState([])
    const [metas, setMetas] = useState([])
    const [novaMeta, setNovaMeta] = useState({
        titulo: '',
        valor: '',
        prazo: '',
        tipo: 'economia' // economia, receita, reducao_despesa
    })
    const [showMetaForm, setShowMetaForm] = useState(false)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR')
    }

    // Carregar dados das memórias
    const carregarDados = () => {
        const mem = MemoryService.inicializar()
        const insightsRecentes = MemoryService.getInsightsRecentes(10)
        const evolucaoMeses = MemoryService.getEvolucaoMeses(6)
        const metasAtivas = MemoryService.getMetasAtivas()
        
        setMemories(mem)
        setInsights(insightsRecentes)
        setEvolucao(evolucaoMeses)
        setMetas(metasAtivas)
    }

    useEffect(() => {
        carregarDados()
    }, [])

    // Gerar snapshot mensal
    const gerarSnapshot = () => {
        MemoryService.registrarSnapshotMensal()
        carregarDados()
    }

    // Gerar novos insights
    const gerarInsights = () => {
        MemoryService.gerarInsights()
        carregarDados()
    }

    // Exportar dados
    const exportarDados = () => {
        const dados = MemoryService.exportarDados()
        const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `financas-backup-${new Date().toISOString().split('T')[0]}.json`
        a.click()
        URL.revokeObjectURL(url)
    }

    // Importar dados
    const importarDados = (event) => {
        const file = event.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (e) => {
            try {
                const dados = JSON.parse(e.target.result)
                const sucesso = MemoryService.importarDados(dados)
                if (sucesso) {
                    alert('Dados importados com sucesso!')
                    carregarDados()
                } else {
                    alert('Erro ao importar dados')
                }
            } catch (error) {
                alert('Arquivo inválido')
            }
        }
        reader.readAsText(file)
    }

    // Adicionar nova meta
    const adicionarMeta = () => {
        if (!novaMeta.titulo || !novaMeta.valor || !novaMeta.prazo) {
            alert('Preencha todos os campos da meta')
            return
        }

        MemoryService.definirMeta({
            ...novaMeta,
            valor: parseFloat(novaMeta.valor)
        })

        setNovaMeta({
            titulo: '',
            valor: '',
            prazo: '',
            tipo: 'economia'
        })
        setShowMetaForm(false)
        carregarDados()
    }

    const getInsightIcon = (tipo) => {
        switch (tipo) {
            case 'positivo':
                return <CheckCircle size={20} className="text-green-500" />
            case 'alerta':
                return <AlertCircle size={20} className="text-red-500" />
            default:
                return <Info size={20} className="text-blue-500" />
        }
    }

    const getInsightColor = (tipo) => {
        switch (tipo) {
            case 'positivo':
                return 'border-green-200 bg-green-50'
            case 'alerta':
                return 'border-red-200 bg-red-50'
            default:
                return 'border-blue-200 bg-blue-50'
        }
    }

    return (
        <div className="memorias">
            <div className="section-header">
                <h2>🧠 Memórias Financeiras</h2>
                <p>Análises inteligentes e insights de longo prazo</p>
            </div>

            <div className="memorias-actions">
                <button 
                    className="btn-primary"
                    onClick={gerarSnapshot}
                >
                    <BarChart3 size={20} />
                    Gerar Snapshot
                </button>
                
                <button 
                    className="btn-primary"
                    onClick={gerarInsights}
                >
                    <Brain size={20} />
                    Gerar Insights
                </button>

                <button 
                    className="btn-secondary"
                    onClick={exportarDados}
                >
                    <Download size={20} />
                    Exportar Dados
                </button>

                <label className="btn-secondary file-input-label">
                    <Upload size={20} />
                    Importar Dados
                    <input
                        type="file"
                        accept=".json"
                        onChange={importarDados}
                        style={{display: 'none'}}
                    />
                </label>
            </div>

            <div className="memorias-grid">
                {/* Evolução dos Últimos Meses */}
                <div className="memoria-card">
                    <h3>📈 Evolução dos Últimos Meses</h3>
                    {evolucao.length > 0 ? (
                        <div className="evolucao-chart">
                            {evolucao.map(mes => (
                                <div key={mes.mes} className="evolucao-item">
                                    <div className="mes-label">{mes.mes}</div>
                                    <div className="mes-values">
                                        <div className="receitas">
                                            Receitas: {formatCurrency(mes.receitas)}
                                        </div>
                                        <div className="despesas">
                                            Despesas: {formatCurrency(mes.despesas)}
                                        </div>
                                        <div className={`saldo ${mes.saldo_liquido >= 0 ? 'positivo' : 'negativo'}`}>
                                            Saldo: {formatCurrency(mes.saldo_liquido)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Gere um snapshot para ver a evolução</p>
                        </div>
                    )}
                </div>

                {/* Insights Recentes */}
                <div className="memoria-card">
                    <h3>💡 Insights Recentes</h3>
                    {insights.length > 0 ? (
                        <div className="insights-list">
                            {insights.map((insight, index) => (
                                <div key={index} className={`insight-item ${getInsightColor(insight.tipo)}`}>
                                    <div className="insight-header">
                                        {getInsightIcon(insight.tipo)}
                                        <h4>{insight.titulo}</h4>
                                    </div>
                                    <p>{insight.descricao}</p>
                                    <small>{formatDate(insight.data)}</small>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Gere insights para ver análises automáticas</p>
                        </div>
                    )}
                </div>

                {/* Metas Financeiras */}
                <div className="memoria-card metas-card">
                    <div className="card-header-with-action">
                        <h3>🎯 Metas Financeiras</h3>
                        <button 
                            className="btn-primary small"
                            onClick={() => setShowMetaForm(true)}
                        >
                            <Target size={16} />
                            Nova Meta
                        </button>
                    </div>

                    {metas.length > 0 ? (
                        <div className="metas-list">
                            {metas.map(meta => (
                                <div key={meta.id} className="meta-item">
                                    <h4>{meta.titulo}</h4>
                                    <div className="meta-details">
                                        <span>Valor: {formatCurrency(meta.valor)}</span>
                                        <span>Prazo: {formatDate(meta.prazo)}</span>
                                        <span className={`meta-tipo ${meta.tipo}`}>
                                            {meta.tipo === 'economia' ? '💰 Economia' : 
                                             meta.tipo === 'receita' ? '📈 Receita' : 
                                             '📉 Redução'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p>Defina suas metas financeiras</p>
                        </div>
                    )}
                </div>

                {/* Estatísticas Gerais */}
                <div className="memoria-card">
                    <h3>📊 Estatísticas das Memórias</h3>
                    {memories && (
                        <div className="stats-memories">
                            <div className="stat-memory">
                                <label>Snapshots Salvos:</label>
                                <span>{memories.balances?.length || 0}</span>
                            </div>
                            <div className="stat-memory">
                                <label>Análises de Categorias:</label>
                                <span>{memories.categories?.length || 0}</span>
                            </div>
                            <div className="stat-memory">
                                <label>Insights Gerados:</label>
                                <span>{memories.insights?.length || 0}</span>
                            </div>
                            <div className="stat-memory">
                                <label>Metas Definidas:</label>
                                <span>{memories.goals?.length || 0}</span>
                            </div>
                            <div className="stat-memory">
                                <label>Criado em:</label>
                                <span>{formatDate(memories.created_at)}</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de Nova Meta */}
            {showMetaForm && (
                <div className="form-modal">
                    <div className="form-content">
                        <h3>🎯 Nova Meta Financeira</h3>
                        
                        <div className="form-group">
                            <label>Título da Meta</label>
                            <input
                                type="text"
                                value={novaMeta.titulo}
                                onChange={(e) => setNovaMeta({...novaMeta, titulo: e.target.value})}
                                placeholder="Ex: Economizar para viagem"
                            />
                        </div>

                        <div className="form-group">
                            <label>Valor</label>
                            <input
                                type="number"
                                value={novaMeta.valor}
                                onChange={(e) => setNovaMeta({...novaMeta, valor: e.target.value})}
                                placeholder="R$ 0,00"
                            />
                        </div>

                        <div className="form-group">
                            <label>Prazo</label>
                            <input
                                type="date"
                                value={novaMeta.prazo}
                                onChange={(e) => setNovaMeta({...novaMeta, prazo: e.target.value})}
                            />
                        </div>

                        <div className="form-group">
                            <label>Tipo de Meta</label>
                            <select
                                value={novaMeta.tipo}
                                onChange={(e) => setNovaMeta({...novaMeta, tipo: e.target.value})}
                            >
                                <option value="economia">💰 Economia</option>
                                <option value="receita">📈 Aumento de Receita</option>
                                <option value="reducao_despesa">📉 Redução de Despesas</option>
                            </select>
                        </div>

                        <div className="form-actions">
                            <button 
                                className="btn-secondary"
                                onClick={() => setShowMetaForm(false)}
                            >
                                Cancelar
                            </button>
                            <button 
                                className="btn-primary"
                                onClick={adicionarMeta}
                            >
                                Criar Meta
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Memorias