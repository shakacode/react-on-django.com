import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { detectDocsLayout, exists, subsetPathsForLayout } from "./docs-layout.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");

const args = new Set(process.argv.slice(2));
const buildSubset = args.has("--subset");

const upstreamRoot = path.join(workspaceRoot, "content", "upstream");
const fullDocsTarget = path.join(upstreamRoot, "docs");
const subsetDocsTarget = path.join(upstreamRoot, "docs-subset");
const sidebarTarget = path.join(upstreamRoot, "sidebars.ts");

const defaultDocsPath = "/Users/justin/codex/react-on-django/docs";
const defaultRepoUrl = "https://github.com/shakacode/react-on-django.git";
const defaultRef = "main";

function cloneRepo(repoUrl, ref) {
  const tmpDir = mkdtempSync(path.join(os.tmpdir(), "react-on-django-docs-"));
  try {
    execFileSync("git", ["clone", "--depth", "1", "--branch", ref, repoUrl, tmpDir], {
      stdio: "inherit"
    });
  } catch {
    execFileSync("git", ["clone", "--depth", "1", repoUrl, tmpDir], {
      stdio: "inherit"
    });
  }
  return tmpDir;
}

async function walkFiles(dir, callback, relativePrefix = "") {
  const entries = await fs.readdir(dir, {withFileTypes: true});
  for (const entry of entries) {
    const rel = relativePrefix ? path.join(relativePrefix, entry.name) : entry.name;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walkFiles(abs, callback, rel);
      continue;
    }
    if (entry.isFile()) {
      await callback(abs, rel);
    }
  }
}

async function writeSubset(sourceDocsRoot, subsetRoot, layout) {
  await fs.rm(subsetRoot, {recursive: true, force: true});
  await fs.mkdir(subsetRoot, {recursive: true});

  const missing = [];
  let copied = 0;

  for (const relativeFile of subsetPathsForLayout(layout)) {
    const sourceFile = path.join(sourceDocsRoot, relativeFile);
    if (!(await exists(sourceFile))) {
      missing.push(relativeFile);
      continue;
    }

    const targetFile = path.join(subsetRoot, relativeFile);
    await fs.mkdir(path.dirname(targetFile), {recursive: true});
    await fs.copyFile(sourceFile, targetFile);
    copied += 1;
  }

  return {copied, missing};
}

async function countFiles(rootDir) {
  let count = 0;
  await walkFiles(rootDir, async () => {
    count += 1;
  });
  return count;
}

async function resolveSourceDocsRoot() {
  const configuredDocs = path.resolve(process.env.REACT_ON_DJANGO_DOCS ?? defaultDocsPath);
  if (await exists(configuredDocs)) {
    return {sourceDocsRoot: configuredDocs, ephemeralClone: null, sourceLabel: configuredDocs};
  }

  const repoUrl = process.env.REACT_ON_DJANGO_REPO_URL ?? defaultRepoUrl;
  const ref = process.env.REACT_ON_DJANGO_REF ?? defaultRef;
  console.log(`Local docs missing at ${configuredDocs}. Cloning ${repoUrl} (${ref})...`);
  const ephemeralClone = cloneRepo(repoUrl, ref);
  const sourceDocsRoot = path.join(ephemeralClone, "docs");

  if (!(await exists(sourceDocsRoot))) {
    throw new Error(
      `Upstream docs directory not found after cloning ${repoUrl}. Expected ${sourceDocsRoot}.`
    );
  }

  return {sourceDocsRoot, ephemeralClone, sourceLabel: `${repoUrl}#${ref}`};
}

async function main() {
  const {sourceDocsRoot, ephemeralClone, sourceLabel} = await resolveSourceDocsRoot();

  await fs.rm(fullDocsTarget, {recursive: true, force: true});
  await fs.mkdir(path.dirname(fullDocsTarget), {recursive: true});
  await fs.cp(sourceDocsRoot, fullDocsTarget, {recursive: true});

  const layout = await detectDocsLayout(fullDocsTarget);

  const upstreamSidebars = path.join(sourceDocsRoot, "sidebars.ts");
  if (await exists(upstreamSidebars)) {
    await fs.copyFile(upstreamSidebars, sidebarTarget);
    console.log(`Synced sidebars.ts to ${sidebarTarget}`);
  }

  let subsetStats = null;
  if (buildSubset) {
    subsetStats = await writeSubset(fullDocsTarget, subsetDocsTarget, layout);
  }

  const docsCount = await countFiles(fullDocsTarget);
  console.log(`Synced docs from ${sourceLabel}`);
  console.log(`Target: ${fullDocsTarget}`);
  console.log(`File count: ${docsCount}`);
  console.log(`Detected docs layout: ${layout}`);

  if (subsetStats) {
    console.log(`Subset: copied ${subsetStats.copied} docs to ${subsetDocsTarget}`);
    if (subsetStats.missing.length > 0) {
      console.log("Subset missing files:");
      for (const missingPath of subsetStats.missing) {
        console.log(`- ${missingPath}`);
      }
    }
  }

  if (ephemeralClone) {
    await fs.rm(ephemeralClone, {recursive: true, force: true});
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
