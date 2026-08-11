import type { ReactNode } from 'react';

export interface EyebrowProps {
  /** Section number, e.g. "01". */
  num: string;
  /** Optional trailing label, e.g. "Projects". */
  children?: ReactNode;
}

/** Small-caps numbered section label with a leading tick mark. */
export function Eyebrow({ num, children }: EyebrowProps) {
  return (
    <div className="eyebrow">
      <span className="num">{num}</span>
      {children}
    </div>
  );
}
