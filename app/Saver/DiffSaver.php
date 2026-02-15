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
            // okay i Think this is allowed. a) we put the diffs in After the state
            // bc theyre more recent b) even if something is deleted in state and re-added in diffs
            // its still gonna be present in the collapsed diffs. and it literally Cannot readd
            // the same thing not Only bc of the connection identifiers but ALSO  
            $mergedDiffs = CentralSaverRepo::collapseDiffs(array_merge($currentBook['state'], $sessionData['diffs']));
            $currentBook->state = $mergedDiffs;
            $currentBook->save();
            CentralSaverRepo::clearDiffs($sessionData['id']);
        }

        if (CentralSaverRepo::shouldClear($sessionData["book_id"])){
            CentralSaverRepo::clear($sessionData["book_id"]);
        }
    }
}