import { useState, useRef, useEffect } from "react";
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import SolutionCard from "@/Components/SolutionCard";
import ReplyElement from "@/Components/ReplyElement";
import { createRoot } from "react-dom/client";
import {flashAfterScroll} from "@/helpers";

export default function ViewSolution({solution, threads, hasMore}) {
    const [topReply, setTopReply] = useState("");
    const currentUser = usePage().props.auth.user;
    const [threadStarts, setThreadStarts] = useState(threads);
    const nextLoadPage = useRef(2);
    const newReplyContainer = useRef(null);
    const errorRef = useRef(null);

    function submitReplyRequest(event) {
        errorRef.current.classList.add("hidden");
        if (event.key === "Enter" && !event.shiftKey && topReply.trim() != "") {
            fetch(`/solution/${solution.id}/reply`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text: topReply}),
            })
            .then(response => response.json())
            .then(responseData => {
                setTopReply("");
                const returnedReply = {
                    ...responseData.reply,
                    prevUser: solution.user
                }
                setThreadStarts([returnedReply, ...threadStarts]);
            }).catch((e) => {
                errorRef.current.classList.remove("hidden");
                console.error(e);
            });
        }
    }

    function loadThreads() {
        errorRef.current.classList.add("hidden");
        fetch(`/solution/${solution.id}/replies`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({page: nextLoadPage.current}),
        })
        .then(response => response.json())
        .then(responseData => {
            setThreadStarts([...threadStarts, ...responseData.replies.data]);
            nextLoadPage.current++;
        }).catch((e) => {
            errorRef.current.classList.remove("hidden");
            console.error(e);
        });
    }

    return (
        <AuthenticatedLayout
            title={"Solution"}
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Solution
                </h2>
            }
        >
            <div className="mx-4 sm:mx-6 lg:mx-8 my-10">
                <SolutionCard solution={solution} size="lg" liked={solution.liked_users.includes(currentUser.id)}></SolutionCard>
                <div ref={errorRef} className="mb-5 hidden bg-red-100 rounded-lg border-2 border-red-300 px-3 py-2">An error occured, try reloading the page.</div>
                <div ref={newReplyContainer} className="relative mb-4">
                    <textarea className="scrollbar w-full rounded-lg border-2 border-gray-300 min-h-16" 
                            placeholder="Reply to thread..." 
                            value={topReply} 
                            onInput={(e) => setTopReply(e.target.value)} 
                            onKeyDown={submitReplyRequest}
                            name={"replytosolution" + solution.id}
                    />
                    <div onClick={() => setTopReply(topReply + "\n")} className="absolute bottom-6 right-4">
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 20L8 30M8 30L18 40M8 30H32C34.1217 30 36.1566 29.1571 37.6569 27.6569C39.1571 26.1566 40 24.1217 40 22V8" stroke="#777777" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
                <div className="replies">
                    {threadStarts.map((r, i) => (
                        <div key={i}>
                            <ReplyElement reply={r} thread={r.limited_thread} hasMoreFrom={r.limited_thread && r.whole_thread_count > r.limited_thread.length} topUser={solution.user}></ReplyElement>
                        </div>
                    ))}
                </div>

                {hasMore ? <button className="text-lg text-blue-500" onClick={loadThreads}>Load more threads...</button> : ""}
            </div>

        </AuthenticatedLayout>
    );
}