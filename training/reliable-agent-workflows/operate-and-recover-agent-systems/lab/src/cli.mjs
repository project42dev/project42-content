import { mkdir, open, readFile, unlink } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { executeRecovery } from './recovery-core.mjs';

function rejectInputAlias(outputPath, incidentPath, ledgerPath) {
  const outputAbsolute = resolve(outputPath);
  const inputPaths = [incidentPath, ledgerPath].map((path) => resolve(path));
  if (inputPaths.includes(outputAbsolute)) {
    throw new Error('output must be a new file and must not alias an input');
  }
}

async function createOutput(outputPath) {
  await mkdir(dirname(outputPath), { recursive: true });
  try {
    return await open(outputPath, 'wx');
  } catch (error) {
    if (error.code === 'EEXIST') {
      throw new Error('output must be a new file and must not alias an input');
    }
    throw error;
  }
}

export async function runCli(reconcileAction, argv) {
  const [incidentPath, ledgerPath, outputPath] = argv;
  if (!incidentPath || !ledgerPath || !outputPath) {
    console.log('ERROR usage: node recover.mjs <incident.json> <ledger.json> <output.json>');
    console.log('RESULT FAILED');
    return 1;
  }

  let incident;
  let ledger;
  let outputHandle;
  let outputCreated = false;
  try {
    rejectInputAlias(outputPath, incidentPath, ledgerPath);
    incident = JSON.parse(await readFile(incidentPath, 'utf8'));
    ledger = JSON.parse(await readFile(ledgerPath, 'utf8'));

    outputHandle = await createOutput(outputPath);
    outputCreated = true;

    const result = executeRecovery(incident, ledger, reconcileAction);
    await outputHandle.writeFile(`${JSON.stringify(result.state, null, 2)}\n`, 'utf8');
    await outputHandle.close();
    outputHandle = undefined;

    for (const line of result.lines) console.log(line);
    return 0;
  } catch (error) {
    if (outputHandle) {
      await outputHandle.close().catch(() => {});
    }
    if (outputCreated) {
      await unlink(outputPath).catch(() => {});
    }
    if (incident && incident.id && incident.severity && incident.contained === true) {
      const firstLine = `INCIDENT ${incident.id} ${incident.severity} CONTAINED`;
      if (!error.recoveryLinesPrinted) {
        const action = incident.actions?.[0];
        if (action && error.message.startsWith('unsafe retry blocked:')) {
          console.log(firstLine);
          console.log(`RECONCILE ${action.actionId}: MISSING`);
        }
      }
    }
    console.log(`ERROR ${error.message}`);
    console.log('RESULT FAILED');
    return 1;
  }
}
