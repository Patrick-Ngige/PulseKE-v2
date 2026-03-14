'use client';
import { useEffect, useState } from 'react';
import { cn, scoreColor } from '@/lib/utils';

export default function ScoreRing({ score, size = 72, className }: { score: number; size?: number; className?: string }) {
  const [n, setN] = useState(0);
  const r  = size / 2 - 5;
  const c  = 2 * Math.PI * r;
  const col = scoreColor(n);

  useEffect(() => {
    const start = performance.now();
    const dur   = 800;
    const step  = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      setN(Math.round(score * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [score]);

  return (
    <div className={cn('relative flex items-center justify-center rounded-full flex-shrink-0', col.bg, className)}
         style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute inset-0 -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor" strokeWidth="3.5" className="opacity-10" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="currentColor"
          className={col.text} strokeWidth="3.5" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (n / 100) * c}
          style={{ transition: 'stroke-dashoffset 0.03s linear' }} />
      </svg>
      <span className={cn('relative font-mono font-bold', col.text)} style={{ fontSize: size * 0.26 }}>{n}</span>
    </div>
  );
}