import dotenv from 'dotenv';
import express from 'express';
import process from 'process';

dotenv.config();
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { MockService } from '../services/mockData.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Função para gerar JWT
const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET || 'fallback_secret_key',
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password, phone, cpf } = req.body;

        // Validações básicas
        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'Nome, email e senha são obrigatórios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Senha deve ter pelo menos 6 caracteres'
            });
        }

        // Verificar se usuário já existe
        const existingUser = await MockService.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                error: 'Usuário já existe com este email'
            });
        }

        // Criar usuário usando mock service
        const user = await MockService.createUser({
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password,
            phone: phone?.trim(),
            cpf: cpf?.trim()
        });

        // Gerar token
        const token = generateToken(user._id);

        // Retornar dados do usuário (sem senha)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            cpf: user.cpf,
            isEmailVerified: user.isEmailVerified,
            preferences: user.preferences,
            financialProfile: user.financialProfile,
            birthDate: user.birthDate,
            city: user.city,
            state: user.state,
            profession: user.profession,
            serviceType: user.serviceType,
            skills: user.skills,
            incomeLevel: user.incomeLevel,
            financialGoals: user.financialGoals,
            investmentExperience: user.investmentExperience,
            familySize: user.familySize,
            hasDependents: user.hasDependents,
            educationLevel: user.educationLevel,
            workExperience: user.workExperience,
            hobbies: user.hobbies,
            healthConditions: user.healthConditions,
            insurance: user.insurance,
            createdAt: user.createdAt
        };

        res.status(201).json({
            message: 'Usuário criado com sucesso',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Erro no registro:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Dados inválidos',
                details: errors
            });
        }

        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validações básicas
        if (!email || !password) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        // Buscar usuário usando mock service
        const user = await MockService.findUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        // Verificar se usuário está ativo
        if (!user.isActive) {
            return res.status(401).json({
                error: 'Conta desativada. Entre em contato com o suporte.'
            });
        }

        // Verificar senha
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Credenciais inválidas'
            });
        }

        // Atualizar último login (mock - não implementado)

        // Gerar token
        const token = generateToken(user._id);

        // Retornar dados do usuário (sem senha)
        const userResponse = {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            cpf: user.cpf,
            isEmailVerified: user.isEmailVerified,
            preferences: user.preferences,
            financialProfile: user.financialProfile,
            birthDate: user.birthDate,
            city: user.city,
            state: user.state,
            profession: user.profession,
            serviceType: user.serviceType,
            skills: user.skills,
            incomeLevel: user.incomeLevel,
            financialGoals: user.financialGoals,
            investmentExperience: user.investmentExperience,
            familySize: user.familySize,
            hasDependents: user.hasDependents,
            educationLevel: user.educationLevel,
            workExperience: user.workExperience,
            hobbies: user.hobbies,
            healthConditions: user.healthConditions,
            insurance: user.insurance,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt
        };

        res.json({
            message: 'Login realizado com sucesso',
            token,
            user: userResponse
        });

    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            error: 'Erro interno do servidor',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// @route   GET /api/auth/me
// @desc    Obter dados do usuário logado
// @access  Private
router.get('/me', auth, async (req, res) => {
    try {
        const user = await MockService.findUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        res.json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cpf: user.cpf,
                avatar: user.avatar,
                isEmailVerified: user.isEmailVerified,
                preferences: user.preferences,
                financialProfile: user.financialProfile,
                birthDate: user.birthDate,
                city: user.city,
                state: user.state,
                profession: user.profession,
                serviceType: user.serviceType,
                skills: user.skills,
                incomeLevel: user.incomeLevel,
                financialGoals: user.financialGoals,
                investmentExperience: user.investmentExperience,
                familySize: user.familySize,
                hasDependents: user.hasDependents,
                educationLevel: user.educationLevel,
                workExperience: user.workExperience,
                hobbies: user.hobbies,
                healthConditions: user.healthConditions,
                insurance: user.insurance,
                lastLogin: user.lastLogin,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao obter usuário:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', auth, async (req, res) => {
    try {
        const allowedUpdates = [
            'name', 'phone', 'cpf', 'preferences', 'financialProfile',
            'birthDate', 'city', 'state', 'profession', 'serviceType',
            'skills', 'incomeLevel', 'financialGoals', 'investmentExperience',
            'familySize', 'hasDependents', 'educationLevel', 'workExperience',
            'hobbies', 'healthConditions', 'insurance'
        ];
        
        const updates = {};
        
        // Filtrar apenas campos permitidos
        Object.keys(req.body).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        const user = await MockService.updateUser(req.user.id, updates);

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        res.json({
            message: 'Perfil atualizado com sucesso',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                cpf: user.cpf,
                preferences: user.preferences,
                financialProfile: user.financialProfile,
                birthDate: user.birthDate,
                city: user.city,
                state: user.state,
                profession: user.profession,
                serviceType: user.serviceType,
                skills: user.skills,
                incomeLevel: user.incomeLevel,
                financialGoals: user.financialGoals,
                investmentExperience: user.investmentExperience,
                familySize: user.familySize,
                hasDependents: user.hasDependents,
                educationLevel: user.educationLevel,
                workExperience: user.workExperience,
                hobbies: user.hobbies,
                healthConditions: user.healthConditions,
                insurance: user.insurance,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                error: 'Dados inválidos',
                details: errors
            });
        }

        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/auth/avatar
// @desc    Upload de foto de perfil
// @access  Private
router.put('/avatar', auth, async (req, res) => {
    try {
        const { avatar } = req.body;

        if (!avatar) {
            return res.status(400).json({
                error: 'URL da foto é obrigatória'
            });
        }

        const user = await MockService.updateUser(req.user.id, { avatar });

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        res.json({
            message: 'Foto de perfil atualizada com sucesso',
            user: {
                id: user._id,
                avatar: user.avatar,
                updatedAt: user.updatedAt
            }
        });

    } catch (error) {
        console.error('Erro ao atualizar foto:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/auth/password
// @desc    Alterar senha
// @access  Private
router.put('/password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                error: 'Senha atual e nova senha são obrigatórias'
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                error: 'Nova senha deve ter pelo menos 6 caracteres'
            });
        }

        // Buscar usuário com senha
        const user = await MockService.findUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }

        // Verificar senha atual
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
            return res.status(400).json({
                error: 'Senha atual incorreta'
            });
        }

        // Atualizar senha
        user.password = newPassword;
        await user.save();

        res.json({
            message: 'Senha alterada com sucesso'
        });

    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   POST /api/auth/logout
// @desc    Logout (invalidar token no lado cliente)
// @access  Private
router.post('/logout', auth, (req, res) => {
    res.json({
        message: 'Logout realizado com sucesso'
    });
});

export default router;