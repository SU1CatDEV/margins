<?php

namespace App\Http\Middleware;

use App\Models\Report;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class CheckUserBanned
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if (Auth::check() && Auth::user()->banned) {
            $user = $request->user();
            Auth::logout();

            $user->delete();
            
            $reports = Report::where('infringer', $user->id)->get();
            foreach ($reports as $report) {
                $book = $report->book;
                Storage::disk("public")->delete("pdf_" . $book->id . ".pdf");
                $book->delete();
            }

            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return Inertia::render("BannedUser", ['userData' => $user]);
        }

        return $next($request);
    }
}
