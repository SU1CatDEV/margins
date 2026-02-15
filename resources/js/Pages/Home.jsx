import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import GuestLayout from "@/Layouts/GuestLayout";
import { PDFtoIMG } from "@/pdf.js/src/custom_helpers";
import { Link } from "@inertiajs/react";
import { useEffect } from "react";

export default function Home() {
    return (
        <GuestLayout>
            <header id="homeheader" className="py-16 flex flex-col items-center h-[50vh] w-full overflow-hidden relative justify-center">
                <div className="absolute z-2 bottom-0 bg-white py-8 px-12 flex flex-col items-center rounded-t-3xl border-t-2 border-r-2 border-l-2 border-gray-300">
                    <h1 className="text-4xl mb-2">
                        <span className="brand-2">Welcome</span> to <span className="logo-color">Margins!</span><span className="beta-text">beta!:3</span>
                    </h1>
                    <p className="mb-4">An up-and-coming textbook annotation and Q&A platform, for students, by students.</p>
                    <div className="flex">
                        <Link href="/register">
                            <PrimaryButton className='btn-medium mr-4'>Sign up</PrimaryButton>
                        </Link>
                        <Link href="/login">
                            <SecondaryButton className='btn-medium'>Log in</SecondaryButton>
                        </Link>
                    </div>
                </div>
                {/* <a href="/header" className="absolute right-4 bottom-2 apply-cursive text-blue-800" preserve-state preserve-scroll>You can edit this image!</a> */}
            </header>
            <div className="mx-4 sm:mx-6 lg:mx-8 py-12 px-6 border-y-2 border-gray-300">
                <div className="block-explanation w-full md:w-[75%] text-lg">
                    <h2 className="text-2xl mb-3">What *is* Margins?</h2>
                    <p>Margins is a project created by me, Zoya Gergenkop, designed to help students better understand textbooks.</p>
                    <br/>
                    <p>On Margins, you can access books, add your own notes to parts you think other students may find confusing, and ask questions about the part *you* find unclear.</p>
                    <br/>
                    <p>There is also a more open-ended Q&A format, where you can ask questions about books more generally, and submit solutions to the practice problems given in them.</p>
                    
                    <h2 className="text-2xl mb-3 mt-6">Why Margins?</h2>
                    <p>I'm a firm believer in structured learning. However, as a homeschooled student, it can be hard for me to find resources which suit my needs.</p>
                    <p>I think it is important to grasp the most fundamental concepts in a subject (especially in STEM!), hence why I prefer to study with textbooks instead of bootcamps, video lessons or online courses (as those are my main options.)</p>
                    <br/>
                    <p>And then, I ran into a problem. The books I read were quite specialised, even if they were basic. Which meant that, often, if I had a question - I would not be able to understand the explanation I found online.</p>
                    <p>This is where Margins comes in - with a textbook-focused, student-run approach to collaborative learning, (wow, she's just saying stuff isn't she?) answers can be tailored to the asker's understanding of a subject!</p>
                    <br/>
                    <p>As for the annotations thing - that would be a practice I also started early on in my learning journey. I found that, even with dedicated notebooks, having to cross-reference things which made no sense to me with a whole 'nother book was needlessly time-consuming and included too many switch-points in which I could get distracted. Plus, there was no guarantee that I'd had already written the clarification!</p>
                    <p>And so I built this project, because frankly, I had nothing better to do with my time, and coding is tasty.</p>
                </div>
                
            </div>
            <div className="block-cool flex flex-col items-center py-32">
                <div className="relative flex flex-col items-end">
                    <h2 className="text-3xl">Over 0 users, 0 books, 0 annotations, and 0 answered questions!</h2>
                    <span className="absolute text-gray-600 top-7 -right-56">and 7 errors in my console. they call me 007 fr</span>
                </div>
                
                <h3 className="text-2xl">Trust the process, chat.</h3>
            </div>
            <div className="block-mecore mx-4 sm:mx-6 lg:mx-8 py-12 px-6 border-y-2 border-gray-300 flex is-it-obvious-that-doing-frontend-will-make-me-lose-my-mind-if-i-dont-keep-myself-entertained-w-silly-classes-bc-i-HOPE-it-is-nyan">
                <div className="pfp rounded-full overflow-hidden w-40 h-40 mr-10 bg-gray-300">
                    <img src="/storage/images/thatsme.jpg"></img>
                </div>
                <div className="text-lg w-full md:w-[75%]">
                    <h2 className="text-2xl mb-3">Okay but, who am I?</h2>
                    <p>My name is Zoya, on here I'm known as @su1cat. I'm an aspiring particle physicist and a coding enthusiast (should be evident, lol.)</p>
                    <p>The main books I'll be working on are, therefore, gonna be physmath and compsci related. However, all subjects are more than welcome on Margins!</p>
                    <p>I also greatly enjoy cetology (study of whales, dolphins and porpoises) and lepidopterology (study of butterflies and moths), so you may see me around there as well. Eventually.</p>
                </div>
            </div>
            <div className="block-opensource mx-4 sm:mx-6 lg:mx-8 py-12 px-6 text-lg w-full md:w-[75%]">
                <h2 className="text-2xl mb-3">The tech side (for nerds) (like me)</h2>
                <p>The Margins PDF editor that allows users to actually annotate books is based on PDF.js, with some modification for Laravel Echo (collaboration and autosaving.)</p>
                <p>As for the rest, Margins uses Laravel, Inertia, and React.js. I plan to take Margins open-source, or at least source-available, in the near future. After I clean up all the jokes.</p>
            </div>
        </GuestLayout>
    )
}