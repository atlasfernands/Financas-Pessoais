class Logger {
    constructor() {
        this.env = process.env.NODE_ENV || 'development';
    }

    _getTimestamp() {
        return new Date().toISOString();
    }

    _formatMessage(level, message, data = {}) {
        return {
            timestamp: this._getTimestamp(),
            level,
            message,
            ...data,
            environment: this.env
        };
    }

    info(message, data = {}) {
        const logData = this._formatMessage('info', message, data);
        console.log(JSON.stringify(logData));
    }

    error(message, error = null, data = {}) {
        const logData = this._formatMessage('error', message, {
            ...data,
            error: error ? {
                message: error.message,
                stack: this.env === 'development' ? error.stack : undefined,
                code: error.code
            } : null
        });
        console.error(JSON.stringify(logData));
    }

    warn(message, data = {}) {
        const logData = this._formatMessage('warn', message, data);
        console.warn(JSON.stringify(logData));
    }

    debug(message, data = {}) {
        if (this.env === 'development') {
            const logData = this._formatMessage('debug', message, data);
            console.debug(JSON.stringify(logData));
        }
    }
}

const logger = new Logger();
export default logger;
