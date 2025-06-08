import { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { trimToLength } from "@/helpers";
import PrimaryButton from "@/Components/PrimaryButton";

export default function CreateProblem({book}) {
    const linkData = JSON.parse(sessionStorage.getItem("linkUIdata"));

    const [thisBook, setThisBook] = useState(book);
    const [questionTitle, setQuestionTitle] = useState(linkData ? `Please annotate: "${trimToLength(linkData.text, 100-19)}"` : "");
    const [questionDescription, setQuestionDescription] = useState(linkData ? linkData.text : "");
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    const resultsContainer = useRef(null);

    const perPage = 4;

function addQuestionRequest(e) {
    e.preventDefault();
    if (!thisBook) {
        return;
    }
    var questionData = {
        bookId: thisBook.id,
        title: questionTitle,
        text: questionDescription
    };
    if (linkData) {
        questionData = {
            ...questionData,
            ...linkData
        };
    }
    fetch("/question/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
            .content,
        },
        body: JSON.stringify(questionData),
    })
    .then(response => response.json())
    .then(responseData => {
        sessionStorage.clear("linkUIdata");
        window.location.href = "/question/" + responseData.question.id;
    })
    .catch((e) => console.log(e));
}

    async function search(event) {
        if (event.key !== "Backspace" && event.key !== "Delete" && query.trim() != "") {
            await fetch(`/search/books`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({query, page: 1, perPage}),
            })
            .then(response => response.json())
            .then(responseData => {
                if (responseData.entries.data.length !== 0) {
                    resultsContainer.current.classList.remove("hidden");
                }
                return setResults(responseData.entries.data);
            }).catch((e) => {
                console.error(e);
            });
        }
    }

    function hidePopup(e) {
        if (!resultsContainer.current.contains(e.relatedTarget)) {
            resultsContainer.current.classList.add("hidden");
            setResults([]);
        }
    }

    return (
        <AuthenticatedLayout
            title={"Ask a question"}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Ask a question
                </h2>
            }
        >
            <Head title="Ask a question" />
            <div className="mx-4 sm:mx-6 lg:mx-8 py-6 flex justify-center">
                <form className="max-w-full lg:max-w-[75%]" onSubmit={e => addQuestionRequest(e)}>
                    <label className="text-xl" htmlFor="title">Title</label>
                    <input required className="w-full rounded-lg border-2 border-gray-300 mb-4" maxLength={100} id="title" value={questionTitle} onChange={e => setQuestionTitle(e.target.value)}/>
                    <div className="mb-6">
                        <label htmlFor="booksearch" className="text-xl">Select book</label>
                        <input id="booksearch" className="w-full relative z-10 rounded-lg border-2 border-gray-300" value={query} onBlur={hidePopup} onInput={e => setQuery(e.target.value)} onKeyDown={search}/>
                        <div className="hidden bookresults absolute w-full bg-white rounded-b-lg -mt-3 pt-2 border-2 border-gray-300 border-gray-300 border" ref={resultsContainer}>
                            {results.map((book) => (
                                <a onClick={(e) => {e.preventDefault(); setThisBook(book); hidePopup(e)}} href="" className="block px-3 py-2 first:pt-4 no-underline hover:bg-gray-100 transition duration-200 ease-in-out" key={book.id}>
                                    <div className="text-lg" role="heading" aria-level="2">{book.title}</div>
                                    <div className="apply-cursive text-sm text-gray-500">{book.author}</div>
                                    <div className="apply-cursive">{trimToLength(book.description, 50)}</div>
                                </a>
                            ))}
                        </div>
                    </div>
                    {thisBook ? 
                    <div className="flex apply-cursive items-center mb-4">
                        <span className="text-lg pr-4">Selected book:</span>
                        <a href={"/book/" + thisBook.id} className="selectedbook border-2 border-gray-300 hover:bg-gray-50 transition duration-200 rounded-lg max-w-fit py-4 pl-4 pr-6">
                            <div className="text-lg" role="heading" aria-level="2">{thisBook.title}</div>
                            <div className="apply-cursive text-sm text-gray-500">{thisBook.author}</div>
                            <div className="apply-cursive">{trimToLength(thisBook.description, 50)}</div>
                        </a>
                    </div> : ""}
                    <label htmlFor="desc" className="text-xl">Question text</label>
                    <p className="text-wrap text-gray-600 apply-cursive">Your question should reference the book, with chapter/section and either direct or paraphrased quote, so others can better understand and answer your question.</p>
                    <textarea required className="w-full scrollbar rounded-lg border-2 border-gray-300 mb-4" id="desc" maxLength={5000} value={questionDescription} onChange={e => setQuestionDescription(e.target.value)}/>
                    <PrimaryButton className="btn-large" disabled={!thisBook || !questionTitle || !questionDescription}>Ask</PrimaryButton>
                </form>
            </div>
            
        </AuthenticatedLayout>
    );
}