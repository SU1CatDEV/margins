import BookCard from '@/Components/BookCard';
import { getMore } from '@/helpers';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DashboardBooks({books}) {
    const [thisBooks, setThisBooks] = useState(books.data);
    const page = useRef(2);
    const moreButton = useRef(null);

    async function getMoreBooks() {
        const gottenBooks = await getMore("book", page.current, 10, 9);
        setThisBooks([...thisBooks, ...gottenBooks.data]);
        page.current++;
        if (!gottenBooks.hasMore) {
            moreButton.current.classList.add("hidden");
        }
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex-1 mx-4 sm:mx-6 lg:mx-8 py-8">
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 hd:grid-cols-5'>
                    {thisBooks.map((book, id) => (
                        <div className='flex justify-center mb-4' key={id}>
                            <BookCard book={book}/>
                        </div>
                    ))}
                    <div className='flex justify-center'>
                        <a href="/book/create" className='flex flex-col items-center'>
                            <div className="rounded-lg text-3xl text-gray-500 apply-cursive border-2 border-gray-200 hover:bg-gray-100 transition duration-[300ms] w-48 h-60 flex items-center justify-center">
                                <svg width="40" height="40" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path className='stroke-gray-500' d="M24 16V32M16 24H32M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                            <span className="mt-4 text-lg" role="heading" aria-level="3">Add book</span>
                        </a>
                    </div>
                </div>
                <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!books.hasMore ? "hidden" : "")} onClick={getMoreBooks} ref={moreButton}>
                    Load more...
                </button>
            </div>
        </>
    )
}

DashboardBooks.layout = (page) => {
    return <AuthenticatedLayout
        title={"Dashboard"}
        withSidebar={true}
    >
        {page}
    </AuthenticatedLayout>
}
