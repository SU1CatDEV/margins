<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileUploadController;
use App\Http\Controllers\ProblemController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\ReplyController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SolutionController;
use App\Http\Controllers\ViewerController;
use App\Models\Book;
use App\Models\CentralSaverRepo;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::controller(DashboardController::class)->group(function () {
    Route::get('/dashboard', 'books')->middleware(['auth', 'verified'])->name('dashboard');
    Route::get('/', 'index')->name('index');
    Route::get('/dashboard/books', 'books')->middleware(['auth', 'verified'])->name('dashboard.books');
    Route::get('/dashboard/questions', 'questions')->middleware(['auth', 'verified'])->name('dashboard.questions');
    Route::get('/dashboard/solutions', 'solutions')->middleware(['auth', 'verified'])->name('dashboard.solutions');
    Route::get('/about', 'about')->name('about');
    Route::post('/load', 'loadMore')->name('data');
})->middleware(['auth', 'verified']);

Route::controller(ViewerController::class)->group(function () {
    Route::get('/header', 'header')->middleware(['auth', 'verified'])->name('editHeader');
    Route::get('/viewer/{book}', 'index')->middleware(['auth', 'verified'])->name('viewer');
    Route::post('/viewer/upload', 'upload')->middleware(['auth', 'verified'])->name('uploadAnnotationImage');
})->middleware(['auth', 'verified']);

Route::controller(ProblemController::class)->group(function () {
    Route::get('/ask/{book_id?}', 'create')->middleware(['auth', 'verified'])->name('createProblem');
    Route::post('/question/add', 'add')->middleware(['auth', 'verified'])->name('addQuestion');
    Route::get('/question/{question}', 'view')->middleware(['auth', 'verified'])->name('question');
    Route::post('/question/{question}/like', 'like')->middleware(['auth', 'verified']);
    Route::post('/question/{question}/reply', 'reply')->middleware(['auth', 'verified']);
    Route::post('/question/{questionId}/replies', 'loadMoreReplies')->middleware(['auth', 'verified']);
})->middleware(['auth', 'verified']);

Route::controller(SolutionController::class)->group(function () {
    Route::get('/solve/{book_id?}', 'create')->middleware(['auth', 'verified'])->name('createSolution');
    Route::post('/solution/add', 'add')->middleware(['auth', 'verified'])->name('addSolution');
    Route::get('/solution/{solution}', 'view')->middleware(['auth', 'verified'])->name('solution');
    Route::post('/solution/{solution}/like', 'like')->middleware(['auth', 'verified']);
    Route::post('/solution/{solution}/reply', 'reply')->middleware(['auth', 'verified']);
    Route::post('/solution/{solutionId}/replies', 'loadMoreReplies')->middleware(['auth', 'verified']);
})->middleware(['auth', 'verified']);

Route::controller(ReplyController::class)->group(function () {
    Route::post('/reply/{reply}/new', 'addReply')->middleware(['auth', 'verified'])->name('addReply');
    Route::post('/reply/{reply}/like', 'likeReply')->middleware(['auth', 'verified'])->name('likeReply');
    Route::post('/reply/thread/{threadId}', 'loadMoreReplies')->middleware(['auth', 'verified'])->name('loadThread');
})->middleware(['auth', 'verified']);

Route::controller(FileUploadController::class)->group(function () {
    Route::post('/upload/save', 'savePdf')->middleware(['auth', 'verified']);
})->middleware(['auth', 'verified']);

Route::controller(SearchController::class)->group(function () {
    Route::post('/search/{searchWhat}', 'search')->middleware(['auth', 'verified'])->name('searchRequest');
    Route::get('/search', 'searchView')->middleware(['auth', 'verified'])->name('search');
})->middleware(['auth', 'verified']);

Route::controller(BookController::class)->group(function () {
    Route::get('/book/create', 'create')->middleware(['auth', 'verified'])->name("book.create");
    Route::post('/book/upload', 'add')->middleware(['auth', 'verified'])->name("book.upload");
    Route::get('/book/{book}', 'view')->middleware(['auth', 'verified'])->name("book.view");
    Route::post('/book/{book}/rate', 'rate')->middleware(['auth', 'verified'])->name("book.rate");
})->middleware(['auth', 'verified']);

Route::controller(ReportController::class)->group(function () {
    Route::get('/copyright-form/{book}', 'createCopyright')->middleware(['auth', 'verified'])->name('report.create');
    Route::post('/copyright-report/{book}', 'storeCopyright')->middleware(['auth', 'verified'])->name('report.newcopyright');
    Route::get('/report-received/{report}', 'reportReceived')->middleware(['auth', 'verified'])->name('report.received');
});

Route::middleware('auth')->group(function () {
    Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::get('/profile/{id?}', [ProfileController::class, 'view'])->name('profile.view');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
