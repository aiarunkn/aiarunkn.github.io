export interface FooterLinkItem {
  href: string;
  label: string;
}

export interface FooterProps {
  /** Defaults to "Aiaru". */
  owner?: string;
  /** Defaults to the current year at render time. */
  year?: number;
  /** Optional right-aligned link list. Omitted entirely when not passed. */
  links?: FooterLinkItem[];
}

/** Site footer — copyright line, optional right-aligned nav links. */
export function Footer({ owner = 'Aiaru', year = new Date().getFullYear(), links }: FooterProps) {
  return (
    <footer className="shell">
      <div className="foot-in">
        <span>© {year} {owner}</span>
        {links && links.length > 0 && (
          <nav className="footnav">
            {links.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
