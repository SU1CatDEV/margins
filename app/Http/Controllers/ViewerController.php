<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\ReCaptchaRequest;

class ViewerController extends Controller
{
    public function index(Book $book) {
        return view('view')
        ->with('bookId', $book->id)
        ->with('diffs', $book->state)
        ->with('links', $book->links)
        ->with('bookTitle', $book->title . ', ' . $book->author)
        ->with('bookUrl', '/storage/pdf_' . $book->id . '.pdf');
    }

    public function header() {
        return view('view')
        ->with('bookId', 0)
        ->with('bookTitle', 'Margins site header')
        ->with('bookUrl', '/storage/header.pdf');
    }

    public function verifyCaptcha(ReCaptchaRequest $_) {
        return response()->json(200);
    }

    public function upload(Request $request) {
        $request->validate([
            'image' => 'required|string',
        ]);

        $imageData = $request->input('image');
        $imageData = str_replace('data:image/png;base64,', '', $imageData);
        $imageData = str_replace(' ', '+', $imageData);
        $imageBinary = base64_decode($imageData);

        $fileName = 'images/' . uniqid() . '.png';
        Storage::disk('public')->put($fileName, $imageBinary);

        return response()->json([
            'path' => "/storage/" . $fileName,
        ]);
    }
}
