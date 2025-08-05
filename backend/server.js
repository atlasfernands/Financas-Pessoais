import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { connectDB } from './config/db.js';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://127.0.0.1:5173', 'http://127.0.0.1:5174', 'http://127.0.0.1:5175'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Inicializar conexão com o banco de dados
connectDB().then(() => {
    console.log('Banco de dados inicializado');
}).catch(err => {
    console.error('Erro ao inicializar banco de dados:', err);
    process.exit(1);
});

// Importar rotas
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import categoryRoutes from './routes/categories.js';
import transactionRoutes from './routes/transactions.js';
import goalsRoutes from './routes/goals.js';
import insightsRoutes from './routes/insights.js';

// Usar rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/goals', goalsRoutes);
app.use('/api/insights', insightsRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'Servidor de Finanças Pessoais rodando!',
        timestamp: new Date().toISOString(),
        mongodb: mongoose.connection.readyState === 1 ? 'conectado' : 'desconectado'
    });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error('❌ Erro no servidor:', err.stack);
    res.status(500).json({ 
        error: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado!'
    });
});

// Middleware para rotas não encontradas
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Rota não encontrada',
        path: req.originalUrl 
    });
});

// Inicializar servidor
const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => {
        console.log(`🚀 Servidor rodando na porta ${PORT}`);
        console.log(`📱 Frontend esperado em: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
        console.log(`🌐 API disponível em: http://localhost:${PORT}/api`);
        console.log(`❤️  Health check: http://localhost:${PORT}/api/health`);
        console.log(`🔧 Modo: ${process.env.NODE_ENV || 'development'}`);
    });
};

// Tratamento de sinais para encerramento gracioso
process.on('SIGTERM', () => {
    console.log('⏳ Recebido SIGTERM. Encerrando servidor...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('⏳ Recebido SIGINT. Encerrando servidor...');
    process.exit(0);
});

// Tratamento de erros não capturados
process.on('uncaughtException', (error) => {
    console.error('❌ Erro não capturado:', error);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Promise rejeitada não tratada:', reason);
    process.exit(1);
});

// Iniciar servidor
startServer();

export default app;