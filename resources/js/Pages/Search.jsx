import BookCard from "@/Components/BookCard";
import QuestionCard from "@/Components/QuestionCard";
import SolutionCard from "@/Components/SolutionCard";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";

export default function Search() {
    const currentUser = usePage().props.auth.user;

    const [searchWhat, setSearchWhat] = useState("books");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [bookResults, setBookResults] = useState([]);
    const [quesolResults, setQuesolResults] = useState([]);
    const noResults = useRef(null);
    const errorResult = useRef(null);
    const moreButton = useRef(null);
    const booksContainer = useRef(null);
    const quesolsContainer = useRef(null);

    const perPage = 8;

    async function search(event) {
        errorResult.current.classList.add("hidden");
        noResults.current.classList.add("hidden");
        moreButton.current.classList.add("hidden");

        if ((event.key === "Enter" || event.type === "click") && query.trim() != "") {
            setBookResults([]);
            setQuesolResults([]);
            booksContainer.current.classList.add("hidden");
            quesolsContainer.current.classList.add("hidden");
            await fetch(`/search/${searchWhat}`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({query, searchWhat, page: 1, perPage}),
            })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(responseData => {
                if (responseData.entries?.data.length === 0) {
                    noResults.current.classList.remove("hidden");
                    setBookResults([]);
                    setQuesolResults([]);
                }
                if (responseData.hasMore) {
                    moreButton.current.classList.remove("hidden");
                }
                setPage(1);
                if (searchWhat === "books") {
                    booksContainer.current.classList.remove("hidden");
                    return setBookResults(responseData.entries.data);
                } else {
                    quesolsContainer.current.classList.remove("hidden");
                    return setQuesolResults(responseData.entries.data);
                }
                
            }).catch((e) => {
                errorResult.current.classList.remove("hidden");
                console.error(e);
            });
        }
    }

    function changeSearchWhat(e) {
        setBookResults([]);
        setQuesolResults([]);
        errorResult.current.classList.add("hidden");
        noResults.current.classList.add("hidden");
        moreButton.current.classList.add("hidden");
        setSearchWhat(e.target.value);
    }

    async function loadMore() {
        await fetch(`/search/${searchWhat}`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({query, searchWhat, page: page + 1, perPage}),
        })
        .then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		})
        .then(responseData => {
            if (!responseData.hasMore) {
                moreButton.current.classList.add("hidden");
            }
            setPage(page + 1);
            if (searchWhat === "books") {
                return setBookResults([...bookResults, ...responseData.entries.data]);
            } else {
                return setQuesolResults([...quesolResults, ...responseData.entries.data]);
            }
        }).catch((e) => {
            errorResult.current.classList.remove("hidden");
            console.error(e);
        });
    }

    return (
        <div className="mx-4 sm:mx-6 lg:mx-8 py-6">
            <div className="w-full hd:max-w-[75%]">
                <h2 className="text-3xl">Search {searchWhat}</h2>
                <div className="w-full flex mb-5">
                    <input name="search" value={query} onInput={(e) => setQuery(e.target.value)} onKeyDown={search} type="text" className="w-full rounded-l-lg border-gray-300 border-2" />
                    <select 
                        className="rounded-r-lg border-l-0 border-gray-300 border-2 text-gray-900 text-sm focus:ring-blue-600 focus:border-blue-600 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        value={searchWhat}
                        onChange={changeSearchWhat}
                        name="selectsearchwhat"
                    >
                        <option value="books">Books</option>
                        <option value="questions">Questions</option>
                        <option value="solutions">Solutions</option>
                    </select>
                </div>
                <div className="hidden text-center w-full bg-red-200 border-2 border-red-300 rounded-lg py-2 px-3 mb-5" ref={errorResult}>
                    An error occured, try reloading the page.
                </div>
                <div className="hidden text-center w-full bg-orange-200 rounded-lg px-3 py-2 border-2 border-orange-300" ref={noResults}>
                    No results found
                </div>
                <div className="hidden bookscontainer flex flex-col items-center sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" ref={booksContainer}>
                    {bookResults.map((book, id) => (
                        <div key={id} className="mb-4">
                            <BookCard book={book}/>
                        </div>
                    ))}
                </div>
                <button className="hidden text-center w-full bg-blue-200 rounded-lg px-3 py-2 border-2 border-blue-300" onClick={loadMore} ref={moreButton}>
                    Load more...
                </button>
            </div>
            <div className="hidden quesolscontainer w-full" ref={quesolsContainer}>
                {
                    searchWhat === "questions" ? 
                    quesolResults.map((question, id) => (
                        <div key={id}>
                            <QuestionCard question={question} liked={question.liked_users.includes(currentUser.id)}/>
                        </div>
                    )) : quesolResults.map((solution, id) => (
                        <div key={id}>
                            <SolutionCard solution={solution} liked={solution.liked_users.includes(currentUser.id)}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

Search.layout = (page) => {
    return <AuthenticatedLayout
        title={"Search"}
        withSidebar={true}
    >
        {page}
    </AuthenticatedLayout>
}

// TODO: fix the messages disappearing when navigating with tab.