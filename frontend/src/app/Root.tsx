import { Outlet, Link } from 'react-router-dom';
import { ROUTES, APP_TITLE } from '@/core/config';

export function Root() {
  return (
    <div className="min-h-screen bg-background font-inter font-tabular-nums text-on-background">
      <header className="sticky top-0 z-50 bg-surface/60 backdrop-blur-[24px]">
        <nav className="mx-auto flex max-w-4xl items-center gap-6 px-4 py-4">
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
              Home
            </Link>
            <Link
              to={ROUTES.GYM}
              className="text-sm font-medium text-on-surface-variant hover:text-mint transition-colors"
            >
              Gym
            </Link>
            <Link
              to={ROUTES.EDITOR}
              className="text-sm font-medium text-on-surface-variant hover:text-mint transition-colors"
            >
              Editor
            </Link>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-12">
        <Outlet />
      </main>
    </div>
  );
}
