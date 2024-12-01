"use client";
import { useMotionValue, motion, useMotionTemplate } from "framer-motion";
import React from "react";
import { cn } from "@/lib/utils";

interface HeroBackgroundProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
}

export const HeroBackground: React.FC<HeroBackgroundProps> = ({
  children,
  className,
  containerClassName,
}) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY,
  }: React.MouseEvent<HTMLDivElement>) {
    if (!currentTarget) return;
    const { left, top } = currentTarget.getBoundingClientRect();

    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={cn(
        "relative h-[40rem] flex items-center bg-black justify-center w-full group",
        containerClassName
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Base dot pattern - slightly visible */}
      <div className="absolute inset-0 bg-dot-thick-neutral-800 opacity-40 pointer-events-none" />

      {/* Glowing dot pattern that follows mouse */}
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          backgroundImage: `radial-gradient(
            600px circle at var(--mouse-x) var(--mouse-y),
            rgba(255,255,255,0.06),
            transparent 40%
          )`,
        }}
      />

      {/* Bright white dots that follow mouse */}
      <motion.div
        className="pointer-events-none bg-dot-thick-white absolute inset-0 opacity-0 mix-blend-screen transition duration-300 group-hover:opacity-100"
        style={{
          WebkitMaskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `,
          maskImage: useMotionTemplate`
            radial-gradient(
              250px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent
            )
          `,
        }}
      />

      {/* Content */}
      <div className={cn("relative z-20", className)}>{children}</div>
    </div>
  );
};
