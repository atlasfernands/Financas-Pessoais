const Category = require('../models/Category');
const { validationResult } = require('express-validator');

class CategoryController {
    async list(req, res) {
        try {
            const userId = req.user.id;
            const categories = await Category.find({ userId });
            res.json(categories);
        } catch (error) {
            console.error('Erro ao listar categorias:', error);
            res.status(500).json({ error: 'Erro ao buscar categorias' });
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = req.user.id;
            const category = new Category({
                ...req.body,
                userId
            });

            await category.save();
            res.status(201).json(category);
        } catch (error) {
            console.error('Erro ao criar categoria:', error);
            res.status(500).json({ error: 'Erro ao criar categoria' });
        }
    }

    async update(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const { id } = req.params;
            const userId = req.user.id;

            const category = await Category.findOneAndUpdate(
                { _id: id, userId },
                req.body,
                { new: true }
            );

            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json(category);
        } catch (error) {
            console.error('Erro ao atualizar categoria:', error);
            res.status(500).json({ error: 'Erro ao atualizar categoria' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const category = await Category.findOneAndDelete({ _id: id, userId });

            if (!category) {
                return res.status(404).json({ error: 'Categoria não encontrada' });
            }

            res.json({ message: 'Categoria removida com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir categoria:', error);
            res.status(500).json({ error: 'Erro ao excluir categoria' });
        }
    }
}

module.exports = new CategoryController();
