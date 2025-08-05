import { PiggyBank, AlertTriangle, TrendingUp, Calculator, Info } from 'lucide-react'
import { useState, useEffect } from 'react'

const FundoEmergencia = () => {
    const [salario, setSalario] = useState('')
    const [despesasMensais, setDespesasMensais] = useState('')
    const [economiaMensal, setEconomiaMensal] = useState('')
    const [resultado, setResultado] = useState(null)

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    const calcularFundoEmergencia = () => {
        const salarioNum = parseFloat(salario) || 0
        const despesasNum = parseFloat(despesasMensais) || 0
        const economiaNum = parseFloat(economiaMensal) || 0

        if (salarioNum === 0) return

        // Cálculo do fundo de emergência (6 meses de despesas)
        const fundoEmergencia = despesasNum * 6
        
        // Porcentagem do salário para economizar
        const porcentagemEconomia = (economiaNum / salarioNum) * 100
        
        // Tempo para atingir o fundo de emergência
        const mesesParaFundo = economiaNum > 0 ? Math.ceil(fundoEmergencia / economiaNum) : 0
        
        // Valor mensal recomendado (10% do salário)
        const valorRecomendado = salarioNum * 0.1
        
        // Meses para atingir com valor recomendado
        const mesesRecomendado = valorRecomendado > 0 ? Math.ceil(fundoEmergencia / valorRecomendado) : 0

        setResultado({
            fundoEmergencia,
            porcentagemEconomia,
            mesesParaFundo,
            valorRecomendado,
            mesesRecomendado,
            salario: salarioNum,
            despesas: despesasNum,
            economia: economiaNum
        })
    }

    useEffect(() => {
        if (salario && despesasMensais) {
            calcularFundoEmergencia()
        }
    }, [salario, despesasMensais, economiaMensal])

    return (
        <div className="fundo-emergencia">
            <div className="section-header">
                <h2>🏦 Fundo de Emergência</h2>
                <p>Calcule quanto você precisa guardar para ter segurança financeira</p>
            </div>

            <div className="calculator-grid">
                <div className="calculator-form">
                    <h3>📊 Informações Financeiras</h3>
                    
                    <div className="form-group">
                        <label>Salário Mensal</label>
                        <input
                            type="number"
                            value={salario}
                            onChange={(e) => setSalario(e.target.value)}
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Despesas Mensais</label>
                        <input
                            type="number"
                            value={despesasMensais}
                            onChange={(e) => setDespesasMensais(e.target.value)}
                            placeholder="R$ 0,00"
                        />
                    </div>

                    <div className="form-group">
                        <label>Economia Mensal (opcional)</label>
                        <input
                            type="number"
                            value={economiaMensal}
                            onChange={(e) => setEconomiaMensal(e.target.value)}
                            placeholder="R$ 0,00"
                        />
                    </div>
                </div>

                {resultado && (
                    <div className="results-section">
                        <h3>📈 Resultados</h3>
                        
                        <div className="result-cards">
                            <div className="result-card emergency">
                                <div className="card-icon">
                                    <PiggyBank size={24} />
                                </div>
                                <div className="card-content">
                                    <h4>Fundo de Emergência</h4>
                                    <span className="card-value">{formatCurrency(resultado.fundoEmergencia)}</span>
                                    <p>6 meses de despesas</p>
                                </div>
                            </div>

                            <div className="result-card recommendation">
                                <div className="card-icon">
                                    <Calculator size={24} />
                                </div>
                                <div className="card-content">
                                    <h4>Valor Recomendado</h4>
                                    <span className="card-value">{formatCurrency(resultado.valorRecomendado)}</span>
                                    <p>10% do salário mensal</p>
                                </div>
                            </div>

                            <div className="result-card time">
                                <div className="card-icon">
                                    <TrendingUp size={24} />
                                </div>
                                <div className="card-content">
                                    <h4>Tempo para Atingir</h4>
                                    <span className="card-value">{resultado.mesesRecomendado} meses</span>
                                    <p>Com valor recomendado</p>
                                </div>
                            </div>
                        </div>

                        <div className="advice-section">
                            <div className="advice-card">
                                <div className="advice-icon">
                                    <Info size={20} />
                                </div>
                                <div className="advice-content">
                                    <h4>💡 Dicas Importantes</h4>
                                    <ul>
                                        <li>Guarde pelo menos 10% do seu salário mensal</li>
                                        <li>O fundo deve cobrir 6 meses de despesas</li>
                                        <li>Mantenha em conta separada e de fácil acesso</li>
                                        <li>Use apenas para emergências reais</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default FundoEmergencia 