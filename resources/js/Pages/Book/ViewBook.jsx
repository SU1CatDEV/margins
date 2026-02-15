import PrimaryButton from "@/Components/PrimaryButton";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useRef, useState, useEffect } from "react";
import BookRating from "@/Components/BookRating";
import { Link, usePage } from "@inertiajs/react";
import QuestionCard from "@/Components/QuestionCard";
import SecondaryButton from "@/Components/SecondaryButton";
import SolutionCard from "@/Components/SolutionCard";
import { averageArray } from "@/helpers";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function ViewBook({book, user, questions, solutions}) {
    const currentUser = usePage().props.auth.user;
    const likedQuestions = questions
        .filter((q) => q.liked_users.includes(currentUser.id))
        .map((q) => q.id);
    const likedSolutions = solutions
        .filter((s) => s.liked_users.includes(currentUser.id))
        .map((s) => s.id);

    const pathInfo = useRef(null);
    const pathQuestion = useRef(null);
    const pathSolution = useRef(null);
    const [infoDividerPosition, setInfoDividerPosition] = useState(0);
    const infoBarRef = useRef(null);
    const [currentlyOpenPath, setCurrentlyOpenPath] = useState(pathInfo);
    const openInfoRef = useRef(null);
    const openQuestionRef = useRef(null);
    const openSolutionRef = useRef(null);

    const [captchaError, setCaptchaError] = useState("");

    const [bookRatings, setBookRatings] = useState(book.ratings);
    const [bookQuality, setBookQuality] = useState(0);

    const { executeRecaptcha } = useGoogleReCaptcha();

    useEffect(() => {
        if (currentlyOpenPath.current === pathInfo.current) {
            pathInfo.current.setAttribute("stroke", "black");
            pathQuestion.current.setAttribute("fill", "gray");
            pathSolution.current.setAttribute("stroke", "gray");

            pathInfo.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathInfo.current.parentElement.parentElement.classList.add("border-black", "border-r-2");

            pathQuestion.current.parentElement.parentElement.classList.remove("border-black", "border-l-2");
            pathQuestion.current.parentElement.parentElement.classList.add("border-gray-300");
            
            pathSolution.current.parentElement.parentElement.classList.remove("border-black");
            pathSolution.current.parentElement.parentElement.classList.add("border-gray-300");
        } else if (currentlyOpenPath.current === pathQuestion.current) {
            pathQuestion.current.setAttribute("fill", "black");
            pathInfo.current.setAttribute("stroke", "gray");
            pathSolution.current.setAttribute("stroke", "gray");

            pathQuestion.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathQuestion.current.parentElement.parentElement.classList.add("border-black", "border-r-2", "border-l-2");

            pathInfo.current.parentElement.parentElement.classList.remove("border-black", "border-r-2");
            pathInfo.current.parentElement.parentElement.classList.add("border-gray-300");
            
            pathSolution.current.parentElement.parentElement.classList.remove("border-black", "border-l-2");
            pathSolution.current.parentElement.parentElement.classList.add("border-gray-300");
        } else if (currentlyOpenPath.current === pathSolution.current) {
            pathSolution.current.setAttribute("stroke", "black");
            pathQuestion.current.setAttribute("fill", "gray");
            pathInfo.current.setAttribute("stroke", "gray");

            pathSolution.current.parentElement.parentElement.classList.remove("border-gray-300");
            pathSolution.current.parentElement.parentElement.classList.add("border-black", "border-l-2");

            pathQuestion.current.parentElement.parentElement.classList.add("border-gray-300");
            pathQuestion.current.parentElement.parentElement.classList.remove("border-black", "border-r-2");

            pathInfo.current.parentElement.parentElement.classList.add("border-gray-300");
            pathInfo.current.parentElement.parentElement.classList.remove("border-black");
        }
    }, [currentlyOpenPath, pathInfo, pathQuestion, pathSolution]);

    useEffect(() => {
        if (currentlyOpenPath.current === pathInfo.current) {
            openInfoRef.current.classList.remove("hidden");
            openQuestionRef.current.classList.add("hidden");
            openSolutionRef.current.classList.add("hidden");
        } else if (currentlyOpenPath.current === pathQuestion.current) {
            openQuestionRef.current.classList.remove("hidden");
            openInfoRef.current.classList.add("hidden");
            openSolutionRef.current.classList.add("hidden");
        } else if (currentlyOpenPath.current === pathSolution.current) {
            openSolutionRef.current.classList.remove("hidden");
            openQuestionRef.current.classList.add("hidden");
            openInfoRef.current.classList.add("hidden");
        }
    }, [currentlyOpenPath, pathInfo, pathQuestion, pathSolution])

    function handleNavigationClick(e) {
        const closestPath = e.target.closest("button").firstChild.firstChild;
        setCurrentlyOpenPath({current: closestPath});
    }

    useEffect(() => {
        const checkScreen = () => {
            const infoBarStyle = window.getComputedStyle(infoBarRef.current, null);
            setInfoDividerPosition(`calc(${infoBarStyle.left} - ${infoBarStyle.width} / 2 + ${pathInfo.current.parentElement.parentElement.offsetWidth}px * 3)`);
        };

        checkScreen();
        
        window.addEventListener('resize', checkScreen);
        
        return () => window.removeEventListener('resize', checkScreen);
    }, []);

    useEffect(() => {
        if (book.questions_count === 0 && book.solutions_count === 0 && bookRatings.length === 0) {
            setBookQuality("?");
            return;
        }

        const qualityArray = Object.values(bookRatings).map((r) => r*2);

        if (book.questions_count) {
            qualityArray.push(book.question_quality);
        }
        if (book.solutions_count) {
            qualityArray.push(book.solution_quality);
        }

        const quality = averageArray(qualityArray).toFixed(1);
        setBookQuality(quality);
    }, [bookRatings]);

    async function openViewer() {
        const token = await executeRecaptcha("STARTEDITING");

        fetch("/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
            },
            body: JSON.stringify({token}),
          })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 422) {
                        setCaptchaError("Sorry, the reCAPTCHA failed. Please try again later!^^");
                    }
                    throw response;
                }
                window.location.replace("/viewer/" + book.id);
            })
            .catch((e) => console.log(e));
    }

    return (
        <AuthenticatedLayout title={"Book view"}>
            <div className="flex flex-col items-center mt-8 mb-5">
                <div className="rounded-xl text-4xl text-gray-500 apply-cursive bg-gray-200 w-56 h-72 flex items-center justify-center">
                    {book.title.concat(" ", book.author).split(' ').map(s => s.charAt(0).toLocaleUpperCase()).slice(0,2)}
                </div>
                <h2 className="text-2xl mt-4">{book.title}</h2>
                <div className="apply-cursive text-gray-500">{book.author}</div>
                <PrimaryButton onClick={openViewer} className="btn-large mt-2"><span className="pt-1 mr-1.5">Edit</span> <img width="25px" src="/assets/edit.svg"/></PrimaryButton>
                <p className="text-red-700 text-lg pt-2">{captchaError}</p> 
            </div>
            <div className="flex items-center relative h-14 mx-4 sm:mx-6 lg:mx-8 border-y-2 border-gray-300">
                <div className="absolute left-1/2 transform -translate-x-1/2 flex" ref={infoBarRef}>
                    <button onClick={handleNavigationClick} className="box-border border-r-2 border-l-2 border-gray-300 first lg:w-32 h-14 sm:w-28 xs:w-24 w-16 flex items-center justify-center">
                        <svg className="md:w-[40px] md:h-[40px] w-[30px] h-[30px]" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path ref={pathInfo} d="M24 32V24M24 16H24.02M44 24C44 35.0457 35.0457 44 24 44C12.9543 44 4 35.0457 4 24C4 12.9543 12.9543 4 24 4C35.0457 4 44 12.9543 44 24Z" stroke="gray" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
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
                
                <Link as="button" className="h-14 mr-2 ml-auto" href={route('report.create', book.id)}>
                    <svg className="md:w-[40px] md:h-[40px] w-[30px] h-[30px]"  viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 30C8 30 10 28 16 28C22 28 26 32 32 32C38 32 40 30 40 30V6C40 6 38 8 32 8C26 8 22 4 16 4C10 4 8 6 8 6V30ZM8 30V44" stroke="gray" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </Link>
            </div>
            <div className="mx-4 sm:mx-6 lg:mx-8">
                <div ref={openInfoRef} className="flex hidden min-h-96">
                    <div style={{width:infoDividerPosition}} className="shrink-0 px-6 py-8 min-h-96 border-r-2 border-gray-300">
                        <h2 className="text-3xl">Description:</h2>
                        <p className="text-lg text-gray-600 leading-8 mt-2">{book.description}</p>
                    </div>
                    <div className="p-8 grow-1 min-w-0">
                        <h2 className="text-3xl">Metadata:</h2>
                        <p className="text-lg text-gray-600 leading-8 mt-2">Active users: {book.active_users?.length}</p>
                        <p className="text-lg text-gray-600 leading-8 mt-2">Date created: {book.created_at.split("T")[0]}</p>
                        <p className="text-lg text-gray-600 leading-8 mt-2 capitalize">Subjects: {book.subjects.join(", ")}</p>
                        <p className="text-lg text-gray-600 leading-8 mt-2">Uploaded by: @{user ? user.username : "deleteduser"}</p>
                        <p className="text-lg text-gray-600 leading-8 mt-2">Quality: {bookQuality}/10</p>
                        <BookRating bookId={book.id} currentRating={book.ratings[currentUser.id]} className="text-lg text-gray-600 leading-8 mt-2 flex items-center" onRatingChange={(rating) => setBookRatings({...bookRatings, [currentUser.id]: rating})}>
                        </BookRating>
                    </div>
                </div>
                
                <div ref={openQuestionRef} className="hidden">
                    <div className="flex justify-between items-center px-6 pt-8 pb-7">
                        <h2 className="text-3xl">{questions.length !== 0 ? "Questions:" : "No questions yet!"}</h2>
                        <div className="flex flex-col items-end">
                            <SecondaryButton className="mb-1 btn-medium">Ask a question</SecondaryButton>
                            <p>You can also click “Edit” and highlight what you would like to ask about.</p>
                        </div>
                    </div>
                    {questions.length !== 0 && questions.map((question, id) => (
                        <a href={"/question/" + question.id} key={id}>
                            <QuestionCard question={question} liked={likedQuestions.includes(question.id)}/>
                        </a>
                    ))}
                </div>
                <div ref={openSolutionRef}className="hidden">
                    <div className="flex justify-between items-center px-6 pt-8 pb-7">
                        <h2 className="text-3xl">{solutions.length !== 0 ? "Solutions:" : "No solutions yet!"}</h2>
                        <div className="flex flex-col items-end">
                            <a href={"/ask/" + book.id}>
                                <SecondaryButton className="mb-1 btn-medium">Add a solution</SecondaryButton>
                            </a>
                        </div>
                    </div>
                    {solutions.length !== 0 && solutions.map((solution, id) => (
                        <a href={"/solution/" + solution.id} key={id}>
                            <SolutionCard solution={solution} liked={likedSolutions.includes(solution.id)}/>
                        </a>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    )
}