<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Question;
use App\Models\Solution;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index() {
        // Log::info(Session::get("isUserBanned"));
        if (Auth::check()) {
            $books = Book::where("user_id", request()->user()->id)->limit(9)->get();
            $count = Book::where("user_id", request()->user()->id)->count();
            return Inertia::render("DashboardBooks", ["books" => ["data" => $books, "hasMore" => $count > 9]]);
        }

        return Inertia::render("Home");
    }

    public function about() {
        return Inertia::render("AuthHome");
    }

    public function books() {
        $books = Book::where("user_id", request()->user()->id)->limit(9)->get();
        $count = Book::where("user_id", request()->user()->id)->count();
        return Inertia::render("DashboardBooks", ["books" => ["data" => $books, "hasMore" => $count > 9]]);
    }

    public function loadMore(Request $request) {
        $request->validate([
            "type.*" => Rule::in(["book", "question", "solution"]),
            "page" => "required|integer",
            "perPage" => "required|integer",
            "skip" => "integer|nullable"
        ]);

        $offset = $request->input("skip", 0) + (($request->input("page") - 2) * $request->input("perPage"));
        if ($request->input("type") === "book") {
            $data = Book::where("user_id", request()->user()->id)->skip($offset)->take($request->input("perPage"))->get();
            $count = Book::where("user_id", request()->user()->id)->count();
        } else if ($request->input("type") === "question") {
            $data = Question::where("user_id", request()->user()->id)->skip($offset)->take($request->input("perPage"))->get();
            $count = Question::where("user_id", request()->user()->id)->count();
        } else if ($request->input("type") === "solution") {
            $data = Solution::where("user_id", request()->user()->id)->skip($offset)->take($request->input("perPage"))->get();
            $count = Solution::where("user_id", request()->user()->id)->count();
        } else {
            return response()->json(["message" => "Type can only be 'book', 'question', and 'solution'"], 400);
        }
        return response()->json([
            "data" => $data,
            "hasMore" => $count > ($request->input("page") - 1)*$request->input("perPage") + count($data),
            "thingy" => ($request->input("page") - 1)*$request->input("perPage") + count($data)
        ]);
    }

    public function questions() {
        $questions = Question::where("user_id", request()->user()->id)->paginate(5);
        return Inertia::render("DashboardQuestions", ["questions" => ["data" => $questions->items(), "hasMore" => $questions->hasMorePages()]]);
    }

    public function solutions() {
        $solutions = Solution::where("user_id", request()->user()->id)->paginate(5);
        return Inertia::render("DashboardSolutions", ["solutions" => ["data" => $solutions->items(), "hasMore" => $solutions->hasMorePages()]]);
    }
}
