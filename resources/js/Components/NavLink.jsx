import { Link } from '@inertiajs/react';

export default function NavLink({
    active = false,
    className = '',
    children,
    ...props
}) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-pink-500 text-white focus:border-pink-700'
                    : 'border-transparent text-gray-300 hover:border-purple-400 hover:text-white focus:border-purple-400 focus:text-white') +
                className
            }
        >
            {children}
        </Link>
    );
}
