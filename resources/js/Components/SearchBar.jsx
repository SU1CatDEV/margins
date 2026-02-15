import Dropdown from "@/Components/Dropdown";
import { useEffect, useRef, useState, useMemo } from "react";
import { trimToLength } from "@/helpers";

export default function SearchBar() {
    const [query, setQuery] = useState("");
    const [searchWhat, setSearchWhat] = useState("books");
    const [searchResults, setSearchResults] = useState([]);
    const [page, setPage] = useState(1);
    const [shouldRound, setShouldRound] = useState("default");
    const searchPopup = useRef(null);
    const moreButton = useRef(null);
    const noResults = useRef(null);
    const errorResult = useRef(null);
    const searchBooksHelp = useRef(null);
    const searchQuestionsHelp = useRef(null);
    const searchSolutionsHelp = useRef(null);
    const perPage = 4;

    async function search(event) {
        if (event.key === "Tab") {
            return;
        }

        if (event.key === "Enter" || event.type === "click") {
            errorResult.current.classList.add("hidden");
            noResults.current.classList.add("hidden");
            moreButton.current.classList.add("hidden");
            searchBooksHelp.current.classList.add("hidden");
            searchQuestionsHelp.current.classList.add("hidden");
            searchSolutionsHelp.current.classList.add("hidden");
        }

        if (searchBooksHelp.current.classList.contains("hidden") && 
            searchQuestionsHelp.current.classList.contains("hidden") && 
            searchSolutionsHelp.current.classList.contains("hidden") &&
            searchResults.length === 0) {
            setShouldRound(true);
        } else {
            setShouldRound(false);
        }

        if ((event.key === "Enter" || event.type === "click") && query.trim() != "") {
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
                    setShouldRound(false);
                    noResults.current.classList.remove("hidden");
                    return setSearchResults([]);
                }
                if (responseData.hasMore) {
                    setShouldRound(false);
                    moreButton.current.classList.remove("hidden");
                }
                setPage(1);
                return setSearchResults(responseData.entries.data);
            }).catch((e) => {
                setShouldRound(false);
                errorResult.current.classList.remove("hidden");
                console.error(e);
            });
        }
    }

    function showSearchHelp(valueToCompare) {
        if (valueToCompare === "books") {
            searchQuestionsHelp.current.classList.add("hidden");
            searchSolutionsHelp.current.classList.add("hidden");
            searchBooksHelp.current.classList.remove("hidden");
        } else if (valueToCompare === "questions") {
            searchBooksHelp.current.classList.add("hidden");
            searchSolutionsHelp.current.classList.add("hidden");
            searchQuestionsHelp.current.classList.remove("hidden");
        } else if (valueToCompare === "solutions") {
            searchBooksHelp.current.classList.add("hidden");
            searchQuestionsHelp.current.classList.add("hidden");
            searchSolutionsHelp.current.classList.remove("hidden");
        }
    }

    function switchSearchWhat(newValue) {
        setSearchResults([]);
        showSearchHelp(newValue);
        setSearchWhat(newValue);
        errorResult.current.classList.add("hidden");
        noResults.current.classList.add("hidden");
        moreButton.current.classList.add("hidden");
    }

    function showPopup() {
        searchPopup.current.classList.remove("hidden");
        errorResult.current.classList.add("hidden");
        noResults.current.classList.add("hidden");
        moreButton.current.classList.add("hidden");
        if (searchResults.length === 0) {
            showSearchHelp(searchWhat);
            setShouldRound(false);
        }
    }
    
    function hidePopup(e) {
        if (!searchPopup.current.contains(e.relatedTarget)) {
            searchPopup.current.classList.add("hidden");
            setSearchResults([]);
        }
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
                setShouldRound(true);
                moreButton.current.classList.add("hidden");
            }
            setPage(page + 1);
            return setSearchResults([...searchResults, ...responseData.entries.data]);
        }).catch((e) => {
            setShouldRound(false);
            errorResult.current.classList.remove("hidden");
            console.error(e);
        });
    }

    const roundingClass = useMemo(() => {
        if (shouldRound) {
            return "rounded-lg";
        }
        return "rounded-t-lg";
    }, [shouldRound, searchResults])

    return (
        <div>
            <input className="rounded-lg border-2 border-gray-300" name="navsearch" onFocus={showPopup} onBlur={hidePopup} value={query} onInput={e => setQuery(e.target.value)} onKeyDown={e => search(e)}/>
            <div className="hidden absolute mt-2 w-64 rounded-lg bg-white z-[999]" ref={searchPopup}>
                <div className={"border-2 border-gray-300 " + roundingClass}>
                    <div className={searchResults.length === 0 ? "" : "border-b-gray-300 border-b"}>
                        <select 
                            name="navselectsearchtype"
                            onBlur={hidePopup} 
                            className={"relative z-10 w-full border-2 border-none text-gray-900 text-sm focus:ring-blue-600 focus:border-blue-600 block dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 pb-1 " + roundingClass}
                            value={searchWhat} 
                            onChange={e => switchSearchWhat(e.target.value)}
                        >
                            <option value="books">Books</option>
                            <option value="questions">Questions</option>
                            <option value="solutions">Solutions</option>
                        </select>
                    </div>
                    <div className="results max-h-[355.2px] overflow-y-scroll scrollbar divide-y divide-gray-300 divide-solid">
                        {searchResults.map(elem => {
                            if (searchWhat === "books") {
                                return (<a className="block px-3 py-2 no-underline hover:bg-gray-100 transition duration-200 ease-in-out" key={elem.id} href={"/book/" + elem.id}>
                                    <div className="text-lg" role="heading" aria-level="2">{elem.title}</div>
                                    <div className="apply-cursive text-sm text-gray-500">{elem.author}</div>
                                    <div className="apply-cursive">{trimToLength(elem.description, 30)}</div>
                                </a>);
                            } else if (searchWhat === "questions") {
                                return (<a className="block px-3 py-2 no-underline hover:bg-gray-100 transition duration-200 ease-in-out" key={elem.id} href={"/book/" + elem.id}>
                                    <div className="text-lg" role="heading" aria-level="2">{trimToLength(elem.title, 28)}</div>
                                    <div className="apply-cursive text-sm text-gray-500">@{elem.user.username}</div>
                                    <div className="apply-cursive">{trimToLength(elem.text, 30)}</div>
                                </a>);
                            } else if (searchWhat === "solutions") {
                                return (<a className="block px-3 py-2 no-underline hover:bg-gray-100 transition duration-200 ease-in-out" key={elem.id} href={"/book/" + elem.id}>
                                    <div className="text-lg" role="heading" aria-level="2">{elem.problem_number + ": " + trimToLength(elem.keywords.join(", "), 26-elem.problem_number.length)}</div>
                                    <div className="apply-cursive text-sm text-gray-500">@{elem.user.username}</div>
                                    <div className="apply-cursive">{trimToLength(elem.solution_text, 30)}</div>
                                </a>);
                            }
                        })}
                    </div>
                </div>
                <button className="hidden text-center w-full bg-blue-100 rounded-b-lg text-blue-900 text-sm px-3 py-2 border-2 border-blue-300" onClick={loadMore} ref={moreButton}>
                    Load more
                </button>
                <div className="hidden text-center w-full bg-orange-100 rounded-b-lg text-orange-900 text-sm px-3 py-2 border-2 border-orange-300" ref={noResults}>
                    No results found
                </div>
                <div className="hidden relative text-center rounded-b-lg w-full bg-red-100 text-red-900 text-sm px-3 py-2 border-2 border-red-300" ref={errorResult}>
                    An error occured, try reloading the page.
                </div>
                <div className="text-center w-full bg-blue-100 rounded-b-lg text-blue-900 text-sm px-3 py-2 border-2 border-blue-300" ref={searchBooksHelp}>
                    Search by title, author, or subjects
                </div>
                <div className="text-center w-full bg-blue-100 rounded-b-lg text-blue-900 text-sm px-3 py-2 border-2 border-blue-300" ref={searchQuestionsHelp}>
                    Search by title or text
                </div>
                <div className="text-center w-full bg-blue-100 rounded-b-lg text-blue-900 text-sm px-3 py-2 border-2 border-blue-300" ref={searchSolutionsHelp}>
                    Search by keywords, text, or number
                </div>
            </div>
        </div>
    )
}