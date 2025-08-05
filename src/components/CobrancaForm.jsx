import { useState } from 'react'
import { useCobrancas } from '../hooks/useCobrancas'
import { useClientes } from '../hooks/useClientes'

const CobrancaForm = ({ onSuccess, onCancel, cobranca = null }) => {
    const { adicionarCobranca, atualizarCobranca } = useCobrancas()
    const { clientes } = useClientes()
    const [formData, setFormData] = useState({
        descricao: cobranca?.descricao || '',
        valor: cobranca?.valor || '',
        cliente: cobranca?.cliente || ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.descricao.trim()) {
            newErrors.descricao = 'Descrição é obrigatória'
        }

        if (!formData.valor || formData.valor <= 0) {
            newErrors.valor = 'Valor deve ser maior que zero'
        }

        if (!formData.cliente) {
            newErrors.cliente = 'Cliente é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        // Formatação para valor monetário
        if (name === 'valor') {
            const numericValue = value.replace(/[^\d,]/g, '').replace(',', '.')
            setFormData(prev => ({ ...prev, [name]: numericValue }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        
        if (!validateForm()) {
            return
        }

        setLoading(true)

        try {
            const dadosCobranca = {
                ...formData,
                cliente: parseInt(formData.cliente),
                valor: parseFloat(formData.valor)
            }

            if (cobranca) {
                await atualizarCobranca(cobranca.id, dadosCobranca)
            } else {
                await adicionarCobranca(dadosCobranca)
            }
            
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao salvar cobrança:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value || 0)
    }

    return (
        <form onSubmit={handleSubmit} className="cobranca-form">
            <div className="form-group">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    placeholder="Descrição da cobrança"
                    rows="3"
                    className={errors.descricao ? 'error' : ''}
                />
                {errors.descricao && <span className="error-message">{errors.descricao}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="valor">Valor</label>
                <input
                    type="number"
                    id="valor"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    placeholder="0,00"
                    step="0.01"
                    min="0"
                    className={errors.valor ? 'error' : ''}
                />
                {errors.valor && <span className="error-message">{errors.valor}</span>}
                {formData.valor && (
                    <small className="value-preview">
                        Valor: {formatCurrency(parseFloat(formData.valor))}
                    </small>
                )}
            </div>

            <div className="form-separator">
                <hr />
                <h3>Escolher cliente</h3>
            </div>

            <div className="form-group">
                <label htmlFor="cliente">Cliente</label>
                <select
                    id="cliente"
                    name="cliente"
                    value={formData.cliente}
                    onChange={handleChange}
                    className={errors.cliente ? 'error' : ''}
                >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                        <option key={cliente.id} value={cliente.id}>
                            {cliente.nome} - {cliente.cpf}
                        </option>
                    ))}
                </select>
                {errors.cliente && <span className="error-message">{errors.cliente}</span>}
                {clientes.length === 0 && (
                    <small className="info-message">
                        Nenhum cliente cadastrado. Cadastre um cliente primeiro.
                    </small>
                )}
            </div>

            <div className="form-actions">
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
                    className="btn-primary"
                    disabled={loading || clientes.length === 0}
                >
                    {loading ? 'Salvando...' : (cobranca ? 'Atualizar' : 'Emitir')} Cobrança
                </button>
            </div>
        </form>
    )
}

export default CobrancaForm