const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    description: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
        trim: true,
        maxlength: [200, 'Descrição deve ter no máximo 200 caracteres']
    },
    amount: {
        type: Number,
        required: [true, 'Valor é obrigatório'],
        min: [0.01, 'Valor deve ser maior que zero']
    },
    type: {
        type: String,
        required: [true, 'Tipo é obrigatório'],
        enum: {
            values: ['receita', 'despesa'],
            message: 'Tipo deve ser "receita" ou "despesa"'
        }
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Categoria é obrigatória']
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Usuário é obrigatório']
    },
    date: {
        type: Date,
        required: [true, 'Data é obrigatória'],
        default: Date.now
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    recurringConfig: {
        frequency: {
            type: String,
            enum: ['daily', 'weekly', 'monthly', 'yearly'],
            default: 'monthly'
        },
        interval: {
            type: Number,
            default: 1,
            min: 1
        },
        endDate: {
            type: Date,
            default: null
        },
        nextOccurrence: {
            type: Date,
            default: null
        }
    },
    tags: [{
        type: String,
        trim: true,
        maxlength: [30, 'Tag deve ter no máximo 30 caracteres']
    }],
    notes: {
        type: String,
        trim: true,
        maxlength: [500, 'Notas devem ter no máximo 500 caracteres']
    },
    attachments: [{
        filename: String,
        originalName: String,
        mimetype: String,
        size: Number,
        url: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }],
    location: {
        name: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    paymentMethod: {
        type: String,
        enum: ['dinheiro', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'boleto', 'outros'],
        default: 'outros'
    },
    status: {
        type: String,
        enum: ['pendente', 'confirmada', 'cancelada'],
        default: 'confirmada'
    },
    installments: {
        current: {
            type: Number,
            default: 1,
            min: 1
        },
        total: {
            type: Number,
            default: 1,
            min: 1
        },
        parentTransaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Transaction',
            default: null
        }
    },
    metadata: {
        source: {
            type: String,
            enum: ['manual', 'import', 'api', 'recurring'],
            default: 'manual'
        },
        syncId: String,
        originalData: mongoose.Schema.Types.Mixed
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
transactionSchema.index({ user: 1, date: -1 });
transactionSchema.index({ user: 1, category: 1 });
transactionSchema.index({ user: 1, type: 1 });
transactionSchema.index({ user: 1, status: 1 });
transactionSchema.index({ date: -1 });
transactionSchema.index({ 'recurringConfig.nextOccurrence': 1 });

// Virtual para formatação monetária
transactionSchema.virtual('formattedAmount').get(function() {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(this.amount);
});

// Virtual para verificar se é parcelada
transactionSchema.virtual('isInstallment').get(function() {
    return this.installments.total > 1;
});

// Virtual para calcular valor da parcela
transactionSchema.virtual('installmentAmount').get(function() {
    if (this.installments.total <= 1) return this.amount;
    return Math.round((this.amount / this.installments.total) * 100) / 100;
});

// Middleware para validar categoria do mesmo usuário
transactionSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('category')) {
        const Category = mongoose.model('Category');
        const category = await Category.findOne({
            _id: this.category,
            user: this.user
        });
        
        if (!category) {
            const error = new Error('Categoria não encontrada ou não pertence ao usuário');
            error.code = 'INVALID_CATEGORY';
            return next(error);
        }
        
        // Verificar se o tipo da transação corresponde ao tipo da categoria
        if (this.type !== category.type) {
            const error = new Error(`Tipo da transação (${this.type}) não corresponde ao tipo da categoria (${category.type})`);
            error.code = 'TYPE_MISMATCH';
            return next(error);
        }
    }
    next();
});

// Middleware para configurar próxima ocorrência de transação recorrente
transactionSchema.pre('save', function(next) {
    if (this.isRecurring && this.isNew) {
        this.recurringConfig.nextOccurrence = this.calculateNextOccurrence();
    }
    next();
});

// Método para calcular próxima ocorrência
transactionSchema.methods.calculateNextOccurrence = function() {
    if (!this.isRecurring) return null;
    
    const { frequency, interval } = this.recurringConfig;
    const nextDate = new Date(this.date);
    
    switch (frequency) {
        case 'daily':
            nextDate.setDate(nextDate.getDate() + interval);
            break;
        case 'weekly':
            nextDate.setDate(nextDate.getDate() + (interval * 7));
            break;
        case 'monthly':
            nextDate.setMonth(nextDate.getMonth() + interval);
            break;
        case 'yearly':
            nextDate.setFullYear(nextDate.getFullYear() + interval);
            break;
    }
    
    return nextDate;
};

// Método para criar próxima transação recorrente
transactionSchema.methods.createNextRecurring = async function() {
    if (!this.isRecurring || !this.recurringConfig.nextOccurrence) return null;
    
    const nextTransaction = new this.constructor({
        description: this.description,
        amount: this.amount,
        type: this.type,
        category: this.category,
        user: this.user,
        date: this.recurringConfig.nextOccurrence,
        isRecurring: true,
        recurringConfig: {
            ...this.recurringConfig,
            nextOccurrence: this.calculateNextOccurrence()
        },
        tags: [...this.tags],
        notes: this.notes,
        paymentMethod: this.paymentMethod,
        metadata: {
            ...this.metadata,
            source: 'recurring'
        }
    });
    
    return nextTransaction.save();
};

// Método estático para processar transações recorrentes
transactionSchema.statics.processRecurringTransactions = async function() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const recurringTransactions = await this.find({
        isRecurring: true,
        'recurringConfig.nextOccurrence': { $lte: today },
        status: 'confirmada'
    });
    
    const results = [];
    
    for (const transaction of recurringTransactions) {
        try {
            // Verificar se ainda não passou da data limite
            if (transaction.recurringConfig.endDate && 
                transaction.recurringConfig.nextOccurrence > transaction.recurringConfig.endDate) {
                continue;
            }
            
            const newTransaction = await transaction.createNextRecurring();
            if (newTransaction) {
                results.push(newTransaction);
                
                // Atualizar próxima ocorrência da transação original
                transaction.recurringConfig.nextOccurrence = transaction.calculateNextOccurrence();
                await transaction.save();
            }
        } catch (error) {
            console.error(`Erro ao processar transação recorrente ${transaction._id}:`, error);
        }
    }
    
    return results;
};

// Middleware para atualizar estatísticas da categoria
transactionSchema.post('save', async function(doc) {
    const Category = mongoose.model('Category');
    const category = await Category.findById(doc.category);
    if (category) {
        await category.updateStats();
    }
});

transactionSchema.post('remove', async function(doc) {
    const Category = mongoose.model('Category');
    const category = await Category.findById(doc.category);
    if (category) {
        await category.updateStats();
    }
});

module.exports = mongoose.model('Transaction', transactionSchema);