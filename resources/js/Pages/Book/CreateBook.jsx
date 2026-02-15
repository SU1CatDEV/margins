import { useRef, useState } from "react";
import { validatePDFHasText } from  "pdfjs/custom_helpers.js";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import Checkbox from "@/Components/Checkbox";
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function CreateBook() {
    const [bookTitle, setBookTitle] = useState("");
    const [bookAuthor, setBookAuthor] = useState("");
    const [bookSubjects, setBookSubjects] = useState([]);
    const [bookDescription, setBookDescription] = useState("");
    const [pdfFilename, setPdfFilename] = useState("Upload");
    const [legalCheck, setLegalCheck] = useState(false);
    const pdfUpload = useRef(null);
    const [goodFile, setGoodFile] = useState(null);

    const { executeRecaptcha } = useGoogleReCaptcha();

    async function addBookRequest(e) {
        e.preventDefault();
        const reader = new FileReader();
        reader.onload = async () => {
            const base64Data = reader.result.split(",")[1];

            const token = await executeRecaptcha("CREATEBOOK");

            var data = {
                title: bookTitle,
                author: bookAuthor,
                subjects: bookSubjects,
                description: bookDescription,
                pdf_blob: base64Data,
                token
            };
            
            fetch("/book/upload", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')
                    .content,
                },
                body: JSON.stringify(data),
            })
            .then(response => {
                if (!response.ok) {
                    throw response;
                }
                return response.json();
            })
            .then(responseData => {
                window.location.href = "/book/" + responseData.book.id;
            })
            .catch((e) => console.log(e));
        };
        reader.readAsDataURL(pdfUpload.current.files[0]);
    }

    async function handlePdfUpload(e) {
        e.preventDefault();
        const file = pdfUpload.current.files[0];

        if (file) {
            setPdfFilename(file.name);

            const has = await validatePDFHasText(await file.arrayBuffer());

            setGoodFile(has);
            setLegalCheck(false);
        }
    }

    return (
        <AuthenticatedLayout title={"Create Book"}>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-6 flex justify-center">
                <form className="w-full lg:w-[75%] block" onSubmit={addBookRequest}>
                    <label className="text-xl" htmlFor="title">Book title</label>
                    <input required value={bookTitle} onInput={e => setBookTitle(e.target.value)} className="w-full rounded-lg border-2 border-gray-300 mb-4" maxLength={127} id="title"/>
                    <label className="text-xl" htmlFor="author">Book author(s)</label>
                    <input required value={bookAuthor} onInput={e => setBookAuthor(e.target.value)} className="w-full rounded-lg border-2 border-gray-300 mb-4" maxLength={63} id="author"/>
                    <label className="text-xl" htmlFor="subjects">Subjects <span className="text-wrap text-base text-gray-600 apply-cursive">Users will be able to search these to find the book.</span></label>
                    <input required value={bookSubjects} onInput={e => setBookSubjects(e.target.value)} className="w-full rounded-lg border-2 border-gray-300 mb-4" maxLength={30} id="subjects"/>
                    <label className="text-xl" htmlFor="desc">Description</label>
                    <textarea required value={bookDescription} onInput={e => setBookDescription(e.target.value)} className="w-full scrollbar rounded-lg border-2 border-gray-300 mb-4" maxLength={100} id="desc"/>
                    
                    <input required className="hidden-accessible inputfile" type="file" accept=".pdf" id="upload" ref={pdfUpload} onChange={handlePdfUpload}/>
                    <label className="text-lg w-full block mb-6 focus:outline-none" htmlFor="upload">
                        <div className="mb-1">Upload file</div>
                        <div className="flex items-center">
                            <svg className="md:w-[36px] md:h-[36px] w-[30px] h-[30px] stroke-black group-focus-blue-svg box-content rounded-lg" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M28 4H12C10.9391 4 9.92172 4.42143 9.17157 5.17157C8.42143 5.92172 8 6.93913 8 8V40C8 41.0609 8.42143 42.0783 9.17157 42.8284C9.92172 43.5786 10.9391 44 12 44H36C37.0609 44 38.0783 43.5786 38.8284 42.8284C39.5786 42.0783 40 41.0609 40 40V16M28 4L40 16M28 4V16H40M24 36V24M18 30H30" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                            <div className="ml-2 group-focus-input-ring flex-1 flex border-2 border-gray-300 rounded-lg py-1 px-3 font-sans">
                                {pdfFilename}
                            </div>
                        </div>
                    </label>

                    <div className={"apply-cursive mb-6 w-full bg-green-200 border-2 border-green-300 rounded-lg px-4 py-3 " + (goodFile ? "" : "hidden")}>
                        <div className="text-xl">File quality checks pass!</div>
                        <span>Remember that books should contain text, not images of text.</span>
                    </div>
                    <div className={"apply-cursive mb-6 w-full bg-red-200 border-2 border-red-300 rounded-lg px-4 py-3 " + ((!goodFile && goodFile !== null) ? "" : "hidden")}>
                        <div className="text-xl">Your book has images of text instead of text.</div>
                        <span>Fellow students will not be able to ask questions about, or solve problems in, this book. </span>
                    </div>
                    <Checkbox id="legal" checked={legalCheck} onChange={val => setLegalCheck(val)} className="ml-1 mb-6" label="I assert I have the legal right to upload this file, and may face both real-world and on-platform consequences if it is found out this is not the case."/>
                    <PrimaryButton className="btn-large" disabled={!bookTitle || !bookAuthor || !bookSubjects || !bookDescription || !goodFile || !legalCheck}>Create</PrimaryButton>
                </form>
            </div>
        </AuthenticatedLayout>
    )
}