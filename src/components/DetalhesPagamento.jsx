import { Calendar, CreditCard, FileText } from 'lucide-react'

const DetalhesPagamento = ({ dadosPagamento }) => {
    if (!dadosPagamento) return null

    const getFormaPagamentoLabel = (forma) => {
        const formas = {
            dinheiro: 'Dinheiro',
            pix: 'PIX',
            cartao_credito: 'Cartão de Crédito',
            cartao_debito: 'Cartão de Débito',
            transferencia: 'Transferência Bancária',
            boleto: 'Boleto',
            cheque: 'Cheque',
            outros: 'Outros'
        }
        return formas[forma] || forma
    }

    return (
        <div className="detalhes-pagamento">
            <div className="detalhes-header">
                <h4>Detalhes do Pagamento</h4>
            </div>
            
            <div className="detalhes-grid">
                <div className="detalhe-item">
                    <div className="detalhe-icon">
                        <Calendar size={14} />
                    </div>
                    <div className="detalhe-content">
                        <label>Data do Pagamento</label>
                        <span>{dadosPagamento.dataPagamento}</span>
                    </div>
                </div>

                <div className="detalhe-item">
                    <div className="detalhe-icon">
                        <CreditCard size={14} />
                    </div>
                    <div className="detalhe-content">
                        <label>Forma de Pagamento</label>
                        <span>{getFormaPagamentoLabel(dadosPagamento.formaPagamento)}</span>
                    </div>
                </div>

                {dadosPagamento.observacoes && (
                    <div className="detalhe-item full-width">
                        <div className="detalhe-icon">
                            <FileText size={14} />
                        </div>
                        <div className="detalhe-content">
                            <label>Observações</label>
                            <span>{dadosPagamento.observacoes}</span>
                        </div>
                    </div>
                )}

                <div className="detalhe-item">
                    <div className="detalhe-content">
                        <label>Confirmado em</label>
                        <span>{dadosPagamento.confirmadoEm}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DetalhesPagamento 