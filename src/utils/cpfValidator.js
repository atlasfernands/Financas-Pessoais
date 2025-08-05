/**
 * Função para validar CPF
 * @param {string} cpf - CPF a ser validado (com ou sem formatação)
 * @returns {boolean} - true se o CPF for válido, false caso contrário
 */
export const validarCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cpfLimpo = cpf.replace(/\D/g, '')
    
    // Verifica se tem 11 dígitos
    if (cpfLimpo.length !== 11) {
        return false
    }
    
    // Verifica se todos os dígitos são iguais (CPF inválido)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) {
        return false
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    let digito1 = resto < 2 ? 0 : resto
    
    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpfLimpo.charAt(i)) * (11 - i)
    }
    resto = 11 - (soma % 11)
    let digito2 = resto < 2 ? 0 : resto
    
    // Verifica se os dígitos verificadores estão corretos
    return parseInt(cpfLimpo.charAt(9)) === digito1 && 
           parseInt(cpfLimpo.charAt(10)) === digito2
}

/**
 * Função para formatar CPF
 * @param {string} cpf - CPF sem formatação
 * @returns {string} - CPF formatado (000.000.000-00)
 */
export const formatarCPF = (cpf) => {
    const cpfLimpo = cpf.replace(/\D/g, '')
    return cpfLimpo
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1')
}

/**
 * Função para limpar CPF (remover formatação)
 * @param {string} cpf - CPF com formatação
 * @returns {string} - CPF apenas com números
 */
export const limparCPF = (cpf) => {
    return cpf.replace(/\D/g, '')
}

/**
 * Função para validar e formatar CPF
 * @param {string} cpf - CPF a ser validado e formatado
 * @returns {object} - { valido: boolean, formatado: string, erro: string }
 */
export const validarEFormatarCPF = (cpf) => {
    const cpfLimpo = limparCPF(cpf)
    
    if (cpfLimpo.length === 0) {
        return {
            valido: false,
            formatado: '',
            erro: 'CPF é obrigatório'
        }
    }
    
    if (cpfLimpo.length < 11) {
        return {
            valido: false,
            formatado: formatarCPF(cpfLimpo),
            erro: 'CPF deve ter 11 dígitos'
        }
    }
    
    if (!validarCPF(cpfLimpo)) {
        return {
            valido: false,
            formatado: formatarCPF(cpfLimpo),
            erro: 'CPF inválido'
        }
    }
    
    return {
        valido: true,
        formatado: formatarCPF(cpfLimpo),
        erro: ''
    }
} 