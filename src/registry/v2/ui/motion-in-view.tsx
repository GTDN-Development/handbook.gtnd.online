"use client";

import {
  motion,
  useReducedMotion,
  type KeyframeOptions,
  type Variants,
  type Transition,
  type SpringOptions,
} from "framer-motion";
import { createContext, useContext } from "react";

const StaggerGroupContext = createContext<boolean>(false);

const viewport = { once: true, margin: "-128px" };

type AnimationsType = {
  [key: string]: Variants;
};

const presets: AnimationsType = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
  },
  focus: {
    initial: { opacity: 0, filter: "blur(5px)" },
    animate: { opacity: 1, filter: "blur(0px)" },
  },
  focusUp: {
    initial: { opacity: 0, y: 20, filter: "blur(5px)" },
    animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  },
};

export function MotionInView({
  preset = "slideUp",
  duration = 0.9,
  delay,
  ease = [0.21, 0.47, 0.32, 0.98],
  ...props
}: React.ComponentProps<typeof motion.div> & {
  preset?: keyof typeof presets;
  duration?: SpringOptions["duration"];
  delay?: Transition["delay"];
  ease?: KeyframeOptions["ease"];
}) {
  const isInStaggerGroup = useContext(StaggerGroupContext);
  const prefersReducedMotion = useReducedMotion();

  const motionSafeDuration = prefersReducedMotion ? 0 : duration;
  const motionSafeDelay = prefersReducedMotion ? 0 : delay;

  if (isInStaggerGroup) {
    return (
      <motion.div
        {...props}
        viewport={viewport}
        variants={presets[preset]}
        transition={{ duration: motionSafeDuration, ease }}
      />
    );
  }

  return (
    <motion.div
      {...props}
      viewport={viewport}
      variants={presets[preset]}
      initial="initial"
      whileInView="animate"
      transition={{ duration: motionSafeDuration, delay: motionSafeDelay, ease }}
    />
  );
}

export function InViewStagger({
  stagger = 0.2,
  delay = 0,
  ...props
}: React.ComponentProps<typeof motion.div> & {
  stagger?: Transition["staggerChildren"];
  delay?: Transition["delay"];
}) {
  const prefersReducedMotion = useReducedMotion();
  return (
    <StaggerGroupContext.Provider value={true}>
      <motion.div
        {...props}
        viewport={viewport}
        initial="initial"
        whileInView="animate"
        variants={{
          initial: {},
          animate: {
            transition: {
              staggerChildren: prefersReducedMotion ? 0 : stagger,
              delayChildren: prefersReducedMotion ? 0 : delay,
            },
          },
        }}
      />
    </StaggerGroupContext.Provider>
  );
}
