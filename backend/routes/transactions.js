const express = require('express');
const MockService = require('../services/mockData');
const auth = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(auth);

// @route   GET /api/transactions/stats/summary
// @desc    Obter resumo das transações
// @access  Private
router.get('/stats/summary', async (req, res) => {
    try {
        const summary = await MockService.getTransactionSummary(req.user.id, req.query);
        
        res.json({ summary });
    } catch (error) {
        console.error('Erro ao buscar resumo:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/transactions
// @desc    Obter todas as transações do usuário
// @access  Private
router.get('/', async (req, res) => {
    try {
        res.json({
            transactions: [],
            total: 0,
            page: 1,
            limit: 20
        });
    } catch (error) {
        console.error('Erro ao buscar transações:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   POST /api/transactions
// @desc    Criar nova transação
// @access  Private
router.post('/', async (req, res) => {
    try {
        res.status(201).json({
            message: 'Funcionalidade em desenvolvimento',
            transaction: null
        });
    } catch (error) {
        console.error('Erro ao criar transação:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router;