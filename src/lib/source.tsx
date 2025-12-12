import { docs } from "@/.source";
import { type InferPageType, loader } from "fumadocs-core/source";
import type { LoaderPlugin } from "fumadocs-core/source";
import { lucideIconsPlugin } from "fumadocs-core/source/lucide-icons";

// Plugin to add highlight indicators to pages with highlight: true in frontmatter
const highlightPlugin: LoaderPlugin = {
  name: "highlight",
  transformPageTree: {
    file(node, filePath) {
      if (!filePath) return node;

      // Access the original file data from storage
      const fileData = this.storage.read(filePath);
      const data = fileData?.data as { highlight?: boolean } | undefined;

      if (data?.highlight) {
        return {
          ...node,
          name: (
            <>
              {node.name}
              <span
                style={{
                  marginLeft: "2px",
                  display: "inline-block",
                  width: "6px",
                  height: "6px",
                  borderRadius: "50%",
                  backgroundColor: "var(--primary)",
                }}
                title="Highlighted"
              />
            </>
          ),
        };
      }
      return node;
    },
  },
};

// See https://fumadocs.dev/docs/headless/source-api for more info
export const source = loader({
  baseUrl: "/docs",
  source: docs.toFumadocsSource(),
  plugins: [lucideIconsPlugin(), highlightPlugin],
});

// Now you can use source.pageTree directly - no manual transformation needed!
export const pageTree = source.pageTree;

export function getPageImage(page: InferPageType<typeof source>) {
  const segments = [...page.slugs, "image.png"];

  return {
    segments,
    url: `/og/docs/${segments.join("/")}`,
  };
}

export async function getLLMText(page: InferPageType<typeof source>) {
  const processed = await page.data.getText("processed");

  return `# ${page.data.title}

${processed}`;
}
