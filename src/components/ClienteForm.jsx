import { useState } from 'react'
import { useClientes } from '../hooks/useClientes'
import { validarEFormatarCPF } from '../utils/cpfValidator'

const ClienteForm = ({ onSuccess, onCancel, cliente = null }) => {
    const { adicionarCliente, atualizarCliente } = useClientes()
    const [formData, setFormData] = useState({
        nome: cliente?.nome || '',
        cpf: cliente?.cpf || '',
        telefone: cliente?.telefone || ''
    })
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})

    const validateForm = () => {
        const newErrors = {}

        if (!formData.nome.trim()) {
            newErrors.nome = 'Nome é obrigatório'
        }

        // Validação de CPF usando a função utilitária
        const validacaoCPF = validarEFormatarCPF(formData.cpf)
        if (!validacaoCPF.valido) {
            newErrors.cpf = validacaoCPF.erro
        }

        if (!formData.telefone.trim()) {
            newErrors.telefone = 'Telefone é obrigatório'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        
        // Formatação automática para CPF
        if (name === 'cpf') {
            const validacaoCPF = validarEFormatarCPF(value)
            setFormData(prev => ({ ...prev, [name]: validacaoCPF.formatado }))
            
            // Limpar erro se o CPF for válido
            if (validacaoCPF.valido && errors.cpf) {
                setErrors(prev => ({ ...prev, cpf: '' }))
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }

        // Limpar erro do campo quando o usuário começar a digitar
        if (errors[name] && name !== 'cpf') {
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
            if (cliente) {
                await atualizarCliente(cliente.id, formData)
            } else {
                await adicionarCliente(formData)
            }
            
            onSuccess?.()
        } catch (error) {
            console.error('Erro ao salvar cliente:', error)
            
            // Tratar erros específicos do serviço
            if (error.message === 'CPF inválido') {
                setErrors(prev => ({ ...prev, cpf: 'CPF inválido' }))
            } else if (error.message === 'CPF já cadastrado') {
                setErrors(prev => ({ ...prev, cpf: 'CPF já cadastrado no sistema' }))
            } else {
                // Erro genérico
                alert('Erro ao salvar cliente: ' + error.message)
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="cliente-form">
            <div className="form-group">
                <label htmlFor="nome">Nome Completo</label>
                <input
                    type="text"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    placeholder="Nome Completo"
                    className={errors.nome ? 'error' : ''}
                />
                {errors.nome && <span className="error-message">{errors.nome}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="cpf">CPF</label>
                <input
                    type="text"
                    id="cpf"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleChange}
                    placeholder="000.000.000-00"
                    maxLength="14"
                    className={errors.cpf ? 'error' : ''}
                />
                {errors.cpf && <span className="error-message">{errors.cpf}</span>}
            </div>

            <div className="form-group">
                <label htmlFor="telefone">Telefone</label>
                <input
                    type="tel"
                    id="telefone"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    placeholder="(11) 99999-9999"
                    className={errors.telefone ? 'error' : ''}
                />
                {errors.telefone && <span className="error-message">{errors.telefone}</span>}
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
                    disabled={loading}
                >
                    {loading ? 'Salvando...' : (cliente ? 'Atualizar' : 'Cadastrar')} Cliente
                </button>
            </div>
        </form>
    )
}

export default ClienteForm