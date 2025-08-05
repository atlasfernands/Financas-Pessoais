const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Título da meta é obrigatório'],
        trim: true,
        maxlength: [100, 'Título deve ter no máximo 100 caracteres']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Descrição deve ter no máximo 500 caracteres']
    },
    type: {
        type: String,
        required: [true, 'Tipo da meta é obrigatório'],
        enum: {
            values: ['economia', 'receita', 'reducao_despesa', 'investimento', 'emergencia'],
            message: 'Tipo deve ser: economia, receita, reducao_despesa, investimento ou emergencia'
        }
    },
    targetAmount: {
        type: Number,
        required: [true, 'Valor alvo é obrigatório'],
        min: [0.01, 'Valor alvo deve ser maior que zero']
    },
    currentAmount: {
        type: Number,
        default: 0,
        min: [0, 'Valor atual não pode ser negativo']
    },
    targetDate: {
        type: Date,
        required: [true, 'Data alvo é obrigatória'],
        validate: {
            validator: function(value) {
                return value > new Date();
            },
            message: 'Data alvo deve ser no futuro'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuário é obrigatório']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        default: null
    },
    status: {
        type: String,
        enum: ['ativa', 'pausada', 'concluida', 'cancelada'],
        default: 'ativa'
    },
    priority: {
        type: String,
        enum: ['baixa', 'media', 'alta'],
        default: 'media'
    },
    recurring: {
        isRecurring: {
            type: Boolean,
            default: false
        },
        frequency: {
            type: String,
            enum: ['diaria', 'semanal', 'mensal', 'anual'],
            default: 'mensal'
        },
        amount: {
            type: Number,
            default: 0,
            min: 0
        },
        nextContribution: {
            type: Date,
            default: null
        }
    },
    milestones: [{
        percentage: {
            type: Number,
            required: true,
            min: 0,
            max: 100
        },
        amount: {
            type: Number,
            required: true
        },
        achievedAt: {
            type: Date,
            default: null
        },
        reward: {
            type: String,
            trim: true
        }
    }],
    contributions: [{
        amount: {
            type: Number,
            required: true,
            min: 0.01
        },
        date: {
            type: Date,
            default: Date.now
        },
        description: {
            type: String,
            trim: true
        },
        transaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            default: null
        }
    }],
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag deve ter no máximo 30 caracteres']
    }],
    notifications: {
        milestone: {
            type: Boolean,
            default: true
        },
        deadline: {
            type: Boolean,
            default: true
        },
        contribution: {
            type: Boolean,
            default: false
        }
    },
    analytics: {
        totalContributions: {
            type: Number,
            default: 0
        },
        averageMonthlyContribution: {
            type: Number,
            default: 0
        },
        projectedCompletionDate: {
            type: Date,
            default: null
        },
        daysToTarget: {
            type: Number,
            default: 0
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
goalSchema.index({ user: 1, status: 1 });
goalSchema.index({ user: 1, type: 1 });
goalSchema.index({ targetDate: 1 });
goalSchema.index({ 'recurring.nextContribution': 1 });
goalSchema.index({ createdAt: -1 });

// Virtual para calcular progresso em porcentagem
goalSchema.virtual('progressPercentage').get(function() {
    if (this.targetAmount === 0) return 0;
    return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
});

// Virtual para calcular valor restante
goalSchema.virtual('remainingAmount').get(function() {
    return Math.max(this.targetAmount - this.currentAmount, 0);
});

// Virtual para verificar se está concluída
goalSchema.virtual('isCompleted').get(function() {
    return this.currentAmount >= this.targetAmount;
});

// Virtual para calcular dias restantes
goalSchema.virtual('daysRemaining').get(function() {
    const today = new Date();
    const target = new Date(this.targetDate);
    const diffTime = target - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual para calcular contribuição mensal necessária
goalSchema.virtual('requiredMonthlyContribution').get(function() {
    const remaining = this.remainingAmount;
    const monthsRemaining = Math.max(this.daysRemaining / 30, 1);
    return Math.ceil(remaining / monthsRemaining);
});

// Middleware para atualizar analytics antes de salvar
goalSchema.pre('save', async function(next) {
    // Recalcular analytics
    this.analytics.totalContributions = this.contributions.length;
    
    if (this.contributions.length > 0) {
        // Calcular contribuição média mensal
        const totalContributed = this.contributions.reduce((sum, contrib) => sum + contrib.amount, 0);
        const firstContribution = new Date(this.contributions[0].date);
        const monthsSinceFirst = Math.max((Date.now() - firstContribution) / (1000 * 60 * 60 * 24 * 30), 1);
        this.analytics.averageMonthlyContribution = totalContributed / monthsSinceFirst;
        
        // Projetar data de conclusão baseada na média
        if (this.analytics.averageMonthlyContribution > 0 && this.remainingAmount > 0) {
            const monthsToComplete = this.remainingAmount / this.analytics.averageMonthlyContribution;
            const projectedDate = new Date();
            projectedDate.setMonth(projectedDate.getMonth() + monthsToComplete);
            this.analytics.projectedCompletionDate = projectedDate;
        }
    }
    
    this.analytics.daysToTarget = this.daysRemaining;
    
    // Verificar marcos atingidos
    this.checkMilestones();
    
    // Verificar se foi concluída
    if (this.isCompleted && this.status === 'ativa') {
        this.status = 'concluida';
    }
    
    next();
});

// Método para adicionar contribuição
goalSchema.methods.addContribution = function(amount, description = '', transactionId = null) {
    const contribution = {
        amount: amount,
        date: new Date(),
        description: description,
        transaction: transactionId
    };
    
    this.contributions.push(contribution);
    this.currentAmount += amount;
    
    return this.save();
};

// Método para verificar marcos
goalSchema.methods.checkMilestones = function() {
    const currentPercentage = this.progressPercentage;
    
    this.milestones.forEach(milestone => {
        if (currentPercentage >= milestone.percentage && !milestone.achievedAt) {
            milestone.achievedAt = new Date();
        }
    });
};

// Método para calcular próxima contribuição recorrente
goalSchema.methods.calculateNextContribution = function() {
    if (!this.recurring.isRecurring) return null;
    
    const { frequency } = this.recurring;
    const nextDate = new Date();
    
    switch (frequency) {
        case 'diaria':
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case 'semanal':
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case 'mensal':
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case 'anual':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
    }
    
    return nextDate;
};

// Método estático para processar contribuições recorrentes
goalSchema.statics.processRecurringContributions = async function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recurringGoals = await this.find({
        'recurring.isRecurring': true,
        'recurring.nextContribution': { $lte: today },
        status: 'ativa'
    });
    
    const results = [];
    
    for (const goal of recurringGoals) {
        try {
            // Adicionar contribuição automática
            await goal.addContribution(
                goal.recurring.amount,
                'Contribuição automática recorrente'
            );
            
            // Atualizar próxima contribuição
            goal.recurring.nextContribution = goal.calculateNextContribution();
            await goal.save();
            
            results.push(goal);
        } catch (error) {
            console.error(`Erro ao processar contribuição recorrente da meta ${goal._id}:`, error);
        }
    }
    
    return results;
};

// Método para criar marcos padrão
goalSchema.methods.createDefaultMilestones = function() {
    const defaultMilestones = [
        { percentage: 25, amount: this.targetAmount * 0.25, reward: 'Primeiro marco atingido!' },
        { percentage: 50, amount: this.targetAmount * 0.50, reward: 'Metade do caminho!' },
        { percentage: 75, amount: this.targetAmount * 0.75, reward: 'Quase lá!' },
        { percentage: 100, amount: this.targetAmount, reward: 'Meta concluída!' }
    ];
    
    this.milestones = defaultMilestones;
    return this;
};

// Método estático para relatório de metas
goalSchema.statics.getUserGoalsReport = async function(userId) {
    const goals = await this.find({ user: userId });
    
    const report = {
        total: goals.length,
        active: goals.filter(g => g.status === 'ativa').length,
        completed: goals.filter(g => g.status === 'concluida').length,
        paused: goals.filter(g => g.status === 'pausada').length,
        cancelled: goals.filter(g => g.status === 'cancelada').length,
        totalTargetAmount: goals.reduce((sum, g) => sum + g.targetAmount, 0),
        totalCurrentAmount: goals.reduce((sum, g) => sum + g.currentAmount, 0),
        averageProgress: goals.length > 0 ? 
            goals.reduce((sum, g) => sum + g.progressPercentage, 0) / goals.length : 0,
        goalsNearDeadline: goals.filter(g => g.daysRemaining <= 30 && g.status === 'ativa').length
    };
    
    return report;
};

module.exports = mongoose.model('Goal', goalSchema);