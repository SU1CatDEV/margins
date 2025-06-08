import { flashAfterScroll } from "@/helpers";
import { usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";

export default function ReplyElement({reply, thread, topUser, hasMoreFrom, flashOnRender}) {
    const [newReply, setNewReply] = useState("");
    const errorRef = useRef(null);
    const [liking, setLiking] = useState(!reply.liked_users.includes(topUser.id));
    const replyBox = useRef(null);
    const replyBtn = useRef(null);
    const hasThreadNewReplyContainer = useRef(null);
    const inThreadNewReplyContainer = useRef(null);
    const thisReply = useRef(null);
    const nextThreadPage = useRef(2);
    const [hasMore, setHasMore] = useState(hasMoreFrom);
    const [threadWithPrevs, setThreadWithPrevs] = useState(fillPrevs(thread));
    const hasThreadContainerRoot = useRef(null);
    const inThreadContainerRoot = useRef(null);

    function fillPrevs(replyThread, searchables=[reply]) {
        if (replyThread && replyThread.length !== 0) {
            return [...replyThread].map((t, _, arr) => {
                
                var prevUser = {};
                if (t.previous) {
                    prevUser = [...arr, ...searchables].filter((v) => v.id === t.previous)[0].user;
                } else {
                    prevUser = topUser;
                }
                return {...t, prevUser};
            })
        }
        return [];
    }

    function likeReplyRequest() {
        errorRef.current.classList.add("hidden");
        fetch(`/reply/${reply.id}/like`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({liking})
        })
        .then(response => response.json())
        .then(_ => {
            setLiking(!liking);
        }).catch((e) => {
            errorRef.current.classList.remove("hidden");
        });
    }

    function submitReplyRequest(event) {
      errorRef.current.classList.add("hidden");
      if (event.key === "Enter" && !event.shiftKey && newReply.trim() != "") {
        fetch(`/reply/${reply.id}/new`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({text: newReply}),
        })
        .then(response => response.json())
        .then(responseData => {
            setNewReply("");
            const returnedReply = {
                ...responseData.reply,
                prevUser: responseData.reply.previous_reply.user
            }
            if (thread) {
                if (!hasThreadContainerRoot.current) {
                    hasThreadContainerRoot.current = createRoot(hasThreadNewReplyContainer.current).render(<ReplyElement reply={returnedReply} topUser={topUser} flashOnRender/>);
                } else {
                    hasThreadContainerRoot.render(<ReplyElement reply={returnedReply} topUser={topUser} flashOnRender/>);
                }
            } else {
                if (!inThreadContainerRoot.current) {
                    inThreadContainerRoot.current = createRoot(inThreadNewReplyContainer.current).render(<ReplyElement reply={returnedReply} topUser={topUser} flashOnRender/>);
                } else {
                    inThreadContainerRoot.render(<ReplyElement reply={returnedReply} topUser={topUser} flashOnRender/>);
                }
            }
        }).catch((e) => {
            errorRef.current.classList.remove("hidden");
            console.error(e);
        });
      }
    }

    function requestMoreInThread(threadId) {
        fetch(`/reply/thread/${threadId}`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({page: nextThreadPage.current}),
        })
        .then(response => response.json())
        .then(responseData => {
            nextThreadPage.current++;
            setThreadWithPrevs(fillPrevs([...threadWithPrevs, ...responseData.replies.data]));
            setHasMore(responseData.has_more);
        }).catch((e) => {
            errorRef.current.classList.remove("hidden");
            console.error(e);
        });
    }

    function toggleReplyBox() {
        replyBtn.current.firstChild.firstChild.classList.toggle("stroke-green-600");
        replyBox.current.classList.toggle("hidden");
    }

    function hideReplyBox() {
        replyBtn.current.firstChild.firstChild.classList.remove("stroke-green-600");
        replyBox.current.classList.add("hidden");
    }

    function highlightElement(elem) {
        elem.classList.remove("gray-on-hover");
        elem.classList.add("highlighted-reply");
    }

    function unhighlightElement(elem) {
        elem.classList.add("gray-on-hover");
        elem.classList.remove("highlighted-reply");
    }

    useEffect(() => {
        if (flashOnRender) {
            highlightElement(thisReply.current);
          
            setTimeout(() => unhighlightElement(thisReply.current), 400);
        }
    }, []);

    function scrollToPrev(id) {
        const element = document.getElementById(id);
        
        if (element) {
            flashAfterScroll(element, (element) => {
                highlightElement(element);
                setTimeout(() => unhighlightElement(element), 400);
            });
        }
    };

    return (
        <div>
            <div id={reply.id} ref={thisReply} className="replycard scroll-mt-36 p-6 border-y-2 border-gray-300 gray-on-hover block transition ease-in-out duration-200 rounded-lg mb-2">
                <div className="replyheader flex justify-between items-center mb-3">
                    <div className="useridentifiers flex items-center">
                        <div className="mr-3 text-white bg-gray-200 w-10 h-10 rounded-full overflow-hidden">
                            <svg className="w-10 h-10 pt-1" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84285 33.8434 8 35.8783 8 38V42M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z" stroke="#777777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-lg/[1rem] mt-2">Reply to @{reply.previous ? (reply.prevUser ? reply.prevUser.username : "deleteduser") : topUser.username}</h3>
                            <span>@{reply.user ? reply.user.username : "deleteduser"}</span>
                        </div>
                    </div>
                    <div className="repliesetc apply-cursive">
                        <button className="mr-3 text-indigo-700 underline" onClick={() => scrollToPrev(reply.previous || "maincard")}>jump to original</button>
                    </div>
                </div>
                <div className="replytext mb-4 whitespace-pre-line">
                    {reply.text}
                </div>
                <div className="interactions pr-10">
                    <div ref={errorRef} className="hidden py-1 px-3 bg-red-200 border-red-300 border-2 rounded-lg mb-2">An error occured, try reloading the page.</div>
                    <div className="flex items-center">
                        <button className={!liking ? "green-icon" : ""}>
                            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={likeReplyRequest}>
                                <path d="M14 22L22 4C23.5913 4 25.1174 4.63214 26.2426 5.75736C27.3679 6.88258 28 8.4087 28 10V18H39.32C39.8998 17.9934 40.4741 18.113 41.0031 18.3504C41.5322 18.5879 42.0032 18.9375 42.3837 19.375C42.7642 19.8126 43.045 20.3276 43.2067 20.8845C43.3683 21.4414 43.407 22.0267 43.32 22.6L40.56 40.6C40.4154 41.5538 39.9309 42.4232 39.1958 43.048C38.4608 43.6728 37.5247 44.0109 36.56 44H14M14 22V44M14 22H8C6.93913 22 5.92172 22.4214 5.17157 23.1716C4.42143 23.9217 4 24.9391 4 26V40C4 41.0609 4.42143 42.0783 5.17157 42.8284C5.92172 43.5786 6.93913 44 8 44H14" stroke="#777777" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        <button className="ml-3" onClick={toggleReplyBox} ref={replyBtn}>
                            <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 28L8 18M8 18L18 8M8 18H32C34.1217 18 36.1566 18.8429 37.6569 20.3431C39.1571 21.8434 40 23.8783 40 26V40" stroke="#777777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                        
                    </div>
                </div>
            </div>

            <div className="w-full rounded-lg mb-1 hidden" ref={replyBox}>
                <div className="replyboxheader apply-cursive border-2 px-3 py-2 border-gray-300 rounded-t-lg border-b-0">
                    Reply to @{reply.user.username}
                </div>
                <div className="relative">
                    <textarea className="scrollbar w-full rounded-b-lg border-2 border-gray-300 min-h-16" 
                            placeholder="Reply to thread..." 
                            value={newReply} 
                            onInput={(e) => setNewReply(e.target.value)} 
                            onKeyDown={submitReplyRequest}
                            onBlur={hideReplyBox}
                            name={"replytothread" + reply.thread + "reply" + reply.id}
                    />
                    <div onClick={() => setNewReply(newReply + "\n")} className="absolute bottom-6 right-4">
                        <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 20L8 30M8 30L18 40M8 30H32C34.1217 30 36.1566 29.1571 37.6569 27.6569C39.1571 26.1566 40 24.1217 40 22V8" stroke="#777777" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            </div>

            <div ref={inThreadNewReplyContainer}>

            </div>

            {thread && <div className="pl-10 mb-2">
                <div ref={hasThreadNewReplyContainer}>

                </div>
                {threadWithPrevs.map((r, i) => (
                    <div key={i}>
                        <ReplyElement reply={r} topUser={topUser}/>
                    </div>
                ))}
                {(thread && thread.length !== 0) ? (hasMore) ? 
                                                                                    /* the thread is the same for all elements, [0] is just guaranteed to exist */
                    <button className="text-lg text-blue-500" onClick={() => requestMoreInThread(thread[0].thread)}>Load more in thread...</button>
                    :
                    <div className="relative flex py-2 items-center">
                        <div className="flex-grow border-t border-gray-400"></div>
                        <span className="flex-shrink mx-4 text-gray-400">End of thread</span>
                        <div className="flex-grow border-t border-gray-400"></div>
                    </div>
                : "" }
            </div>}
        </div>
    )
}