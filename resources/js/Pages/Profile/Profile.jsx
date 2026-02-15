import BookCard from '@/Components/BookCard';
import QuestionCard from '@/Components/QuestionCard';
import SolutionCard from '@/Components/SolutionCard';
import { averageArray, getMore } from '@/helpers';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Profile({ profileInfo, books, questions, solutions }) {
    const pathBook = useRef(null);
    const pathQuestion = useRef(null);
    const pathSolution = useRef(null);

    const infoBarRef = useRef(null);
    const [currentlyOpenPath, setCurrentlyOpenPath] = useState(pathBook);

    const openBookRef = useRef(null);
    const openQuestionRef = useRef(null);
    const openSolutionRef = useRef(null);

    const currentUser = usePage().props.auth.user;
    const [userRating, setUserRating] = useState("?");

    const pageBook = useRef(2);
    const pageQuestion = useRef(2);
    const pageSolution = useRef(2);

    const [thisBooks, setThisBooks] = useState(books.data);
    const [thisQuestions, setThisQuestions] = useState(questions.data);
    const [thisSolutions, setThisSolutions] = useState(solutions.data);

    const moreBooksButton = useRef(null);
    const moreQuestionsButton = useRef(null);
    const moreSolutionsButton = useRef(null);

    async function getMoreBooks() {
        const gottenBooks = await getMore("book", pageBook.current, 5, 5);
        setThisBooks([...thisBooks, ...gottenBooks.data]);
        pageBook.current++;
        if (!gottenBooks.hasMore) {
            moreBooksButton.current.classList.add("hidden");
        }
    }

    async function getMoreQuestions() {
        const gottenQuestions = await getMore("question", pageQuestion.current, 5, 5);
        setThisQuestions([...thisQuestions, ...gottenQuestions.data]);
        pageQuestion.current++;
        if (!gottenQuestions.hasMore) {
            moreQuestionsButton.current.classList.add("hidden");
        }
    }

    async function getMoreSolutions() {
        const gottenSolutions = await getMore("solution", pageSolution.current, 5, 5);
        setThisSolutions([...thisSolutions, ...gottenSolutions.data]);
        pageSolution.current++;
        if (!gottenSolutions.hasMore) {
            moreSolutionsButton.current.classList.add("hidden");
        }
    }

    useEffect(() => {
        const qualityArray = [];
        if (profileInfo.books_count) {
            qualityArray.push(profileInfo.book_quality);
        }
        if (profileInfo.questions_count) {
            qualityArray.push(profileInfo.question_quality);
        }
        if (profileInfo.solutions_count) {
            qualityArray.push(profileInfo.solution_quality);
        }
        setUserRating(averageArray(qualityArray)); 
    }, [])

    useEffect(() => {
        if (currentlyOpenPath.current === pathBook.current) {
            pathBook.current.setAttribute("stroke", "black");
            pathQuestion.current.setAttribute("fill", "gray");
            pathSolution.current.setAttribute("stroke", "gray");
            

            pathBook.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathBook.current.parentElement.parentElement.classList.add("border-black", "border-r-2");

            pathQuestion.current.parentElement.parentElement.classList.remove("border-black", "border-l-2");
            pathQuestion.current.parentElement.parentElement.classList.add("border-gray-300");
            
            pathSolution.current.parentElement.parentElement.classList.remove("border-black");
            pathSolution.current.parentElement.parentElement.classList.add("border-gray-300");
        } else if (currentlyOpenPath.current === pathQuestion.current) {
            pathQuestion.current.setAttribute("fill", "black");
            pathBook.current.setAttribute("stroke", "gray");
            pathSolution.current.setAttribute("stroke", "gray");

            pathQuestion.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathQuestion.current.parentElement.parentElement.classList.add("border-black", "border-r-2", "border-l-2");

            pathBook.current.parentElement.parentElement.classList.remove("border-black", "border-r-2");
            pathBook.current.parentElement.parentElement.classList.add("border-gray-300");
            
            pathSolution.current.parentElement.parentElement.classList.remove("border-black", "border-l-2");
            pathSolution.current.parentElement.parentElement.classList.add("border-gray-300");
        } else if (currentlyOpenPath.current === pathSolution.current) {
            pathSolution.current.setAttribute("stroke", "black");
            pathQuestion.current.setAttribute("fill", "gray");
            pathBook.current.setAttribute("stroke", "gray");

            pathSolution.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathSolution.current.parentElement.parentElement.classList.add("border-black", "border-l-2");

            pathQuestion.current.parentElement.parentElement.classList.add("border-gray-300");
            pathQuestion.current.parentElement.parentElement.classList.remove("border-black", "border-r-2");

            pathBook.current.parentElement.parentElement.classList.add("border-gray-300");
            pathBook.current.parentElement.parentElement.classList.remove("border-black");
        }
    }, [currentlyOpenPath, pathBook, pathQuestion, pathSolution]);

    useEffect(() => {
        if (currentlyOpenPath.current === pathBook.current) {
            openBookRef.current.classList.remove("hidden");
            openQuestionRef.current.classList.add("hidden");
            openSolutionRef.current.classList.add("hidden");
        } else if (currentlyOpenPath.current === pathQuestion.current) {
            openQuestionRef.current.classList.remove("hidden");
            openBookRef.current.classList.add("hidden");
            openSolutionRef.current.classList.add("hidden");
        } else if (currentlyOpenPath.current === pathSolution.current) {
            openSolutionRef.current.classList.remove("hidden");
            openQuestionRef.current.classList.add("hidden");
            openBookRef.current.classList.add("hidden");
        }
    }, [currentlyOpenPath, pathBook, pathQuestion, pathSolution])

    function handleNavigationClick(e) {
        const closestPath = e.target.closest("button").firstChild.firstChild;
        setCurrentlyOpenPath({current: closestPath});
    }

    return (
        <AuthenticatedLayout
            title={"Profile"}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Profile
                </h2>
            }
        >
            <div className='mx-4 sm:mx-6 lg:mx-8'>
                <div className={'pt-24 pb-16 px-4 flex flex-col sm:px-12 lg:px-24 md:flex-row'}>
                    <div className={'flex border-space items-center min-w-[50%] pr-10 border-gray-300 ' + (profileInfo.bio ? 'border-b-2 pb-8 md:border-r-2 md:border-b-0 md:pb-0' : '')}>
                        <div className='rounded-full w-48 h-48 hidden xs:flex bg-gray-200 justify-center items-center overflow-hidden'>
                            <svg className='w-48 w-48 pt-10' viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84285 33.8434 8 35.8783 8 38V42M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z" stroke="#777777" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className='flex flex-col justify-center pl-4 xs:pl-8'>
                            <div className='useridentity'>
                                <div className='flex mainidentifier'>
                                    <h2 className='text-3xl'>
                                        {
                                            profileInfo.username === profileInfo.name || !profileInfo.name ? 
                                            `@${profileInfo.username}`
                                             : 
                                            profileInfo.name
                                        }
                                    </h2>
                                    <span className='apply-cursive mb-1 ml-4 mt-2'>{profileInfo.pronouns}</span>
                                </div>
                                {!(profileInfo.username === profileInfo.name || !profileInfo.name) && <h3 className='text-gray-600 text-lg -mt-2'>@{profileInfo.username}</h3>}
                            </div>
                            <div className='userinfo'>
                                {profileInfo.education && <p>Education: {profileInfo.education}</p>}
                                {profileInfo.work && <p>Work: {profileInfo.work}</p>}
                                {/* <p>User rating: {userRating}/10</p> */}
                                <p>Joined: {profileInfo.created_at.split("T")[0]}</p>
                            </div>
                        </div>
                    </div>
                    <div className={'border-space mt-8 shrink-1 grow-0 ' + (profileInfo.bio ? '' : 'hidden')}>
                        <div className="pl-4 md:pl-10">
                            <h2 className='text-2xl'>About me:</h2>
                            <p>{profileInfo.bio}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center relative border-y-2 border-gray-300 h-14">
                    <div className="absolute left-1/2 transform -translate-x-1/2 flex" ref={infoBarRef}>
                        <button onClick={handleNavigationClick} className="box-border border-r-2 border-l-2 border-gray-300 first lg:w-32 h-14 sm:w-28 xs:w-24 w-16 flex items-center justify-center">
                            <svg className="md:w-[40px] md:h-[40px] w-[30px] h-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path ref={pathBook} d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="gray" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button onClick={handleNavigationClick} className="box-border border-r-2 border-gray-300 second lg:w-32 h-14 sm:w-28 xs:w-24 w-16 flex items-center justify-center">
                            <svg className="md:w-[20px] md:h-[35px] w-[16px] h-[30px]" viewBox="0 0 21 37" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path ref={pathQuestion} d="M7.93182 26.1818V25.9773C7.95455 23.8068 8.18182 22.0795 8.61364 20.7955C9.04545 19.5114 9.65909 18.4716 10.4545 17.6761C11.25 16.8807 12.2045 16.1477 13.3182 15.4773C13.9886 15.0682 14.5909 14.5852 15.125 14.0284C15.6591 13.4602 16.0795 12.8068 16.3864 12.0682C16.7045 11.3295 16.8636 10.5114 16.8636 9.61364C16.8636 8.5 16.6023 7.53409 16.0795 6.71591C15.5568 5.89773 14.858 5.26704 13.983 4.82386C13.108 4.38068 12.1364 4.15909 11.0682 4.15909C10.1364 4.15909 9.23864 4.35227 8.375 4.73864C7.51136 5.125 6.78977 5.73295 6.21023 6.5625C5.63068 7.39204 5.29545 8.47727 5.20455 9.81818H0.909091C1 7.88636 1.5 6.23295 2.40909 4.85795C3.32955 3.48295 4.53977 2.43182 6.03977 1.70454C7.55114 0.977271 9.22727 0.613635 11.0682 0.613635C13.0682 0.613635 14.8068 1.01136 16.2841 1.80682C17.7727 2.60227 18.9205 3.69318 19.7273 5.07954C20.5455 6.46591 20.9545 8.04545 20.9545 9.81818C20.9545 11.0682 20.7614 12.1989 20.375 13.2102C20 14.2216 19.4545 15.125 18.7386 15.9205C18.0341 16.7159 17.1818 17.4205 16.1818 18.0341C15.1818 18.6591 14.3807 19.3182 13.7784 20.0114C13.1761 20.6932 12.7386 21.5057 12.4659 22.4489C12.1932 23.392 12.0455 24.5682 12.0227 25.9773V26.1818H7.93182ZM10.1136 36.2727C9.27273 36.2727 8.55114 35.9716 7.94886 35.3693C7.34659 34.767 7.04545 34.0455 7.04545 33.2045C7.04545 32.3636 7.34659 31.642 7.94886 31.0398C8.55114 30.4375 9.27273 30.1364 10.1136 30.1364C10.9545 30.1364 11.6761 30.4375 12.2784 31.0398C12.8807 31.642 13.1818 32.3636 13.1818 33.2045C13.1818 33.7614 13.0398 34.2727 12.7557 34.7386C12.483 35.2045 12.1136 35.5795 11.6477 35.8636C11.1932 36.1364 10.6818 36.2727 10.1136 36.2727Z" fill="gray"/>
                            </svg>
                        </button>
                        <button onClick={handleNavigationClick} className="box-border border-r-2 border-gray-300 third lg:w-32 h-14 sm:w-28 xs:w-24 w-16 flex items-center justify-center">
                            <svg className="md:w-[40px] md:h-[40px] w-[30px] h-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path ref={pathSolution} d="M18 22L24 28L44 8M42 24V38C42 39.0609 41.5786 40.0783 40.8284 40.8284C40.0783 41.5786 39.0609 42 38 42H10C8.93913 42 7.92172 41.5786 7.17157 40.8284C6.42143 40.0783 6 39.0609 6 38V10C6 8.93913 6.42143 7.92172 7.17157 7.17157C7.92172 6.42143 8.93913 6 10 6H32" stroke="gray" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>

                <div className='hidden px-6 pb-10' ref={openBookRef}>
                    <h2 className="text-3xl pt-8 pb-7">{books.data.length !== 0 ? "Books:" : "No books yet!"}</h2>
                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 hd:grid-cols-5 pb-2'>
                        {thisBooks.map((book, id) => (
                            <div className='flex justify-center mb-4' key={id}>
                                <BookCard book={book}/>
                            </div>
                        ))}
                    </div>
                    <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!books.hasMore ? "hidden" : "")} onClick={getMoreBooks} ref={moreBooksButton}>
                        Load more...
                    </button>
                </div>
                <div className='hidden pb-6' ref={openQuestionRef}>
                    <h2 className="text-3xl px-6 pt-8 pb-6">{questions.data.length !== 0 ? "Questions:" : "No questions yet!"}</h2>
                    {thisQuestions.map((question, id) => (
                        <a href={"/question/" + question.id} key={id}>
                            <QuestionCard question={question} liked={question.liked_users.includes(currentUser.id)}/>
                        </a>
                    ))}
                    <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!questions.hasMore ? "hidden" : "")} onClick={getMoreQuestions} ref={moreQuestionsButton}>
                        Load more...
                    </button>
                </div>
                <div className='hidden pb-6' ref={openSolutionRef}>
                    <h2 className="text-3xl px-6 pt-8 pb-6">{solutions.data.length !== 0 ? "Solutions:" : "No solutions yet!"}</h2>
                    {thisSolutions.map((solution, id) => (
                        <a href={"/solution/" + solution.id} key={id}>
                            <SolutionCard solution={solution} liked={solution.liked_users.includes(currentUser.id)}/>
                        </a>
                    ))}
                    <button className={"text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300 " + (!solutions.hasMore ? "hidden" : "")} onClick={getMoreSolutions} ref={moreSolutionsButton}>
                        Load more...
                    </button>
                </div>
            </div>
            
        </AuthenticatedLayout>
    );
}
