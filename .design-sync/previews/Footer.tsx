import { Footer } from '@aiaru/site-ds';

export const Default = () => <Footer year={2026} />;

export const WithLinks = () => (
  <Footer
    year={2026}
    links={[
      { href: '/work', label: 'Work' },
      { href: '/about', label: 'About' },
    ]}
  />
);
