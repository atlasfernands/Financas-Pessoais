const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../models/User');

class PasswordResetService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        });
    }

    async generateResetToken(email) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email não encontrado');
            }

            // Gerar token único
            const resetToken = crypto.randomBytes(32).toString('hex');
            const resetTokenExpires = Date.now() + 3600000; // 1 hora

            // Salvar token no usuário
            user.resetToken = resetToken;
            user.resetTokenExpires = resetTokenExpires;
            await user.save();

            return resetToken;
        } catch (error) {
            throw new Error('Erro ao gerar token de recuperação');
        }
    }

    async sendResetEmail(email, resetToken) {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Recuperação de Senha - Finanças Pessoais',
            html: `
                <h1>Recuperação de Senha</h1>
                <p>Você solicitou a recuperação de senha. Clique no link abaixo para criar uma nova senha:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>Este link é válido por 1 hora.</p>
                <p>Se você não solicitou esta recuperação, ignore este email.</p>
            `
        };

        try {
            await this.transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            throw new Error('Erro ao enviar email de recuperação');
        }
    }

    async resetPassword(token, newPassword) {
        try {
            const user = await User.findOne({
                resetToken: token,
                resetTokenExpires: { $gt: Date.now() }
            });

            if (!user) {
                throw new Error('Token inválido ou expirado');
            }

            // Atualizar senha
            user.password = newPassword;
            user.resetToken = undefined;
            user.resetTokenExpires = undefined;
            await user.save();

            return true;
        } catch (error) {
            throw new Error('Erro ao redefinir senha');
        }
    }
}

module.exports = new PasswordResetService();
