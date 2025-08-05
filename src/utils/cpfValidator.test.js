// Arquivo de teste para demonstrar a validação de CPF
// Este arquivo pode ser executado no console do navegador para testar

import { validarCPF, formatarCPF, validarEFormatarCPF } from './cpfValidator.js'

// CPFs válidos para teste
const cpfsValidos = [
    '529.982.247-25',
    '111.444.777-35',
    '123.456.789-09',
    '987.654.321-00'
]

// CPFs inválidos para teste
const cpfsInvalidos = [
    '111.111.111-11', // Todos os dígitos iguais
    '123.456.789-10', // Dígitos verificadores incorretos
    '000.000.000-00', // Todos zeros
    '123.456.789-',   // Incompleto
    '123.456.789',    // Incompleto
    'abc.def.ghi-jk', // Letras
    ''                // Vazio
]

console.log('=== TESTE DE VALIDAÇÃO DE CPF ===')

console.log('\n--- CPFs Válidos ---')
cpfsValidos.forEach(cpf => {
    const resultado = validarCPF(cpf)
    console.log(`${cpf}: ${resultado ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`)
})

console.log('\n--- CPFs Inválidos ---')
cpfsInvalidos.forEach(cpf => {
    const resultado = validarCPF(cpf)
    console.log(`${cpf}: ${resultado ? '✅ VÁLIDO' : '❌ INVÁLIDO'}`)
})

console.log('\n--- Teste de Formatação ---')
const cpfSemFormatacao = '52998224725'
console.log(`CPF sem formatação: ${cpfSemFormatacao}`)
console.log(`CPF formatado: ${formatarCPF(cpfSemFormatacao)}`)

console.log('\n--- Teste de Validação e Formatação ---')
const cpfsParaTestar = ['52998224725', '11111111111', '123456789', '']
cpfsParaTestar.forEach(cpf => {
    const resultado = validarEFormatarCPF(cpf)
    console.log(`CPF: ${cpf}`)
    console.log(`  Válido: ${resultado.valido}`)
    console.log(`  Formatado: ${resultado.formatado}`)
    console.log(`  Erro: ${resultado.erro || 'Nenhum'}`)
    console.log('---')
})

// Função para testar no console do navegador
window.testarCPF = (cpf) => {
    const resultado = validarEFormatarCPF(cpf)
    console.log(`Testando CPF: ${cpf}`)
    console.log(`Resultado:`, resultado)
    return resultado
}

console.log('\n=== Para testar no console, use: testarCPF("seu-cpf-aqui") ===') 