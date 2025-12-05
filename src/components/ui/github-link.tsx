import { siteConfig } from "@/config/site";

export function GitHubLink() {
  return (
    <a href={siteConfig.gitHubUrl} target="_blank" rel="noopener noreferrer">
      GitHub repo
    </a>
  );
}
