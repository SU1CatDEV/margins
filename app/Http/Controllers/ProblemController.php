<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Question;
use App\Models\Reply;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Http\Requests\ReCaptchaRequest;

class ProblemController extends Controller
{
    public function create($book_id = null) {
        if ($book_id) {
            $book = Book::find($book_id);
            return Inertia::render('QueSol/CreateProblem', ["book" => $book]);
        }
        return Inertia::render('QueSol/CreateProblem');
    }

    public function add(ReCaptchaRequest $request) {
        $request->validate([
            'title' => 'required|string|max:100',
            'text' => 'required|string|max:5000',
            'bookId' => 'required|integer',
        ]);
        $question = new Question();
        $question->title = $request->input("title");
        $question->text = $request->input("text");
        $question->book_id = $request->input("bookId");
        $question->user_id = Auth::user()->id;
        $question->liked_users = [];
        $question->save();

        if ($request->has('pageIndex') && $request->has('rect') && $request->has('quadPoints')) {
            $book = Book::find($request->input("bookId"));
            $bookLinks = $book->links;
            $bookLinks["problem_link_" . $question->id] = ["element" => [
                "annotationType" => 2,
                "borderStyle" => null,
                "quadPoints" => $request->input("quadPoints"),
                "rect" => $request->input("rect"),
                "pageIndex" => $request->input("pageIndex"),
                "url" => route("question", $question->id),
                "rotation" => 0,
            ]];
            $book->links = $bookLinks;
            $book->save();
        }
        return response()->json([
            "question" => $question
        ], 201);
    }

    public function view(Question $question) {
        $threads = Reply::whereNull('thread')
                        ->where('question_id', $question->id)
                        ->with('limitedThread')
                        ->withCount('wholeThread')
                        ->limit(3)
                        ->get();

        $hasMore = Reply::whereNull('thread')->where('question_id', $question->id)->count() > 3;
        return Inertia::render('QueSol/ViewProblem', ["question" => $question, "threads" => $threads, "hasMore" => $hasMore]);
    }

    public function loadMoreReplies($questionId, Request $request) {
        $page = $request->input('page') ?? 2;
        $perPage = $request->input('perPage') ?? 4;

        $replies = Reply::where('question_id', $questionId)
            ->whereNull('thread')
            ->with('limitedThread')
            ->withCount('wholeThread')
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'replies' => $replies,
            'has_more' => $replies->hasMorePages()
        ]);
    }

    public function like(Question $question, ReCaptchaRequest $request) {
        $request->validate([
            "liking" => "required|boolean"
        ]);

        $userId = $request->user()->id;

        if (in_array($userId, $question->liked_users) && !$request->input("liking")) {
            $question->likes -= 1;
            $likedUsers = $question->liked_users;
           
            unset($likedUsers[array_search($userId, $likedUsers)]);
            $question->liked_users = $likedUsers;
            $question->save();
        } else if (!in_array($userId, $question->liked_users) && $request->input("liking")) {
            $question->likes += 1;
            $likedUsers = $question->liked_users;

            array_push($likedUsers, $userId);
            $question->liked_users = $likedUsers;
            $question->save();
        } else {
            return response()->json(["message" => "You have already liked this"], 403);
        }

        return response()->json(200);
    }

    public function reply(Question $question, ReCaptchaRequest $request) {
        $request->validate([
            "text" => "required|string"
        ]);

        $reply = new Reply();
        $reply->text = $request->input("text");
        $reply->liked_users = [];
        $reply->question_id = $question->id;
        $reply->user_id = $request->user()->id;
        $reply->thread = null;

        $reply->save();

        $reply->load("user:id,username");

        return response()->json(["reply" => $reply], 201);
    }
}
