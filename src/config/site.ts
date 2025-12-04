export const siteConfig = {
  name: "GTDN Docs",
  url: "https://docs.gtnd.online",
  gitHubUrl: "https://github.com/GTDN-Development/handbook.gtnd.online",
} as const;

export type SiteConfig = typeof siteConfig;
