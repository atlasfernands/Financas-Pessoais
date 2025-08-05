const Transaction = require('../models/Transaction');
const { validationResult } = require('express-validator');

class TransactionController {
    async list(req, res) {
        try {
            const { 
                startDate, 
                endDate, 
                category, 
                type, 
                page = 1, 
                limit = 10,
                sortBy = 'date',
                sortOrder = 'desc'
            } = req.query;
            
            const userId = req.user.id;
            let query = { userId };
            
            // Filtros
            if (startDate && endDate) {
                const start = new Date(startDate);
                const end = new Date(endDate);
                start.setHours(0, 0, 0, 0);
                end.setHours(23, 59, 59, 999);
                
                query.date = {
                    $gte: start,
                    $lte: end
                };
            }
            
            if (category) {
                query.category = category;
            }
            
            if (type) {
                query.type = type;
            }
            
            // Contagem total para paginação
            const total = await Transaction.countDocuments(query);
            
            // Paginação e ordenação
            const skip = (parseInt(page) - 1) * parseInt(limit);
            const sortConfig = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };
            
            const transactions = await Transaction.find(query)
                .sort(sortConfig)
                .skip(skip)
                .limit(parseInt(limit))
                .populate('category', 'name')
                .lean();
            
            // Cálculo de totais da página
            const totals = transactions.reduce((acc, trans) => {
                if (trans.type === 'receita') {
                    acc.receitas += trans.amount;
                } else {
                    acc.despesas += trans.amount;
                }
                return acc;
            }, { receitas: 0, despesas: 0 });
            
            res.json({
                transactions,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: parseInt(page),
                    limit: parseInt(limit)
                },
                totals: {
                    ...totals,
                    saldo: totals.receitas - totals.despesas
                }
            });
        } catch (error) {
            console.error('Erro ao listar transações:', error);
            res.status(500).json({ error: 'Erro ao buscar transações' });
        }
    }

    async create(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            const userId = req.user.id;
            const transaction = new Transaction({
                ...req.body,
                userId
            });

            await transaction.save();
            res.status(201).json(transaction);
        } catch (error) {
            console.error('Erro ao criar transação:', error);
            res.status(500).json({ error: 'Erro ao criar transação' });
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

            const transaction = await Transaction.findOneAndUpdate(
                { _id: id, userId },
                req.body,
                { new: true }
            );

            if (!transaction) {
                return res.status(404).json({ error: 'Transação não encontrada' });
            }

            res.json(transaction);
        } catch (error) {
            console.error('Erro ao atualizar transação:', error);
            res.status(500).json({ error: 'Erro ao atualizar transação' });
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user.id;

            const transaction = await Transaction.findOneAndDelete({ _id: id, userId });

            if (!transaction) {
                return res.status(404).json({ error: 'Transação não encontrada' });
            }

            res.json({ message: 'Transação removida com sucesso' });
        } catch (error) {
            console.error('Erro ao excluir transação:', error);
            res.status(500).json({ error: 'Erro ao excluir transação' });
        }
    }

    async getBalance(req, res) {
        try {
            const userId = req.user.id;
            const { startDate, endDate } = req.query;

            let query = { userId };
            if (startDate && endDate) {
                query.date = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }

            const transactions = await Transaction.find(query);
            const balance = transactions.reduce((acc, trans) => {
                return trans.type === 'receita' 
                    ? acc + trans.amount 
                    : acc - trans.amount;
            }, 0);

            res.json({ balance });
        } catch (error) {
            console.error('Erro ao calcular saldo:', error);
            res.status(500).json({ error: 'Erro ao calcular saldo' });
        }
    }
}

module.exports = new TransactionController();
