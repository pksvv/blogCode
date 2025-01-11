import pino from 'pino'

const isBrowser = typeof window !== 'undefined'

/* const logger = isBrowser
  ? pino({
      browser: {
        asObject: true, // Logs appear as objects in the browser console
      },
      level: 'info',
    })
  : pino({
      transport: {
        target: 'pino-pretty', // Pretty print logs in the terminal
        options: {
          colorize: true, // Colorized output
          sync: true, // Disable worker threads
        },
      },
      level: 'info',
    })
 */}
const logger = pino({
    transport: {
        target: 'pino-pretty',
        options: {
        colorize: true,
        sync: true, // Use sync mode to avoid worker threads
        },
    },
    });
      

export default logger
