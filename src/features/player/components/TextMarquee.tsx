import React, { useEffect, useRef, useState } from 'react';

interface TextMarqueeProps {
  text: string;
  className?: string;
  speedMs?: number; // full loop duration
}

export const TextMarquee: React.FC<TextMarqueeProps> = ({ text, className = '', speedMs = 12000 }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLSpanElement | null>(null);
  const [shouldMarquee, setShouldMarquee] = useState(false);
  const [contentWidth, setContentWidth] = useState(0);

  useEffect(() => {
    const checkOverflow = () => {
      const wrap = wrapperRef.current;
      const cont = contentRef.current;
      if (!wrap || !cont) return;
      const contWidth = cont.scrollWidth;
      setContentWidth(contWidth);
      setShouldMarquee(contWidth > wrap.clientWidth + 2);
    };
    checkOverflow();
    const id = window.setTimeout(checkOverflow, 0);
    window.addEventListener('resize', checkOverflow);
    return () => {
      window.clearTimeout(id);
      window.removeEventListener('resize', checkOverflow);
    };
  }, [text]);

  if (!shouldMarquee) {
    return (
      <div ref={wrapperRef} className={`overflow-hidden whitespace-nowrap ${className}`}>
        <span ref={contentRef} className="inline-block align-middle">
          {text}
        </span>
      </div>
    );
  }

  // Marquee mode with duplicated content for seamless loop
  const durationStyle = { animationDuration: `${speedMs}ms`, width: contentWidth * 2 || undefined } as React.CSSProperties;
  return (
    <div ref={wrapperRef} className={`marquee-wrapper overflow-hidden whitespace-nowrap ${className}`}>
      <div className="marquee flex items-center gap-12" style={durationStyle}>
        <span ref={contentRef} className="inline-block align-middle">
          {text}
        </span>
        <span className="inline-block align-middle" aria-hidden>
          {text}
        </span>
      </div>
    </div>
  );
};

export default TextMarquee;

