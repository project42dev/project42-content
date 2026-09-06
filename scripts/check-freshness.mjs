import { readdir, readFile } from 'node:fs/promises';
import { extname, resolve, relative, sep } from 'node:path';

// Review currency, checked where the curriculum is authored.
//
// This lived only in project42-platform, downstream of the sync, and it knew
// three states: current, review-due, stale. It had no way to say "nobody
// knows". A citation whose lastVerified was missing produced
// `new Date("undefinedT00:00:00.000Z")` -> NaN, and `NaN > cadence` is false,
// so an unverified citation passed the gate looking exactly like a fresh one.
// Absence of evidence read as evidence of freshness.
//
// So there are four states here, not three:
//
//   current     a review date exists and is inside the source's cadence
//   review-due  a review date exists and the cadence is nearly spent
//   stale       a review date exists and the cadence is spent  -> FAILS
//   unverified  no review date exists at all                   -> NAMED, never hidden
//
// unverified is deliberately not a failure. Stale means "we checked, and the
// check has expired" -- a real, dated claim that has aged out, and the fix is
// to go and re-check. Unverified means "no one ever recorded a check", which
// is an honest gap in the record, not an expired claim. Failing the build on
// it would push authors toward writing a date they cannot support, which is
// the exact defect this file exists to undo. It is instead named, counted, and
// printed on every run so it cannot pass silently.
//
// The only shape of "unknown" is an absent lastVerified. A null, an empty
// string, or a non-date string is a malformed record, not an unknown one, and
// validate-content.mjs rejects those outright.

const REVIEW_DUE_FRACTION = 0.8;

export async function checkFreshness(root = process.cwd(), asOf = new Date()) {
  const asOfDate = parseAsOf(asOf);
  const registry = JSON.parse(
    await readFile(resolve(root, 'source-registry.json'), 'utf8')
  );
  // Longest prefix wins, so a specific page beats its publisher's root.
  const registered = [...registry.sources].sort(
    (left, right) => right.urlPrefix.length - left.urlPrefix.length
  );

  const references = await collectReferences(root);

  const failures = [];
  const warnings = [];
  const unverified = [];
  const counts = { current: 0, 'review-due': 0, stale: 0, unverified: 0 };

  for (const reference of references) {
    const registration = registered.find((source) =>
      reference.url ? reference.url.startsWith(source.urlPrefix) : false
    );

    if (reference.url && !registration) {
      failures.push(`${reference.contentId}: unregistered source ${reference.url}`);
      continue;
    }
    if (registration && reference.publisher && registration.publisher !== reference.publisher) {
      failures.push(
        `${reference.contentId}: publisher ${reference.publisher} does not match registry ${registration.publisher}`
      );
    }

    const cadenceDays = registration
      ? registration.reviewCadenceDays
      : reference.reviewCadenceDays;
    const state = evaluate(reference.lastVerified, cadenceDays, asOfDate);
    counts[state.status] += 1;

    const label = registration ? registration.id : reference.label;
    if (state.status === 'unverified') {
      unverified.push(`${reference.contentId}: ${label} has no recorded review`);
    } else if (state.status === 'stale') {
      failures.push(
        `${reference.contentId}: ${label} is ${state.ageDays} days old (limit ${cadenceDays})`
      );
    } else if (state.status === 'review-due') {
      warnings.push(
        `${reference.contentId}: ${label} review is due in ${cadenceDays - state.ageDays} days`
      );
    }
  }

  return { references: references.length, counts, failures, warnings, unverified, registered: registered.length, asOf: asOfDate };
}

/**
 * The four-state rule, isolated so it can be tested directly.
 *
 * An absent lastVerified is unverified. Anything else must already be a
 * well-formed date -- validate-content.mjs guarantees that -- and is dated
 * against the cadence.
 */
export function evaluate(lastVerified, cadenceDays, asOf) {
  if (lastVerified === undefined || lastVerified === null) {
    return { status: 'unverified', ageDays: null };
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(lastVerified)) {
    throw new TypeError(`lastVerified must be YYYY-MM-DD or absent, got ${JSON.stringify(lastVerified)}`);
  }
  if (!Number.isInteger(cadenceDays) || cadenceDays < 1 || cadenceDays > 365) {
    throw new RangeError('reviewCadenceDays must be an integer from 1 through 365');
  }
  const verified = new Date(`${lastVerified}T00:00:00.000Z`);
  const ageDays = Math.floor((parseAsOf(asOf).valueOf() - verified.valueOf()) / 86_400_000);
  if (ageDays > cadenceDays) return { status: 'stale', ageDays };
  if (ageDays >= Math.floor(cadenceDays * REVIEW_DUE_FRACTION)) {
    return { status: 'review-due', ageDays };
  }
  return { status: 'current', ageDays };
}

async function collectReferences(root) {
  const references = [];

  const push = (item, contentId) => {
    // The item's own rollup review, where it declares one. A module or resource
    // without these fields is not making a claim, and is counted unverified.
    if ('reviewCadenceDays' in item || 'lastVerified' in item) {
      references.push({
        contentId,
        url: null,
        label: 'module review',
        publisher: null,
        lastVerified: item.lastVerified,
        reviewCadenceDays: item.reviewCadenceDays,
      });
    } else {
      references.push({
        contentId,
        url: null,
        label: 'module review',
        publisher: null,
        lastVerified: undefined,
        reviewCadenceDays: undefined,
      });
    }
    for (const source of item.sources ?? []) {
      references.push({
        contentId,
        url: source.url,
        label: source.title,
        publisher: source.publisher,
        lastVerified: source.lastVerified,
        reviewCadenceDays: undefined,
      });
    }
  };

  for (const dir of ['modules', 'resources']) {
    for (const file of await findJsonFiles(resolve(root, dir))) {
      const parsed = JSON.parse(await readFile(file, 'utf8'));
      push(parsed, parsed.id ?? relative(root, file).split(sep).join('/'));
    }
  }

  const catalog = JSON.parse(await readFile(resolve(root, 'catalog.json'), 'utf8'));
  for (const key of ['modules', 'resources']) {
    for (const item of catalog[key] ?? []) push(item, `catalog.json:${item.id}`);
  }

  return references;
}

async function findJsonFiles(dir) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
  const paths = [];
  for (const entry of entries) {
    const full = resolve(dir, entry.name);
    if (entry.isDirectory()) paths.push(...(await findJsonFiles(full)));
    else if (entry.isFile() && extname(entry.name) === '.json') paths.push(full);
  }
  return paths.sort();
}

function parseAsOf(value) {
  if (value instanceof Date) return value;
  if (!value) return new Date();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error('as-of must use YYYY-MM-DD');
  }
  const result = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(result.valueOf())) throw new Error('as-of is invalid');
  return result;
}

export function report(result) {
  const lines = [];
  for (const entry of result.unverified) lines.push(`UNVERIFIED ${entry}`);
  for (const warning of result.warnings) lines.push(`WARN ${warning}`);
  for (const failure of result.failures) lines.push(`ERROR ${failure}`);
  const { current, stale } = result.counts;
  lines.push(
    `Checked ${result.references} review claims against ${result.registered} registered sources ` +
      `as of ${result.asOf.toISOString().slice(0, 10)}: ` +
      `${current} current, ${result.counts['review-due']} review-due, ${stale} stale, ` +
      `${result.counts.unverified} unverified.`
  );
  if (result.counts.unverified > 0) {
    lines.push(
      `${result.counts.unverified} review claim(s) have no recorded review. Unverified is not stale: ` +
        'nothing has expired, nothing was ever checked. Named above, not failed.'
    );
  }
  return lines.join('\n');
}

if (process.argv[1] && process.argv[1].endsWith('check-freshness.mjs')) {
  const result = await checkFreshness(process.cwd(), process.env.PROJECT42_AS_OF);
  console.log(report(result));
  if (result.failures.length > 0) process.exitCode = 1;
}
