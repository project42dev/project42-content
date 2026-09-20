import {execute} from './executor.mjs';
import {fixtures} from './fixtures.mjs';
import {allGraphs, input, parallelGraph, routerGraph, evaluatorGraph} from './graphs.mjs';
import {learnerGraph, assessLearnerGraph} from './learner.mjs';
import {solutionGraph, feedback} from './solution.mjs';

const command = process.argv[2] ?? 'demo';
const traceTarget = process.argv[3] ?? 'parallel';
const successful = run => run.evidence.filter(item => item.state === 'success').length;

if (command === 'demo') {
  for (const graph of allGraphs) {
    const run = await execute({graph, fixtures, input, config: {runId: `run-${graph.pattern}`}});
    const suffix = graph.pattern === 'router' ? ` route=${run.selectedRoute}` : graph.pattern === 'evaluator' ? ` revisions=${run.artifactRevision}` : '';
    console.log(`${graph.pattern.padEnd(10)} terminal=${run.terminal.state} used=${run.budget.used} evidence=${successful(run)}${suffix}`);
  }
} else if (command === 'trace') {
  const graph = traceTarget === 'router' ? routerGraph : traceTarget === 'evaluator' ? evaluatorGraph : parallelGraph;
  const run = await execute({graph, fixtures, input, config: {runId: `run-trace-${traceTarget}`}});
  for (const item of run.trace) {
    const details = item.reason ? ` reason=${item.reason}` : item.route ? ` route=${item.route}` : '';
    console.log(`${String(item.sequence).padStart(2, '0')} ${item.node.padEnd(16)} ${item.event}${details}`);
  }
  if (traceTarget === 'parallel') {
    const aggregation = run.evidence.find(item => item.id === 'parent')?.result?.aggregation?.join(',') ?? 'none';
    console.log(`FINAL ${run.terminal.state} aggregation=${aggregation} used=${run.budget.used}`);
  } else if (traceTarget === 'router') {
    console.log(`FINAL ${run.terminal.state} route=${run.selectedRoute} used=${run.budget.used}`);
  } else {
    console.log(`FINAL ${run.terminal.state} revisions=${run.artifactRevision} used=${run.budget.used}`);
  }
} else if (command === 'learner' || command === 'solution') {
  const graph = command === 'learner' ? learnerGraph : solutionGraph;
  const assessment = assessLearnerGraph(graph);
  const run = await execute({graph, fixtures, input, config: {runId: `run-${command}`}});
  console.log(`assessment pass=${assessment.pass} independent=${assessment.independent} requiredJoin=${assessment.requiredJoin}`);
  console.log(`execution terminal=${run.terminal.state} used=${run.budget.used}`);
  console.log(`feedback=${assessment.pass ? feedback.solution : feedback.broken}`);
} else {
  console.error('usage: node src/cli.mjs demo|trace [parallel|router|evaluator]|learner|solution');
  process.exitCode = 2;
}
