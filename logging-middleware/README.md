# Logging Middleware

Reusable log utility to send structured logs to Affordmed’s test server.

## Usage

```ts
import { Log } from './log';

await Log('backend', 'error', 'handler', 'received string, expected boolean');
