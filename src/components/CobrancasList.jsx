import { CheckCircle, Edit, Trash2, Circle, DollarSign, ChevronDown, ChevronUp } from 'lucide-react'
import { useCobrancas } from '../hooks/useCobrancas'
import { useClientes } from '../hooks/useClientes'
import { useState } from 'react'
import ConfirmacaoPagamento from './ConfirmacaoPagamento'
import DetalhesPagamento from './DetalhesPagamento'

const CobrancasList = ({ onEdit, searchTerm = '', onPagamentoConfirmado }) => {
    const { cobrancas, marcarComoPaga, marcarComoPendente, removerCobranca, confirmarPagamento, reverterPagamento } = useCobrancas()
    const { buscarClientePorId } = useClientes()
    const [modalPagamento, setModalPagamento] = useState({ show: false, cobranca: null })
    const [cobrancasExpandidas, setCobrancasExpandidas] = useState(new Set())

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const handleStatusToggle = (cobranca) => {
        if (cobranca.status) {
            // Se já está paga, pergunta se quer reverter
            if (window.confirm('Deseja marcar esta cobrança como pendente?')) {
                reverterPagamento(cobranca.id)
            }
        } else {
            // Se está pendente, abre modal de confirmação
            setModalPagamento({ show: true, cobranca })
        }
    }

    const handleConfirmarPagamento = async (cobrancaId, dadosPagamento) => {
        try {
            const cobrancaAtualizada = await confirmarPagamento(cobrancaId, dadosPagamento)
            setModalPagamento({ show: false, cobranca: null })
            
            // Notificar sobre o pagamento confirmado
            if (onPagamentoConfirmado) {
                onPagamentoConfirmado(cobrancaAtualizada.valor)
            }
        } catch (error) {
            alert('Erro ao confirmar pagamento: ' + error.message)
        }
    }

    const handleCancelarPagamento = () => {
        setModalPagamento({ show: false, cobranca: null })
    }

    const toggleDetalhesPagamento = (cobrancaId) => {
        setCobrancasExpandidas(prev => {
            const novoSet = new Set(prev)
            if (novoSet.has(cobrancaId)) {
                novoSet.delete(cobrancaId)
            } else {
                novoSet.add(cobrancaId)
            }
            return novoSet
        })
    }

    const handleDelete = (id) => {
        if (window.confirm('Tem certeza que deseja excluir esta cobrança?')) {
            removerCobranca(id)
        }
    }

    // Filtrar cobranças baseado no termo de pesquisa
    const cobrancasFiltradas = cobrancas.filter(cobranca => {
        if (!searchTerm) return true
        
        const cliente = buscarClientePorId(cobranca.cliente)
        const clienteNome = cliente?.nome.toLowerCase() || ''
        const descricao = cobranca.descricao.toLowerCase()
        const searchLower = searchTerm.toLowerCase()
        
        return clienteNome.includes(searchLower) || 
               descricao.includes(searchLower) ||
               cobranca.id.toString().includes(searchLower)
    })

    const renderCobrancasList = () => {
        if (cobrancasFiltradas.length === 0) {
            return (
                <div className="empty-state">
                    <p>
                        {searchTerm 
                            ? `Nenhuma cobrança encontrada para "${searchTerm}"` 
                            : 'Nenhuma cobrança cadastrada'
                        }
                    </p>
                </div>
            )
        }

        return (
            <div className="cobrancas-list">
                <header className="list-header">
                    <div className="header-status">Status</div>
                    <div className="header-cliente">Cliente</div>
                    <div className="header-descricao">Descrição</div>
                    <div className="header-valor">Valor</div>
                    <div className="header-data">Data de emissão</div>
                    <div className="header-actions">Ações</div>
                </header>

                <ul className="list-content">
                    {cobrancasFiltradas.map((cobranca) => {
                        const cliente = buscarClientePorId(cobranca.cliente)
                        
                        return (
                            <li 
                                key={cobranca.id} 
                                className={`cobranca-item ${cobranca.status ? 'paga' : 'pendente'}`}
                            >
                                <div className="item-status">
                                    <button
                                        onClick={() => handleStatusToggle(cobranca)}
                                        className={`status-btn ${cobranca.status ? 'paid' : 'pending'}`}
                                        title={cobranca.status ? 'Marcar como pendente' : 'Marcar como paga'}
                                    >
                                        {cobranca.status ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <Circle size={20} />
                                        )}
                                    </button>
                                </div>
                                
                                <div className="item-cliente">
                                    <h3>{cliente?.nome || 'Cliente não encontrado'}</h3>
                                    <small>{cliente?.cpf}</small>
                                </div>
                                
                                <div className="item-descricao">
                                    <p>{cobranca.descricao}</p>
                                </div>
                                
                                <div className="item-valor">
                                    <strong>{formatCurrency(cobranca.valor)}</strong>
                                </div>
                                
                                <div className="item-data">
                                    <p>{cobranca.data}</p>
                                </div>

                                <div className="item-actions">
                                    {cobranca.status && cobranca.dadosPagamento && (
                                        <button
                                            onClick={() => toggleDetalhesPagamento(cobranca.id)}
                                            className="action-btn details-btn"
                                            title="Ver detalhes do pagamento"
                                        >
                                            {cobrancasExpandidas.has(cobranca.id) ? (
                                                <ChevronUp size={16} />
                                            ) : (
                                                <ChevronDown size={16} />
                                            )}
                                        </button>
                                    )}
                                    {!cobranca.status && (
                                        <button
                                            onClick={() => setModalPagamento({ show: true, cobranca })}
                                            className="action-btn pay-btn"
                                            title="Confirmar pagamento"
                                        >
                                            <DollarSign size={16} />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => onEdit?.(cobranca)}
                                        className="action-btn edit-btn"
                                        title="Editar cobrança"
                                    >
                                        <Edit size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(cobranca.id)}
                                        className="action-btn delete-btn"
                                        title="Excluir cobrança"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </li>
                        )
                    })}
                </ul>

                {/* Detalhes do pagamento expandidos */}
                {cobrancasFiltradas.map((cobranca) => {
                    if (cobranca.status && cobranca.dadosPagamento && cobrancasExpandidas.has(cobranca.id)) {
                        return (
                            <div key={`detalhes-${cobranca.id}`} className="detalhes-pagamento-container">
                                <DetalhesPagamento dadosPagamento={cobranca.dadosPagamento} />
                            </div>
                        )
                    }
                    return null
                })}
            </div>
        )
    }

    return (
        <>
            {renderCobrancasList()}
            
            {modalPagamento.show && modalPagamento.cobranca && (
                <ConfirmacaoPagamento
                    cobranca={modalPagamento.cobranca}
                    cliente={buscarClientePorId(modalPagamento.cobranca.cliente)}
                    onConfirm={handleConfirmarPagamento}
                    onCancel={handleCancelarPagamento}
                />
            )}
        </>
    )
}

export default CobrancasList