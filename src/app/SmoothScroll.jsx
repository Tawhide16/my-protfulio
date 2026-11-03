'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    // Suppress third-party browser extension errors from popping up in Next.js dev overlay
    const handleExtensionErrors = (event) => {
      const filename = event?.filename || '';
      const message = event?.message || '';
      if (
        filename.includes('chrome-extension://') ||
        filename.includes('moz-extension://') ||
        message.includes('M_ID')
      ) {
        event.stopImmediatePropagation?.();
        event.preventDefault?.();
      }
    };

    window.addEventListener('error', handleExtensionErrors, true);

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      window.removeEventListener('error', handleExtensionErrors, true);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
