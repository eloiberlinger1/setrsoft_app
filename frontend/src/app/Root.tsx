import { Outlet, Link } from 'react-router-dom';
import { ROUTES, APP_TITLE } from '@/core/config';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher';
import { Footer } from '@/shared/components/Footer';

export function Root() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col bg-background font-inter font-tabular-nums text-on-background">
      <header className="sticky top-0 z-50 bg-surface/60 backdrop-blur-[24px]">
        <nav className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 w-full">
          <div className="flex items-center gap-6">
            <Link
              to={ROUTES.HOME}
              className="font-bold text-white tracking-tight"
            >
              {APP_TITLE}
            </Link>
            <div className="flex gap-4">
              <Link
                to={ROUTES.HOME}
                className="text-sm font-medium text-on-surface-variant hover:text-mint transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                to={ROUTES.GYM}
                className="text-sm font-medium text-on-surface-variant hover:text-mint transition-colors"
              >
                {t('nav.gym')}
              </Link>
              <Link
                to={ROUTES.EDITOR}
                className="text-sm font-medium text-on-surface-variant hover:text-mint transition-colors"
              >
                {t('nav.editor')}
              </Link>
            </div>
          </div>
          <LanguageSwitcher />
        </nav>
      </header>
      <main className="flex-grow flex flex-col mx-auto max-w-4xl px-4 py-12 w-full">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
