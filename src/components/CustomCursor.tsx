import type { RefObject } from 'react';

interface CustomCursorProps {
  ringRef: RefObject<HTMLDivElement | null>;
  cursorRef: RefObject<HTMLDivElement | null>;
}

/** Curseur custom (pointeur fin uniquement) : position pilotée en impératif par App. */
export default function CustomCursor({ ringRef, cursorRef }: CustomCursorProps) {
  return (
    <>
      <div ref={ringRef} className="cursor-ring" />
      <div ref={cursorRef} className="cursor-dot" />
    </>
  );
}
