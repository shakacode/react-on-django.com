import {themes as prismThemes} from "prism-react-renderer";
import type {Config} from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "React on Django",
  tagline: "Render React from Django with SSR, streaming SSR, and React Server Components.",
  future: {
    v4: true,
  },
  url: "https://react-on-django.com",
  baseUrl: "/",
  organizationName: "shakacode",
  projectName: "react-on-django.com",
  onBrokenLinks: "throw",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "throw",
    },
  },
  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "docs",
          editUrl: ({docPath}) =>
            `https://github.com/shakacode/react-on-django/tree/main/docs/${docPath}`,
        },
        blog: false,
      } satisfies Preset.Options,
    ],
  ],
  themeConfig: {
    navbar: {
      title: "React on Django",
      items: [
        {
          type: "docSidebar",
          sidebarId: "docsSidebar",
          position: "left",
          label: "Docs",
        },
        {to: "/examples", label: "Examples", position: "left"},
        {to: "/pro", label: "Pro", position: "left"},
        {
          href: "https://github.com/shakacode/react-on-django",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "light",
      links: [
        {
          title: "Docs",
          items: [
            {label: "Introduction", to: "/docs/introduction"},
            {label: "Installation", to: "/docs/getting-started/installation"},
            {label: "Quick Start", to: "/docs/getting-started/quick-start"},
            {label: "Server Rendering", to: "/docs/guides/server-rendering"},
          ],
        },
        {
          title: "Project",
          items: [
            {label: "Examples", to: "/examples"},
            {label: "Pro", to: "/pro"},
            {label: "GitHub", href: "https://github.com/shakacode/react-on-django"},
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ShakaCode. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.vsDark,
      additionalLanguages: ["python", "bash", "json", "diff", "markup"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
