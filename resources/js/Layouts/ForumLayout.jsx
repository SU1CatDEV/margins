import { useState, useRef, useEffect } from "react";
import ReplyElement from "@/Components/ReplyElement";

export default function ForumLayout({children, endpoint, user, threads, hasMore}) {
	const [topReply, setTopReply] = useState("");
	const [threadStarts, setThreadStarts] = useState(threads);
	const nextLoadPage = useRef(2);
	const newReplyContainer = useRef(null);
	const errorRef = useRef(null);
	const isFirstRender = useRef(true);

	function submitReplyRequest(event) {
		errorRef.current.classList.add("hidden");
		if (event.key === "Enter" && !event.shiftKey && topReply.trim() != "") {
			fetch(`${endpoint}/reply`, {
				method: "POST",
				headers: {
					"X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({text: topReply}),
			})
			.then(response => {
				if (!response.ok) {
					throw response;
				}
				return response.json();
			})
			.then(responseData => {
				setTopReply("");
				const returnedReply = {
					...responseData.reply,
					prevUser: user
				}
				setThreadStarts([returnedReply, ...threadStarts]);
			}).catch((e) => {
				errorRef.current.classList.remove("hidden");
				console.log(e);
			});
		}
	}

	function loadThreads() {
		errorRef.current.classList.add("hidden");
		fetch(`${endpoint}/replies`, {
			method: "POST",
			headers: {
				"X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
				"Accept": "application/json",
				"Content-Type": "application/json"
			},
			body: JSON.stringify({page: nextLoadPage.current}),
		})
		.then(response => {
			if (!response.ok) {
				throw response;
			}
			return response.json();
		})
		.then(responseData => {
			setThreadStarts([...threadStarts, ...responseData.replies.data]);
			nextLoadPage.current++;
		}).catch((e) => {
			errorRef.current.classList.remove("hidden");
			console.error(e);
		});
	}

	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}

		const lastReply = document.getElementById(threadStarts.at(0).id);
		lastReply.classList.add("highlighted-reply");
		setTimeout(() => {lastReply.classList.remove("highlighted-reply")}, 400);
	}, [threadStarts]);

	return (
		<>
			{children}
			<div ref={errorRef} className="mb-5 hidden bg-red-100 rounded-lg border-2 border-red-300 px-3 py-2">An error occured, try reloading the page.</div>
			<div ref={newReplyContainer} className="relative mb-4">
				<textarea className="scrollbar w-full rounded-lg border-2 border-gray-300 min-h-16"
						placeholder="Reply to thread..."
						value={topReply}
						onInput={(e) => setTopReply(e.target.value)}
						onKeyDown={submitReplyRequest}
						name="replytopost"
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
						<ReplyElement reply={r} thread={r.limited_thread} hasMoreFrom={r.limited_thread && r.whole_thread_count > r.limited_thread.length} topUser={user}></ReplyElement>
					</div>
				))}
			</div>

			{hasMore ? <button className="text-lg text-blue-500" onClick={loadThreads}>Load more threads...</button> : ""}
		</>
	);
}