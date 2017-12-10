type LoggerLevel = number

var logger: {
    levels: {
        off: LoggerLevel,
        fatal: LoggerLevel,
        error: LoggerLevel,
        warn: LoggerLevel,
        info: LoggerLevel,
        debug: LoggerLevel
    }
    level(level: LoggerLevel): LoggerLevel
    info(from: string, message: ...string[]): void
    debug(from: string, message: ...string[]): void
    fatal(from: string, message: ...string[]): void
    error(from: string, message: ...string[]): void
    warn(from: string, message: ...string[]): void
    from(from: string): {
        info(message: ...string[]): void
        debug(message: ...string[]): void
        fatal(message: ...string[]): void
        error(message: ...string[]): void
        warn(message: ...string[]): void
    }
}

export = logger
