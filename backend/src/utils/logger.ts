import { Log } from '../../../logging-middleware/log';

export enum Stack {
  BACKEND = 'backend',
  FRONTEND = 'frontend',
}

export enum Level {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
  FATAL = 'fatal',
}

export enum Package {
  HANDLER = 'handler',
  SERVICE = 'service',
  DB = 'db',
  UTILS = 'utils',
}

export const logEvent = async (
  level: Level,
  pkg: Package,
  message: string
) => {
  try {
    await Log(Stack.BACKEND, level, pkg, message);
  } catch (err) {
    console.error('Failed to send log:', err);
  }
};

