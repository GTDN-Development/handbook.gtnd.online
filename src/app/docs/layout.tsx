import { pageTree } from "@/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { baseOptions } from "@/lib/layout.shared";

export default function Layout({ children }: LayoutProps<"/docs">) {
  return (
    <DocsLayout
      tree={pageTree}
      sidebar={{
        defaultOpenLevel: 1,
        collapsible: false,
      }}
      {...baseOptions()}
    >
      {children}
    </DocsLayout>
  );
}
