export type PortraitVariant = 'home' | 'story';

export interface PortraitProps {
  /** "home" = larger centered portrait; "story" = smaller top-aligned portrait. */
  variant: PortraitVariant;
  src: string;
  alt: string;
}

/** Grayscale portrait photo, sized per page context. */
export function Portrait({ variant, src, alt }: PortraitProps) {
  const wrapperClass = variant === 'home' ? 'home-portrait' : 'story-portrait';
  return (
    <div className={wrapperClass}>
      <img src={src} alt={alt} />
    </div>
  );
}
