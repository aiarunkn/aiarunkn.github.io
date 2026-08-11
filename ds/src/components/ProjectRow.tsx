export interface ProjectRowProps {
  /** Zero-padded index string, e.g. "01". */
  index: string;
  title: string;
  description: string;
  tag: string;
  href: string;
  /** Renders target="_blank" rel="noopener" — defaults true, matching real usage. */
  external?: boolean;
}

/** A single linked project row: index, title + description, tag pill. */
export function ProjectRow({ index, title, description, tag, href, external = true }: ProjectRowProps) {
  return (
    <a
      className="proj"
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener' : undefined}
    >
      <span className="pidx">{index}</span>
      <span className="pm">
        <h3>
          {title} <span className="arr">↗</span>
        </h3>
        <p>{description}</p>
      </span>
      <span className="ptag">{tag}</span>
    </a>
  );
}
