import { trimToLength } from "@/helpers";

export default function BookCard({book}) {
    const updatedAt = new Date(book.updated_at.replace("T", " ").split(":").slice(0, 2).join(":")).toISOString().replace("T", " ").split(":").slice(0, 2).join(":");

    return (
        <a href={"/book/" + book.id} className="flex flex-col justify-center items-center max-w-fit">
            <div className="rounded-lg text-3xl text-gray-500 apply-cursive border-2 bg-gray-200 hover:bg-gray-100 hover:border-gray-200 transition duration-200 w-48 h-60 flex items-center justify-center">
                {book.title.concat(" ", book.author).split(' ').map(s => s.charAt(0).toUpperCase()).slice(0,2)}
            </div>
            <span className="mt-4 text-lg" role="heading" aria-level="3">{trimToLength(`${book.title}, ${book.author.split(' ').at(-1)}`, 27)}</span>
            <span className="apply-cursive text-gray-500">{updatedAt}</span>
        </a>
    )
}