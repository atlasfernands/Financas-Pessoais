import express from 'express';
import { MockService } from '../services/mockData.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(auth);

// @route   GET /api/goals/stats/overview
// @desc    Obter estatísticas das metas
// @access  Private
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await MockService.getGoalStats(req.user.id);
        
        res.json({ stats });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   GET /api/goals
// @desc    Obter todas as metas do usuário
// @access  Private
router.get('/', async (req, res) => {
    try {
        res.json({
            goals: [],
            total: 0,
            page: 1,
            limit: 20
        });
    } catch (error) {
        console.error('Erro ao buscar metas:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

export default router;