import { validationResult } from 'express-validator';
import logger from '../utils/logger';

export const validate = (validations) => {
    return async (req, res, next) => {
        // Executa todas as validações
        for (let validation of validations) {
            const result = await validation.run(req);
            if (!result.isEmpty()) break;
        }

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        logger.warn('Validação falhou', { 
            path: req.path, 
            errors: errors.array() 
        });

        return res.status(400).json({
            errors: errors.array().map(err => ({
                field: err.param,
                message: err.msg
            }))
        });
    };
};

// Validações comuns
export const commonValidations = {
    id: {
        in: ['params'],
        isMongoId: true,
        errorMessage: 'ID inválido'
    },
    date: {
        in: ['body'],
        isISO8601: true,
        toDate: true,
        errorMessage: 'Data inválida'
    },
    amount: {
        in: ['body'],
        isFloat: { 
            options: { min: 0 },
            errorMessage: 'Valor deve ser maior que zero'
        },
        toFloat: true
    },
    description: {
        in: ['body'],
        trim: true,
        notEmpty: {
            errorMessage: 'Descrição é obrigatória'
        },
        isLength: {
            options: { min: 3, max: 100 },
            errorMessage: 'Descrição deve ter entre 3 e 100 caracteres'
        }
    },
    type: {
        in: ['body'],
        isIn: {
            options: [['receita', 'despesa']],
            errorMessage: 'Tipo deve ser receita ou despesa'
        }
    }
};
