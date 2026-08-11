import { useEffect, useState } from 'react';

export type NavPage = 'home' | 'work' | 'about' | 'contact';

export interface NavProps {
  /** Which page's link should render with the `.active` treatment. */
  active: NavPage;
  className?: string;
}

const LINKS: { page: NavPage; href: string; label: string }[] = [
  { page: 'home', href: '/', label: 'Home' },
  { page: 'work', href: '/work', label: 'Work' },
  { page: 'about', href: '/about', label: 'About' },
  { page: 'contact', href: '/contact', label: 'Contact' },
];

/** Sticky site header — brand mark + primary nav, with a border that appears once the page scrolls. */
export function Nav({ active, className }: NavProps) {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStuck((window.scrollY || window.pageYOffset) > 8);
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={['nav', stuck ? 'stuck' : '', className].filter(Boolean).join(' ')}>
      <div className="shell nav-in">
        <a href="/" className="brand">
          <span className="mk" />
        </a>
        <nav className="nav-links">
          {LINKS.map(({ page, href, label }) => (
            <a key={page} href={href} className={['label', page === active ? 'active' : ''].filter(Boolean).join(' ')}>
              {label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
