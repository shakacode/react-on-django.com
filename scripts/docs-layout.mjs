import fs from "node:fs/promises";
import path from "node:path";

export const docsSubsetEntries = [
  "introduction.md",
  "getting-started/installation.md",
  "getting-started/quick-start.md",
  "getting-started/create-react-on-django-app.md",
  "guides/client-rendering.md",
  "guides/helper-apis.md",
  "guides/server-rendering.md",
  "guides/streaming-ssr.md",
  "guides/rsc.md",
  "guides/configuration.md",
  "guides/testing-and-operations.md",
  "guides/licensing.md"
];

export async function exists(targetPath) {
  try {
    await fs.access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function detectDocsLayout(docsRoot) {
  const introduction = path.join(docsRoot, "introduction.md");
  const guidesDir = path.join(docsRoot, "guides");

  if ((await exists(introduction)) || (await exists(guidesDir))) {
    return "consolidated";
  }

  throw new Error(`Unable to detect docs layout in ${docsRoot}`);
}

export function subsetPathsForLayout(layout) {
  if (layout !== "consolidated") {
    throw new Error(`Unsupported docs layout: ${layout}`);
  }

  return docsSubsetEntries;
}

export function docsLayoutPaths(docsRoot, layout) {
  if (layout !== "consolidated") {
    throw new Error(`Unsupported docs layout: ${layout}`);
  }

  return {
    layout,
    contentRoot: docsRoot,
    readmePath: path.join(docsRoot, "README.md")
  };
}

export function excludeNamesForRootCopy() {
  return new Set(["README.md", "sidebars.ts"]);
}
