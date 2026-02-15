import { useEffect, useRef, useState } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { trimToLength } from "@/helpers";
import PrimaryButton from "@/Components/PrimaryButton";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function CreateSolution({book}) {
    const linkData = JSON.parse(sessionStorage.getItem("linkUIdata"));

    const { executeRecaptcha } = useGoogleReCaptcha();

    const [chapter, setChapter] = useState("");
    const [problemNum, setProblemNum] = useState("");
    const [thisBook, setThisBook] = useState(book);
    const [problemDescription, setProblemDescription] = useState(linkData ? linkData.text : "");
    const [solutionDescription, setSolutionDescription] = useState("");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [results, setResults] = useState([]);
    const [addTag, setAddTag] = useState("");
    const [tags, setTags] = useState([]);

    const resultsContainer = useRef(null);

    const perPage = 4;

    function processTagInput(event) {
        if ((event.key === "," || event.key === "Enter") && addTag.trim() !== "") {
            event.preventDefault();
            setTags([...tags, addTag.toLowerCase()]);
            setAddTag("");
        }
        else if (event.key === "Backspace" && addTag.trim() === "") {
            removeTag(tags.length - 1);
        } 
        else if (event.key === ",") {
            event.preventDefault();
            setAddTag("");
        }
    }

    function removeTag(tagId) {
        setTags(tags.filter((t, id) => id !== tagId));
    }

    async function addSolutionRequest(e) {
        e.preventDefault();
        if (!thisBook) {
            return;
        }

        const token = await executeRecaptcha("CREATESOLUTION");

        var solutionData = {
            bookId: thisBook.id,
            problemNumber: `${chapter}.${problemNum}`,
            problemText: problemDescription,
            solutionText: solutionDescription,
            keywords: tags,
            token
        };
        if (linkData) {
            solutionData = {
                ...solutionData,
                ...linkData
            };
        }
        
        fetch("/solution/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                .content,
            },
            body: JSON.stringify(solutionData),
          })
            .then(response => response.json())
            .then(responseData => {
                sessionStorage.clear("linkUIdata");
                window.location.href = "/solution/" + responseData.solution.id;
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
            title={"Add a solution"}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Add a solution
                </h2>
            }
        >
            <Head title="Add a solution" />
            <div className="mx-4 sm:mx-6 lg:mx-8 py-6 flex justify-center">
                <form className="w-full lg:w-[75%] block" onSubmit={e => addSolutionRequest(e)}>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 mb-4">
                        <div className="flex flex-col">
                            <label className="text-xl apply-cursive">Chapter</label>
                            <input className="rounded-lg border-2 border-gray-300" value={chapter} onChange={e => setChapter(parseInt(e.target.value))} type="number" min={0}/>
                        </div>
                        <div className="flex flex-col">
                            <label className="text-xl apply-cursive">Problem #</label>
                            <input className="rounded-lg border-2 border-gray-300" value={problemNum} onChange={e => setProblemNum(parseInt(e.target.value))} type="number" min={0}/>
                        </div>
                    </div>
                    <label className="text-xl" htmlFor="title">Keywords</label>
                    <div className={"flex flex-wrap rounded-lg border-2 border-gray-300 mb-4 min-h-6 px-3 focus-within:ring-1 focus-within:ring-blue-600 focus-within:border-blue-600 " + (tags && tags.length !== 0 ? "pb-2" : "py-2")}>
                        {tags.map((tag, index) => (
                            <div key={index} onClick={() => {removeTag(index)}} className="bg-gray-300 hover:bg-gray-200 px-5 mr-2 mt-2 rounded-lg flex items-center">
                                <span className="mr-2 whitespace-nowrap">{tag}</span>
                                <svg className="mt-0.5" width="16" height="16" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M36 12L12 36M12 12L36 36" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </div>
                        ))}
                        
                        <input 
                            className={"flex-1 min-w-[50px] h-full p-0 border-0 outline-none focus:outline-none focus:ring-0 focus:border-0 focus:shadow-none " + (tags && tags.length !== 0 ? "mt-2" : "")}
                            maxLength={30} 
                            id="title" 
                            value={addTag} 
                            onChange={e => setAddTag(e.target.value)} 
                            onKeyDown={processTagInput}
                        />
                    </div>
                    
                    <div className="mb-6 relative">
                        <label htmlFor="booksearch" className="text-xl">Select book</label>
                        <input id="booksearch" className="w-full z-10 relative rounded-lg border-2 border-gray-300" value={query} onBlur={hidePopup} onInput={e => setQuery(e.target.value)} onKeyDown={search}/>
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
                    <label htmlFor="desc" className="text-xl">Problem text</label>
                    <p className="text-wrap text-gray-600 apply-cursive">This should be a direct quote from the book. If clarifications are necessary, write them in the solution text.</p>
                    <textarea required className="w-full rounded-lg border-2 border-gray-300 mb-4 scrollbar" id="desc" maxLength={5000} value={problemDescription} onChange={e => setProblemDescription(e.target.value)}/>
                    <label htmlFor="desc" className="text-xl">Solution text</label>
                    <p className="text-wrap text-gray-600 apply-cursive">Your solution should only reference information given by the book up to this point. If you must include outside information, add clear citations.</p>
                    <textarea required className="w-full rounded-lg border-2 border-gray-300 mb-4 scrollbar" id="desc" maxLength={5000} value={solutionDescription} onChange={e => setSolutionDescription(e.target.value)}/>
                    <PrimaryButton className="btn-large" disabled={!thisBook || (!chapter && chapter !== 0) || (!problemNum && problemNum !== 0) || !problemDescription || !solutionDescription}>Submit</PrimaryButton>
                </form>
            </div>
            
        </AuthenticatedLayout>
    );
}