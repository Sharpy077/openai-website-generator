type LogLevel = 'debug' | 'info' | 'warn' | 'error'

class Logger {
    private log(level: LogLevel, message: string, ...args: unknown[]) {
        const timestamp = new Date().toISOString()
        console[level](`[${timestamp}] [${level.toUpperCase()}]:`, message, ...args)
    }

    debug(message: string, ...args: unknown[]) {
        if (process.env.NODE_ENV === 'development') {
            this.log('debug', message, ...args)
        }
    }

    info(message: string, ...args: unknown[]) {
        this.log('info', message, ...args)
    }

    warn(message: string, ...args: unknown[]) {
        this.log('warn', message, ...args)
    }

    error(message: string, ...args: unknown[]) {
        this.log('error', message, ...args)
    }
}

export const logger = new Logger()