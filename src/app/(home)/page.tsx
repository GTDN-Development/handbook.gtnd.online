import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Welcome to the gtdn Knowledge Base</h1>
      <div className="mx-auto w-full max-w-4xl space-y-4 px-4">
        <p>
          This is the single source of truth for everything related to development and operations at
          gtdn. Whether it's your first day or you're looking for a specific technical guide, you're
          in the right place.
        </p>
        <p>
          Our goal is to centralize knowledge, simplify onboarding, and ensure we're all pulling in
          the same direction.
        </p>
      </div>
      <p className="mt-12">
        You can open{" "}
        <Link href="/docs/company/handbook/introduction" className="font-medium underline">
          /docs
        </Link>{" "}
        and see the documentation.
      </p>
    </div>
  );
}
