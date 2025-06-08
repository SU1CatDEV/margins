<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Reply;
use App\Models\Solution;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SolutionController extends Controller
{
    public function create($book_id = null) {
        if ($book_id) {
            $book = Book::find($book_id);
            return Inertia::render('QueSol/CreateSolution', ["book" => $book]);
        }
        return Inertia::render('QueSol/CreateSolution');
    }

    public function add(Request $request) {
        $request->validate([
            'problemNumber' => 'required|string',
            'problemText' => 'required|string|max:5000',
            'solutionText' => 'required|string|max:5000',
            'bookId' => 'required|integer',
            'keywords' => 'required|array',
        ]);
        $solution = new Solution();
        $solution->problem_number = $request->input("problemNumber");
        $solution->problem_text = $request->input("problemText");
        $solution->solution_text = $request->input("solutionText");
        $solution->book_id = $request->input("bookId");
        $solution->user_id = Auth::user()->id;
        $solution->keywords = $request->input("keywords");
        $solution->liked_users = [];
        $solution->save();

        if ($request->has('pageIndex') && $request->has('rect') && $request->has('quadPoints')) {
            $book = Book::find($request->input("bookId"));
            $bookLinks = $book->links;
            $bookLinks["solution_link_" . $solution->id] = ["element" => [
                "annotationType" => 2,
                "borderStyle" => null,
                "quadPoints" => $request->input("quadPoints"),
                "rect" => $request->input("rect"),
                "pageIndex" => $request->input("pageIndex"),
                "url" => route("question", $solution->id),
                "rotation" => 0,
            ]];
            $book->links = $bookLinks;
            $book->save();
        }
        return response()->json([
            "solution" => $solution
        ], 201);
    }

    public function view(Solution $solution) {
        $threads = Reply::where('thread', null)
                        ->where('solution_id', $solution->id)
                        ->with('limitedThread')
                        ->withCount('wholeThread')
                        ->limit(3)
                        ->get();

        $hasMore = Reply::whereNull('thread')->where('solution_id', $solution->id)->count() > 3;
        return Inertia::render('QueSol/ViewSolution', ["solution" => $solution, "threads" => $threads, "hasMore" => $hasMore]);
    }

    public function loadMoreReplies($solutionId, Request $request) {
        $page = $request->input('page') ?? 2;
        $perPage = $request->input('perPage') ?? 4;

        $replies = Reply::where('solution_id', $solutionId)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'replies' => $replies,
            'has_more' => $replies->hasMorePages()
        ]);
    }

    public function like(Solution $solution, Request $request) {
        $request->validate([
            "liking" => "required|boolean"
        ]);

        $userId = $request->user()->id;

        if (in_array($userId, $solution->liked_users) && !$request->input("liking")) {
            $solution->likes -= 1;
            $likedUsers = $solution->liked_users;
           
            unset($likedUsers[array_search($userId, $likedUsers)]);
            $solution->liked_users = $likedUsers;
            $solution->save();
        } else if (!in_array($userId, $solution->liked_users) && $request->input("liking")) {
            $solution->likes += 1;
            $likedUsers = $solution->liked_users;

            array_push($likedUsers, $userId);
            $solution->liked_users = $likedUsers;
            $solution->save();
        } else {
            return response()->json(["message" => "You have already liked this"], 403);
        }

        return response()->json(200);
    }

    public function reply(Solution $solution, Request $request) {
        $request->validate([
            "text" => "required|string"
        ]);

        $reply = new Reply();
        $reply->text = $request->input("text");
        $reply->liked_users = [];
        $reply->question_id = $solution->id;
        $reply->user_id = $request->user()->id;

        $reply->save();

        $reply->load("user:id,username");

        return response()->json(["reply" => $reply], 201);
    }
}
