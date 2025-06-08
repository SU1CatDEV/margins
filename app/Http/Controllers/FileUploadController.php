<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\CentralSaverRepo;
use App\Helpers;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FileUploadController extends Controller
{
    public function savePdf(Request $request)
    {
        $request->validate([
            'pdf_blob' => 'required|string',
            'book_id' => 'required_without:filename|integer',
            'filename' => 'required_without:book_id'
        ]);
        if (CentralSaverRepo::checkUserTimeout($request->input('book_id'), strval(Auth::id()))) { 
            $pdfBlob = $request->input('pdf_blob');
            
            $fileName = Helpers::uploadPdf($pdfBlob, $request->input('book_id', $request->input('filename')));

            Book::clearState($request->input('book_id'));

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
