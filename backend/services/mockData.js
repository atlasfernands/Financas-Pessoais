// Mock data service para desenvolvimento sem MongoDB
import bcrypt from 'bcryptjs';

// Dados mock em memória
let mockUsers = [
    {
        _id: '1',
        name: 'Admin',
        email: 'admin@financas.com',
        password: '$2b$12$Rzfd2Ww/Lg9HLGmq1z/nkOS8EgK9e9l9Tril2JMhz5/vJlrsv20QG', // admin
        phone: '(11) 99999-9999',
        cpf: '123.456.789-01',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        preferences: {
            currency: 'BRL',
            language: 'pt-BR',
            notifications: { email: true, push: true },
            theme: 'light'
        },
        financialProfile: {
            monthlyIncome: 5000,
            monthlyExpenses: 3000,
            emergencyFundGoal: 18000,
            riskProfile: 'moderado'
        },
        // Campos adicionais do perfil
        birthDate: '1990-01-01',
        city: 'São Paulo',
        state: 'SP',
        profession: 'Desenvolvedor',
        serviceType: 'CLT',
        skills: ['JavaScript', 'React', 'Node.js'],
        incomeLevel: 'médio',
        financialGoals: ['Aposentadoria', 'Viagem'],
        investmentExperience: 'iniciante',
        familySize: '2',
        hasDependents: false,
        educationLevel: 'superior',
        workExperience: '5 anos',
        hobbies: ['Leitura', 'Esportes'],
        healthConditions: [],
        insurance: {
            health: true,
            life: false,
            auto: true,
            home: false
        }
    }
];

let mockCategories = [
    {
        _id: '1',
        name: 'Salário',
        description: 'Renda principal do trabalho',
        type: 'receita',
        color: '#22c55e',
        icon: 'dollar-sign',
        user: '1',
        isDefault: true,
        isActive: true,
        stats: { totalTransactions: 12, totalAmount: 60000, averageAmount: 5000 }
    },
    {
        _id: '2',
        name: 'Alimentação',
        description: 'Supermercado, restaurantes',
        type: 'despesa',
        color: '#f59e0b',
        icon: 'utensils',
        user: '1',
        isDefault: true,
        isActive: true,
        stats: { totalTransactions: 45, totalAmount: 13500, averageAmount: 300 }
    },
    {
        _id: '3',
        name: 'Transporte',
        description: 'Combustível, transporte público',
        type: 'despesa',
        color: '#06b6d4',
        icon: 'car',
        user: '1',
        isDefault: true,
        isActive: true,
        stats: { totalTransactions: 24, totalAmount: 7200, averageAmount: 300 }
    }
];

let mockTransactions = [];
let mockGoals = [];

class MockService {
    // Users
    static async findUserByEmail(email) {
        return mockUsers.find(user => user.email === email.toLowerCase());
    }

    static async findUserById(id) {
        return mockUsers.find(user => user._id === id);
    }

    static async createUser(userData) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        
        const newUser = {
            _id: (mockUsers.length + 1).toString(),
            ...userData,
            password: hashedPassword,
            email: userData.email.toLowerCase(),
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            preferences: {
                currency: 'BRL',
                language: 'pt-BR',
                notifications: { email: true, push: true },
                theme: 'light'
            },
            financialProfile: {
                monthlyIncome: 0,
                monthlyExpenses: 0,
                emergencyFundGoal: 0,
                riskProfile: 'moderado'
            },
            // Campos adicionais do perfil
            birthDate: '',
            city: '',
            state: '',
            profession: '',
            serviceType: '',
            skills: [],
            incomeLevel: '',
            financialGoals: [],
            investmentExperience: '',
            familySize: '',
            hasDependents: false,
            educationLevel: '',
            workExperience: '',
            hobbies: [],
            healthConditions: [],
            insurance: {
                health: false,
                life: false,
                auto: false,
                home: false
            }
        };

        mockUsers.push(newUser);
        return newUser;
    }

    static async updateUser(id, updateData) {
        const userIndex = mockUsers.findIndex(user => user._id === id);
        if (userIndex === -1) return null;

        mockUsers[userIndex] = {
            ...mockUsers[userIndex],
            ...updateData,
            updatedAt: new Date()
        };

        return mockUsers[userIndex];
    }

    // Categories
    static async getCategoriesByUser(userId, filters = {}) {
        let categories = mockCategories.filter(cat => cat.user === userId);
        
        if (filters.type) {
            categories = categories.filter(cat => cat.type === filters.type);
        }

        return {
            categories,
            total: categories.length,
            page: 1,
            limit: 50
        };
    }

    static async getCategoryById(id, userId) {
        return mockCategories.find(cat => cat._id === id && cat.user === userId);
    }

    static async createCategory(categoryData) {
        const newCategory = {
            _id: (mockCategories.length + 1).toString(),
            ...categoryData,
            isDefault: false,
            isActive: true,
            stats: { totalTransactions: 0, totalAmount: 0, averageAmount: 0 },
            createdAt: new Date(),
            updatedAt: new Date()
        };

        mockCategories.push(newCategory);
        return newCategory;
    }

    static async updateCategory(id, userId, updateData) {
        const categoryIndex = mockCategories.findIndex(cat => cat._id === id && cat.user === userId);
        if (categoryIndex === -1) return null;

        mockCategories[categoryIndex] = {
            ...mockCategories[categoryIndex],
            ...updateData,
            updatedAt: new Date()
        };

        return mockCategories[categoryIndex];
    }

    static async deleteCategory(id, userId) {
        const categoryIndex = mockCategories.findIndex(cat => cat._id === id && cat.user === userId);
        if (categoryIndex === -1) return null;

        const deletedCategory = mockCategories[categoryIndex];
        mockCategories.splice(categoryIndex, 1);
        return deletedCategory;
    }

    static async getCategoryStats(userId) {
        const userCategories = mockCategories.filter(cat => cat.user === userId);
        
        return {
            total: userCategories.length,
            receitas: userCategories.filter(cat => cat.type === 'receita').length,
            despesas: userCategories.filter(cat => cat.type === 'despesa').length,
            totalTransactions: userCategories.reduce((sum, cat) => sum + cat.stats.totalTransactions, 0),
            totalAmount: userCategories.reduce((sum, cat) => sum + cat.stats.totalAmount, 0)
        };
    }

    // Transactions
    static async getTransactionSummary(userId, filters = {}) {
        // Mock summary data
        return {
            receitas: { total: 60000, count: 12 },
            despesas: { total: 36000, count: 89 },
            saldoLiquido: 24000,
            periodo: filters.periodo || 'mensal'
        };
    }

    // Goals  
    static async getGoalStats(userId) {
        return {
            total: 0,
            ativas: 0,
            concluidas: 0,
            totalTarget: 0,
            totalCurrent: 0
        };
    }

    // Reset data (for testing)
    static resetData() {
        mockUsers = mockUsers.slice(0, 1); // Keep only admin user
        mockCategories = mockCategories.slice(0, 3); // Keep default categories
        mockTransactions = [];
        mockGoals = [];
    }
}

export { MockService };