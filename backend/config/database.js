const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Se não houver MONGODB_URI, usar dados mock
        if (!process.env.MONGODB_URI) {
            console.log('⚠️  Modo desenvolvimento: usando dados mock (sem MongoDB)');
            console.log('📝 Para usar MongoDB real, configure MONGODB_URI no .env');
            return null;
        }
        
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('✅ Conectado ao MongoDB');
        return mongoose.connection;
        
    } catch (error) {
        console.error('❌ Erro ao conectar MongoDB:', error.message);
        
        // Em desenvolvimento, continuar sem MongoDB
        if (process.env.NODE_ENV === 'development') {
            console.log('⚠️  Modo desenvolvimento: continuando sem MongoDB');
            return null;
        }
        
        process.exit(1);
    }
};

module.exports = connectDB;