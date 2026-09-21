import { copyFile, rm } from "node:fs/promises";
import { dirname, isAbsolute, normalize, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = dirname(fileURLToPath(import.meta.url));
const labDir = resolve(toolsDir, "..");
const template = resolve(labDir, "starter", "authorize.broken.mjs");
const target = resolve(labDir, "starter", "authorize.mjs");
const workDir = resolve(labDir, ".work");

function requireLabChild(path, expectedRelativePath) {
  const normalizedExpectedRelativePath = normalize(expectedRelativePath);
  if (
    !isAbsolute(labDir) ||
    !isAbsolute(path) ||
    path !== resolve(labDir, normalizedExpectedRelativePath) ||
    relative(labDir, path) !== normalizedExpectedRelativePath
  ) {
    throw new Error("refusing operation outside lab directory");
  }
}

requireLabChild(template, "starter/authorize.broken.mjs");
requireLabChild(target, "starter/authorize.mjs");
requireLabChild(workDir, ".work");

if (workDir !== resolve(labDir, ".work") || relative(labDir, workDir) !== ".work") {
  throw new Error("refusing unexpected cleanup path");
}

await copyFile(template, target);
await rm(workDir, { recursive: true, force: true });
console.log("RESET starter/authorize.mjs restored; lab .work removed");
