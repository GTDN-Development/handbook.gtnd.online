import { getPageImage, source } from "@/lib/source";
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from "fumadocs-ui/page";
import { notFound } from "next/navigation";
import { getMDXComponents } from "@/mdx-components";
import type { Metadata } from "next";
import { createRelativeLink } from "fumadocs-ui/mdx";
import { LLMCopyButton } from "@/components/page-actions";
import { findNeighbour } from "fumadocs-core/page-tree";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react";

export default async function Page(props: PageProps<"/docs/[[...slug]]">) {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;
  const neighbours = findNeighbour(source.pageTree, page.url);

  return (
    <DocsPage toc={page.data.toc} full={page.data.full}>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-4">
          <DocsTitle>{page.data.title}</DocsTitle>
          <div className="flex gap-2">
            <div className="hidden lg:block">
              <LLMCopyButton markdownUrl={`${page.url}.mdx`} />
            </div>

            {neighbours.previous && (
              <Button variant="secondary" size="icon-sm" asChild>
                <Link href={neighbours.previous.url}>
                  <ArrowLeftIcon aria-hidden="true" />
                  <span className="sr-only">Previous</span>
                </Link>
              </Button>
            )}
            {neighbours.next && (
              <Button variant="secondary" size="icon-sm" asChild>
                <Link href={neighbours.next.url}>
                  <span className="sr-only">Next</span>
                  <ArrowRightIcon aria-hidden="true" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        <DocsDescription>{page.data.description}</DocsDescription>
      </div>
      <DocsBody className="pb-16 sm:pb-24">
        <MDX
          components={getMDXComponents({
            // this allows you to link to other pages with relative file paths
            a: createRelativeLink(source, page),
          })}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return source.generateParams();
}

export async function generateMetadata(props: PageProps<"/docs/[[...slug]]">): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
    openGraph: {
      images: getPageImage(page).url,
    },
  };
}
