import { useState, useEffect } from 'react'
import { CobrancaService } from '../services/CobrancaService'

export const useCobrancas = () => {
    const [cobrancas, setCobrancas] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Carregar cobranças do localStorage na inicialização
    useEffect(() => {
        carregarCobrancas()
    }, [])

    const carregarCobrancas = () => {
        try {
            setLoading(true)
            setError(null)
            const cobrancasCarregadas = CobrancaService.pegarCobrancas()
            setCobrancas(cobrancasCarregadas)
        } catch (err) {
            setError('Erro ao carregar cobranças')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const adicionarCobranca = (dadosCobranca) => {
        try {
            setError(null)
            const novaCobranca = CobrancaService.cadastrarCobranca(dadosCobranca)
            setCobrancas(prev => [...prev, novaCobranca])
            return novaCobranca
        } catch (err) {
            setError('Erro ao adicionar cobrança')
            console.error(err)
            throw err
        }
    }

    const removerCobranca = (id) => {
        try {
            setError(null)
            CobrancaService.deletarCobranca(id)
            setCobrancas(prev => prev.filter(cobranca => cobranca.id !== id))
        } catch (err) {
            setError('Erro ao remover cobrança')
            console.error(err)
            throw err
        }
    }

    const atualizarCobranca = (id, dadosAtualizados) => {
        try {
            setError(null)
            const cobrancaAtualizada = CobrancaService.atualizarCobranca(id, dadosAtualizados)
            setCobrancas(prev => 
                prev.map(cobranca => 
                    cobranca.id === id ? cobrancaAtualizada : cobranca
                )
            )
            return cobrancaAtualizada
        } catch (err) {
            setError('Erro ao atualizar cobrança')
            console.error(err)
            throw err
        }
    }

    const marcarComoPaga = (id) => {
        try {
            setError(null)
            const cobrancaAtualizada = CobrancaService.marcarComoPaga(id)
            setCobrancas(prev => 
                prev.map(cobranca => 
                    cobranca.id === id ? cobrancaAtualizada : cobranca
                )
            )
            return cobrancaAtualizada
        } catch (err) {
            setError('Erro ao marcar cobrança como paga')
            console.error(err)
            throw err
        }
    }

    const marcarComoPendente = (id) => {
        try {
            setError(null)
            const cobrancaAtualizada = CobrancaService.marcarComoPendente(id)
            setCobrancas(prev => 
                prev.map(cobranca => 
                    cobranca.id === id ? cobrancaAtualizada : cobranca
                )
            )
            return cobrancaAtualizada
        } catch (err) {
            setError('Erro ao marcar cobrança como pendente')
            console.error(err)
            throw err
        }
    }

    const confirmarPagamento = (id, dadosPagamento) => {
        try {
            setError(null)
            const cobrancaAtualizada = CobrancaService.confirmarPagamento(id, dadosPagamento)
            setCobrancas(prev => 
                prev.map(cobranca => 
                    cobranca.id === id ? cobrancaAtualizada : cobranca
                )
            )
            return cobrancaAtualizada
        } catch (err) {
            setError('Erro ao confirmar pagamento')
            console.error(err)
            throw err
        }
    }

    const reverterPagamento = (id) => {
        try {
            setError(null)
            const cobrancaAtualizada = CobrancaService.reverterPagamento(id)
            setCobrancas(prev => 
                prev.map(cobranca => 
                    cobranca.id === id ? cobrancaAtualizada : cobranca
                )
            )
            return cobrancaAtualizada
        } catch (err) {
            setError('Erro ao reverter pagamento')
            console.error(err)
            throw err
        }
    }

    const buscarCobrancaPorId = (id) => {
        return CobrancaService.buscarCobrancaPorId(id)
    }

    const buscarCobrancasPorCliente = (clienteId) => {
        return CobrancaService.buscarCobrancasPorCliente(clienteId)
    }

    const calcularTotal = (filtroStatus = null) => {
        return CobrancaService.calcularTotal(filtroStatus)
    }

    const estatisticas = {
        total: calcularTotal(),
        pagas: calcularTotal(true),
        pendentes: calcularTotal(false),
        totalCobrancas: cobrancas.length,
        cobrancasPagas: cobrancas.filter(c => c.status).length,
        cobrancasPendentes: cobrancas.filter(c => !c.status).length
    }

    return {
        cobrancas,
        loading,
        error,
        estatisticas,
        carregarCobrancas,
        adicionarCobranca,
        removerCobranca,
        atualizarCobranca,
        marcarComoPaga,
        marcarComoPendente,
        confirmarPagamento,
        reverterPagamento,
        buscarCobrancaPorId,
        buscarCobrancasPorCliente,
        calcularTotal
    }
}