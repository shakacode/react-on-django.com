import type {ReactNode} from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./index.module.css";

const paths = [
  {
    eyebrow: "Start here",
    title: "Install React on Django",
    description:
      "Set up the Django integration layer, wire the renderer boundary, and keep the shared JavaScript runtime aligned.",
    href: "/docs/getting-started/installation",
  },
  {
    eyebrow: "Rendering",
    title: "Review SSR and streaming",
    description:
      "See how client rendering, SSR, streaming SSR, and RSC fit together in the Django package.",
    href: "/docs/guides/server-rendering",
  },
  {
    eyebrow: "Commercial use",
    title: "Review licensing",
    description:
      "Use the same package for client rendering, SSR, streaming SSR, and RSC, then apply the commercial license only when production use requires it.",
    href: "/licensing",
  },
];

export default function HomePage(): ReactNode {
  return (
    <Layout
      title="React on Django"
      description="Render React from Django templates with SSR, streaming SSR, and React Server Components.">
      <header className={styles.hero}>
        <div className={["container", styles.heroLayout].join(" ")}>
          <div>
            <p className={styles.eyebrow}>Django, React, and the shared renderer stack</p>
            <h1>React on Django</h1>
            <p className={styles.lead}>
              React on Django gives Django teams a native template tag API for React, plus server
              rendering, streaming SSR, and React Server Components over the shared renderer
              protocol.
            </p>
            <div className={styles.actions}>
              <Link className="button button--primary button--lg" to="/docs/introduction">
                Open the docs
              </Link>
              <Link className="button button--secondary button--lg" to="/examples">
                Browse examples
              </Link>
            </div>
          </div>

          <aside className={styles.heroPanel}>
            <p className={styles.cardEyebrow}>Repository model</p>
            <ul>
              <li>Canonical docs sync from `react-on-django/docs`</li>
              <li>Site UX lives in `react-on-django.com`</li>
              <li>Cloudflare Pages deploys the static Docusaurus build</li>
            </ul>
          </aside>
        </div>
      </header>

      <main className="container">
        <section className={styles.section}>
          <div className={styles.grid}>
            {paths.map((path) => (
              <article className={styles.card} key={path.title}>
                <p className={styles.cardEyebrow}>{path.eyebrow}</p>
                <h3>{path.title}</h3>
                <p>{path.description}</p>
                <Link to={path.href}>Open this path</Link>
              </article>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
