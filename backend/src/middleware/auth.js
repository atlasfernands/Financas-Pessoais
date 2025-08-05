const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    try {
        // Verifica o header de autorização
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Extrai o token do header (Bearer token)
        const [, token] = authHeader.split(' ');
        if (!token) {
            return res.status(401).json({ error: 'Token não fornecido' });
        }

        // Verifica e decodifica o token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Adiciona informações do usuário ao request
        req.user = {
            id: decoded.userId,
            email: decoded.email
        };

        return next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({ error: 'Token expirado' });
        }
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({ error: 'Token inválido' });
        }
        return res.status(500).json({ error: 'Erro na autenticação' });
    }
};

module.exports = authMiddleware;
