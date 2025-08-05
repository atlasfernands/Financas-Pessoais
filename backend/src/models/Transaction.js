const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, 'Descrição é obrigatória'],
        trim: true
    },
    amount: {
        type: Number,
        required: [true, 'Valor é obrigatório'],
        min: [0, 'Valor não pode ser negativo']
    },
    type: {
        type: String,
        enum: ['receita', 'despesa'],
        required: [true, 'Tipo é obrigatório']
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Categoria é obrigatória']
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
    frequency: {
        type: String,
        enum: ['diaria', 'semanal', 'mensal', 'anual'],
        required: function() {
            return this.isRecurring;
        }
    },
    notes: {
        type: String,
        trim: true
    },
    attachments: [{
        name: String,
        url: String,
        type: String
    }],
    tags: [{
        type: String,
        trim: true
    }]
}, {
    timestamps: true
});

// Índices
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, category: 1 });
transactionSchema.index({ description: 'text' });

// Middleware pre-save
transactionSchema.pre('save', function(next) {
    // Garante que o valor seja positivo
    if (this.amount < 0) {
        this.amount = Math.abs(this.amount);
    }
    next();
});

// Métodos estáticos
transactionSchema.statics.getBalance = async function(userId, startDate, endDate) {
    const query = { userId };
    if (startDate && endDate) {
        query.date = { $gte: startDate, $lte: endDate };
    }

    const transactions = await this.find(query);
    return transactions.reduce((acc, trans) => {
        return trans.type === 'receita' 
            ? acc + trans.amount 
            : acc - trans.amount;
    }, 0);
};

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
