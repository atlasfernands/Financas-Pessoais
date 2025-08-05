const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
    try {
        // Se estiver em modo de desenvolvimento sem MongoDB
        if (process.env.USE_MOCK_DB === 'true') {
            console.log('📝 Modo desenvolvimento: usando banco de dados em memória');
            
            // Criar instância do MongoDB em memória
            mongod = await MongoMemoryServer.create();
            const uri = mongod.getUri();
            
            await mongoose.connect(uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            
            console.log('✅ Conectado ao banco de dados em memória');
            return mongoose.connection;
        }

        // Tentar conectar ao MongoDB real
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI não configurado');
        }

        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('✅ Conectado ao MongoDB');
        return mongoose.connection;

    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
        process.exit(1);
    }
};

const disconnectDB = async () => {
    try {
        await mongoose.disconnect();
        if (mongod) {
            await mongod.stop();
        }
    } catch (error) {
        console.error('Erro ao desconectar do banco de dados:', error);
    }
};

module.exports = {
    connectDB,
    disconnectDB
};
