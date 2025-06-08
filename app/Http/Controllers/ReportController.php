<?php

namespace App\Http\Controllers;

use App\Http\Requests\CopyrightNoticeRequest;
use App\Models\Book;
use App\Models\Report;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ReportController extends Controller
{
    public function createCopyright(Book $book) {
        return Inertia::render("Report/CopyrightForm", ["bookId" => $book]);
    }

    public function storeCopyright(CopyrightNoticeRequest $request, Book $book) {
        $report = new Report();
        $report->name_requester = $request->nameOfRequester;
        $report->name_owner = $request->nameOfOwner;
        $report->work_title = $request->workTitle;
        $report->work_description = $request->workDescription;
        $report->infringing_material = $request->infringingMaterial;
        $report->infringing_description = $request->infringingDescription;
        $report->location_url = $request->locationUrl;
        $report->infringed_work = $request->infringedWork;
        $report->email = $request->email;
        $report->phone = $request->phone;
        $report->post = $request->post;
        $report->preference = $request->preference;
        $report->full_name = $request->nameOfRequester;
        $report->esignature = $request->eSignature;
        $report->book_id = $book->id;
        $report->reporter = Auth::id();
        $report->infringer = $book->user ? $book->user->id : 0;
        $report->save();

        $book->private = true;
        $book->save();

        $user = $book->user;
        if ($user) {
            $user->strikes += 1;
            if ($user->strikes >= 3) {
                $user->banned = true;
            }
            $user->save();
        }
        
        return Inertia::location(route('report.received', ['report' => $report->id]));
    }

    public function reportReceived(Report $report) {
        return Inertia::render('Report/Received', ['report' => $report]);
    }
}
