import { runCli } from './cli.mjs';
import { reconcileAction } from './reconcile.mjs';

process.exitCode = await runCli(reconcileAction, process.argv.slice(2));
