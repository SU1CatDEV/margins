import { useEffect, useState, useRef } from "react";

export default function QuestionCard({question, liked, size="sm"}) {
    const [liking, setLiking] = useState(!liked);
    const [reply, setReply] = useState("");
    const [repliesNum, setRepliesNum] = useState(question.replies_count);
    const errorRef = useRef(null);

    function likeQuestionRequest(e) {
        errorRef.current.classList.add("hidden");
        fetch(`/question/${question.id}/like`, {
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
            console.error(e);
        });
    }

    function submitReplyRequest(event) {
        errorRef.current.classList.add("hidden");
        if ((event.key === "Enter" || event.type === "click") && reply.trim() != "") {
            fetch(`/question/${question.id}/reply`, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({text: reply}),
            })
            .then(response => response.json())
            .then(responseData => {
                setRepliesNum(repliesNum+1);
                setReply("");
            }).catch((e) => {
                errorRef.current.classList.remove("hidden");
                console.error(e);
            });
        }
    }

    function jumpToText(e) {
        e.preventDefault(); 
        sessionStorage.setItem("linkIDToFlash", "problem_link_" + question.id); 
        window.location.href = "/viewer/" + question.book_id;
    }

    return (
        <div id={size === "lg" ? "maincard" : ""} className="questioncard scroll-mt-36 p-6 border-y-2 border-gray-300 block gray-on-hover transition duration-200 rounded-lg mb-5">
            <div>
                <div className="questionheader flex justify-between items-center mb-3">
                    <div className="useridentifiers flex items-center">
                        <a href={question.user ? "/profile/" + question.user.id : "/"} className="mr-3 text-white bg-gray-200 w-10 h-10 rounded-full overflow-hidden">
                            <svg className="w-10 h-10 pt-1" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M40 42V38C40 35.8783 39.1571 33.8434 37.6569 32.3431C36.1566 30.8429 34.1217 30 32 30H16C13.8783 30 11.8434 30.8429 10.3431 32.3431C8.84285 33.8434 8 35.8783 8 38V42M32 14C32 18.4183 28.4183 22 24 22C19.5817 22 16 18.4183 16 14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14Z" stroke="#777777" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </a>
                        <div>
                            <h3 className="text-lg/[1rem] mt-2">{question.title}</h3>
                            <a href={question.user ? "/profile/" + question.user.id : "/"}>@{question.user ? question.user.username : "deleteduser"}</a>
                        </div>
                    </div>
                    <div className="repliesetc apply-cursive">
                        {Object.keys(question.book.links).includes("problem_link_" + question.id) ? 
                            <button className="mr-3 text-indigo-700 underline" onClick={jumpToText}>jump to text</button> 
                            : ""}
                        <span>{repliesNum || "no"} reply(s)</span>
                    </div>
                </div>
                <div className={"questiontext " + (size === "lg" ? "mb-8" : "mb-4")}>
                    {question.text.slice(0, 500)}
                </div>
            </div>
            <div className="interactions pr-10">
                <div ref={errorRef} className="hidden py-1 px-3 bg-red-200 border-red-300 border-2 rounded-lg mb-2">An error occured, try reloading the page.</div>
                <div className="flex items-center">
                    <button onClick={e => e.preventDefault()} className={!liking ? "green-icon" : ""}>
                        <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={likeQuestionRequest}>
                            <path d="M14 22L22 4C23.5913 4 25.1174 4.63214 26.2426 5.75736C27.3679 6.88258 28 8.4087 28 10V18H39.32C39.8998 17.9934 40.4741 18.113 41.0031 18.3504C41.5322 18.5879 42.0032 18.9375 42.3837 19.375C42.7642 19.8126 43.045 20.3276 43.2067 20.8845C43.3683 21.4414 43.407 22.0267 43.32 22.6L40.56 40.6C40.4154 41.5538 39.9309 42.4232 39.1958 43.048C38.4608 43.6728 37.5247 44.0109 36.56 44H14M14 22V44M14 22H8C6.93913 22 5.92172 22.4214 5.17157 23.1716C4.42143 23.9217 4 24.9391 4 26V40C4 41.0609 4.42143 42.0783 5.17157 42.8284C5.92172 43.5786 6.93913 44 8 44H14" stroke="#777777" fill="none" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                    {size === "sm" ? <div className="relative ml-4 w-full">
                        <textarea className="w-full rounded-lg border-gray-400 scrollbar higher-unset-hover" 
                                placeholder="Reply to thread..." 
                                value={reply} 
                                onClick={(e) => e.preventDefault()}
                                onInput={(e) => setReply(e.target.value)} 
                                onKeyDown={submitReplyRequest}
                                name={"replytoquestion" + question.id}
                                rows="1"
                        />
                        <div onClick={(e) => {e.preventDefault(); setReply(reply + "\n")}} className="absolute bottom-4 right-4">
                            <svg width="20" height="20" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 20L8 30M8 30L18 40M8 30H32C34.1217 30 36.1566 29.1571 37.6569 27.6569C39.1571 26.1566 40 24.1217 40 22V8" stroke="#777777" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                    </div> : ""}
                </div>
            </div>
        </div>
    )
}