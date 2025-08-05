import { Home, Trello, Tag, Users, PiggyBank, TrendingUp, AlertTriangle, Calculator, Brain } from 'lucide-react'

const Sidebar = ({ activeTab, onTabChange }) => {
    const menuItems = [
        { id: 'home', icon: Home, label: 'Dashboard' },
        { id: 'receitas', icon: TrendingUp, label: 'Receitas' },
        { id: 'despesas', icon: Tag, label: 'Despesas' },
        { id: 'dividas', icon: AlertTriangle, label: 'Dívidas' },
        { id: 'emergencia', icon: PiggyBank, label: 'Fundo Emergência' },
        { id: 'planejamento', icon: Calculator, label: 'Planejamento' },
        { id: 'memorias', icon: Brain, label: 'Memórias' },
        { id: 'extrato', icon: Trello, label: 'Extrato' },
        { id: 'clientes', icon: Users, label: 'Categorias' }
    ]

    return (
        <aside className="app__navegacao">
            <nav>
                <ul>
                    {menuItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <li key={item.id}>
                                <button 
                                    className={activeTab === item.id ? 'active' : ''}
                                    onClick={() => onTabChange(item.id)}
                                >
                                    <IconComponent size={20} />
                                    <span>{item.label}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar