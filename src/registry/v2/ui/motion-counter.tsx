"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type KeyframeOptions,
  type Transition,
  type SpringOptions,
} from "motion/react";
import { useEffect, useRef } from "react";

export function MotionCounter({
  start,
  end,
  decimals = 2,
  duration = 2,
  delay = 0,
  ease = [0.25, 1, 0.5, 1],
  ...props
}: React.ComponentProps<typeof motion.div> & {
  start: number;
  end: number;
  decimals?: number;
  duration?: SpringOptions["duration"];
  delay?: Transition["delay"];
  ease?: KeyframeOptions["ease"];
}) {
  const ref = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = useReducedMotion();
  const value = useMotionValue(start);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  const computed = useTransform(value, (v) => v.toFixed(decimals));

  useEffect(() => {
    if (prefersReducedMotion) {
      value.set(end);
    }

    if (!isInView) return;

    const animation = animate(value, end, {
      duration,
      delay,
      ease,
    });

    return animation.stop;
  }, [prefersReducedMotion, isInView, value, end, duration, delay, ease]);

  return (
    <motion.div ref={ref} {...props}>
      {computed}
    </motion.div>
  );
}
