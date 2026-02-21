import { Link, usePage } from '@inertiajs/react';
import { type ReactNode } from 'react';

interface Props {
    children: ReactNode;
    // Optional title displayed in the header
    title?: string;
}

export default function AppLayout({ children, title }: Props) {
    // Get the current URL to highlight the active nav item
    const { url } = usePage();

    const isActive = (path: string) => url.startsWith(path);

    return (
        <div className="app-wrapper">
            {/* Top header */}
            <header className="app-header">
                <div className="app-header__logo">
                    <span className="app-header__logo-icon">⛳</span>
                    <span>Putt Perfect</span>
                </div>
                {title && (
                    <span className="text-sm text-muted">{title}</span>
                )}
            </header>

            {/* Page content */}
            <main className="app-main">
                {children}
            </main>

            {/* Bottom Navigation */}
            <nav className="bottom-nav" aria-label="Main navigation">
                <Link
                    href="/home"
                    className={`nav-item ${isActive('/home') || isActive('/play') ? 'nav-item--active' : ''}`}
                    aria-label="Games"
                >
                    <span className="nav-item__icon">🎮</span>
                    <span>Games</span>
                </Link>

                <Link
                    href="/history"
                    className={`nav-item ${isActive('/history') ? 'nav-item--active' : ''}`}
                    aria-label="History"
                >
                    <span className="nav-item__icon">📊</span>
                    <span>History</span>
                </Link>

                <Link
                    href="/profile"
                    className={`nav-item ${isActive('/profile') ? 'nav-item--active' : ''}`}
                    aria-label="Profile"
                >
                    <span className="nav-item__icon">👤</span>
                    <span>Profile</span>
                </Link>
            </nav>
        </div>
    );
}
