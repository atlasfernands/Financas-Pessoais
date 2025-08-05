import express from 'express';
import { MockService } from '../services/mockData.js';
import { auth } from '../middleware/auth.js';
import process from 'process';

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(auth);

// @route   GET /api/categories
// @desc    Obter todas as categorias do usuário
// @access  Private
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        
        const result = await MockService.getCategoriesByUser(req.user.id, { type });
        
        res.json(result);
    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/categories/stats/overview
// @desc    Obter estatísticas das categorias
// @access  Private
router.get('/stats/overview', async (req, res) => {
    try {
        const stats = await MockService.getCategoryStats(req.user.id);
        
        res.json({ stats });
    } catch (error) {
        console.error('Erro ao buscar estatísticas:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/categories/:id
// @desc    Obter categoria específica
// @access  Private
router.get('/:id', async (req, res) => {
    try {
        const category = await MockService.getCategoryById(req.params.id, req.user.id);
        
        if (!category) {
            return res.status(404).json({
                error: 'Categoria não encontrada'
            });
        }
        
        res.json({ category });
    } catch (error) {
        console.error('Erro ao buscar categoria:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/categories
// @desc    Criar nova categoria
// @access  Private
router.post('/', async (req, res) => {
    try {
        const { name, description, type, color, icon } = req.body;
        
        // Validações básicas
        if (!name || !type || !color) {
            return res.status(400).json({
                error: 'Nome, tipo e cor são obrigatórios'
            });
        }
        
        if (!['receita', 'despesa'].includes(type)) {
            return res.status(400).json({
                error: 'Tipo deve ser "receita" ou "despesa"'
            });
        }
        
        const categoryData = {
            name: name.trim(),
            description: description?.trim(),
            type,
            color,
            icon: icon || 'tag',
            user: req.user.id
        };
        
        const category = await MockService.createCategory(categoryData);
        
        res.status(201).json({
            message: 'Categoria criada com sucesso',
            category
        });
    } catch (error) {
        console.error('Erro ao criar categoria:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   PUT /api/categories/:id
// @desc    Atualizar categoria
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { name, description, type, color, icon } = req.body;
        
        const updateData = {};
        
        if (name !== undefined) updateData.name = name.trim();
        if (description !== undefined) updateData.description = description.trim();
        if (type !== undefined) {
            if (!['receita', 'despesa'].includes(type)) {
                return res.status(400).json({
                    error: 'Tipo deve ser "receita" ou "despesa"'
                });
            }
            updateData.type = type;
        }
        if (color !== undefined) updateData.color = color;
        if (icon !== undefined) updateData.icon = icon;
        
        const category = await MockService.updateCategory(req.params.id, req.user.id, updateData);
        
        if (!category) {
            return res.status(404).json({
                error: 'Categoria não encontrada'
            });
        }
        
        res.json({
            message: 'Categoria atualizada com sucesso',
            category
        });
    } catch (error) {
        console.error('Erro ao atualizar categoria:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   DELETE /api/categories/:id
// @desc    Deletar categoria
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        const category = await MockService.deleteCategory(req.params.id, req.user.id);
        
        if (!category) {
            return res.status(404).json({
                error: 'Categoria não encontrada'
            });
        }
        
        res.json({
            message: 'Categoria deletada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao deletar categoria:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

export default router;