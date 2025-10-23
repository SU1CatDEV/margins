<?php

namespace App\Models;

use DateTime;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Carbon;

class CentralSaverRepo
{
    /**
     * Collapse diffs into a simplified format.
     */
    public static function collapseDiffs($diffs)
    {
        $lastModifications = [];

        // wait holon what. What
        // nevermind its the same algorithm its fine
        // okay wait but . we dont want the key tho
        // ughhhhh 
        // Log::info("literally anything searchable");

        foreach($diffs as $modification) {
            $key = $modification['element']['id'];
            if (
                $modification['action'] == "modify" || 
                $modification["action"] == "add" || 
                ($modification["action"] == "remove" && 
                !array_key_exists($key, $lastModifications))
            ) {
                $lastModifications[$key] = [
                    'action' => $modification['action'],
                    'element' => $modification['element'],
                ];
            } else {
                unset($lastModifications[$key]);
            }
        }
        return array_values($lastModifications);
    }

    /**
     * Create a new session for a book.
     */
    public static function createSession($bookId)
    {
        $book = Book::find($bookId);
        if (!$book) {
            throw new \Exception("book with ID {$bookId} doesnt exist!");
        }

        CentralSaverSession::updateOrCreate(
            ['book_id' => $bookId],
            [
                'inactive' => false,
                'clearby' => null,
                'diffs' => [],
                'state' => $book->state,
                'users' => [],
            ]
        );
    }

    /**
     * Register a user timeout for a book session.
     */
    public static function registerUserTimeout($bookId, $userId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session) {
            $users = $session->users ?? [];
            $users[$userId] = ['userId' => $userId, 'lastUpdate' => null];
            $session->update(['users' => $users]);
        }
    }

    /**
     * Stage annotation data for a book session.
     */
    public static function stageAnnotationData($bookId, $diffs)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session) {
            $existingDiffs = $session->diffs ?? [];
            $updatedDiffs = array_merge($existingDiffs, $diffs);
            $session->update(['diffs' => $updatedDiffs]);
        }
    }

    /**
     * Check if a session is inactive.
     */
    public static function sessionInactive($bookId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        return $session ? $session->inactive : true;
    }

    /**
     * Reactivate a session.
     */
    public static function reactivateSession($bookId)
    {
        CentralSaverSession::where('book_id', $bookId)->update([
            'inactive' => false,
            'clearby' => null,
        ]);
    }

    /**
     * Handle a user leaving the session.
     */
    public static function handleUserLeave($bookId, $userId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session) {
            if (count($session->users ?? []) <= 1) {
                $session->update([
                    'inactive' => true,
                    'clearby' => now()->addMinutes(2),
                    'users' => [],
                ]);
            } else {
                $sessionUsers = $session->users;
                unset($sessionUsers[$userId]);
                // var_dump("user" . $userId);
                // var_dump($sessionUsers);
            }
        }
    }

    /**
     * Handle a user joining the session.
     */
    public static function handleUserJoin($bookId, $userId)
    {
        if (!CentralSaverSession::where('book_id', $bookId)->exists()) {
            self::createSession($bookId);
        } elseif (self::sessionInactive($bookId)) {
            self::reactivateSession($bookId);
        }
        self::registerUserTimeout($bookId, $userId);
    }

    /**
     * Check if a user has timed out.
     */
    public static function checkUserTimeout($bookId, $userId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session) {
            $user = $session->users[$userId] ?? null;
            $lastUpdate = Carbon::parse($user['lastUpdate']);
            return $user && ($user['lastUpdate'] == null || now()->greaterThan($lastUpdate->addMinute()));
        }
        return true;
    }

    /**
     * Handle a user save request.
     */
    public static function handleUserSaveRequest($bookId, $userId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        Log::info($session);
        if ($session && $userId) { // for users who didnt connect
            // we do not want disconnected users to clear the diffs they did not receive
            // Log::info($session->users);
            // ugh. good night
            // Log::info(array_merge($session->users, [$userId => [...$session->users[$userId], 'lastUpdate' => now()]]));
            // Log::info(array_merge($session->users ?? [], [$userId => ['lastUpdate' => now()]]));
            $session->update([
                'diffs' => [],
                'users' => array_merge($session->users, [$userId => [...$session->users[$userId], 'lastUpdate' => now()]]),
            ]);
        }
    }

    /**
     * Check if a session should be cleared.
     */
    public static function shouldClear($bookId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        return $session && $session->inactive && now()->greaterThan($session->clearby);
    }

    /**
     * Clear a session.
     */
    public static function clear($bookId)
    {
        CentralSaverSession::where('book_id', $bookId)->delete();
    }

    public static function all() {
        return CentralSaverSession::all();
    }

    public static function getByBook($bookId) {
        // Log::info($bookId);
        $thing = CentralSaverSession::where("book_id", $bookId)->first();
        // Log::info($thing);
        return $thing;
    }

    public static function clearDiffs($sessionId) {
        CentralSaverSession::where('id', $sessionId)->update([
            "diffs" => [],
        ]);
    }
}