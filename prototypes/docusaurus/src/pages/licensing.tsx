import type {ReactNode} from "react";
import Link from "@docusaurus/Link";
import Layout from "@theme/Layout";

import styles from "./licensing.module.css";

export default function LicensingPage(): ReactNode {
  return (
    <Layout
      title="React on Django Licensing"
      description="React on Django licensing for non-commercial and commercial production use">
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className="container">
            <p className={styles.eyebrow}>One product, one docs surface</p>
            <h1>React on Django licensing</h1>
            <p>
              React on Django ships client rendering, SSR, streaming SSR, and React Server
              Components in the same package. Non-commercial and no-revenue use is free. Commercial
              production use requires a paid license from ShakaCode.
            </p>
            <div>
              <Link className="button button--primary button--lg" to="/docs/guides/licensing">
                Open the licensing guide
              </Link>
            </div>
          </div>
        </section>

        <section className="container">
          <div className={styles.grid}>
            <article className={styles.card}>
              <p className={styles.cardEyebrow}>Use model</p>
              <h2>No separate feature tier</h2>
              <p>
                Teams do not switch packages to unlock SSR, streaming, or RSC. The licensing model
                depends on production usage, not on a separate add-on surface.
              </p>
            </article>

            <article className={styles.card}>
              <p className={styles.cardEyebrow}>Commercial questions</p>
              <h2>Start from the docs and license</h2>
              <p>
                Review the licensing guide and the repository license terms first, then contact
                ShakaCode if you need commercial production coverage.
              </p>
            </article>
          </div>
        </section>
      </main>
    </Layout>
  );
}
