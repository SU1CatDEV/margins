<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CentralSaverRepo;
use App\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\ReCaptchaRequest;

class FileUploadController extends Controller
{
    public function savePdf(ReCaptchaRequest $request)
    {
        // $request->csrf()
        // $request->validate([
        //     'pdf_blob' => 'required|string',
        //     'book_id' => 'required_without:filename|integer', // fix this
        //     'filename' => 'required_without:book_id'
        // ]);
        $request->validate([
            'pdf_blob' => 'required|string',
            'book_id' => 'required|integer',
            'filename' => 'required',
        ]);
        if (!$request->input("socket_id") || CentralSaverRepo::checkUserTimeout($request->input('book_id'), Auth::id())) { 
            $pdfBlob = $request->input('pdf_blob');
            
            $fileName = Helpers::uploadPdf($pdfBlob, $request->input('book_id', $request->input('filename')));

            // Log::info($re)
            CentralSaverRepo::handleUserSaveRequest($request->input('book_id'), Auth::id());
            // Log::info($request->input('book_id'));
            Book::clearState($request->input('book_id')); // am i ? not passing this? no i am

            return response()->json([
                'message' => 'PDF saved successfully',
                'file_name' => $fileName,
            ], 200);
        } else {
            return response()->json([
                'message' => 'Cannot save yet',
            ], 403);
        }
    }
}
