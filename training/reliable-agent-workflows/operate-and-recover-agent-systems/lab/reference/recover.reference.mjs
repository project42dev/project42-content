import { runCli } from '../src/cli.mjs';
import { reconcileAction } from './reconcile.reference.mjs';

process.exitCode = await runCli(reconcileAction, process.argv.slice(2));
