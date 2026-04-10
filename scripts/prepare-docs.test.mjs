import assert from "node:assert/strict";
import test from "node:test";

import {normalizeMarkdownForDocusaurus} from "./prepare-docs.mjs";

test("normalizeMarkdownForDocusaurus rewrites local repo markdown links to GitHub blob URLs", () => {
  const content = `
# Streaming SSR

See [the example view](/Users/justin/codex/react-on-django/example/react_on_django_example/views.py)
and [the dev script](file:///Users/justin/codex/react-on-django/example/bin/dev#L1).
`;

  const normalized = normalizeMarkdownForDocusaurus(content, {
    localRepoRoot: "/Users/justin/codex/react-on-django",
    repoBlobBaseUrl: "https://github.com/shakacode/react-on-django/blob/main"
  });

  assert.match(
    normalized,
    /\[the example view]\(https:\/\/github\.com\/shakacode\/react-on-django\/blob\/main\/example\/react_on_django_example\/views\.py\)/
  );
  assert.match(
    normalized,
    /\[the dev script]\(https:\/\/github\.com\/shakacode\/react-on-django\/blob\/main\/example\/bin\/dev#L1\)/
  );
});

test("normalizeMarkdownForDocusaurus leaves relative doc links untouched", () => {
  const content = "Read [installation](./installation.md) before [server rendering](../guides/server-rendering.md).";

  const normalized = normalizeMarkdownForDocusaurus(content, {
    localRepoRoot: "/Users/justin/codex/react-on-django"
  });

  assert.equal(normalized, content);
});
