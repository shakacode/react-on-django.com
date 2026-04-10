import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  detectDocsLayout,
  docsLayoutPaths,
  excludeNamesForRootCopy
} from "./docs-layout.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const workspaceRoot = path.resolve(__dirname, "..");
const defaultLocalRepoRoot = path.resolve(workspaceRoot, "..", "react-on-django");
const defaultRepoBlobBaseUrl = "https://github.com/shakacode/react-on-django/blob/main";

function argValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] ?? null;
}

const target = argValue("--target");
const useSubset = process.argv.includes("--subset");

async function ensureExists(targetPath, message) {
  try {
    await fs.access(targetPath);
  } catch {
    throw new Error(message);
  }
}

async function copyDirectoryContents(sourceDir, targetDir, options = {}) {
  const {excludeNames = new Set()} = options;
  await fs.mkdir(targetDir, {recursive: true});
  const entries = await fs.readdir(sourceDir, {withFileTypes: true});
  for (const entry of entries) {
    if (excludeNames.has(entry.name)) {
      continue;
    }

    const sourcePath = path.join(sourceDir, entry.name);
    const targetPath = path.join(targetDir, entry.name);
    if (entry.isDirectory()) {
      await fs.cp(sourcePath, targetPath, {recursive: true});
      continue;
    }
    if (entry.name.endsWith(".md") || entry.name.endsWith(".mdx")) {
      const content = await fs.readFile(sourcePath, "utf8");
      await fs.writeFile(targetPath, normalizeMarkdownForDocusaurus(content), "utf8");
      continue;
    }
    await fs.copyFile(sourcePath, targetPath);
  }
}

function normalizePath(value) {
  return value.split(path.sep).join("/");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function normalizeMarkdownForDocusaurus(content, options = {}) {
  const localRepoRoot = normalizePath(
    path.resolve(options.localRepoRoot ?? process.env.REACT_ON_DJANGO_LOCAL_REPO_ROOT ?? defaultLocalRepoRoot)
  );
  const repoBlobBaseUrl = options.repoBlobBaseUrl ?? defaultRepoBlobBaseUrl;
  const localRepoPrefix = `${localRepoRoot}/`;
  const localRepoPattern = new RegExp(`\\]\\((?:file://)?(${escapeRegExp(localRepoPrefix)}[^)#\\s]+)(#[^)\\s]+)?\\)`, "g");

  return content.replace(localRepoPattern, (_match, absolutePath, anchor = "") => {
    const relativePath = normalizePath(absolutePath).slice(localRepoPrefix.length);
    return `](${repoBlobBaseUrl}/${relativePath}${anchor})`;
  });
}

async function prepareDocusaurusDocs(sourceDocs) {
  const layout = await detectDocsLayout(sourceDocs);
  const layoutPaths = docsLayoutPaths(sourceDocs, layout);
  const targetDocs = path.join(workspaceRoot, "prototypes", "docusaurus", "docs");

  await fs.rm(targetDocs, {recursive: true, force: true});
  await fs.mkdir(targetDocs, {recursive: true});

  await copyDirectoryContents(layoutPaths.contentRoot, targetDocs, {
    excludeNames: excludeNamesForRootCopy(layout)
  });

  console.log(`Prepared Docusaurus docs in ${targetDocs}`);
  console.log(`Source docs: ${sourceDocs}`);
  console.log(`Detected docs layout: ${layout}`);
}

export async function main() {
  if (target !== "docusaurus") {
    throw new Error(`Unsupported or missing target. Use --target docusaurus.`);
  }

  const sourceDocs = path.join(
    workspaceRoot,
    "content",
    "upstream",
    useSubset ? "docs-subset" : "docs"
  );

  await ensureExists(
    sourceDocs,
    `Source docs not found at ${sourceDocs}. Run "npm run sync:docs" first.`
  );

  await prepareDocusaurusDocs(sourceDocs);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
