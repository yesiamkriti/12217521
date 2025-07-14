// logging-middleware/test-log.ts
import { Log } from './log';

(async () => {
  await Log('backend', 'info', 'handler', 'Test log from logging-middleware');
})();
