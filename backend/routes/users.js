const express = require('express');
const MockService = require('../services/mockData');
const auth = require('../middleware/auth');

const router = express.Router();

// Aplicar middleware de autenticação a todas as rotas
router.use(auth);

// @route   GET /api/users/profile
// @desc    Obter perfil do usuário
// @access  Private
router.get('/profile', async (req, res) => {
    try {
        const user = await MockService.findUserById(req.user.id);
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
        
        // Remover senha dos dados retornados
        const { password, ...userProfile } = user;
        
        res.json({ user: userProfile });
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

// @route   PUT /api/users/profile
// @desc    Atualizar perfil do usuário
// @access  Private
router.put('/profile', async (req, res) => {
    try {
        const { name, email, phone, preferences, financialProfile } = req.body;
        
        const updateData = {};
        
        if (name) updateData.name = name;
        if (email) updateData.email = email;
        if (phone) updateData.phone = phone;
        if (preferences) updateData.preferences = preferences;
        if (financialProfile) updateData.financialProfile = financialProfile;
        
        const updatedUser = await MockService.updateUser(req.user.id, updateData);
        
        if (!updatedUser) {
            return res.status(404).json({
                error: 'Usuário não encontrado'
            });
        }
        
        // Remover senha dos dados retornados
        const { password, ...userProfile } = updatedUser;
        
        res.json({ 
            message: 'Perfil atualizado com sucesso',
            user: userProfile 
        });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({
            error: 'Erro interno do servidor'
        });
    }
});

module.exports = router;