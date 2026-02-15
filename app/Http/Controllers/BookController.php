<?php

namespace App\Http\Controllers;

use App\Helpers;
use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Support\Arr;
use App\Http\Requests\ReCaptchaRequest;

class BookController extends Controller
{
    public function view(Book $book) {
        $book->loadCount(["questions", "solutions"]);
        // Note: we will potentially need to implement some caching eventually.
        $books = Book::select([
                'books.id',
                DB::raw('RANK() OVER (ORDER BY COUNT(questions.id) DESC) as bookque_rank'),
                DB::raw('RANK() OVER (ORDER BY COUNT(solutions.id) DESC) as booksol_rank')
            ])
            ->leftJoin('questions', 'questions.book_id', '=', 'books.id')
            ->leftJoin('solutions', 'solutions.book_id', '=', 'books.id')
            ->whereBetween('books.updated_at', [
                now()->subMonths(1),
                now()
            ])
            ->groupBy('books.id')
            ->get();

        $book->question_quality = Helpers::checkQuality($books, "bookque_rank", $book);
        $book->solution_quality = Helpers::checkQuality($books, "booksol_rank", $book);

        $user = $book->user;
        $questions = $book->questions;
        $solutions = $book->solutions;

        return Inertia::render("Book/ViewBook", [
            "book" => $book,
            "user" => $user,
            "questions" => $questions,
            "solutions" => $solutions
        ]);
    }

    public function create() {
        return Inertia::render("Book/CreateBook");
    }

    public function add(ReCaptchaRequest $request) {
        $request->validate([
            'title' => 'required|string|max:127',
            'author' => 'required|string|max:63',
            'subjects' => 'required|string',
            'description' => 'required|string|max:5000',
            'pdf_blob' => 'required|string'
        ]);

        $book = new Book();
        $book->title = $request->input("title");
        $book->author = $request->input("author");
        $book->subjects = explode(",", $request->input("subjects"));
        $book->description = $request->input("description");

        $book->user_id = Auth::user()->id;
        
        $book->ratings = [];
        $book->active_users = [];
        $book->state = [];
        $book->links = [];
        $book->private = false;
        $book->save();

        $fileName = Helpers::uploadPdf($request->input("pdf_blob"), $book->id);

        return response()->json([
            "book" => $book,
            "endfile" => $fileName
        ], 201);
    }

    public function rate(Book $book, ReCaptchaRequest $request) {
        $request->validate([
            "rating" => "required|integer"
        ]);
        $bookRatings = $book->ratings;
        $bookRatings[$request->user()->id] = $request->input("rating");
        $book->ratings = $bookRatings;
        $book->save();
        return response()->json(["book" => $book, 200]);
    } 
}
