"use client";

import { CopyButton } from "@/registry/v2/ui/copy-button";
import { cn } from "@/lib/utils";
import { CheckIcon } from "lucide-react";

export function CopyButtonBasic() {
  return (
    <CopyButton toCopy="hello@example.com" onClick={() => alert("Copied!")}>
      Copy email
    </CopyButton>
  );
}

export function CopyButtonWithRenderProp() {
  return (
    <CopyButton toCopy="hello@example.com" className="relative">
      {({ isCopied }) => (
        <>
          <span className={cn(!isCopied ? "visible" : "invisible")}>
            hello@example.com
          </span>
          <span
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              isCopied ? "visible" : "invisible"
            )}
          >
            <CheckIcon aria-hidden="true" className="mr-1 size-[1em]" />
            Copied!
          </span>
        </>
      )}
    </CopyButton>
  );
}
