<?php

namespace App;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class Helpers {
    static function uploadPdf(string $pdfBlob, $fileName) {
        $pdfData = base64_decode($pdfBlob);

        if (str_contains($fileName, "storage/")) {
            $parts = explode("/", $fileName);
            Storage::disk('public')->put(end($parts), $pdfData);
        } if (str_ends_with($fileName, ".pdf")) {
            Storage::disk('public')->put($fileName, $pdfData);
        } else {
            Storage::disk('public')->put("pdf_" . $fileName . ".pdf", $pdfData);
        }

        return $fileName;
    }

    static function checkQuality(Collection $withRanks, $rankKey, $checkAgainst) {
        $sortedWithRanks = $withRanks->sortBy(function($ranked) use ($rankKey) {
            return $ranked[$rankKey];
        });

        $rank = Arr::first($sortedWithRanks, fn($test) => $test["id"] === $checkAgainst->id)[$rankKey];

        return 1 + (9 * (count($sortedWithRanks) - $sortedWithRanks->search(function($test) use ($rankKey, $rank) {
            return $test[$rankKey] === $rank;
        }))) / (count($sortedWithRanks));
    }
}
