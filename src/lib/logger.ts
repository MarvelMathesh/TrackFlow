type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogOptions {
  level?: LogLevel;
  timestamp?: boolean;
  data?: unknown;
}

/**
 * Simple logging utility for tracking CRUD operations
 * and other important application events
 */
export const logger = {
  /**
   * Log a message with optional data
   */
  log: (message: string, options: LogOptions = {}) => {
    const { level = 'info', timestamp = true, data } = options;
    
    // Format with timestamp if enabled
    const time = timestamp ? `[${new Date().toISOString()}]` : '';
    const prefix = `${time} [${level.toUpperCase()}]`;
    
    // Log to console with appropriate log level
    switch (level) {
      case 'info':
        data 
          ? console.log(prefix, message, data)
          : console.log(prefix, message);
        break;
      case 'warn':
        data 
          ? console.warn(prefix, message, data)
          : console.warn(prefix, message);
        break;
      case 'error':
        data 
          ? console.error(prefix, message, data)
          : console.error(prefix, message);
        break;
      case 'debug':
        data 
          ? console.debug(prefix, message, data)
          : console.debug(prefix, message);
        break;
    }
  },
  
  // Convenience methods
  info: (message: string, data?: unknown) => logger.log(message, { level: 'info', data }),
  warn: (message: string, data?: unknown) => logger.log(message, { level: 'warn', data }),
  error: (message: string, data?: unknown) => logger.log(message, { level: 'error', data }),
  debug: (message: string, data?: unknown) => logger.log(message, { level: 'debug', data }),
  
  // Special methods for CRUD operations
  create: (collection: string, data: unknown) => 
    logger.log(`Created document in ${collection}`, { level: 'info', data }),
  read: (collection: string, id: string, data?: unknown) => 
    logger.log(`Read document ${id} from ${collection}`, { level: 'debug', data }),
  update: (collection: string, id: string, data?: unknown) => 
    logger.log(`Updated document ${id} in ${collection}`, { level: 'info', data }),
  delete: (collection: string, id: string) => 
    logger.log(`Deleted document ${id} from ${collection}`, { level: 'info' }),
};
