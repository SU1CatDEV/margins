import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import SearchBar from '@/Components/SearchBar';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, title, children, withSidebar=false }) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 min-h-[100vh] flex flex-col">
            <div className='flex flex-1'>
                {/* Sidebar */}
                {withSidebar && <div className=" border-r-2 border-gray-300 px-4 sm:px-6 lg:px-8 dark:border-gray-700 bg-white dark:bg-gray-800">
                    <div className="flex flex-col shrink-0 items-center">
                        <Link href="/" className='mt-6 mb-2 '>
                            <span className='mt-2 pt-2 pb-1 border-b-2 border-gray-300 text-2xl apply-cursive logo-color'>M</span><span className="beta-symbol">β</span>
                        </Link>
                        <Link href="/dashboard/books" className='mt-10 mb-2'>
                            <svg width="35" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M8 39C8 37.6739 8.52678 36.4021 9.46447 35.4645C10.4021 34.5268 11.6739 34 13 34H40M8 39C8 40.3261 8.52678 41.5979 9.46447 42.5355C10.4021 43.4732 11.6739 44 13 44H40V4H13C11.6739 4 10.4021 4.52678 9.46447 5.46447C8.52678 6.40215 8 7.67392 8 9V39Z" 
                                        stroke={
                                            route().current() === "dashboard" || 
                                            route().current() === "index" || 
                                            route().current() === "dashboard.books" ? "black" : "#777"} 
                                strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <Link href="/dashboard/questions" className='mt-10 mb-2'>
                            <svg width="19" height="33" viewBox="0 0 21 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.93182 26.1818V25.9773C7.95455 23.8068 8.18182 22.0795 8.61364 20.7955C9.04545 19.5114 9.65909 18.4716 10.4545 17.6761C11.25 16.8807 12.2045 16.1477 13.3182 15.4773C13.9886 15.0682 14.5909 14.5852 15.125 14.0284C15.6591 13.4602 16.0795 12.8068 16.3864 12.0682C16.7045 11.3295 16.8636 10.5114 16.8636 9.61364C16.8636 8.5 16.6023 7.53409 16.0795 6.71591C15.5568 5.89773 14.858 5.26704 13.983 4.82386C13.108 4.38068 12.1364 4.15909 11.0682 4.15909C10.1364 4.15909 9.23864 4.35227 8.375 4.73864C7.51136 5.125 6.78977 5.73295 6.21023 6.5625C5.63068 7.39204 5.29545 8.47727 5.20455 9.81818H0.909091C1 7.88636 1.5 6.23295 2.40909 4.85795C3.32955 3.48295 4.53977 2.43182 6.03977 1.70454C7.55114 0.977271 9.22727 0.613635 11.0682 0.613635C13.0682 0.613635 14.8068 1.01136 16.2841 1.80682C17.7727 2.60227 18.9205 3.69318 19.7273 5.07954C20.5455 6.46591 20.9545 8.04545 20.9545 9.81818C20.9545 11.0682 20.7614 12.1989 20.375 13.2102C20 14.2216 19.4545 15.125 18.7386 15.9205C18.0341 16.7159 17.1818 17.4205 16.1818 18.0341C15.1818 18.6591 14.3807 19.3182 13.7784 20.0114C13.1761 20.6932 12.7386 21.5057 12.4659 22.4489C12.1932 23.392 12.0455 24.5682 12.0227 25.9773V26.1818H7.93182ZM10.1136 36.2727C9.27273 36.2727 8.55114 35.9716 7.94886 35.3693C7.34659 34.767 7.04545 34.0455 7.04545 33.2045C7.04545 32.3636 7.34659 31.642 7.94886 31.0398C8.55114 30.4375 9.27273 30.1364 10.1136 30.1364C10.9545 30.1364 11.6761 30.4375 12.2784 31.0398C12.8807 31.642 13.1818 32.3636 13.1818 33.2045C13.1818 33.7614 13.0398 34.2727 12.7557 34.7386C12.483 35.2045 12.1136 35.5795 11.6477 35.8636C11.1932 36.1364 10.6818 36.2727 10.1136 36.2727Z" 
                                        fill={
                                            route().current() === "dashboard.questions" ? "black" : "#777"
                                        }
                                />
                            </svg>
                        </Link>
                        <Link href="/dashboard/solutions" className='mt-10 mb-2'>
                            <svg width="35" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 22L24 28L44 8M42 24V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H32" 
                                        stroke={
                                            route().current() === "dashboard.solutions" ? "black" : "#777"} 
                                strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </Link>
                        <Link href="/search" className='mt-10 mb-2'>
                            <svg width="35" height="35" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M39.2 42L26.6 29.4C25.6 30.2 24.45 30.8333 23.15 31.3C21.85 31.7667 20.4667 32 19 32C15.3667 32 12.2917 30.7417 9.775 28.225C7.25833 25.7083 6 22.6333 6 19C6 15.3667 7.25833 12.2917 9.775 9.775C12.2917 7.25833 15.3667 6 19 6C22.6333 6 25.7083 7.25833 28.225 9.775C30.7417 12.2917 32 15.3667 32 19C32 20.4667 31.7667 21.85 31.3 23.15C30.8333 24.45 30.2 25.6 29.4 26.6L42 39.2L39.2 42ZM19 28C21.5 28 23.625 27.125 25.375 25.375C27.125 23.625 28 21.5 28 19C28 16.5 27.125 14.375 25.375 12.625C23.625 10.875 21.5 10 19 10C16.5 10 14.375 10.875 12.625 12.625C10.875 14.375 10 16.5 10 19C10 21.5 10.875 23.625 12.625 25.375C14.375 27.125 16.5 28 19 28Z" 
                                    fill={
                                        route().current() === "search" ? "black" : "#777"
                                    }
                                />
                            </svg>
                        </Link>
                    </div>
                </div>}

                {/* Main content area (now flex column) */}
                <div className="flex-1 flex flex-col">
                    <nav className={"border-b-2 border-gray-300 bg-white dark:border-gray-700 dark:bg-gray-800 " + (withSidebar ? "mr-4 sm:mr-6 lg:mr-8" : "mx-4 sm:mx-6 lg:mx-8")}>
                        <div className="mx-auto">
                            <div className="flex h-16 justify-between">
                                <div className="flex w-full">
                                    {!withSidebar && <div className="flex shrink-0 items-center">
                                        <Link href="/" className='border-r-2 border-gray-300 pr-5 pt-2 mr-5'>
                                            <span className='mt-2 pt-2 text-2xl apply-cursive logo-color'>M</span><span className="beta-symbol">β</span>
                                        </Link>
                                    </div>}

                                    <h1 className={"text-4xl w-auto mb-1 flex align-end items-end " + (withSidebar ? "pl-4" : "")}>
                                        {title}
                                    </h1>
                                    
                                </div>

                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <SearchBar/>
                                    <div className="relative ms-3">
                                        <Dropdown>
                                            <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md border-2 border-transparent bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none stroke-[#777] focus:stroke-black dark:bg-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                                    >
                                                        <svg className="-ms-0.5 me-2 md:w-[40px] md:h-[40px] w-[30px] h-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84285 33.8434 8 35.8783 8 38V42M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                                        </svg>

                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route('profile.view')}
                                                >
                                                    Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('profile.edit')}
                                                >
                                                    Edit Profile
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('logout')}
                                                    method="post"
                                                    as="button"
                                                >
                                                    Log Out
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
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
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800 dark:text-gray-200">
                                        Logged in as: @{user.username}
                                    </div>
                                    {/* <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div> */}
                                </div>

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
