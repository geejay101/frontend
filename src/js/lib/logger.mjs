/**
 * A thin wrapper around the native console that makes it possible to set
 * loglevels. Use source blacklisting and sourcemaps to get to the
 * original error.
 */
export class Logger {
    /**
     * @param {App} app - The application object.
     */
    constructor(app) {
        this.levels = {
            debug: 4,
            error: 0,
            info: 2,
            verbose: 3,
            warn: 1,
        }
        this.setLevel('info')
    }


    setLevel(level) {
        this.level = this.levels[level]
    }

    error(...args) {
        console.error(...args)
    }

    warn(...args) {
        if (this.level >= this.levels.warn) {
            console.warn(...args)
        }
    }

    info(...args) {
        if (this.level >= this.levels.info) {
            console.info(...args)
        }
    }

    verbose(...args) {
        if (this.level >= this.levels.verbose) {
            console.log(...args)
        }
    }

    debug(...args) {
        if (this.level >= this.levels.debug) {
            console.log(...args)
        }
    }
}