import {readFile} from 'node:fs/promises';
import {plan, ValidationError} from './reference-planner.mjs';

try {
  if (process.argv.length !== 3) throw new ValidationError('usage: node solution/reference-cli.mjs FIXTURE.json');
  const input=JSON.parse(await readFile(process.argv[2],'utf8'));
  const result=plan(input);
  console.log(JSON.stringify(result));
  process.exitCode=result.status==='OK'?0:3;
} catch(error) {
  if (error instanceof ValidationError || error instanceof SyntaxError) {
    console.error(JSON.stringify({status:'INVALID',error:error.message}));
    process.exitCode=2;
  } else {
    console.error(JSON.stringify({status:'ERROR',error:error instanceof Error?error.message:String(error)}));
    process.exitCode=1;
  }
}
