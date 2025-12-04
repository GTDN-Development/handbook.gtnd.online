import { siteConfig } from "@/config/site";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: siteConfig.name,
    },
    githubUrl: "https://github.com",
    themeSwitch: {
      mode: "light-dark-system",
    },
  };
}
