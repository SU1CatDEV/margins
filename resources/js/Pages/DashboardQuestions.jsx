import PrimaryButton from '@/Components/PrimaryButton';
import QuestionCard from '@/Components/QuestionCard';
import { getMore } from '@/helpers';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';

export default function DashboardQuestions({questions}) {
    const currentUser = usePage().props.auth.user;
    const [thisQuestions, setThisQuestions] = useState(questions.data);
    const page = useRef(2);
    const moreButton = useRef(null);

    async function getMoreQuestions() {
        const gottenQuestions = await getMore("question", page.current, 5, 5);
        setThisQuestions([...thisQuestions, ...gottenQuestions.data]);
        page.current++;
        if (!gottenQuestions.hasMore) {
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
                            {questions.data && questions.data.length !== 0 ? "Your questions:" : "No questions yet!"}
                        </h2>
                        <a href="/ask"><PrimaryButton className='btn-large'>Ask</PrimaryButton></a>
                    </div>
                    
                    {thisQuestions.map((question, id) => (
                        <a href={"/question/" + question.id} key={id}>
                            <QuestionCard question={question} liked={question.liked_users.includes(currentUser.id)}/>
                        </a>
                    ))}

                    <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!questions.hasMore ? "hidden" : "")} onClick={getMoreQuestions} ref={moreButton}>
                        Load more...
                    </button>
                </div>
            </div>
        </>
    )
}

DashboardQuestions.layout = (page) => {
    return <AuthenticatedLayout
        title={"Dashboard"}
        withSidebar={true}
    >
        {page}
    </AuthenticatedLayout>
}
