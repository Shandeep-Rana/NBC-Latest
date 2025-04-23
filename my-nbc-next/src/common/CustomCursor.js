'use client';

import { useEffect, useRef, useState } from 'react';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const textRef = useRef(null);
  const requestRef = useRef(null);
  const [visible, setVisible] = useState(false);
  const [stickPos, setStickPos] = useState(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const cursor = cursorRef.current;
    const text = textRef.current;

    if (!cursor || !text) return;

    let visibleTimeout;

    const show = () => {
      if (!visible) {
        cursor.classList.add('-visible');
        visibleTimeout = setTimeout(() => setVisible(true), 10);
      }
    };

    const hide = () => {
      cursor.classList.remove('-visible');
      clearTimeout(visibleTimeout);
      visibleTimeout = setTimeout(() => setVisible(false), 300);
    };

    const moveCursor = (e) => {
      target.current.x = stickPos ? stickPos.x - ((stickPos.x - e.clientX) * 0.15) : e.clientX;
      target.current.y = stickPos ? stickPos.y - ((stickPos.y - e.clientY) * 0.15) : e.clientY;
      show();
    };

    const animate = () => {
      const speed = 0.15;
      current.current.x += (target.current.x - current.current.x) * speed;
      current.current.y += (target.current.y - current.current.y) * speed;
      cursor.style.transform = `translate3d(${current.current.x}px, ${current.current.y}px, 0)`;
      requestRef.current = requestAnimationFrame(animate);
    };

    const setState = (state) => cursor.classList.add(state);
    const removeState = (state) => cursor.classList.remove(state);

    const setText = (value) => {
      text.innerHTML = value;
      cursor.classList.add('-text');
    };

    const removeText = () => cursor.classList.remove('-text');

    const setStick = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setStickPos({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      });
    };

    const removeStick = () => setStickPos(null);

    // Start animation
    requestRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', moveCursor);
    document.addEventListener('mousedown', () => setState('-active'));
    document.addEventListener('mouseup', () => removeState('-active'));
    document.addEventListener('mouseenter', show);
    document.addEventListener('mouseleave', hide);

    const pointerElements = ['a', 'button', 'input', 'textarea'];
    pointerElements.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.addEventListener('mouseenter', () => setState('-pointer'));
        el.addEventListener('mouseleave', () => removeState('-pointer'));
      });
    });

    document.querySelectorAll('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => setState(el.dataset.cursor));
      el.addEventListener('mouseleave', () => removeState(el.dataset.cursor));
    });

    document.querySelectorAll('[data-cursor-text]').forEach((el) => {
      el.addEventListener('mouseenter', () => setText(el.dataset.cursorText));
      el.addEventListener('mouseleave', removeText);
    });

    document.querySelectorAll('[data-cursor-stick]').forEach((el) => {
      el.addEventListener('mouseenter', () => setStick(el.dataset.cursorStick));
      el.addEventListener('mouseleave', removeStick);
    });

    return () => {
      cancelAnimationFrame(requestRef.current);
      document.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mousedown', () => setState('-active'));
      document.removeEventListener('mouseup', () => removeState('-active'));
      document.removeEventListener('mouseenter', show);
      document.removeEventListener('mouseleave', hide);
    };
  }, [stickPos, visible]);

  return (
    <div className="cb-cursor" ref={cursorRef}>
      <div className="cb-cursor-text" ref={textRef}></div>
    </div>
  );
};

export default CustomCursor;
