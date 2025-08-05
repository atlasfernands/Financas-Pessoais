import { useState, useEffect } from 'react'
import { ClienteService } from '../services/ClienteService'

export const useClientes = () => {
    const [clientes, setClientes] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    // Carregar clientes do localStorage na inicialização
    useEffect(() => {
        carregarClientes()
    }, [])

    const carregarClientes = () => {
        try {
            setLoading(true)
            setError(null)
            const clientesCarregados = ClienteService.pegarClientes()
            setClientes(clientesCarregados)
        } catch (err) {
            setError('Erro ao carregar clientes')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    const adicionarCliente = (dadosCliente) => {
        try {
            setError(null)
            const novoCliente = ClienteService.cadastrarCliente(dadosCliente)
            setClientes(prev => [...prev, novoCliente])
            return novoCliente
        } catch (err) {
            setError('Erro ao adicionar cliente')
            console.error(err)
            throw err
        }
    }

    const removerCliente = (id) => {
        try {
            setError(null)
            ClienteService.deletarCliente(id)
            setClientes(prev => prev.filter(cliente => cliente.id !== id))
        } catch (err) {
            setError('Erro ao remover cliente')
            console.error(err)
            throw err
        }
    }

    const atualizarCliente = (id, dadosAtualizados) => {
        try {
            setError(null)
            const clienteAtualizado = ClienteService.atualizarCliente(id, dadosAtualizados)
            setClientes(prev => 
                prev.map(cliente => 
                    cliente.id === id ? clienteAtualizado : cliente
                )
            )
            return clienteAtualizado
        } catch (err) {
            setError('Erro ao atualizar cliente')
            console.error(err)
            throw err
        }
    }

    const buscarClientePorId = (id) => {
        return ClienteService.buscarClientePorId(id)
    }

    return {
        clientes,
        loading,
        error,
        carregarClientes,
        adicionarCliente,
        removerCliente,
        atualizarCliente,
        buscarClientePorId
    }
}