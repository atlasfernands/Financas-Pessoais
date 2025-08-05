// Funções de validação para o sistema JavaScript

// Validação de CPF
export function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '')
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) {
        return false
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(cpf)) {
        return false
    }
    
    // Validação do primeiro dígito verificador
    let soma = 0
    for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i)
    }
    let resto = 11 - (soma % 11)
    let digito1 = resto < 2 ? 0 : resto
    
    // Validação do segundo dígito verificador
    soma = 0
    for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i)
    }
    resto = 11 - (soma % 11)
    let digito2 = resto < 2 ? 0 : resto
    
    // Verifica se os dígitos verificadores estão corretos
    return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2
}

// Formatação de CPF
export function formatarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '')
    
    // Aplica a máscara
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
}

// Validação de telefone
export function validarTelefone(telefone) {
    // Remove caracteres não numéricos
    telefone = telefone.replace(/[^\d]/g, '')
    
    // Verifica se tem entre 10 e 11 dígitos
    if (telefone.length < 10 || telefone.length > 11) {
        return false
    }
    
    // Verifica se começa com 9 (celular) ou outros dígitos (fixo)
    if (telefone.length === 11 && !telefone.startsWith('9')) {
        return false
    }
    
    return true
}

// Formatação de telefone
export function formatarTelefone(telefone) {
    // Remove caracteres não numéricos
    telefone = telefone.replace(/[^\d]/g, '')
    
    // Aplica a máscara baseada no número de dígitos
    if (telefone.length === 11) {
        return telefone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (telefone.length === 10) {
        return telefone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    
    return telefone
}

// Validação e formatação combinadas
export function validarEFormatarCPF(cpf) {
    const cpfLimpo = cpf.replace(/[^\d]/g, '')
    
    if (cpfLimpo.length === 11) {
        if (validarCPF(cpfLimpo)) {
            return {
                valido: true,
                formatado: formatarCPF(cpfLimpo),
                valor: cpfLimpo
            }
        } else {
            return {
                valido: false,
                formatado: cpf,
                valor: cpfLimpo,
                erro: 'CPF inválido'
            }
        }
    } else if (cpfLimpo.length > 11) {
        return {
            valido: false,
            formatado: cpf,
            valor: cpfLimpo,
            erro: 'CPF deve ter 11 dígitos'
        }
    } else {
        return {
            valido: false,
            formatado: cpf,
            valor: cpfLimpo,
            erro: 'CPF incompleto'
        }
    }
}

export function validarEFormatarTelefone(telefone) {
    const telefoneLimpo = telefone.replace(/[^\d]/g, '')
    
    if (validarTelefone(telefoneLimpo)) {
        return {
            valido: true,
            formatado: formatarTelefone(telefoneLimpo),
            valor: telefoneLimpo
        }
    } else {
        return {
            valido: false,
            formatado: telefone,
            valor: telefoneLimpo,
            erro: 'Telefone inválido'
        }
    }
} 