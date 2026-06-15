"use client";

import * as React from "react";
import { motion, useInView, animate } from "framer-motion";

export function StatCounter({
  value,
  label,
  suffix = "",
}: {
  value: number;
  label: string;
  suffix?: string;
}) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = React.useState(0);

  React.useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <span
        ref={ref}
        className="block font-heading text-4xl font-extrabold text-white sm:text-5xl"
      >
        {display.toLocaleString()}
        {suffix}
      </span>
      <span className="mt-1 block text-sm font-medium text-white/70">{label}</span>
    </motion.div>
  );
}
