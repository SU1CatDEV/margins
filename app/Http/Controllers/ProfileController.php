<?php

namespace App\Http\Controllers;

use App\Helpers;
use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Book;
use App\Models\Question;
use App\Models\Solution;
use App\Models\User;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use App\Http\Requests\ReCaptchaRequest;

class ProfileController extends Controller
{
    public function view($id = null)
    {
        if ($id == null) {
            $user = Auth::user();
        } else {
            $user = User::find($id);
        }

        if (!$user) {
            abort(404);
        }

        $user->loadCount("books", "questions", "solutions");

        if ($user->books_count || $user->questions_count || $user->solutions_count) {
            $users = User::select([
                'users.id',
                DB::raw('RANK() OVER (ORDER BY COUNT(books.id) DESC) as userbook_rank'),
                DB::raw('RANK() OVER (ORDER BY COUNT(questions.id) DESC) as userque_rank'),
                DB::raw('RANK() OVER (ORDER BY COUNT(solutions.id) DESC) as usersol_rank')
            ])
            ->leftJoin('books', 'books.user_id', '=', 'users.id')
            ->leftJoin('questions', 'questions.user_id', '=', 'users.id')
            ->leftJoin('solutions', 'solutions.user_id', '=', 'users.id')
            ->whereBetween('users.created_at', [
                now()->subMonths(1),
                now()
            ])
            ->groupBy('users.id')
            ->get();

            if ($user->books_count) {
                Log::info($users);
                Log::info("userbook_rank");
                Log::info($user);
                $user->book_quality = Helpers::checkQuality($users, "userbook_rank", $user);
            }
            if ($user->questions_count) {
                $user->question_quality = Helpers::checkQuality($users, "userque_rank", $user);
            }
            if ($user->solutions_count) {
                $user->solution_quality = Helpers::checkQuality($users, "usersol_rank", $user);
            }
        }
        // eventually, we may need to cache these.

        $books = Book::where("user_id", request()->user()->id)->paginate(5);
        $questions = Question::where("user_id", request()->user()->id)->paginate(5);
        $solutions = Solution::where("user_id", request()->user()->id)->paginate(5);
        return Inertia::render('Profile/Profile', [
            "profileInfo" => $user,
            "books" => ["data" => $books->items(), "hasMore" => $books->hasMorePages()],
            "questions" => ["data" => $questions->items(), "hasMore" => $questions->hasMorePages()],
            "solutions" => ["data" => $solutions->items(), "hasMore" => $solutions->hasMorePages()]
        ]);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Inertia::location(route("profile.edit"));;
    }

    /**
     * Delete the user's account.
     */
    public function destroy(ReCaptchaRequest $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Inertia::location('/');
    }
}
