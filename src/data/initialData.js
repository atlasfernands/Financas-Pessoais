import { ClienteService } from '../services/ClienteService'
import { CobrancaService } from '../services/CobrancaService'

export const initializeTestData = () => {
    // Verificar se já existem dados
    const existingClientes = ClienteService.pegarClientes()
    
    if (existingClientes.length === 0) {
        // Adicionar clientes de teste
        const cliente1 = ClienteService.cadastrarCliente({
            nome: "João Silva",
            cpf: "123.456.789-00",
            telefone: "(11) 99999-9999"
        })

        const cliente2 = ClienteService.cadastrarCliente({
            nome: "Maria Santos",
            cpf: "987.654.321-00",
            telefone: "(11) 88888-8888"
        })

        const cliente3 = ClienteService.cadastrarCliente({
            nome: "Pedro Oliveira",
            cpf: "555.666.777-88",
            telefone: "(11) 77777-7777"
        })

        // Adicionar cobranças de teste
        CobrancaService.cadastrarCobranca({
            descricao: "Desenvolvimento de website responsivo",
            valor: 2500.00,
            cliente: cliente1.id
        })

        CobrancaService.cadastrarCobranca({
            descricao: "Consultoria em TI",
            valor: 1200.00,
            cliente: cliente2.id
        })

        CobrancaService.cadastrarCobranca({
            descricao: "Manutenção de sistema",
            valor: 800.00,
            cliente: cliente1.id
        })

        CobrancaService.cadastrarCobranca({
            descricao: "Design de identidade visual",
            valor: 1800.00,
            cliente: cliente3.id
        })

        console.log('✅ Dados de teste inicializados!')
    }
}