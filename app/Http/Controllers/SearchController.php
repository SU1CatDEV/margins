<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Question;
use App\Models\Solution;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Inertia\Inertia;

class SearchController extends Controller
{
    public function search(Request $request, string $searchWhat) {
        $request->validate([
            'query' => 'required|string'
        ]);

        $query = $request->input('query');
        $perPage = $request->input('perPage') ?? 4;

if ($searchWhat == 'books') {
    if (substr_count($query, ",") === 1) {
        $query = explode(",", $query);
        $result = Book::whereLower('title', $query[0])
                    ->orWhereLower('author', $query[1])
                    ->groupBy('id')
                    ->orderByRaw('AVG(ratings) desc')
                    ->paginate($perPage);
        if ($result->isEmpty()) {
            $result = Book::whereLower('title', $query[1])
                    ->orWhereLower('author', $query[0])
                    ->groupBy('id')
                    ->orderByRaw('AVG(ratings) desc')
                    ->paginate($perPage);
        }
    } else {
            $result = Book::whereLower('title', $query)
                        ->orWhereLower('author', $query)
                        ->orWhereLower('subjects', $query)
                        ->groupBy('id')
                        ->orderByRaw('AVG(ratings) desc')
                        ->paginate($perPage);
        }
            
            return response()->json([
                'entries' => $result,
                'hasMore' => $result->hasMorePages()
            ]);
        } else if ($searchWhat == 'questions') {
            $result = Question::with(['user:id,username'])->
                                whereLower('text', $query)
                                ->orWhereLower('title', $query)
                                ->orderBy('updated_at', 'desc')
                                ->paginate($perPage);
            
            return response()->json([
                'entries' => $result,
                'hasMore' => $result->hasMorePages()
            ]);
        } else if ($searchWhat == 'solutions') {
            $result = Solution::with(['user:id,username'])
                                ->whereLower('keywords', $query)
                                ->orWhereLower('problem_number', $query)
                                ->orWhereLower('problem_text', $query)
                                ->orWhereLower('solution_text', $query)
                                ->orderBy('updated_at', 'desc')
                                ->paginate($perPage);
            
            return response()->json([
                'entries' => $result,
                'hasMore' => $result->hasMorePages()
            ]);
        }
    }

    public function searchView(Request $request) {
        return Inertia::render('Search');
    }
}
