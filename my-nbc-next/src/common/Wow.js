'use client';

import { useEffect } from 'react';

export default function Wow() {
  useEffect(() => {
    // Dynamically import wowjs to avoid SSR issues
    import('wowjs').then((WOW) => {
      const wow = new WOW.WOW({
        boxClass: 'wow',
        animateClass: 'animate__animated',
        offset: 40,
        mobile: true,
        live: false,
        callback: function (box) {
          box.style.animationTimingFunction = 'ease-in-out';
        },
      });

      wow.init();
    });
  }, []);

  return null;
}
