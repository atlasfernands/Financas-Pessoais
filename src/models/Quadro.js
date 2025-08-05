import {ClienteControle} from "./../controllers/Cliente.js"
import {CobrancaControle} from "./../controllers/Cobranca.js"
import { validarEFormatarCPF, validarEFormatarTelefone } from "../utils/validacoes.js"

//CLASSE QUADRO, RESPONSÁVEL POR MANIPULAR OS ELEMENTOS HTML DA PÁGINA. E REALIZAR A AUTALIZAÇÃO DE FORMA VISUAL.
class Quadro {
    
    //PROPROEDADES QUE RECEBEM OS ELEMENTOS HTML, LISTA DE COBRANÇAS E SELECT DE CLIENTES
    static tgSelect = document.getElementById("cliente") 
    static tagLista = document.querySelector(".app__cobrancas")

    //MÉTODO STATICO RESPONSÁVEL POR CAPTURAR DADOS DOS FORMULÁRIO
    //INVOCADO PELO ADDEVENTLISTENER NO ARQUIVO APP
    static capturarDados(event){
        event.preventDefault()

        //RECEBENDO INFORMAÇÕES DO EVENTO
        const nomeFormulario = event.target.name
        const inputs         = event.target
        
        //CRIANDO OBJETO PARA RECEBER AS INFORMAÇÕES DE FORMA FORMATADA
        const dataForm       = {}

        //PERCORRENDO OS INPUTS DO FORMULÁRIO 
        for(let i = 0; i< inputs.length;i++){

            //EXTRAINDO PROPRIEADE DE CADA INPUT ENCONTRADO
            const {name, value} = inputs[i]
            
            //VERIFICANDO SE EXISTE A PROPRIEDADE NAME
            if(name){
                dataForm[name] = value
            }

            //LIMPANDO INPUTS
            inputs[i].value = ""
        }

        //VERIFICAÇÃO PARA IDENTIFICAR DE QUAL FORMULÁRIO
        if(nomeFormulario == "cliente"){
            
            //PASSANDO OBJETO COM AS INFORMAÇÕES PARA FAZER A MODELAGEM E CADASTRO
            ClienteControle.cadastrarCliente(dataForm)

            //CHAMANDO A FUNÇÃO QUE ATUALIZA O SELECT DE FORMA VISUAL COM O NOVO CLIENTE 
            this.atualizarSelect()
            
            // Atualizar dashboard
            this.carregarDashboard()

        }else{

            //PASSANDO OBJETO COM AS INFORMAÇÕES PARA FAZER A MODELAGEM E CADASTRO 
            CobrancaControle.cadastrarCobranca(dataForm)
            
             //CHAMANDO A FUNÇÃO TEMPLATE PARA ATUALIZAR DE FORMA VISUAL 
            this.templateCobrancas()
            
            // Atualizar saldos após criar nova cobrança
            this.atualizarSaldos()
            
            // Atualizar dashboard e extrato
            this.carregarDashboard()
            this.carregarExtrato()
        }
        
    }

    // Método para capturar dados do cliente com validação
    static capturarDadosCliente(cliente) {
        try {
            // Validar CPF
            const cpfResultado = validarEFormatarCPF(cliente.cpf)
            if (!cpfResultado.valido) {
                console.error('CPF inválido:', cpfResultado.erro)
                return false
            }
            
            // Validar telefone
            const telefoneResultado = validarEFormatarTelefone(cliente.telefone)
            if (!telefoneResultado.valido) {
                console.error('Telefone inválido:', telefoneResultado.erro)
                return false
            }
            
            // Verificar se CPF já existe
            const clientesExistentes = ClienteControle.pegarClientes()
            const cpfJaExiste = clientesExistentes.find(c => c.cpf === cpfResultado.valor)
            
            if (cpfJaExiste) {
                console.error('CPF já cadastrado')
                return false
            }
            
            // Criar objeto cliente com dados validados
            const clienteValidado = {
                nome: cliente.nome,
                cpf: cpfResultado.valor,
                telefone: telefoneResultado.valor
            }
            
            // Cadastrar cliente
            ClienteControle.cadastrarCliente(clienteValidado)
            
            // Atualizar interface
            this.atualizarSelect()
            this.carregarDashboard()
            
            console.log('Cliente cadastrado com sucesso:', clienteValidado)
            return true
            
        } catch (error) {
            console.error('Erro ao cadastrar cliente:', error)
            return false
        }
    }

    //MÉTODO RESPONSÁVEL POR ATUALZIAR O SELECT DE CLIENTES, DENTRO DO FORMULÁRIO DE COBRANÇAS
    static atualizarSelect(){
      
        this.tgSelect.innerHTML = ""
        
        //RECUPERANDO CLIENTES DO BANCO DE DADOS
        ClienteControle.pegarClientes().forEach((cliente)=>{
            
            //EXTRAINDO INFORMAÇÕES DO CLIENTE
            const {nome, id} = cliente

            //CRIANDO TAG OPTION PARA ALIMENTAR O SELECT
            const option     = document.createElement("option")
            option.value     = id
            option.innerText = nome

            //ALIMENTANDO SELECT DE FORM VISUAL
            this.tgSelect.appendChild(option)
        })
    }

    static templateCobrancas(){

        this.tagLista.innerHTML = ""

        CobrancaControle.pegarCobranca().forEach((cobranca)=>{

            const {status, data, cliente: clienteId, descricao, valor, id} = cobranca
        
            const li = document.createElement("li")

            //BUSCANDO CLIENTE
            const clienteCobranca = ClienteControle.pegarClientes().find((cliente)=>cliente.id == clienteId)

            if(status === true){
                li.classList.add("paga")
            }

            li.innerHTML =`
                <div>
                    <i data-feather="${status ? 'check-circle' : 'circle'}" 
                       style="cursor: pointer;" 
                       class="status-toggle"
                       data-cobranca-id="${id}"></i> 
                </div>
                <div>
                    <h2>${clienteCobranca ? clienteCobranca.nome : 'Cliente não encontrado'}</h2>
                </div>
                <div>
                    <p>${descricao}</p>
                </div>
                <div>
                    <p>R$ ${valor}</p>
                </div>
                <div>
                    <p>${data}</p>
                </div>
                <div class="cobranca-actions">
                    ${!status ? `<button class="btn-confirmar-pagamento" data-cobranca-id="${id}">Confirmar Pagamento</button>` : ''}
                    <button class="btn-detalhes" data-cobranca-id="${id}">Detalhes</button>
                </div>
            `
            this.tagLista.appendChild(li)
        })
        
        // Adicionar event listeners para os toggles de status
        this.tagLista.querySelectorAll('.status-toggle').forEach(icon => {
            icon.addEventListener('click', (e) => {
                const cobrancaId = e.target.getAttribute('data-cobranca-id')
                this.toggleStatusCobranca(cobrancaId)
            })
        })
        
        // Adicionar event listeners para botões de ação
        this.tagLista.querySelectorAll('.btn-confirmar-pagamento').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cobrancaId = e.target.getAttribute('data-cobranca-id')
                this.abrirModalPagamento(cobrancaId)
            })
        })
        
        this.tagLista.querySelectorAll('.btn-detalhes').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cobrancaId = e.target.getAttribute('data-cobranca-id')
                this.mostrarDetalhesCobranca(cobrancaId)
            })
        })
        
        feather.replace()
    }
    
    // Método para alternar status da cobrança
    static toggleStatusCobranca(cobrancaId) {
        try {
            // Buscar dados do localStorage
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            // Encontrar a cobrança
            const cobrancaIndex = dados.cobrancas.findIndex(c => c.id === cobrancaId)
            
            if (cobrancaIndex !== -1) {
                // Alternar status
                dados.cobrancas[cobrancaIndex].status = !dados.cobrancas[cobrancaIndex].status
                
                // Salvar no localStorage
                localStorage.setItem('bancoDados', JSON.stringify(dados))
                
                // Atualizar visual
                this.templateCobrancas()
                
                // Atualizar saldos
                this.atualizarSaldos()
                
                // Atualizar dashboard e extrato
                this.carregarDashboard()
                this.carregarExtrato()
                
                console.log(`Cobrança ${cobrancaId} marcada como ${dados.cobrancas[cobrancaIndex].status ? 'paga' : 'pendente'}`)
            }
        } catch (error) {
            console.error('Erro ao alternar status da cobrança:', error)
        }
    }

    // Método para abrir modal de pagamento
    static abrirModalPagamento(cobrancaId) {
        try {
            const cobranca = CobrancaControle.pegarCobranca().find(c => c.id === cobrancaId)
            if (!cobranca) {
                console.error('Cobrança não encontrada')
                return
            }

            const cliente = ClienteControle.pegarClientes().find(c => c.id === cobranca.cliente)
            
            // Preencher informações no modal
            document.getElementById('pagamento-cliente').textContent = cliente ? cliente.nome : 'Cliente não encontrado'
            document.getElementById('pagamento-descricao').textContent = cobranca.descricao
            document.getElementById('pagamento-valor').textContent = `R$ ${cobranca.valor}`
            
            // Definir data atual como padrão
            const hoje = new Date().toISOString().split('T')[0]
            document.getElementById('dataPagamento').value = hoje
            
            // Armazenar ID da cobrança no modal
            document.getElementById('modalPagamento').setAttribute('data-cobranca-id', cobrancaId)
            
            // Abrir modal
            document.getElementById('modalPagamento').classList.add('show')
            document.body.classList.add('scrollStop')
            
        } catch (error) {
            console.error('Erro ao abrir modal de pagamento:', error)
        }
    }

    // Método para confirmar pagamento
    static confirmarPagamento(dadosPagamento) {
        try {
            const cobrancaId = document.getElementById('modalPagamento').getAttribute('data-cobranca-id')
            
            // Buscar dados do localStorage
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            // Encontrar a cobrança
            const cobrancaIndex = dados.cobrancas.findIndex(c => c.id === cobrancaId)
            
            if (cobrancaIndex !== -1) {
                // Marcar como paga e adicionar dados do pagamento
                dados.cobrancas[cobrancaIndex].status = true
                dados.cobrancas[cobrancaIndex].dadosPagamento = {
                    dataPagamento: dadosPagamento.dataPagamento,
                    formaPagamento: dadosPagamento.formaPagamento,
                    observacoes: dadosPagamento.observacoes,
                    dataConfirmacao: new Date().toISOString()
                }
                
                // Salvar no localStorage
                localStorage.setItem('bancoDados', JSON.stringify(dados))
                
                // Fechar modal
                this.fecharModalPagamento()
                
                // Atualizar interface
                this.templateCobrancas()
                this.atualizarSaldos()
                this.carregarDashboard()
                this.carregarExtrato()
                
                console.log(`Pagamento confirmado para cobrança ${cobrancaId}`)
                
                // Mostrar notificação de sucesso
                this.mostrarNotificacao('Pagamento confirmado com sucesso!', 'success')
                
                return true
            }
        } catch (error) {
            console.error('Erro ao confirmar pagamento:', error)
            this.mostrarNotificacao('Erro ao confirmar pagamento', 'error')
            return false
        }
    }

    // Método para fechar modal de pagamento
    static fecharModalPagamento() {
        document.getElementById('modalPagamento').classList.remove('show')
        document.body.classList.remove('scrollStop')
        document.getElementById('formPagamento').reset()
    }

    // Método para mostrar detalhes da cobrança
    static mostrarDetalhesCobranca(cobrancaId) {
        try {
            const cobranca = CobrancaControle.pegarCobranca().find(c => c.id === cobrancaId)
            if (!cobranca) {
                console.error('Cobrança não encontrada')
                return
            }

            const cliente = ClienteControle.pegarClientes().find(c => c.id === cobranca.cliente)
            
            let detalhes = `
                <h3>Detalhes da Cobrança</h3>
                <p><strong>Cliente:</strong> ${cliente ? cliente.nome : 'Cliente não encontrado'}</p>
                <p><strong>Descrição:</strong> ${cobranca.descricao}</p>
                <p><strong>Valor:</strong> R$ ${cobranca.valor}</p>
                <p><strong>Data de Emissão:</strong> ${cobranca.data}</p>
                <p><strong>Status:</strong> ${cobranca.status ? 'Paga' : 'Pendente'}</p>
            `
            
            if (cobranca.dadosPagamento) {
                detalhes += `
                    <h4>Dados do Pagamento</h4>
                    <p><strong>Data do Pagamento:</strong> ${cobranca.dadosPagamento.dataPagamento}</p>
                    <p><strong>Forma de Pagamento:</strong> ${cobranca.dadosPagamento.formaPagamento}</p>
                    <p><strong>Observações:</strong> ${cobranca.dadosPagamento.observacoes || 'Nenhuma'}</p>
                    <p><strong>Data de Confirmação:</strong> ${new Date(cobranca.dadosPagamento.dataConfirmacao).toLocaleDateString('pt-BR')}</p>
                `
            }
            
            alert(detalhes)
            
        } catch (error) {
            console.error('Erro ao mostrar detalhes da cobrança:', error)
        }
    }

    // Método para mostrar notificações
    static mostrarNotificacao(mensagem, tipo = 'info') {
        const notificacao = document.createElement('div')
        notificacao.className = `notificacao notificacao-${tipo}`
        notificacao.textContent = mensagem
        notificacao.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 5px;
            color: white;
            font-weight: bold;
            z-index: 1000;
            animation: slideIn 0.3s ease;
        `
        
        if (tipo === 'success') {
            notificacao.style.backgroundColor = '#28a745'
        } else if (tipo === 'error') {
            notificacao.style.backgroundColor = '#dc3545'
        } else {
            notificacao.style.backgroundColor = '#17a2b8'
        }
        
        document.body.appendChild(notificacao)
        
        setTimeout(() => {
            notificacao.remove()
        }, 3000)
    }

    static inicializandoAplicacao(){
        //INICIALIANDO O SELECT COM CLIENTES/COBRANÇAS JÁ PRÉ CADASTRADOS
        this.atualizarSelect()
        this.templateCobrancas()
        
        // Atualizar saldos iniciais
        this.atualizarSaldos()
        
        // Configurar atualização automática de saldos
        this.configurarAtualizacaoSaldos()
        
        // Configurar navegação
        this.configurarNavegacao()
        
        // Carregar dashboard inicial
        this.carregarDashboard()
        
        // Carregar extrato
        this.carregarExtrato()
    }
    
    // Método para calcular e atualizar saldos
    static atualizarSaldos() {
        try {
            // Buscar dados do localStorage
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            // Calcular saldos
            let saldoDisponivel = 0
            let saldoPendente = 0
            let totalGeral = 0
            
            dados.cobrancas.forEach(cobranca => {
                totalGeral += parseFloat(cobranca.valor) || 0
                if (cobranca.status) {
                    saldoDisponivel += parseFloat(cobranca.valor) || 0
                } else {
                    saldoPendente += parseFloat(cobranca.valor) || 0
                }
            })
            
            // Formatar valores
            const formatarMoeda = (valor) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(valor)
            }
            
            // Atualizar elementos na página
            const saldoDisponivelEl = document.getElementById('saldo-disponivel')
            const saldoPendenteEl = document.getElementById('saldo-pendente')
            const saldoTotalEl = document.getElementById('saldo-total')
            
            if (saldoDisponivelEl) saldoDisponivelEl.textContent = formatarMoeda(saldoDisponivel)
            if (saldoPendenteEl) saldoPendenteEl.textContent = formatarMoeda(saldoPendente)
            if (saldoTotalEl) saldoTotalEl.textContent = formatarMoeda(totalGeral)
            
        } catch (error) {
            console.error('Erro ao atualizar saldos:', error)
        }
    }
    
    // Configurar atualização automática de saldos
    static configurarAtualizacaoSaldos() {
        // Atualizar saldos periodicamente (a cada 2 segundos)
        setInterval(() => {
            this.atualizarSaldos()
        }, 2000)
        
        // Atualizar saldos quando houver mudanças no localStorage
        window.addEventListener('storage', (e) => {
            if (e.key === 'bancoDados') {
                this.atualizarSaldos()
            }
        })
    }
    
    // Configurar navegação entre páginas
    static configurarNavegacao() {
        const navBtns = document.querySelectorAll('.nav-btn')
        
        navBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetPage = btn.getAttribute('data-page')
                
                // Remover classe active de todos os botões
                navBtns.forEach(b => b.classList.remove('active'))
                
                // Adicionar classe active ao botão clicado
                btn.classList.add('active')
                
                // Mostrar página correspondente
                this.mostrarPagina(targetPage)
            })
        })
    }
    
    // Mostrar página específica
    static mostrarPagina(pagina) {
        // Esconder todas as páginas
        const paginas = ['dashboard', 'cobrancas-page', 'extrato-page']
        paginas.forEach(p => {
            const elemento = document.getElementById(p)
            if (elemento) elemento.style.display = 'none'
        })
        
        // Mostrar página selecionada
        const paginaElemento = document.getElementById(pagina === 'cobrancas' ? 'cobrancas-page' : pagina === 'extrato' ? 'extrato-page' : 'dashboard')
        if (paginaElemento) {
            paginaElemento.style.display = 'block'
            
            // Atualizar dados da página
            if (pagina === 'dashboard') {
                this.carregarDashboard()
            } else if (pagina === 'extrato') {
                this.carregarExtrato()
            } else if (pagina === 'cobrancas') {
                this.templateCobrancas()
            }
        }
    }
    
    // Carregar dashboard com estatísticas
    static carregarDashboard() {
        try {
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            // Calcular estatísticas
            let receitaTotal = 0
            let recebido = 0
            let pendente = 0
            const totalClientes = dados.clientes.length
            
            dados.cobrancas.forEach(cobranca => {
                const valor = parseFloat(cobranca.valor) || 0
                receitaTotal += valor
                
                if (cobranca.status) {
                    recebido += valor
                } else {
                    pendente += valor
                }
            })
            
            // Formatar valores
            const formatarMoeda = (valor) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(valor)
            }
            
            // Atualizar elementos do dashboard
            const elementos = {
                'receita-total': formatarMoeda(receitaTotal),
                'recebido': formatarMoeda(recebido),
                'pendente': formatarMoeda(pendente),
                'total-clientes': totalClientes
            }
            
            Object.keys(elementos).forEach(id => {
                const elemento = document.getElementById(id)
                if (elemento) elemento.textContent = elementos[id]
            })
            
            // Gerar gráficos simples
            this.gerarGraficosDashboard(dados)
            
        } catch (error) {
            console.error('Erro ao carregar dashboard:', error)
        }
    }
    
    // Gerar gráficos simples para o dashboard
    static gerarGraficosDashboard(dados) {
        // Gráfico de evolução mensal (simulado)
        const chartEvolucao = document.getElementById('chart-evolucao')
        if (chartEvolucao) {
            chartEvolucao.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h4>Evolução dos Últimos 6 Meses</h4>
                    <div style="display: flex; justify-content: space-around; align-items: end; height: 200px; margin-top: 20px;">
                        ${this.gerarBarrasEvolucao(dados)}
                    </div>
                </div>
            `
        }
        
        // Gráfico de distribuição por status
        const chartDistribuicao = document.getElementById('chart-distribuicao')
        if (chartDistribuicao) {
            chartDistribuicao.innerHTML = `
                <div style="padding: 20px; text-align: center;">
                    <h4>Distribuição por Status</h4>
                    <div style="display: flex; justify-content: center; align-items: center; height: 200px; margin-top: 20px;">
                        ${this.gerarPizzaDistribuicao(dados)}
                    </div>
                </div>
            `
        }
    }
    
    // Gerar barras para gráfico de evolução
    static gerarBarrasEvolucao(dados) {
        const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun']
        const valores = [1200, 1800, 1500, 2200, 1900, 2500] // Valores simulados
        
        return meses.map((mes, index) => {
            const altura = (valores[index] / Math.max(...valores)) * 150
            return `
                <div style="display: flex; flex-direction: column; align-items: center;">
                    <div style="width: 30px; height: ${altura}px; background: linear-gradient(to top, #667eea, #764ba2); border-radius: 5px; margin-bottom: 10px;"></div>
                    <span style="font-size: 12px; color: #666;">${mes}</span>
                </div>
            `
        }).join('')
    }
    
    // Gerar pizza para gráfico de distribuição
    static gerarPizzaDistribuicao(dados) {
        const totalCobrancas = dados.cobrancas.length
        const cobrancasPagas = dados.cobrancas.filter(c => c.status).length
        const cobrancasPendentes = totalCobrancas - cobrancasPagas
        
        if (totalCobrancas === 0) {
            return '<p>Nenhuma cobrança registrada</p>'
        }
        
        const percentualPagas = (cobrancasPagas / totalCobrancas) * 100
        const percentualPendentes = (cobrancasPendentes / totalCobrancas) * 100
        
        return `
            <div style="position: relative; width: 150px; height: 150px; border-radius: 50%; background: conic-gradient(
                #4facfe 0deg ${percentualPagas * 3.6}deg,
                #f093fb ${percentualPagas * 3.6}deg 360deg
            );">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80px; height: 80px; background: white; border-radius: 50%;"></div>
            </div>
            <div style="margin-top: 20px;">
                <div style="display: flex; justify-content: center; gap: 20px;">
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 15px; height: 15px; background: #4facfe; border-radius: 3px;"></div>
                        <span>Pagas (${percentualPagas.toFixed(1)}%)</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px;">
                        <div style="width: 15px; height: 15px; background: #f093fb; border-radius: 3px;"></div>
                        <span>Pendentes (${percentualPendentes.toFixed(1)}%)</span>
                    </div>
                </div>
            </div>
        `
    }
    
    // Carregar extrato financeiro
    static carregarExtrato() {
        try {
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            // Gerar dados do extrato
            const extratoData = this.gerarDadosExtrato(dados)
            
            // Atualizar tabela do extrato
            this.atualizarTabelaExtrato(extratoData)
            
            // Atualizar resumo do extrato
            this.atualizarResumoExtrato(extratoData)
            
        } catch (error) {
            console.error('Erro ao carregar extrato:', error)
        }
    }
    
    // Gerar dados do extrato
    static gerarDadosExtrato(dados) {
        const extrato = []
        
        dados.cobrancas.forEach(cobranca => {
            const cliente = dados.clientes.find(c => c.id == cobranca.cliente)
            
            extrato.push({
                data: cobranca.data,
                cliente: cliente ? cliente.nome : 'Cliente não encontrado',
                descricao: cobranca.descricao,
                valor: parseFloat(cobranca.valor) || 0,
                status: cobranca.status ? 'Paga' : 'Pendente',
                tipo: 'Receita',
                dadosOriginais: cobranca
            })
        })
        
        // Ordenar por data (mais recente primeiro)
        return extrato.sort((a, b) => new Date(b.data) - new Date(a.data))
    }
    
    // Atualizar tabela do extrato
    static atualizarTabelaExtrato(extratoData) {
        const tbody = document.getElementById('extrato-tbody')
        if (!tbody) return
        
        tbody.innerHTML = ''
        
        extratoData.forEach(item => {
            const row = document.createElement('tr')
            
            const formatarMoeda = (valor) => {
                return new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }).format(valor)
            }
            
            row.innerHTML = `
                <td>${item.data}</td>
                <td>${item.cliente}</td>
                <td>${item.descricao}</td>
                <td>${formatarMoeda(item.valor)}</td>
                <td><span class="status-badge ${item.status.toLowerCase()}">${item.status}</span></td>
                <td><span class="tipo-badge">${item.tipo}</span></td>
            `
            
            tbody.appendChild(row)
        })
    }
    
    // Atualizar resumo do extrato
    static atualizarResumoExtrato(extratoData) {
        const totalRegistros = extratoData.length
        const valorTotal = extratoData.reduce((sum, item) => sum + item.valor, 0)
        const valorRecebido = extratoData.filter(item => item.status === 'Paga').reduce((sum, item) => sum + item.valor, 0)
        const valorPendente = valorTotal - valorRecebido
        
        const formatarMoeda = (valor) => {
            return new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor)
        }
        
        // Atualizar elementos
        const elementos = {
            'total-registros': totalRegistros,
            'valor-total-extrato': formatarMoeda(valorTotal),
            'valor-recebido-extrato': formatarMoeda(valorRecebido),
            'valor-pendente-extrato': formatarMoeda(valorPendente)
        }
        
        Object.keys(elementos).forEach(id => {
            const elemento = document.getElementById(id)
            if (elemento) elemento.textContent = elementos[id]
        })
    }
    
    // Aplicar filtros do extrato
    static aplicarFiltrosExtrato() {
        try {
            const statusFilter = document.getElementById('filter-status').value
            const periodoFilter = document.getElementById('filter-periodo').value
            
            const dados = JSON.parse(localStorage.getItem('bancoDados')) || {
                cobrancas: [],
                clientes: []
            }
            
            let extratoData = this.gerarDadosExtrato(dados)
            
            // Aplicar filtro de status
            if (statusFilter) {
                extratoData = extratoData.filter(item => 
                    statusFilter === 'paga' ? item.status === 'Paga' : item.status === 'Pendente'
                )
            }
            
            // Aplicar filtro de período
            if (periodoFilter && periodoFilter !== 'todos') {
                const hoje = new Date()
                let dataLimite = new Date()
                
                switch (periodoFilter) {
                    case 'mes':
                        dataLimite.setMonth(hoje.getMonth() - 1)
                        break
                    case 'trimestre':
                        dataLimite.setMonth(hoje.getMonth() - 3)
                        break
                    case 'ano':
                        dataLimite.setFullYear(hoje.getFullYear() - 1)
                        break
                }
                
                extratoData = extratoData.filter(item => {
                    const dataItem = new Date(item.data)
                    return dataItem >= dataLimite
                })
            }
            
            // Atualizar tabela e resumo com dados filtrados
            this.atualizarTabelaExtrato(extratoData)
            this.atualizarResumoExtrato(extratoData)
            
        } catch (error) {
            console.error('Erro ao aplicar filtros:', error)
        }
    }
}

export {Quadro}