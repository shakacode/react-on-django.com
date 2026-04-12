import assert from "node:assert/strict";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";

import {
  detectDocsLayout,
  docsLayoutPaths,
  excludeNamesForRootCopy,
  subsetPathsForLayout
} from "./docs-layout.mjs";

async function makeDocsFixture() {
  const docsRoot = await fs.mkdtemp(path.join(os.tmpdir(), "react-on-django-docs-layout-"));
  await fs.mkdir(path.join(docsRoot, "guides"), {recursive: true});
  await fs.writeFile(path.join(docsRoot, "introduction.md"), "# Introduction\n", "utf8");
  await fs.writeFile(path.join(docsRoot, "guides", "configuration.md"), "# Configuration\n", "utf8");
  return docsRoot;
}

test("detectDocsLayout returns consolidated for the current upstream docs shape", async () => {
  const docsRoot = await makeDocsFixture();
  const layout = await detectDocsLayout(docsRoot);
  assert.equal(layout, "consolidated");

  const layoutPaths = docsLayoutPaths(docsRoot, layout);
  assert.equal(layoutPaths.contentRoot, docsRoot);
  assert.equal(layoutPaths.readmePath, path.join(docsRoot, "README.md"));
});

test("subsetPathsForLayout includes the full bounded docs slice", () => {
  const paths = subsetPathsForLayout("consolidated");

  assert.ok(!paths.includes("README.md"));
  assert.ok(paths.includes("introduction.md"));
  assert.ok(paths.includes("guides/helper-apis.md"));
  assert.ok(paths.includes("guides/testing-and-operations.md"));
  assert.ok(paths.includes("guides/licensing.md"));
});

test("layout helpers reject unsupported layout values", () => {
  assert.throws(() => subsetPathsForLayout("hybrid"), /Unsupported docs layout: hybrid/);
  assert.throws(
    () => docsLayoutPaths("/tmp/docs", "hybrid"),
    /Unsupported docs layout: hybrid/
  );
});

test("excludeNamesForRootCopy filters non-navigable root files for the consolidated docs tree", () => {
  assert.deepEqual([...excludeNamesForRootCopy("consolidated")].sort(), [
    "README.md",
    "sidebars.ts"
  ]);
});
