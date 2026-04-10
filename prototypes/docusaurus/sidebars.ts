import type {SidebarsConfig} from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  docsSidebar: [
    "introduction",
    {
      type: "category",
      label: "Getting Started",
      collapsed: false,
      items: [
        "getting-started/installation",
        "getting-started/quick-start",
        "getting-started/create-react-on-django-app",
      ],
    },
    {
      type: "category",
      label: "Guides",
      items: [
        "guides/client-rendering",
        "guides/server-rendering",
        "guides/streaming-ssr",
        "guides/rsc",
        "guides/configuration",
        "guides/testing-and-operations",
      ],
    },
    {
      type: "category",
      label: "Pro",
      items: ["pro/overview", "pro/upgrading-to-pro"],
    },
  ],
};

export default sidebars;
