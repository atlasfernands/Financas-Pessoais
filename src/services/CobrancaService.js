import { Cobranca } from '../models/Cobranca.js'
import { BancoDados } from './BancoDados.js'

class CobrancaService {
    
    static cadastrarCobranca(cobranca) {
        const novaCobranca = new Cobranca(cobranca)
        return BancoDados.post("cobrancas", novaCobranca)
    }

    static pegarCobrancas() {
        return BancoDados.get("cobrancas")
    }

    static deletarCobranca(id) {
        BancoDados.delete("cobrancas", id)
    }

    static atualizarCobranca(id, dadosAtualizados) {
        return BancoDados.update("cobrancas", id, dadosAtualizados)
    }

    static marcarComoPaga(id) {
        return this.atualizarCobranca(id, { status: true })
    }

    static marcarComoPendente(id) {
        return this.atualizarCobranca(id, { status: false })
    }

    static confirmarPagamento(id, dadosPagamento) {
        const cobranca = this.buscarCobrancaPorId(id)
        if (!cobranca) {
            throw new Error('Cobrança não encontrada')
        }

        const cobrancaAtualizada = cobranca.confirmarPagamento(dadosPagamento)
        return this.atualizarCobranca(id, cobrancaAtualizada)
    }

    static reverterPagamento(id) {
        const cobranca = this.buscarCobrancaPorId(id)
        if (!cobranca) {
            throw new Error('Cobrança não encontrada')
        }

        const cobrancaAtualizada = cobranca.marcarComoPendente()
        return this.atualizarCobranca(id, cobrancaAtualizada)
    }

    static buscarCobrancaPorId(id) {
        const cobrancas = this.pegarCobrancas()
        return cobrancas.find(cobranca => cobranca.id === id)
    }

    static buscarCobrancasPorCliente(clienteId) {
        const cobrancas = this.pegarCobrancas()
        return cobrancas.filter(cobranca => cobranca.cliente === clienteId)
    }

    static calcularTotal(filtroStatus = null) {
        const cobrancas = this.pegarCobrancas()
        let cobrancasFiltradas = cobrancas

        if (filtroStatus !== null) {
            cobrancasFiltradas = cobrancas.filter(cobranca => cobranca.status === filtroStatus)
        }

        return cobrancasFiltradas.reduce((total, cobranca) => total + cobranca.valor, 0)
    }
}

export { CobrancaService }