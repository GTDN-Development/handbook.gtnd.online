"use client";

import {
  MotionValue,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useState } from "react";

export function useParallax(value: MotionValue<number>, offset: number) {
  return useTransform(value, [0, 1], [-offset, offset]);
}

type ParallaxProps = React.ComponentPropsWithoutRef<typeof motion.div> & {
  target: React.RefObject<HTMLElement | null>;
  offset?: number;
};

export function Parallax({ offset = 50, target, ...props }: ParallaxProps) {
  const [isMounted, setIsMounted] = useState(false);

  const { scrollYProgress } = useScroll({ target });
  const prefersReducedMotion = useReducedMotion();

  const rangeY = useParallax(scrollYProgress, offset);
  const y = useSpring(rangeY, { stiffness: 400, damping: 90 });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return <motion.div style={{ y: isMounted && prefersReducedMotion ? 0 : y }} {...props} />;
}
