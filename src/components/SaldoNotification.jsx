import { CheckCircle, DollarSign } from 'lucide-react'
import { useState, useEffect } from 'react'

const SaldoNotification = ({ show, valor, onClose }) => {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (show) {
            setIsVisible(true)
            const timer = setTimeout(() => {
                setIsVisible(false)
                setTimeout(onClose, 300) // Aguarda a animação terminar
            }, 3000)
            return () => clearTimeout(timer)
        }
    }, [show, onClose])

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(value)
    }

    if (!show) return null

    return (
        <div className={`saldo-notification ${isVisible ? 'show' : 'hide'}`}>
            <div className="notification-content">
                <div className="notification-icon">
                    <CheckCircle size={24} />
                </div>
                <div className="notification-text">
                    <h4>Pagamento Confirmado!</h4>
                    <p>Saldo atualizado: <strong>{formatCurrency(valor)}</strong></p>
                </div>
                <div className="notification-amount">
                    <DollarSign size={20} />
                    <span>+{formatCurrency(valor)}</span>
                </div>
            </div>
        </div>
    )
}

export default SaldoNotification 