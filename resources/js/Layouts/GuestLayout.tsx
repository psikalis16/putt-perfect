import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        /* guest-layout class overrides the dark app body theme for auth pages */
        <div className="guest-layout flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0">
            {/* Logo + brand name */}
            <div className="flex flex-col items-center gap-1">
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-green-700" />
                </Link>
                <span className="text-lg font-bold tracking-tight text-gray-800">
                    ⛳ Putt Perfect
                </span>
            </div>

            {/* guest-card: white card with subtle green border */}
            <div className="guest-card mt-6 w-full overflow-hidden px-6 py-6 sm:max-w-md">
                {children}
            </div>
        </div>
    );
}
