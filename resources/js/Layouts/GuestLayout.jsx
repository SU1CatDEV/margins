import Dropdown from '@/Components/Dropdown';
import PrimaryButton from '@/Components/PrimaryButton';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SecondaryButton from '@/Components/SecondaryButton';
import { Link } from '@inertiajs/react';
import { useState } from 'react';

export default function GuestLayout({ children, title }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 min-h-[100vh] flex flex-col">
            <div className='flex flex-1'>
                {/* Main content area (now flex column) */}
                <div className="flex-1 flex flex-col">
                    <nav className="border-b-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 mx-4 sm:mx-6 lg:mx-8">
                        <div className="mx-auto">
                            <div className="flex h-16 justify-between">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/" className='border-r-2 border-gray-300 pr-5 pt-2 mr-5'>
                                        <span className='mt-2 pt-2 text-2xl apply-cursive logo-color'>M</span>
                                    </Link>

                                    {title && <h1 className="text-4xl w-auto -mb-3 flex align-end items-end">
                                        {title}
                                    </h1>}
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <Link href="/register">
                                        <PrimaryButton className='btn-smol mr-4'>Sign up</PrimaryButton>
                                    </Link>
                                    <Link href="/login">
                                        <SecondaryButton className='btn-smol'>Log in</SecondaryButton>
                                    </Link>
                                    
                                </div>

                                <div className="-me-2 flex items-center sm:hidden">
                                    <button
                                        onClick={() =>
                                            setShowingNavigationDropdown(
                                                (previousState) => !previousState,
                                            )
                                        }
                                        className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-200 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none dark:text-gray-500 dark:hover:bg-gray-900 dark:hover:text-gray-400 dark:focus:bg-gray-900 dark:focus:text-gray-400"
                                    >
                                        <svg
                                            className="h-6 w-6"
                                            stroke="currentColor"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                className={
                                                    !showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M4 6h16M4 12h16M4 18h16"
                                            />
                                            <path
                                                className={
                                                    showingNavigationDropdown
                                                        ? 'inline-flex'
                                                        : 'hidden'
                                                }
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div
                            className={
                                (showingNavigationDropdown ? 'block' : 'hidden') +
                                ' sm:hidden'
                            }
                        >
                            <div className="space-y-1 pb-3 pt-2">
                                <ResponsiveNavLink
                                    href={route('dashboard')}
                                    active={route().current('dashboard')}
                                >
                                    Dashboard
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    href={route('search')}
                                >
                                    Search
                                </ResponsiveNavLink>
                            </div>

                            <div className="border-t border-gray-200 pb-1 pt-4 dark:border-gray-600">
                                <div className="mt-3 space-y-1">
                                    <ResponsiveNavLink href={route('profile.view')}>
                                        View Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink href={route('profile.edit')}>
                                        Edit Profile
                                    </ResponsiveNavLink>
                                    <ResponsiveNavLink
                                        method="post"
                                        href={route('logout')}
                                        as="button"
                                    >
                                        Log Out
                                    </ResponsiveNavLink>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className='flex-1 flex flex-col'>
                        {children}
                    </main>
                </div>
            </div>
            
            <footer className='flex justify-around px-10 py-2 border-t-2 border-gray-300 items-center'>
                <span className='apply-cursive bold text-lg pt-2 box-border logo-color'>M</span> | 
                <span>thanks for being here :D</span> | 
                <span>i dont like doing footers</span> | 
                <span>
                    <span className='mr-1'>tbh idc take my code if u think that ur better than me lol 2025</span> 
                    {/* <a className='underline text-indigo-700 mr-1'>check me out</a> 
                    <a className='underline text-indigo-700 mr-1'>source code</a> 
                    <a className='underline text-indigo-700'>policies</a> */}
                </span>
            </footer>
        </div>
    );
}
