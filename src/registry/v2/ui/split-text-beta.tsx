/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, Variants } from "motion/react";
import { createElement, isValidElement, useMemo } from "react";

const fadeInContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const fadeInWord: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 },
  },
};

const fadeInChar: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

const slideUpContainer: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { staggerChildren: 0.125, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const slideUpWord: Variants = {
  initial: { opacity: 0, y: 15 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, staggerChildren: 0.025, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const slideUpChar: Variants = {
  initial: { opacity: 0, y: 7.5 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

const defaultContainerVariants: Variants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.035,
    },
  },
};

const defaultWordVariants: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      staggerChildren: 0.09,
      ease: [0.21, 0.47, 0.32, 0.98],
    },
  },
};

const defaultCharVariants: Variants = {
  initial: { opacity: 0, scale: 0.5 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.1, ease: [0.21, 0.47, 0.32, 0.98] },
  },
};

function SingleWord({
  index,
  variants,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  index: number;
  clip?: SplitModeOptions | "none";
  variants: Variants;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...props}
      style={{ display: "inline-block" }}
      key={`word-${index}`}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

function SingleChar({
  index,
  variants,
  children,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  index: number;
  variants: Variants;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      {...props}
      style={{ display: "inline-block" }}
      key={`char-${index}`}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

type SplitModeOptions = "chars" | "words" | "both";

// Define the required structure for each animation preset
type AnimationVariants = {
  container: Variants;
  word: Variants;
  char: Variants;
};

// First define the animations object without explicit type
const presets = {
  fade: {
    container: fadeInContainer,
    word: fadeInWord,
    char: fadeInChar,
  },
  slideUp: {
    container: slideUpContainer,
    word: slideUpWord,
    char: slideUpChar,
  },
  typing: {
    container: slideUpContainer,
    word: slideUpWord,
    char: slideUpChar,
  },
} as const satisfies Record<string, AnimationVariants>;

// Then derive both the names and preset types from the animations object
type AnimationNames = keyof typeof presets;
type AnimationPreset = AnimationNames; // or just use AnimationNames directly

type SplitTextProps = Omit<React.ComponentPropsWithoutRef<typeof motion.div>, "children"> & {
  children: React.ReactNode;
  split?: SplitModeOptions;
  preset?: AnimationPreset;
  containerVariants?: Variants;
  wordVariants?: Variants;
  charVariants?: Variants;
};

export function SplitTextBeta({
  children,
  split = "both",
  preset = "slideUp",
  wordVariants = defaultWordVariants,
  charVariants = defaultCharVariants,
  containerVariants = defaultContainerVariants,
  ...props
}: SplitTextProps) {
  const viewport = { once: true, margin: "0px 0px -128px" };

  const resolvedContainerVariants = presets[preset]?.container ?? containerVariants;
  const resolvedWordVariants = presets[preset]?.word ?? wordVariants;
  const resolvedCharVariants = presets[preset]?.char ?? charVariants;

  const splittedChildren = useMemo(() => {
    return transformNode(children, split, resolvedWordVariants, resolvedCharVariants, "root");
  }, [children, split, resolvedWordVariants, resolvedCharVariants]);

  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={viewport}
      variants={resolvedContainerVariants}
      {...props}
    >
      {/* Screen readers get the original text/structure. */}
      <span className="sr-only">{children}</span>

      {/* Render the splitted version for sighted users */}
      <div aria-hidden="true">{splittedChildren}</div>
    </motion.div>
  );
}

/**
 * Recursively traverse `node`. If it's text, split it split the chosen mode.
 * If it's a React element, reconstruct it with transformed children.
 * We pass down a `keyPath` string to ensure unique fallback keys for each sibling.
 */
function transformNode(
  node: React.ReactNode,
  split: SplitModeOptions,
  wordVariants: Variants,
  charVariants: Variants,
  keyPath: string
): React.ReactNode {
  if (node === null || node === undefined || typeof node === "boolean") {
    return node;
  }

  if (typeof node === "string") {
    switch (split) {
      case "chars":
        return splitByChars(node, charVariants);
      case "words":
        return splitByWords(node, wordVariants);
      case "both":
        return splitByCharsAndWords(node, wordVariants, charVariants);
      default:
        return node;
    }
  }

  if (Array.isArray(node)) {
    return node.map((child, index) =>
      transformNode(child, split, wordVariants, charVariants, `${keyPath}-${index}`)
    );
  }

  if (isValidElement(node)) {
    const element = node as React.ReactElement<any>;
    const { type, props: elemProps, key } = element;

    const newChildren = elemProps?.children
      ? transformNode(elemProps.children, split, wordVariants, charVariants, `${keyPath}-child`)
      : elemProps?.children;

    const childKey = key ?? keyPath;
    const newProps = { ...elemProps };
    delete newProps.children;

    return createElement(type, { ...newProps, key: childKey }, newChildren);
  }

  return node;
}

// Helper functions
function splitByChars(text: string, charVariants: Variants): React.ReactNode[] {
  return text
    .split(/(\s+)/)
    .map((chunk, chunkIndex) => {
      if (/\s+/.test(chunk)) {
        return chunk; // Return whitespace chunks as-is
      }
      return chunk.split("").map((char, charIndex) => (
        <SingleChar
          key={`${chunkIndex}-${charIndex}`}
          index={chunkIndex * 100 + charIndex}
          variants={charVariants}
        >
          {char}
        </SingleChar>
      ));
    })
    .flat();
}

function splitByWords(text: string, wordVariants: Variants): React.ReactNode[] {
  return text.split(/(\s+)/).map((chunk, i) => {
    if (/\s+/.test(chunk)) {
      return chunk;
    }
    return (
      <SingleWord key={i} index={i} variants={wordVariants}>
        {chunk}
      </SingleWord>
    );
  });
}

function splitByCharsAndWords(
  text: string,
  wordVariants: Variants,
  charVariants: Variants
): React.ReactNode[] {
  return text.split(/(\s+)/).map((wordChunk, index) => {
    if (/\s+/.test(wordChunk)) {
      return wordChunk;
    }
    const chars = wordChunk.split("").map((char, j) => (
      <SingleChar key={j} index={j} variants={charVariants}>
        {char}
      </SingleChar>
    ));
    return (
      <SingleWord key={index} index={index} variants={wordVariants}>
        {chars}
      </SingleWord>
    );
  });
}
