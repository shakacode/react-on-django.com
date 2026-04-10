import type {ReactNode} from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./pro.module.css";

export default function ProPage(): ReactNode {
  return (
    <Layout title="React on Django Pro" description="React on Django Pro overview and upgrade path">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>Commercial rendering tier</p>
            <h1>React on Django Pro</h1>
            <p>
              The Pro path extends the Django integration with the renderer-backed capabilities that
              matter for heavier SSR, streaming, and RSC workflows.
            </p>
            <div>
              <Link className="button button--primary button--lg" to="/docs/pro/overview">
                Open the Pro docs
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.cardEyebrow}>Upgrade path</p>
              <h2>Move in three steps</h2>
              <ol className={styles.stepList}>
                <li>Compare the open-source package and the Pro surface area.</li>
                <li>Follow the upgrade guide in the docs repo.</li>
                <li>Validate renderer-backed behavior in your real Django app.</li>
              </ol>
            </article>

            <article className={styles.card}>
              <p className={styles.cardEyebrow}>Support</p>
              <h2>One docs surface, one product story</h2>
              <p>
                The site keeps Pro in the same documentation system, so teams can move from client
                rendering to SSR, streaming, and RSC without switching products or site structure.
              </p>
              <p>
                For commercial questions, start with the upgrade guide and the upstream repository.
              </p>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
