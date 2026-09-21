import { copyFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
const source = fileURLToPath(new URL("./src/bridge.template.mjs", import.meta.url));
const destination = fileURLToPath(new URL("./src/bridge.mjs", import.meta.url));
await copyFile(source, destination);
console.log("Reset src/bridge.mjs to the deliberate tenant-scoping defect.");
