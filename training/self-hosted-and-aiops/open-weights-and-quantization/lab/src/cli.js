import { readFile } from "node:fs/promises";
import { analyzeManifest } from "./analyze.js";

function formatReport(report) {
  const resident = report.residentWeightBytes === null ? "UNKNOWN" : String(report.residentWeightBytes);
  const holds = report.holds.length === 0 ? "none" : report.holds.join("|");
  return `${report.id} predicted=${report.predictedPayloadBytes} actual=${report.actualFileBytes} overhead=${report.overheadBytes} discrepancy=${report.discrepancyPercent.toFixed(2)}% resident=${resident} status=${report.status} holds=${holds}`;
}

async function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("Usage: node src/cli.js <manifest.json>");
    process.exitCode = 64;
    return;
  }

  try {
    const manifest = JSON.parse(await readFile(path, "utf8"));
    const reports = analyzeManifest(manifest);
    for (const report of reports) console.log(formatReport(report));
    process.exitCode = reports.some((report) => report.status === "HOLD") ? 2 : 0;
  } catch (error) {
    console.error(`ERROR ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  }
}

await main();
