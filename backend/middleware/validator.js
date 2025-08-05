const { validationResult, checkSchema } = require('express-validator');

// Schema de validação base para transações
const transactionValidationSchema = {
    description: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'A descrição é obrigatória'
        },
        isLength: {
            options: { min: 3, max: 100 },
            errorMessage: 'A descrição deve ter entre 3 e 100 caracteres'
        }
    },
    amount: {
        in: ['body'],
        isFloat: {
            options: { min: 0.01 },
            errorMessage: 'O valor deve ser maior que zero'
        },
        toFloat: true
    },
    type: {
        in: ['body'],
        isIn: {
            options: [['income', 'expense']],
            errorMessage: 'O tipo deve ser "income" ou "expense"'
        }
    },
    date: {
        in: ['body'],
        isISO8601: {
            errorMessage: 'Data inválida'
        }
    },
    category: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'A categoria é obrigatória'
        },
        isMongoId: {
            errorMessage: 'ID de categoria inválido'
        }
    }
};

// Schema de validação para usuários
const userValidationSchema = {
    name: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'O nome é obrigatório'
        },
        isLength: {
            options: { min: 2, max: 50 },
            errorMessage: 'O nome deve ter entre 2 e 50 caracteres'
        }
    },
    email: {
        in: ['body'],
        trim: true,
        normalizeEmail: true,
        isEmail: {
            errorMessage: 'Email inválido'
        }
    },
    password: {
        in: ['body'],
        isLength: {
            options: { min: 8 },
            errorMessage: 'A senha deve ter no mínimo 8 caracteres'
        },
        matches: {
            options: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])/,
            errorMessage: 'A senha deve conter letras maiúsculas, minúsculas, números e caracteres especiais'
        }
    }
};

// Middleware de validação genérico
const validate = (schema) => {
    return async (req, res, next) => {
        await checkSchema(schema).run(req);
        
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ 
                success: false,
                errors: errors.array()
            });
        }
        
        next();
    };
};

// Middlewares específicos
const validateTransaction = validate(transactionValidationSchema);
const validateUser = validate(userValidationSchema);

module.exports = {
    validateTransaction,
    validateUser,
    validate
};
