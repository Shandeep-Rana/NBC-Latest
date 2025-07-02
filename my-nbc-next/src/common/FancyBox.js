'use client';

import React, { useRef, useEffect } from 'react';
import { Fancybox as NativeFancybox } from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

function Fancybox({ children, options = {} }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    // Unbind first
    NativeFancybox.unbind(container);
    // Then bind again
    NativeFancybox.bind(container, '[data-fancybox]', options);

    return () => {
      NativeFancybox.unbind(container);
    };
  }, [children, options]); // 👈 key: re-run when children change

  return <div ref={containerRef}>{children}</div>;
}

export default Fancybox;
