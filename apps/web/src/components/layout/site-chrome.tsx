'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from './navbar';
import { Footer } from './footer';
import { LanguageSelector } from './language-selector';

/** Routes that present as a dedicated deck — no marketing chrome, edge-to-edge slides. */
const CHROMELESS_ROUTES = new Set(['/pitch', '/pitch-pro']);

/**
 * Wraps every page with the global Navbar/Footer, except chromeless routes
 * (the pitch decks), which get a floating language toggle instead — a
 * `position: fixed` control doesn't occupy layout height the way the
 * sticky Navbar does, so each slide's min-h-screen centers correctly.
 */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const chromeless = CHROMELESS_ROUTES.has(pathname);

  if (chromeless) {
    return (
      <>
        <div className="fixed right-4 top-4 z-50">
          <LanguageSelector />
        </div>
        <main id="main-content">{children}</main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer />
    </>
  );
}
