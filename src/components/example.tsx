"use client";

import { clsx } from "clsx";
import { useState } from "react";
import { RotateCcwIcon } from "lucide-react";
import { Button } from "./ui/button";

export type ExampleStyleProps = {
  padding?: boolean;
  horizontalAlign?: "start" | "center" | "end";
  verticalAlign?: "start" | "center" | "end";
  prose?: boolean;
  pattern?: boolean;
  reload?: boolean;
  className?: string;
};

export function Example({
  children,
  padding = true,
  horizontalAlign = "center",
  verticalAlign = "center",
  prose = false,
  pattern = true,
  reload = false,
  className,
}: React.PropsWithChildren<ExampleStyleProps>) {
  const [key, setKey] = useState(0);

  const handleReload = () => {
    setKey(key + 1);
  };

  return (
    <div
      key={key}
      className={clsx(
        className,
        "bg-card relative flex min-h-48 overflow-auto rounded-xl border shadow-sm dark:shadow-none",
        pattern &&
          "bg-[radial-gradient(color-mix(in_oklab,currentColor_12.5%,transparent)_1px,transparent_1px)] bg-size-[21px_21px]",
        prose ? "" : "not-prose",
        horizontalAlign === "start" && "justify-start",
        horizontalAlign === "center" && "justify-center",
        horizontalAlign === "end" && "justify-end",
        verticalAlign === "start" && "items-start",
        verticalAlign === "center" && "items-center",
        verticalAlign === "end" && "items-end",
        padding && "p-8"
      )}
    >
      {children}
      {reload && (
        <Button
          onClick={handleReload}
          size="sm"
          variant={"ghost"}
          className="absolute top-2 right-2"
        >
          {/*<span className="sr-only">reload</span>*/}
          <RotateCcwIcon aria-hidden="true" />
          reload
        </Button>
      )}
    </div>
  );
}
