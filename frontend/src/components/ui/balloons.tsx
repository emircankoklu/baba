"use client";

import React, { useCallback, useRef } from "react";

/**
 * Balloons Animation Component
 *
 * Creates a canvas-based balloon animation that fills the viewport.
 * Uses the balloons-js library for the core animation logic.
 *
 * Usage:
 *   <Balloons trigger={shouldLaunch} />
 *
 * Or imperatively:
 *   const ref = useRef<BalloonsHandle>(null);
 *   ref.current?.launch();
 *   <Balloons ref={ref} />
 */

// Dynamic import of balloons-js since it's a vanilla JS module
let balloonsModule: (() => void) | null = null;

async function loadBalloons() {
  if (!balloonsModule) {
    const mod = await import("balloons-js");
    balloonsModule = mod.balloons || mod.default;
  }
  return balloonsModule;
}

export interface BalloonsProps {
  /** When set to true, triggers the balloon animation */
  trigger?: boolean;
  /** Callback fired after the animation launches */
  onLaunch?: () => void;
}

export interface BalloonsHandle {
  launch: () => void;
}

export const Balloons = React.forwardRef<BalloonsHandle, BalloonsProps>(
  function Balloons({ trigger, onLaunch }, ref) {
    const hasLaunched = useRef(false);

    const launch = useCallback(async () => {
      try {
        const balloonsFn = await loadBalloons();
        if (balloonsFn) {
          balloonsFn();
          onLaunch?.();
        }
      } catch (err) {
        console.error("Failed to launch balloons:", err);
      }
    }, [onLaunch]);

    // Expose launch method via ref
    React.useImperativeHandle(ref, () => ({ launch }), [launch]);

    // Launch when trigger changes to true
    React.useEffect(() => {
      if (trigger && !hasLaunched.current) {
        hasLaunched.current = true;
        launch();
      }
      if (!trigger) {
        hasLaunched.current = false;
      }
    }, [trigger, launch]);

    return null; // balloons-js renders its own canvas overlay
  }
);
