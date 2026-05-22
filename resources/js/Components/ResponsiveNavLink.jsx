import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? 'border-pink-500 bg-purple-600/20 text-white focus:border-pink-700 focus:bg-purple-600/30 focus:text-white'
                    : 'border-transparent text-gray-300 hover:border-purple-400 hover:bg-white/10 hover:text-white focus:border-purple-400 focus:bg-white/10 focus:text-white'
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
