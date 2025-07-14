// logging-middleware/log.ts
import axios from 'axios';

interface LogParams {
  stack: 'backend' | 'frontend';
  level: 'debug' | 'info' | 'warn' | 'error' | 'fatal';
  package:
    | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain' | 'handler'
    | 'repository' | 'route' | 'service' | 'api' | 'component' | 'hook'
    | 'page' | 'state' | 'style' | 'auth' | 'config' | 'middleware' | 'utils';
  message: string;
  token: string; // Bearer token from auth API
}

export async function Log({ stack, level, package: pkg, message, token }: LogParams): Promise<void> {
  try {
    const response = await axios.post(
      'http://20.244.56.144/evaluation-service/logs',
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('✅ Log sent successfully:', response.data);
  } catch (error: any) {
    console.error('❌ Log failed:', error.response?.data || error.message);
  }
}
