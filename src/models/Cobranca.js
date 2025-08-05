
class Cobranca {
    constructor({ descricao, valor, cliente }) {
        this.data = Cobranca.getData()
        this.descricao = descricao
        this.valor = parseFloat(valor)
        this.cliente = cliente
        this.status = false
        this.dadosPagamento = null
    }

    static getData() {
        return new Date().toLocaleDateString("pt-BR")
    }

    // Método para confirmar pagamento
    confirmarPagamento(dadosPagamento) {
        this.status = true
        this.dadosPagamento = {
            dataPagamento: dadosPagamento.dataPagamento,
            formaPagamento: dadosPagamento.formaPagamento,
            observacoes: dadosPagamento.observacoes || '',
            confirmadoEm: dadosPagamento.confirmadoEm
        }
        return this
    }

    // Método para marcar como pendente
    marcarComoPendente() {
        this.status = false
        this.dadosPagamento = null
        return this
    }
}

export { Cobranca }