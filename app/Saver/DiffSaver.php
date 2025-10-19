<?php

namespace App\Saver;

use App\Models\Book;
use App\Models\CentralSaverRepo;
use Illuminate\Support\Facades\Log;

class DiffSaver {
    public static function handleDiffTransfer($sessionData) {
        // var_dump($sessionData);
        Log::info($sessionData);
        // i cant find shit in here LMAO
        if ($sessionData['diffs']) {
            $currentBook = Book::find($sessionData["book_id"]);
            // var_dump($sessionData['diffs']);
            $mergedDiffs = CentralSaverRepo::collapseDiffs($sessionData['diffs'], $currentBook['state']);
            $currentBook->state = $mergedDiffs;
            $currentBook->save();
            CentralSaverRepo::clearDiffs($sessionData['id']);
        }

        if (CentralSaverRepo::shouldClear($sessionData["book_id"])){
            CentralSaverRepo::clear($sessionData["book_id"]);
        }
    }
}