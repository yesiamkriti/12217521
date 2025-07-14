// logging-middleware/log.ts
import axios from 'axios';
import { LOG_ENDPOINT, TOKEN } from './config';

interface LogPayload {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package:
    | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler'
    | 'repository' | 'route' | 'service'
    | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
    | 'auth' | 'config' | 'middleware' | 'utils';
  message: string;
}

export async function Log(
  stack: LogPayload['stack'],
  level: LogPayload['level'],
  pkg: LogPayload['package'],
  message: string
) {
  try {
    const res = await axios.post(
      LOG_ENDPOINT,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );
    return res.data;
  } catch (err: any) {
    console.error('Log failed:', err?.response?.data || err.message);
  }
}
