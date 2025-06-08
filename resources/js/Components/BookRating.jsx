import { useEffect, useState, useRef } from "react";

export default function BookRating({bookId, className, onRatingChange, currentRating}) {

    const [rating, setRating] = useState(currentRating);
    const errorMsg = useRef(null);
    const successMsg = useRef(null);
    const buttonsRef = useRef(null);
    const isFirstRender = useRef(true);

    function setStarRating(e) {
        setRating(parseInt(e.target.closest("button").id));
    }

    function clearStars() {
        buttonsRef.current.childNodes.forEach((elem) => {
            elem.firstChild.firstChild.classList.remove("selected-star");
        })
    }

    useEffect(() => {
        clearStars();

        if (!rating) {
            if (isFirstRender.current) {
                isFirstRender.current = false;
            }
            return;
        }

        Array.from(buttonsRef.current.childNodes).slice(0, rating).forEach((btn) => {
            btn.firstChild.firstChild.classList.add("selected-star");
        });

        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        fetch(`/book/${bookId}/rate`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').content,
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({rating}),
        })
        .then(response => response.json())
        .then(responseData => {
            errorMsg.current.classList.add("hidden");
            successMsg.current.classList.remove("hidden");
            onRatingChange(rating);
        }).catch((e) => {
            clearStars();
            successMsg.current.classList.add("hidden");
            errorMsg.current.classList.remove("hidden");
            console.error(e);
        });
    }, [rating]);

    return (
        <div>
            <div className={className + " mb-2"}>
                <span className="mr-1">Rate:</span>
                <div className="flex items-center" ref={buttonsRef}>
                    <button id={1} className="star" onClick={setStarRating}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M13.8789 10.0146L14.1133 10.5693L14.7139 10.6211L19.5596 11.041L15.8945 14.2197L15.4404 14.6143L15.5762 15.2002L16.668 19.9229L12.5166 17.4189L12 17.1074L11.4834 17.4189L7.33105 19.9229L8.42383 15.2002L8.55957 14.6143L8.10547 14.2197L4.43945 11.041L9.28613 10.6211L9.88672 10.5693L10.1211 10.0146L12 5.56836L13.8789 10.0146Z" 
                                fill="none" 
                                stroke="#777777" 
                                strokeLinecap="round"
                                strokeLinejoin="round" 
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <button id={2} className="star" onClick={setStarRating}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M13.8789 10.0146L14.1133 10.5693L14.7139 10.6211L19.5596 11.041L15.8945 14.2197L15.4404 14.6143L15.5762 15.2002L16.668 19.9229L12.5166 17.4189L12 17.1074L11.4834 17.4189L7.33105 19.9229L8.42383 15.2002L8.55957 14.6143L8.10547 14.2197L4.43945 11.041L9.28613 10.6211L9.88672 10.5693L10.1211 10.0146L12 5.56836L13.8789 10.0146Z" 
                                fill="none" 
                                stroke="#777777" 
                                strokeLinecap="round"
                                strokeLinejoin="round" 
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <button id={3} className="star" onClick={setStarRating}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M13.8789 10.0146L14.1133 10.5693L14.7139 10.6211L19.5596 11.041L15.8945 14.2197L15.4404 14.6143L15.5762 15.2002L16.668 19.9229L12.5166 17.4189L12 17.1074L11.4834 17.4189L7.33105 19.9229L8.42383 15.2002L8.55957 14.6143L8.10547 14.2197L4.43945 11.041L9.28613 10.6211L9.88672 10.5693L10.1211 10.0146L12 5.56836L13.8789 10.0146Z" 
                                fill="none" 
                                stroke="#777777" 
                                strokeLinecap="round"
                                strokeLinejoin="round" 
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <button id={4} className="star" onClick={setStarRating}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M13.8789 10.0146L14.1133 10.5693L14.7139 10.6211L19.5596 11.041L15.8945 14.2197L15.4404 14.6143L15.5762 15.2002L16.668 19.9229L12.5166 17.4189L12 17.1074L11.4834 17.4189L7.33105 19.9229L8.42383 15.2002L8.55957 14.6143L8.10547 14.2197L4.43945 11.041L9.28613 10.6211L9.88672 10.5693L10.1211 10.0146L12 5.56836L13.8789 10.0146Z" 
                                fill="none" 
                                stroke="#777777" 
                                strokeLinecap="round"
                                strokeLinejoin="round" 
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <button id={5} className="star" onClick={setStarRating}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path 
                                d="M13.8789 10.0146L14.1133 10.5693L14.7139 10.6211L19.5596 11.041L15.8945 14.2197L15.4404 14.6143L15.5762 15.2002L16.668 19.9229L12.5166 17.4189L12 17.1074L11.4834 17.4189L7.33105 19.9229L8.42383 15.2002L8.55957 14.6143L8.10547 14.2197L4.43945 11.041L9.28613 10.6211L9.88672 10.5693L10.1211 10.0146L12 5.56836L13.8789 10.0146Z" 
                                fill="none" 
                                stroke="#777777" 
                                strokeLinecap="round"
                                strokeLinejoin="round" 
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                </div>
            </div>
            
            <div ref={errorMsg} className="hidden bg-red-200">
                Something went wrong.
            </div>
            <div ref={successMsg} className="hidden bg-green-200">
                Thank you for your rating!
            </div>
        </div>
    )
}