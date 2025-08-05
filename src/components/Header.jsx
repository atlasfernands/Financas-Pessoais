import { DollarSign, TrendingUp, Clock, Moon, Sun } from 'lucide-react'
import { useCobrancas } from '../hooks/useCobrancas'
import { useTheme } from '../hooks/useTheme'

const Header = () => {
    const { theme, toggleTheme } = useTheme()
    const { estatisticas } = useCobrancas()

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    return (
        <header className="header">
            <div className="app__logo flex items-center justify-between">
                <h1>Finanças Pessoais</h1>
                <button 
                    onClick={toggleTheme}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    aria-label="Alternar tema"
                >
                    {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
            </div>
            <div className="app__saldos">
                <div className="saldo-item saldo-disponivel">
                    <div className="saldo-icon">
                        <DollarSign size={18} />
                    </div>
                    <div className="saldo-info">
                        <p className="saldo-label">Saldo Disponível</p>
                        <span className="saldo-valor">{formatCurrency(estatisticas.pagas)}</span>
                    </div>
                </div>
                
                <div className="saldo-divider"></div>
                
                <div className="saldo-item saldo-pendente">
                    <div className="saldo-icon">
                        <Clock size={18} />
                    </div>
                    <div className="saldo-info">
                        <p className="saldo-label">Saldo Pendente</p>
                        <span className="saldo-valor">{formatCurrency(estatisticas.pendentes)}</span>
                    </div>
                </div>
                
                <div className="saldo-divider"></div>
                
                <div className="saldo-item saldo-total">
                    <div className="saldo-icon">
                        <TrendingUp size={18} />
                    </div>
                    <div className="saldo-info">
                        <p className="saldo-label">Total Geral</p>
                        <span className="saldo-valor">{formatCurrency(estatisticas.total)}</span>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header