const popUp__cobranca = document.querySelector(".app__popUp__cobranca")
const popUp__cliente   = document.querySelector(".app__popUp__cliente")
const menuCobrancas = document.querySelector(".app__navegacao")
const body = document.querySelector("body")

body.addEventListener("click", popUpControllers)

function popUpControllers(e){

    const cliqueElemento = e.target.innerText.toLowerCase()

    if(cliqueElemento === "cobranças"){

        popUp__cobranca.classList.add("show")
        body.classList.add("scrollStop")
    
    }else if(cliqueElemento === "clientes"){
    
        popUp__cliente.classList.add("show")
        body.classList.add("scrollStop")
    
    }else if(cliqueElemento == "x"){
        e.target.closest("div").classList.remove("show")
        body.classList.remove("scrollStop")
    }
    
}

// Função para aplicar filtros do extrato (global)
window.aplicarFiltrosExtrato = function() {
    if (window.Quadro && window.Quadro.aplicarFiltrosExtrato) {
        window.Quadro.aplicarFiltrosExtrato()
    }
}

// Configurar validações quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    configurarValidacoes()
})

function configurarValidacoes() {
    const cpfInput = document.getElementById('cpf')
    const telefoneInput = document.getElementById('telefone')
    const formCliente = document.getElementById('formCliente')
    
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            const valor = e.target.value
            const resultado = validarEFormatarCPF(valor)
            
            if (resultado.valido) {
                e.target.value = resultado.formatado
                e.target.classList.remove('error')
                e.target.classList.add('success')
                document.getElementById('cpf-error').textContent = ''
            } else {
                e.target.classList.remove('success')
                if (resultado.erro) {
                    e.target.classList.add('error')
                    document.getElementById('cpf-error').textContent = resultado.erro
                } else {
                    e.target.classList.remove('error')
                    document.getElementById('cpf-error').textContent = ''
                }
            }
        })
    }
    
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            const valor = e.target.value
            const resultado = validarEFormatarTelefone(valor)
            
            if (resultado.valido) {
                e.target.value = resultado.formatado
                e.target.classList.remove('error')
                e.target.classList.add('success')
                document.getElementById('telefone-error').textContent = ''
            } else {
                e.target.classList.remove('success')
                if (resultado.erro) {
                    e.target.classList.add('error')
                    document.getElementById('telefone-error').textContent = resultado.erro
                } else {
                    e.target.classList.remove('error')
                    document.getElementById('telefone-error').textContent = ''
                }
            }
        })
    }
    
    if (formCliente) {
        formCliente.addEventListener('submit', function(e) {
            e.preventDefault()
            
            const nome = document.getElementById('nome').value.trim()
            const cpf = document.getElementById('cpf').value
            const telefone = document.getElementById('telefone').value
            
            // Validar nome
            if (nome.length < 3) {
                document.getElementById('nome-error').textContent = 'Nome deve ter pelo menos 3 caracteres'
                return
            } else {
                document.getElementById('nome-error').textContent = ''
            }
            
            // Validar CPF
            const cpfResultado = validarEFormatarCPF(cpf)
            if (!cpfResultado.valido) {
                document.getElementById('cpf-error').textContent = cpfResultado.erro || 'CPF inválido'
                return
            }
            
            // Validar telefone
            const telefoneResultado = validarEFormatarTelefone(telefone)
            if (!telefoneResultado.valido) {
                document.getElementById('telefone-error').textContent = telefoneResultado.erro || 'Telefone inválido'
                return
            }
            
            // Se chegou até aqui, os dados são válidos
            const cliente = {
                nome: nome,
                cpf: cpfResultado.valor,
                telefone: telefoneResultado.valor
            }
            
            // Chamar a função de cadastro
            Quadro.capturarDadosCliente(cliente)
            
            // Limpar formulário
            formCliente.reset()
            document.querySelectorAll('.error-message').forEach(el => el.textContent = '')
            document.querySelectorAll('input').forEach(input => {
                input.classList.remove('error', 'success')
            })
            
            // Fechar modal
            popUp__cliente.classList.remove("show")
            body.classList.remove("scrollStop")
        })
    }
    
    // Configurar formulário de pagamento
    const formPagamento = document.getElementById('formPagamento')
    if (formPagamento) {
        formPagamento.addEventListener('submit', function(e) {
            e.preventDefault()
            
            const dadosPagamento = {
                dataPagamento: document.getElementById('dataPagamento').value,
                formaPagamento: document.getElementById('formaPagamento').value,
                observacoes: document.getElementById('observacoes').value
            }
            
            // Validar dados obrigatórios
            if (!dadosPagamento.dataPagamento || !dadosPagamento.formaPagamento) {
                alert('Por favor, preencha todos os campos obrigatórios')
                return
            }
            
            // Confirmar pagamento
            if (window.Quadro && window.Quadro.confirmarPagamento) {
                window.Quadro.confirmarPagamento(dadosPagamento)
            }
        })
    }
}

// Função global para fechar modal de pagamento
window.fecharModalPagamento = function() {
    if (window.Quadro && window.Quadro.fecharModalPagamento) {
        window.Quadro.fecharModalPagamento()
    }
}