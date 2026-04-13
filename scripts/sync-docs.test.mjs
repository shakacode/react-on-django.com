import { execFileSync } from "node:child_process";
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import test from "node:test";

import { cloneRepo } from "./sync-docs.mjs";

function git(cwd, ...args) {
  return execFileSync("git", ["-C", cwd, ...args], { encoding: "utf8" }).trim();
}

async function makeRepoFixture() {
  const repoDir = await fs.mkdtemp(path.join(os.tmpdir(), "react-on-django-sync-fixture-"));
  execFileSync("git", ["init", "--initial-branch", "main", repoDir], { stdio: "ignore" });
  git(repoDir, "config", "user.name", "Codex Tests");
  git(repoDir, "config", "user.email", "codex-tests@example.com");

  await fs.mkdir(path.join(repoDir, "docs"), { recursive: true });
  await fs.writeFile(path.join(repoDir, "docs", "introduction.md"), "# Main v1\n", "utf8");
  git(repoDir, "add", "docs/introduction.md");
  git(repoDir, "commit", "-m", "Initial docs");
  const initialSha = git(repoDir, "rev-parse", "HEAD");

  git(repoDir, "checkout", "-b", "feature/docs-sync");
  await fs.writeFile(path.join(repoDir, "docs", "introduction.md"), "# Feature branch\n", "utf8");
  git(repoDir, "commit", "-am", "Feature docs");
  const featureSha = git(repoDir, "rev-parse", "HEAD");

  git(repoDir, "checkout", "main");
  await fs.writeFile(path.join(repoDir, "docs", "introduction.md"), "# Main v2\n", "utf8");
  git(repoDir, "commit", "-am", "Main docs update");
  const latestMainSha = git(repoDir, "rev-parse", "HEAD");

  return { repoDir, initialSha, featureSha, latestMainSha };
}

test("cloneRepo clones an explicit non-default branch ref", async () => {
  const { repoDir } = await makeRepoFixture();
  const cloneDir = cloneRepo(repoDir, "feature/docs-sync");

  try {
    const content = await fs.readFile(path.join(cloneDir, "docs", "introduction.md"), "utf8");
    assert.equal(content, "# Feature branch\n");
  } finally {
    await fs.rm(cloneDir, { recursive: true, force: true });
    await fs.rm(repoDir, { recursive: true, force: true });
  }
});

test("cloneRepo can check out an exact commit SHA after cloning the ref", async () => {
  const { repoDir, initialSha } = await makeRepoFixture();
  const cloneDir = cloneRepo(repoDir, "main", initialSha);

  try {
    const content = await fs.readFile(path.join(cloneDir, "docs", "introduction.md"), "utf8");
    assert.equal(content, "# Main v1\n");
    assert.equal(git(cloneDir, "rev-parse", "HEAD"), initialSha);
  } finally {
    await fs.rm(cloneDir, { recursive: true, force: true });
    await fs.rm(repoDir, { recursive: true, force: true });
  }
});
