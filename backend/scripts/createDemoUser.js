const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// Schema do Usuário
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

// Model do Usuário
const User = mongoose.model('User', userSchema);

async function createDemoUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado ao MongoDB');

        // Verificar se o usuário já existe
        const existingUser = await User.findOne({ email: 'demo@financas.com' });
        if (existingUser) {
            console.log('Usuário demo já existe!');
            await mongoose.connection.close();
            return;
        }

        // Criar hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('Demo@2025', salt);

        // Criar usuário
        const demoUser = new User({
            name: 'Usuário Demo',
            email: 'demo@financas.com',
            password: hashedPassword
        });

        await demoUser.save();
        console.log('✅ Usuário demo criado com sucesso!');

        await mongoose.connection.close();
    } catch (error) {
        console.error('❌ Erro:', error);
        process.exit(1);
    }
}

createDemoUser();
