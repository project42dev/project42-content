# Review currency

Every module, resource, and source citation in this repository can carry a
`lastVerified` date and a review cadence. `npm run freshness` reads them and
puts every claim into exactly one of four states.

| State | Meaning | Effect on the run |
| --- | --- | --- |
| `current` | A review is recorded and the cadence has not been spent. | passes |
| `review-due` | A review is recorded and at least 80% of the cadence has passed. | warns |
| `stale` | A review is recorded and the cadence has been spent. | **fails** |
| `unverified` | No review has ever been recorded. | named on every run, does not fail |

## Why `unverified` is not `stale`

They are different facts and they call for different work.

`stale` is a real, dated claim that has aged out. Someone checked the source on
a known day, the cadence has since expired, and the remedy is to go and check it
again. Failing the build is right: a promise was made and has lapsed.

`unverified` is the absence of a claim. Nobody ever recorded a check. Failing
the build on it would put an author under pressure to write down a date they
cannot support, which is precisely how this repository acquired 663 fabricated
review dates (see below). So an unverified claim is named individually, counted
in the summary line, and printed on every run — it can never pass silently — but
it does not turn the run red.

Both are visible on every run. Neither is ever inferred from the other.

## How "unknown" is written

By leaving `lastVerified` out. That is the only permitted shape.

`validate-content.mjs` rejects `null`, `""`, `"unknown"`, `"TBD"`, non-strings,
malformed dates, and any date in the future. A missing field is unambiguous; a
placeholder is not, and tooling that cannot parse a placeholder tends to fall
back to treating it as fresh — which is exactly what happened downstream.

## The correction of 2026-09-06

On 2026-08-22, platform commit `e7c857c` ("chore(sources): update all
lastVerified timestamps to 2026-08-23") set every review date in the curriculum
to `2026-08-23` — a day *after* the commit that wrote it. No review was
performed. On 2026-09-05, content commits `0f67ae1` and `944a5c0` carried those
dates into this repository and described them in their messages as restoring a
real review record. That description was wrong.

The dates were traced through the history of both repositories. All 755
citations then in the repository had a pre-bump date that was introduced by a
commit dated on that same day — the day the citation was authored and the source
was read. That is the last traceable verification, so it is what the data now
records. 663 citations across 151 files were rolled back to it; 26 citations
added on 2026-09-05 and 2026-09-06 already carried their own authoring dates and
were left alone.

Module-level `lastVerified` is a rollup, derived as the oldest date among a
module's own citations (the convention set by platform commit `7e1a19d`). The 22
modules added without one keep no rollup: they report as `unverified` rather
than inheriting a review nobody performed.

The honest consequence is that the catalogue is now largely overdue. As of
2026-09-06 the gate reports 464 stale claims of 783, because the sources really
were last read in late July against mostly 30-day cadences. `npm run check`
therefore exits non-zero, and will keep doing so until the sources are actually
re-read. The remedy is review, not another bump.
