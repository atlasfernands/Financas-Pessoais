import { useState, useEffect } from 'react'

export const useFinancialData = () => {
    const [receitas, setReceitas] = useState([])
    const [despesas, setDespesas] = useState([])

    // Carregar dados do localStorage
    useEffect(() => {
        const receitasStorage = localStorage.getItem('receitas')
        const despesasStorage = localStorage.getItem('despesas')

        if (receitasStorage) {
            setReceitas(JSON.parse(receitasStorage))
        }

        if (despesasStorage) {
            setDespesas(JSON.parse(despesasStorage))
        }
    }, [])

    // Salvar receitas no localStorage
    const salvarReceitas = (novasReceitas) => {
        setReceitas(novasReceitas)
        localStorage.setItem('receitas', JSON.stringify(novasReceitas))
    }

    // Salvar despesas no localStorage
    const salvarDespesas = (novasDespesas) => {
        setDespesas(novasDespesas)
        localStorage.setItem('despesas', JSON.stringify(novasDespesas))
    }

    // Adicionar receita
    const adicionarReceita = (receita) => {
        const novaReceita = {
            id: Date.now(),
            ...receita,
            valor: parseFloat(receita.valor),
            data: new Date(receita.data)
        }
        const novasReceitas = [...receitas, novaReceita]
        salvarReceitas(novasReceitas)
        return novaReceita
    }

    // Adicionar despesa
    const adicionarDespesa = (despesa) => {
        const novaDespesa = {
            id: Date.now(),
            ...despesa,
            valor: parseFloat(despesa.valor),
            data: new Date(despesa.data)
        }
        const novasDespesas = [...despesas, novaDespesa]
        salvarDespesas(novasDespesas)
        return novaDespesa
    }

    // Remover receita
    const removerReceita = (id) => {
        const novasReceitas = receitas.filter(r => r.id !== id)
        salvarReceitas(novasReceitas)
    }

    // Remover despesa
    const removerDespesa = (id) => {
        const novasDespesas = despesas.filter(d => d.id !== id)
        salvarDespesas(novasDespesas)
    }

    // Atualizar receita
    const atualizarReceita = (id, dadosAtualizados) => {
        const novasReceitas = receitas.map(r => 
            r.id === id ? { ...r, ...dadosAtualizados } : r
        )
        salvarReceitas(novasReceitas)
    }

    // Atualizar despesa
    const atualizarDespesa = (id, dadosAtualizados) => {
        const novasDespesas = despesas.map(d => 
            d.id === id ? { ...d, ...dadosAtualizados } : d
        )
        salvarDespesas(novasDespesas)
    }

    // Calcular totais
    const calcularTotais = () => {
        const totalReceitas = receitas.reduce((sum, r) => sum + r.valor, 0)
        const totalDespesas = despesas.reduce((sum, d) => sum + d.valor, 0)
        const saldoLiquido = totalReceitas - totalDespesas

        return {
            totalReceitas,
            totalDespesas,
            saldoLiquido
        }
    }

    // Calcular totais do mês atual
    const calcularTotaisMes = () => {
        const hoje = new Date()
        const mesAtual = hoje.getMonth()
        const anoAtual = hoje.getFullYear()

        const receitasMes = receitas.filter(r => {
            const dataReceita = new Date(r.data)
            return dataReceita.getMonth() === mesAtual && 
                   dataReceita.getFullYear() === anoAtual
        })

        const despesasMes = despesas.filter(d => {
            const dataDespesa = new Date(d.data)
            return dataDespesa.getMonth() === mesAtual && 
                   dataDespesa.getFullYear() === anoAtual
        })

        const totalReceitasMes = receitasMes.reduce((sum, r) => sum + r.valor, 0)
        const totalDespesasMes = despesasMes.reduce((sum, d) => sum + d.valor, 0)
        const saldoLiquidoMes = totalReceitasMes - totalDespesasMes

        return {
            totalReceitasMes,
            totalDespesasMes,
            saldoLiquidoMes,
            quantidadeReceitasMes: receitasMes.length,
            quantidadeDespesasMes: despesasMes.length
        }
    }

    // Obter dados por categoria
    const obterDadosPorCategoria = () => {
        const categoriaReceitas = {}
        const categoriaDespesas = {}

        receitas.forEach(receita => {
            const cat = receita.categoria || 'Sem categoria'
            if (!categoriaReceitas[cat]) {
                categoriaReceitas[cat] = { total: 0, count: 0 }
            }
            categoriaReceitas[cat].total += receita.valor
            categoriaReceitas[cat].count += 1
        })

        despesas.forEach(despesa => {
            const cat = despesa.categoria || 'Sem categoria'
            if (!categoriaDespesas[cat]) {
                categoriaDespesas[cat] = { total: 0, count: 0 }
            }
            categoriaDespesas[cat].total += despesa.valor
            categoriaDespesas[cat].count += 1
        })

        return {
            categoriaReceitas,
            categoriaDespesas
        }
    }

    return {
        receitas,
        despesas,
        adicionarReceita,
        adicionarDespesa,
        removerReceita,
        removerDespesa,
        atualizarReceita,
        atualizarDespesa,
        calcularTotais,
        calcularTotaisMes,
        obterDadosPorCategoria
    }
}