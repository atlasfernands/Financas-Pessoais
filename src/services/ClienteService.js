import { Cliente } from '../models/Cliente.js'
import { BancoDados } from './BancoDados.js'
import { validarCPF } from '../utils/cpfValidator.js'

// CLASSE RESPONSÁVEL POR FAZER A COMUNICAÇÃO ENTRE CLASSE DE MODELAGEM E BANCO DE DADOS
class ClienteService {
    
    // MÉTODO CADASTRAR CLIENTE
    static cadastrarCliente(cliente) {
        // VALIDAÇÃO DE CPF
        if (!validarCPF(cliente.cpf)) {
            throw new Error('CPF inválido')
        }

        // VERIFICAR SE CPF JÁ EXISTE
        const clientesExistentes = this.pegarClientes()
        const cpfJaExiste = clientesExistentes.some(c => c.cpf === cliente.cpf)
        if (cpfJaExiste) {
            throw new Error('CPF já cadastrado')
        }

        // FAZENDO MODELAGEM DO CLIENTE
        const novoCliente = new Cliente(cliente)

        // CADASTRANDO NO BANCO DE DADOS
        return BancoDados.post("clientes", novoCliente)
    }

    // MÉTODO RECUPERAR CLIENTE
    static pegarClientes() {
        // RETORNA TODOS OS CLIENTES DO BANCO DE DADOS
        return BancoDados.get("clientes")
    }

    // MÉTODO DELETAR CLIENTE
    static deletarCliente(id) {
        BancoDados.delete("clientes", id)
    }

    // MÉTODO ATUALIZAR CLIENTE
    static atualizarCliente(id, dadosAtualizados) {
        // VALIDAÇÃO DE CPF SE FOR FORNECIDO
        if (dadosAtualizados.cpf && !validarCPF(dadosAtualizados.cpf)) {
            throw new Error('CPF inválido')
        }

        // VERIFICAR SE CPF JÁ EXISTE EM OUTRO CLIENTE
        if (dadosAtualizados.cpf) {
            const clientesExistentes = this.pegarClientes()
            const cpfJaExiste = clientesExistentes.some(c => c.cpf === dadosAtualizados.cpf && c.id !== id)
            if (cpfJaExiste) {
                throw new Error('CPF já cadastrado')
            }
        }

        return BancoDados.update("clientes", id, dadosAtualizados)
    }

    // MÉTODO BUSCAR CLIENTE POR ID
    static buscarClientePorId(id) {
        const clientes = this.pegarClientes()
        return clientes.find(cliente => cliente.id === id)
    }
}

export { ClienteService }