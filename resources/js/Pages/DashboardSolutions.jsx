import PrimaryButton from '@/Components/PrimaryButton';
import SolutionCard from '@/Components/SolutionCard';
import { getMore } from '@/helpers';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DashboardSolutions({solutions}) {
    const currentUser = usePage().props.auth.user;
    const [thisSolutions, setThisSolutions] = useState(solutions.data);
    const page = useRef(2);
    const moreButton = useRef(null);

    async function getMoreSolutions() {
        const gottenSolutions = await getMore("solution", page.current, 5, 5);
        setThisSolutions([...thisSolutions, ...gottenSolutions.data]);
        page.current++;
        if (!gottenSolutions.hasMore) {
            moreButton.current.classList.add("hidden");
        }
    }

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex-1">
                <div className='mx-4 sm:mx-6 lg:mx-8 py-6'>
                    <div className='flex justify-between items-end mb-5'>
                        <h2 className="text-3xl">
                            {solutions.data && solutions.data.length !== 0 ? "Your solutions:" : "No solutions yet!"}
                        </h2>
                        <a href="/solve"><PrimaryButton className='btn-large'>Add</PrimaryButton></a>
                    </div>
                    
                    {solutions.data.map((solution, id) => (
                        <a href={"/solution/" + solution.id}key={id}>
                            <SolutionCard solution={solution} liked={solution.liked_users.includes(currentUser.id)}/>
                        </a>
                    ))}
                    <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!solutions.hasMore ? "hidden" : "")} onClick={getMoreSolutions} ref={moreButton}>
                        Load more...
                    </button>
                </div>
            </div>
        </>
    )
}

DashboardSolutions.layout = (page) => {
    return <AuthenticatedLayout
        title={"Dashboard"}
        withSidebar={true}
    >
        {page}
    </AuthenticatedLayout>
}
