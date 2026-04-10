import type {ReactNode} from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./examples.module.css";

const exampleCards = [
  {
    title: "Example app in the package repo",
    description:
      "The Django package includes an example app for client rendering, SSR, streaming SSR, and RSC-oriented integration work.",
    href: "https://github.com/shakacode/react-on-django/tree/main/example",
  },
  {
    title: "Configuration guide",
    description:
      "Use the docs to map renderer settings, template tag options, and bundler integration into a working Django project.",
    href: "/docs/guides/configuration",
  },
  {
    title: "GitHub repository",
    description:
      "Track the package, example app, and documentation source in one upstream repository.",
    href: "https://github.com/shakacode/react-on-django",
  },
];

export default function ExamplesPage(): ReactNode {
  return (
    <Layout title="Examples" description="React on Django examples and references">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Examples and integration references</p>
            <h1>Use concrete examples when evaluating React on Django.</h1>
            <p>
              This site points to the package repo and the example app rather than creating a second
              source of truth for code samples.
            </p>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            {exampleCards.map((card) => (
              <article className={styles.card} key={card.title}>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
                <Link href={card.href}>Open reference</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
