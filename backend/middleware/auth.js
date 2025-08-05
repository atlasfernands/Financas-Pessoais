import jwt from 'jsonwebtoken';
import { MockService } from '../services/mockData.js';
import dotenv from 'dotenv';
dotenv.config();

export const auth = async (req, res, next) => {
    try {
        // Obter token do header
        const authHeader = req.header('Authorization');
        
        if (!authHeader) {
            return res.status(401).json({
                error: 'Acesso negado. Token não fornecido.'
            });
        }

        // Verificar formato do token (Bearer token)
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if (!token) {
            return res.status(401).json({
                error: 'Acesso negado. Token inválido.'
            });
        }

        // Verificar e decodificar token
        const decoded = jwt.verify(
            token, 
            import.meta.env.JWT_SECRET || 'fallback_secret_key'
        );

        // Buscar usuário usando mock service
        const user = await MockService.findUserById(decoded.userId);
        
        if (!user) {
            return res.status(401).json({
                error: 'Token inválido. Usuário não encontrado.'
            });
        }

        // Verificar se usuário está ativo
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Conta desativada.'
            });
        }

        // Adicionar dados do usuário à requisição
        req.user = {
            id: user._id,
            email: user.email,
            name: user.name
        };

        next();

    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Erro na autenticação:', error.message);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                error: 'Token inválido.'
            });
        }
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expirado. Faça login novamente.'
            });
        }

        res.status(500).json({
            error: 'Erro interno no servidor.',
            message: import.meta.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

// Export já feito na linha 4 com "export const auth"