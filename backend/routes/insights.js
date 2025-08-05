import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(auth);

// @route   GET /api/insights/financial-overview
// @desc    Obter visão geral financeira
// @access  Private
router.get('/financial-overview', async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        // Mock insights data
        const insights = {
            period,
            totalReceitas: 60000,
            totalDespesas: 36000,
            saldoLiquido: 24000,
            categoriasMaisGastosas: [
                { name: 'Alimentação', amount: 13500 },
                { name: 'Transporte', amount: 7200 },
                { name: 'Lazer', amount: 4800 }
            ],
            tendencia: 'positiva',
            sugestoes: [
                'Considere aumentar sua reserva de emergência',
                'Suas despesas com alimentação estão acima da média',
                'Parabéns! Você está no caminho certo'
            ]
        };
        
        res.json(insights);
    } catch (error) {
        // Aqui você pode adicionar um logger personalizado, se necessário
        console.error(error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

export default router;