import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface CountUpProps {
  value: string;
  duration?: number;
}

const CountUp = ({ value, duration = 2000 }: CountUpProps) => {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;

    const numericValue = parseFloat(value.replace(/,/g, ""));
    if (isNaN(numericValue)) {
      setDisplay(value);
      return;
    }

    const isDecimal = value.includes(".");
    const hasComma = value.includes(",");
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic

      const current = numericValue * eased;

      let formatted: string;
      if (isDecimal) {
        const decimals = value.split(".")[1]?.length || 2;
        formatted = current.toFixed(decimals);
      } else {
        formatted = Math.round(current).toString();
      }

      if (hasComma) {
        formatted = Number(formatted).toLocaleString();
      }

      setDisplay(formatted);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="text-2xl font-heading font-bold text-foreground tabular-nums">
      {display}
    </span>
  );
};

export default CountUp;
