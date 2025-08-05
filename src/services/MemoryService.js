/**
 * Sistema de Memórias Financeiras
 * Armazena e analisa dados financeiros de longo prazo
 */

class MemoryService {
    static STORAGE_KEY = 'financial_memories'
    
    // Inicializar o sistema de memórias
    static inicializar() {
        const memories = this.getMemories()
        if (!memories) {
            const defaultMemories = {
                balances: [], // Histórico de saldos
                categories: [], // Evolução das categorias
                habits: [], // Padrões de comportamento
                goals: [], // Metas financeiras
                insights: [], // Insights automáticos
                created_at: new Date().toISOString()
            }
            this.saveMemories(defaultMemories)
            return defaultMemories
        }
        return memories
    }

    // Salvar memórias no localStorage
    static saveMemories(memories) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(memories))
    }

    // Carregar memórias do localStorage
    static getMemories() {
        const data = localStorage.getItem(this.STORAGE_KEY)
        return data ? JSON.parse(data) : null
    }

    // Registrar snapshot mensal dos saldos
    static registrarSnapshotMensal() {
        const memories = this.getMemories() || this.inicializar()
        const hoje = new Date()
        const mesAtual = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}`
        
        // Pegar dados financeiros atuais
        const bancoDados = JSON.parse(localStorage.getItem('bancoDados') || '{"cobrancas": [], "clientes": []}')
        const receitas = JSON.parse(localStorage.getItem('receitas') || '[]')
        const despesas = JSON.parse(localStorage.getItem('despesas') || '[]')
        
        // Calcular totais
        const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0)
        const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)
        const saldoLiquido = totalReceitas - totalDespesas
        
        const snapshot = {
            mes: mesAtual,
            data: hoje.toISOString(),
            receitas: totalReceitas,
            despesas: totalDespesas,
            saldo_liquido: saldoLiquido,
            total_receitas_count: receitas.length,
            total_despesas_count: despesas.length,
            cobrancas_pagas: bancoDados.cobrancas.filter(c => c.status).length,
            cobrancas_pendentes: bancoDados.cobrancas.filter(c => !c.status).length
        }

        // Verificar se já existe snapshot para este mês
        const existingIndex = memories.balances.findIndex(b => b.mes === mesAtual)
        if (existingIndex >= 0) {
            memories.balances[existingIndex] = snapshot
        } else {
            memories.balances.push(snapshot)
        }

        // Manter apenas os últimos 24 meses
        memories.balances = memories.balances
            .sort((a, b) => new Date(b.data) - new Date(a.data))
            .slice(0, 24)

        this.saveMemories(memories)
        return snapshot
    }

    // Analisar padrões de gastos por categoria
    static analisarPadroesCategorias() {
        const memories = this.getMemories() || this.inicializar()
        const despesas = JSON.parse(localStorage.getItem('despesas') || '[]')
        const receitas = JSON.parse(localStorage.getItem('receitas') || '[]')
        
        const analise = {
            categorias_despesas: {},
            categorias_receitas: {},
            tendencias: [],
            data_analise: new Date().toISOString()
        }

        // Analisar despesas por categoria
        despesas.forEach(despesa => {
            const categoria = despesa.categoria || 'Sem categoria'
            if (!analise.categorias_despesas[categoria]) {
                analise.categorias_despesas[categoria] = {
                    total: 0,
                    count: 0,
                    media: 0,
                    recorrentes: 0
                }
            }
            analise.categorias_despesas[categoria].total += despesa.valor
            analise.categorias_despesas[categoria].count += 1
            if (despesa.recorrente) {
                analise.categorias_despesas[categoria].recorrentes += 1
            }
        })

        // Analisar receitas por categoria
        receitas.forEach(receita => {
            const categoria = receita.categoria || 'Sem categoria'
            if (!analise.categorias_receitas[categoria]) {
                analise.categorias_receitas[categoria] = {
                    total: 0,
                    count: 0,
                    media: 0,
                    recorrentes: 0
                }
            }
            analise.categorias_receitas[categoria].total += receita.valor
            analise.categorias_receitas[categoria].count += 1
            if (receita.recorrente) {
                analise.categorias_receitas[categoria].recorrentes += 1
            }
        })

        // Calcular médias
        Object.keys(analise.categorias_despesas).forEach(cat => {
            const data = analise.categorias_despesas[cat]
            data.media = data.total / data.count
        })

        Object.keys(analise.categorias_receitas).forEach(cat => {
            const data = analise.categorias_receitas[cat]
            data.media = data.total / data.count
        })

        // Salvar análise
        memories.categories.push(analise)
        
        // Manter apenas as últimas 12 análises
        memories.categories = memories.categories.slice(-12)
        
        this.saveMemories(memories)
        return analise
    }

    // Gerar insights automáticos
    static gerarInsights() {
        const memories = this.getMemories() || this.inicializar()
        const insights = []
        
        // Insight sobre evolução do saldo
        if (memories.balances.length >= 2) {
            const ultimosMeses = memories.balances.slice(0, 2)
            const crescimento = ultimosMeses[0].saldo_liquido - ultimosMeses[1].saldo_liquido
            
            if (crescimento > 0) {
                insights.push({
                    tipo: 'positivo',
                    titulo: '📈 Crescimento Financeiro',
                    descricao: `Seu saldo líquido cresceu R$ ${crescimento.toFixed(2)} no último mês!`,
                    data: new Date().toISOString()
                })
            } else if (crescimento < 0) {
                insights.push({
                    tipo: 'alerta',
                    titulo: '⚠️ Saldo em Declínio',
                    descricao: `Seu saldo líquido diminuiu R$ ${Math.abs(crescimento).toFixed(2)} no último mês.`,
                    data: new Date().toISOString()
                })
            }
        }

        // Insight sobre categoria mais gasta
        const analiseAtual = this.analisarPadroesCategorias()
        const categoriasMaioresGastos = Object.entries(analiseAtual.categorias_despesas)
            .sort(([,a], [,b]) => b.total - a.total)
            .slice(0, 1)

        if (categoriasMaioresGastos.length > 0) {
            const [categoria, dados] = categoriasMaioresGastos[0]
            insights.push({
                tipo: 'informativo',
                titulo: '💸 Categoria Principal',
                descricao: `Sua maior categoria de gastos é "${categoria}" com R$ ${dados.total.toFixed(2)}.`,
                data: new Date().toISOString()
            })
        }

        // Insight sobre hábitos de economia
        const totalReceitas = Object.values(analiseAtual.categorias_receitas)
            .reduce((sum, cat) => sum + cat.total, 0)
        const totalDespesas = Object.values(analiseAtual.categorias_despesas)
            .reduce((sum, cat) => sum + cat.total, 0)
        
        if (totalReceitas > 0) {
            const percentualEconomia = ((totalReceitas - totalDespesas) / totalReceitas) * 100
            
            if (percentualEconomia >= 20) {
                insights.push({
                    tipo: 'positivo',
                    titulo: '🏆 Excelente Disciplina',
                    descricao: `Você está economizando ${percentualEconomia.toFixed(1)}% da sua renda!`,
                    data: new Date().toISOString()
                })
            } else if (percentualEconomia >= 10) {
                insights.push({
                    tipo: 'positivo',
                    titulo: '👍 Boa Economia',
                    descricao: `Você está economizando ${percentualEconomia.toFixed(1)}% da sua renda.`,
                    data: new Date().toISOString()
                })
            } else if (percentualEconomia < 0) {
                insights.push({
                    tipo: 'alerta',
                    titulo: '🚨 Gastos Excessivos',
                    descricao: `Você está gastando mais do que recebe. Revise seus gastos!`,
                    data: new Date().toISOString()
                })
            }
        }

        // Salvar insights
        memories.insights.push(...insights)
        
        // Manter apenas os últimos 50 insights
        memories.insights = memories.insights.slice(-50)
        
        this.saveMemories(memories)
        return insights
    }

    // Obter evolução dos últimos meses
    static getEvolucaoMeses(quantidade = 6) {
        const memories = this.getMemories() || this.inicializar()
        return memories.balances.slice(0, quantidade).reverse()
    }

    // Obter insights recentes
    static getInsightsRecentes(quantidade = 10) {
        const memories = this.getMemories() || this.inicializar()
        return memories.insights.slice(-quantidade).reverse()
    }

    // Definir meta financeira
    static definirMeta(meta) {
        const memories = this.getMemories() || this.inicializar()
        
        const novaMeta = {
            id: Date.now(),
            ...meta,
            criada_em: new Date().toISOString(),
            ativa: true
        }

        memories.goals.push(novaMeta)
        this.saveMemories(memories)
        return novaMeta
    }

    // Obter metas ativas
    static getMetasAtivas() {
        const memories = this.getMemories() || this.inicializar()
        return memories.goals.filter(g => g.ativa)
    }

    // Exportar dados para backup
    static exportarDados() {
        const memories = this.getMemories() || this.inicializar()
        const dadosCompletos = {
            memories,
            receitas: JSON.parse(localStorage.getItem('receitas') || '[]'),
            despesas: JSON.parse(localStorage.getItem('despesas') || '[]'),
            categorias: JSON.parse(localStorage.getItem('categorias') || '[]'),
            bancoDados: JSON.parse(localStorage.getItem('bancoDados') || '{}'),
            exportado_em: new Date().toISOString()
        }
        
        return dadosCompletos
    }

    // Importar dados de backup
    static importarDados(dados) {
        try {
            if (dados.memories) {
                this.saveMemories(dados.memories)
            }
            if (dados.receitas) {
                localStorage.setItem('receitas', JSON.stringify(dados.receitas))
            }
            if (dados.despesas) {
                localStorage.setItem('despesas', JSON.stringify(dados.despesas))
            }
            if (dados.categorias) {
                localStorage.setItem('categorias', JSON.stringify(dados.categorias))
            }
            if (dados.bancoDados) {
                localStorage.setItem('bancoDados', JSON.stringify(dados.bancoDados))
            }
            return true
        } catch (error) {
            console.error('Erro ao importar dados:', error)
            return false
        }
    }

    // Limpar dados antigos
    static limparDadosAntigos() {
        const memories = this.getMemories() || this.inicializar()
        const dataLimite = new Date()
        dataLimite.setFullYear(dataLimite.getFullYear() - 2) // 2 anos atrás

        // Limpar balances antigos
        memories.balances = memories.balances.filter(
            b => new Date(b.data) > dataLimite
        )

        // Limpar categorias antigas
        memories.categories = memories.categories.filter(
            c => new Date(c.data_analise) > dataLimite
        )

        // Limpar insights antigos
        memories.insights = memories.insights.filter(
            i => new Date(i.data) > dataLimite
        )

        this.saveMemories(memories)
        return memories
    }
}

export default MemoryService