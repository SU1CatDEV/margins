import { useEffect, useState, useRef } from "react";
import RatingStar from "./RatingStar";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function BookRating({bookId, className, onRatingChange, currentRating}) {

    const [rating, setRating] = useState(currentRating);
    const errorMsg = useRef(null);
    const successMsg = useRef(null);
    const buttonsRef = useRef(null);
    const isFirstRender = useRef(true);

    const { executeRecaptcha } = useGoogleReCaptcha();

    function setStarRating(e) {
        console.log(e.target.closest("button").id);
        setRating(parseInt(e.target.closest("button").id));
    }

    function clearStars() {
        buttonsRef.current.childNodes.forEach((elem) => {
            elem.firstChild.firstChild.firstChild.classList.remove("selected-star");
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

        const getToken = async () => {
            return await executeRecaptcha("RATEBOOK");
        }
        
        const token = getToken();

        Array.from(buttonsRef.current.childNodes).slice(0, rating).forEach((btn) => {
            console.log(btn.firstChild);
            btn.firstChild.firstChild.firstChild.classList.add("selected-star"); // i KNOW right.
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
            body: JSON.stringify({rating, token}),
        })
        .then(response => {
            if (!response.ok) {
                throw response;
            }
            errorMsg.current.classList.add("hidden");
            successMsg.current.classList.remove("hidden");
            onRatingChange(rating);
        })
        .catch((e) => {
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
                    {[1, 2, 3, 4, 5].map((val) => (
                        <span key={val}><RatingStar id={val} onClick={setStarRating}/></span>
                    ))}
                </div>
            </div>
            
            <div ref={errorMsg} className="hidden bg-red-200 px-3 py-1 rounded-lg">
                Something went wrong.
            </div>
            <div ref={successMsg} className="hidden bg-green-200 px-3 py-1 rounded-lg">
                Thank you for your rating!
            </div>
        </div>
    )
}