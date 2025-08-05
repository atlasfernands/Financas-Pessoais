const { MongoClient } = require('mongodb');
const fs = require('fs').promises;
const path = require('path');
const { compress } = require('gzip-js');

class BackupService {
    constructor() {
        this.backupDir = path.join(__dirname, '../backups');
        this.init();
    }

    async init() {
        try {
            await fs.mkdir(this.backupDir, { recursive: true });
        } catch (error) {
            console.error('Erro ao criar diretório de backup:', error);
        }
    }

    async createBackup() {
        try {
            const client = await MongoClient.connect(process.env.MONGODB_URI);
            const db = client.db();
            
            // Obtém todas as coleções
            const collections = await db.listCollections().toArray();
            
            const backup = {};
            
            // Para cada coleção, obter todos os documentos
            for (const collection of collections) {
                const documents = await db.collection(collection.name).find({}).toArray();
                backup[collection.name] = documents;
            }
            
            // Criar nome do arquivo com timestamp
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const fileName = `backup-${timestamp}.json.gz`;
            const filePath = path.join(this.backupDir, fileName);
            
            // Comprimir e salvar
            const backupString = JSON.stringify(backup);
            const compressed = compress(backupString);
            await fs.writeFile(filePath, Buffer.from(compressed));
            
            // Limpar backups antigos (manter últimos 7 dias)
            await this.cleanOldBackups();
            
            await client.close();
            
            return {
                success: true,
                fileName,
                timestamp,
                size: compressed.length
            };
        } catch (error) {
            console.error('Erro ao criar backup:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
    
    async cleanOldBackups() {
        try {
            const files = await fs.readdir(this.backupDir);
            const now = new Date();
            
            for (const file of files) {
                const filePath = path.join(this.backupDir, file);
                const stats = await fs.stat(filePath);
                const daysOld = (now - stats.mtime) / (1000 * 60 * 60 * 24);
                
                if (daysOld > 7) {
                    await fs.unlink(filePath);
                }
            }
        } catch (error) {
            console.error('Erro ao limpar backups antigos:', error);
        }
    }
}

module.exports = new BackupService();
