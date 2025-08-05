class CacheService {
    constructor() {
        this.cache = new Map();
        this.ttl = new Map();
        this.defaultTTL = 5 * 60 * 1000; // 5 minutos em milissegundos
    }

    _generateKey(prefix, params) {
        return `${prefix}:${JSON.stringify(params)}`;
    }

    get(prefix, params) {
        const key = this._generateKey(prefix, params);
        const cached = this.cache.get(key);
        const expiry = this.ttl.get(key);

        if (!cached || !expiry || Date.now() > expiry) {
            return null;
        }

        return cached;
    }

    set(prefix, params, data, ttl = this.defaultTTL) {
        const key = this._generateKey(prefix, params);
        this.cache.set(key, data);
        this.ttl.set(key, Date.now() + ttl);
        return true;
    }

    invalidate(prefix, params = null) {
        if (params) {
            const key = this._generateKey(prefix, params);
            this.cache.delete(key);
            this.ttl.delete(key);
        } else {
            // Invalida todos os itens com o prefixo
            for (const key of this.cache.keys()) {
                if (key.startsWith(`${prefix}:`)) {
                    this.cache.delete(key);
                    this.ttl.delete(key);
                }
            }
        }
    }

    clear() {
        this.cache.clear();
        this.ttl.clear();
    }

    // Método utilitário para cache de transações
    async getCachedTransactions(userId, params, fetchFn) {
        const cached = this.get('transactions', { userId, ...params });
        if (cached) {
            return cached;
        }

        const data = await fetchFn();
        this.set('transactions', { userId, ...params }, data);
        return data;
    }

    // Método utilitário para cache de saldos
    async getCachedBalance(userId, params, fetchFn) {
        const cached = this.get('balance', { userId, ...params });
        if (cached) {
            return cached;
        }

        const data = await fetchFn();
        this.set('balance', { userId, ...params }, data, 60 * 1000); // 1 minuto TTL para saldos
        return data;
    }
}

export const cacheService = new CacheService();
