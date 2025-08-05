import { useState } from 'react'
import { CheckCircle, X, Calendar, FileText } from 'lucide-react'

const ConfirmacaoPagamento = ({ cobranca, cliente, onConfirm, onCancel }) => {
    const [formData, setFormData] = useState({
        dataPagamento: new Date().toISOString().split('T')[0], // Data atual
        observacoes: '',
        formaPagamento: 'dinheiro'
    })
    const [loading, setLoading] = useState(false)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            const dadosPagamento = {
                ...formData,
                dataPagamento: new Date(formData.dataPagamento).toLocaleDateString('pt-BR'),
                confirmadoEm: new Date().toLocaleDateString('pt-BR')
            }

            await onConfirm(cobranca.id, dadosPagamento)
        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content confirmacao-pagamento">
                <div className="modal-header">
                    <div className="header-icon">
                        <CheckCircle size={24} className="success-icon" />
                    </div>
                    <h2>Confirmar Pagamento</h2>
                    <button 
                        onClick={onCancel}
                        className="close-btn"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="modal-body">
                    <div className="cobranca-info">
                        <div className="info-section">
                            <h3>Informações da Cobrança</h3>
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Cliente:</label>
                                    <span>{cliente?.nome}</span>
                                </div>
                                <div className="info-item">
                                    <label>CPF:</label>
                                    <span>{cliente?.cpf}</span>
                                </div>
                                <div className="info-item">
                                    <label>Descrição:</label>
                                    <span>{cobranca.descricao}</span>
                                </div>
                                <div className="info-item">
                                    <label>Valor:</label>
                                    <span className="valor">{formatCurrency(cobranca.valor)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Data de Emissão:</label>
                                    <span>{cobranca.data}</span>
                                </div>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="form-pagamento">
                            <div className="form-section">
                                <h3>Detalhes do Pagamento</h3>
                                
                                <div className="form-group">
                                    <label htmlFor="dataPagamento">
                                        <Calendar size={16} />
                                        Data do Pagamento
                                    </label>
                                    <input
                                        type="date"
                                        id="dataPagamento"
                                        name="dataPagamento"
                                        value={formData.dataPagamento}
                                        onChange={handleChange}
                                        max={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="formaPagamento">
                                        Forma de Pagamento
                                    </label>
                                    <select
                                        id="formaPagamento"
                                        name="formaPagamento"
                                        value={formData.formaPagamento}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="dinheiro">Dinheiro</option>
                                        <option value="pix">PIX</option>
                                        <option value="cartao_credito">Cartão de Crédito</option>
                                        <option value="cartao_debito">Cartão de Débito</option>
                                        <option value="transferencia">Transferência Bancária</option>
                                        <option value="boleto">Boleto</option>
                                        <option value="cheque">Cheque</option>
                                        <option value="outros">Outros</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="observacoes">
                                        <FileText size={16} />
                                        Observações (opcional)
                                    </label>
                                    <textarea
                                        id="observacoes"
                                        name="observacoes"
                                        value={formData.observacoes}
                                        onChange={handleChange}
                                        placeholder="Adicione observações sobre o pagamento..."
                                        rows="3"
                                    />
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="modal-footer">
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="btn-secondary"
                        disabled={loading}
                    >
                        Cancelar
                    </button>
                    <button 
                        type="submit"
                        onClick={handleSubmit}
                        className="btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Confirmando...' : 'Confirmar Pagamento'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmacaoPagamento 