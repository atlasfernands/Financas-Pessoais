const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Nome é obrigatório'],
        trim: true,
        maxlength: [100, 'Nome deve ter no máximo 100 caracteres']
    },
    email: {
        type: String,
        required: [true, 'Email é obrigatório'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Email inválido']
    },
    password: {
        type: String,
        required: [true, 'Senha é obrigatória'],
        minlength: [6, 'Senha deve ter pelo menos 6 caracteres'],
        select: false // Não retornar senha por padrão
    },
    phone: {
        type: String,
        trim: true,
        match: [/^\(\d{2}\)\s\d{4,5}-\d{4}$/, 'Telefone inválido']
    },
    cpf: {
        type: String,
        trim: true,
        match: [/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, 'CPF inválido']
    },
    avatar: {
        type: String,
        default: null
    },
    isActive: {
        type: Boolean,
        default: true
    },
    preferences: {
        currency: {
            type: String,
            default: 'BRL'
        },
        language: {
            type: String,
            default: 'pt-BR'
        },
        notifications: {
            email: {
                type: Boolean,
                default: true
            },
            push: {
                type: Boolean,
                default: true
            }
        },
        theme: {
            type: String,
            enum: ['light', 'dark', 'auto'],
            default: 'light'
        }
    },
    financialProfile: {
        monthlyIncome: {
            type: Number,
            default: 0
        },
        monthlyExpenses: {
            type: Number,
            default: 0
        },
        emergencyFundGoal: {
            type: Number,
            default: 0
        },
        riskProfile: {
            type: String,
            enum: ['conservador', 'moderado', 'agressivo'],
            default: 'moderado'
        }
    },
    lastLogin: {
        type: Date,
        default: null
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    emailVerificationToken: String,
    isEmailVerified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Índices
userSchema.index({ email: 1 });
userSchema.index({ cpf: 1 });
userSchema.index({ createdAt: -1 });

// Virtual para calcular saldo líquido
userSchema.virtual('netWorth').get(function() {
    return this.financialProfile.monthlyIncome - this.financialProfile.monthlyExpenses;
});

// Middleware para hash da senha antes de salvar
userSchema.pre('save', async function(next) {
    // Só fazer hash se a senha foi modificada
    if (!this.isModified('password')) return next();
    
    try {
        const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12;
        this.password = await bcrypt.hash(this.password, saltRounds);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar senhas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// Método para gerar token de reset de senha
userSchema.methods.createPasswordResetToken = function() {
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    
    this.resetPasswordToken = require('crypto')
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    // Token expira em 10 minutos
    this.resetPasswordExpires = Date.now() + 10 * 60 * 1000;
    
    return resetToken;
};

// Método para atualizar último login
userSchema.methods.updateLastLogin = function() {
    this.lastLogin = new Date();
    return this.save({ validateBeforeSave: false });
};

// Método para remover dados sensíveis
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.resetPasswordToken;
    delete user.resetPasswordExpires;
    delete user.emailVerificationToken;
    return user;
};

// Middleware para remover transações relacionadas ao deletar usuário
userSchema.pre('remove', async function(next) {
    try {
        // Remover todas as transações do usuário
        await this.model('Transaction').deleteMany({ user: this._id });
        
        // Remover todas as categorias do usuário
        await this.model('Category').deleteMany({ user: this._id });
        
        // Remover todas as metas do usuário
        await this.model('Goal').deleteMany({ user: this._id });
        
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('User', userSchema);