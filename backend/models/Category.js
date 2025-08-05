const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome da categoria é obrigatório'],
        trim: true,
        maxlength: [50, 'Nome deve ter no máximo 50 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Descrição deve ter no máximo 200 caracteres']
    },
    type: {
        type: String,
        required: [true, 'Tipo da categoria é obrigatório'],
        enum: {
            values: ['receita', 'despesa'],
            message: 'Tipo deve ser "receita" ou "despesa"'
        }
    },
    color: {
        type: String,
        required: [true, 'Cor é obrigatória'],
        match: [/^#[0-9A-F]{6}$/i, 'Cor deve ser um código hexadecimal válido']
    },
    icon: {
        type: String,
        default: 'tag'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuário é obrigatório']
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isActive: {
        type: Boolean,
        default: true
    },
    budget: {
        monthly: {
            type: Number,
            default: 0,
            min: [0, 'Orçamento mensal não pode ser negativo']
        },
        yearly: {
            type: Number,
            default: 0,
            min: [0, 'Orçamento anual não pode ser negativo']
        }
    },
    stats: {
        totalTransactions: {
            type: Number,
            default: 0
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        lastTransactionDate: {
            type: Date,
            default: null
        },
        averageAmount: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices compostos
categorySchema.index({ user: 1, type: 1 });
categorySchema.index({ user: 1, name: 1 }, { unique: true });
categorySchema.index({ user: 1, isActive: 1 });
categorySchema.index({ createdAt: -1 });

// Virtual para verificar se está no orçamento
categorySchema.virtual('isOnBudget').get(function() {
    if (this.budget.monthly === 0) return true;
    return this.stats.totalAmount <= this.budget.monthly;
});

// Virtual para calcular porcentagem do orçamento usada
categorySchema.virtual('budgetUsagePercentage').get(function() {
    if (this.budget.monthly === 0) return 0;
    return Math.round((this.stats.totalAmount / this.budget.monthly) * 100);
});

// Middleware para validar categoria única por usuário
categorySchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('name')) {
        const existingCategory = await this.constructor.findOne({
            user: this.user,
            name: { $regex: new RegExp(`^${this.name}$`, 'i') },
            _id: { $ne: this._id }
        });
        
        if (existingCategory) {
            const error = new Error('Você já possui uma categoria com este nome');
            error.code = 'DUPLICATE_CATEGORY';
            return next(error);
        }
    }
    next();
});

// Middleware para atualizar estatísticas quando transações são modificadas
categorySchema.methods.updateStats = async function() {
    const Transaction = mongoose.model('Transaction');
    
    const stats = await Transaction.aggregate([
        {
            $match: {
                category: this._id,
                user: this.user
            }
        },
        {
            $group: {
                _id: null,
                totalTransactions: { $sum: 1 },
                totalAmount: { $sum: '$amount' },
                averageAmount: { $avg: '$amount' },
                lastTransactionDate: { $max: '$date' }
            }
        }
    ]);
    
    if (stats.length > 0) {
        this.stats = {
            totalTransactions: stats[0].totalTransactions,
            totalAmount: stats[0].totalAmount,
            averageAmount: Math.round(stats[0].averageAmount * 100) / 100,
            lastTransactionDate: stats[0].lastTransactionDate
        };
    } else {
        this.stats = {
            totalTransactions: 0,
            totalAmount: 0,
            averageAmount: 0,
            lastTransactionDate: null
        };
    }
    
    return this.save();
};

// Método estático para criar categorias padrão
categorySchema.statics.createDefaultCategories = async function(userId) {
    const defaultCategories = [
        // Receitas
        {
            name: 'Salário',
            description: 'Renda principal do trabalho',
            type: 'receita',
            color: '#22c55e',
            icon: 'dollar-sign',
            user: userId,
            isDefault: true
        },
        {
            name: 'Freelance',
            description: 'Trabalhos extras e projetos',
            type: 'receita',
            color: '#3b82f6',
            icon: 'briefcase',
            user: userId,
            isDefault: true
        },
        {
            name: 'Investimentos',
            description: 'Rendimentos de investimentos',
            type: 'receita',
            color: '#8b5cf6',
            icon: 'trending-up',
            user: userId,
            isDefault: true
        },
        
        // Despesas
        {
            name: 'Moradia',
            description: 'Aluguel, financiamento, condomínio',
            type: 'despesa',
            color: '#ef4444',
            icon: 'home',
            user: userId,
            isDefault: true
        },
        {
            name: 'Alimentação',
            description: 'Supermercado, restaurantes',
            type: 'despesa',
            color: '#f59e0b',
            icon: 'utensils',
            user: userId,
            isDefault: true
        },
        {
            name: 'Transporte',
            description: 'Combustível, transporte público',
            type: 'despesa',
            color: '#06b6d4',
            icon: 'car',
            user: userId,
            isDefault: true
        },
        {
            name: 'Saúde',
            description: 'Plano de saúde, medicamentos',
            type: 'despesa',
            color: '#10b981',
            icon: 'heart',
            user: userId,
            isDefault: true
        },
        {
            name: 'Lazer',
            description: 'Entretenimento, viagens',
            type: 'despesa',
            color: '#ec4899',
            icon: 'gamepad-2',
            user: userId,
            isDefault: true
        }
    ];
    
    try {
        await this.insertMany(defaultCategories);
        console.log(`✅ Categorias padrão criadas para usuário ${userId}`);
    } catch (error) {
        console.error('❌ Erro ao criar categorias padrão:', error.message);
    }
};

// Middleware para remover transações relacionadas ao deletar categoria
categorySchema.pre('remove', async function(next) {
    try {
        // Remover todas as transações desta categoria
        await this.model('Transaction').deleteMany({ category: this._id });
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Category', categorySchema);