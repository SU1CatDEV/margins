<?php

namespace App\Models;

use DateTime;
use Illuminate\Support\Facades\Log;

class CentralSaverRepo
{
    /**
     * Collapse diffs into a simplified format.
     */
    public static function collapseDiffs($diffs)
    {
        $lastModifications = [];
        $addRemoveIdMap = [];

        foreach ($diffs as $editorId => $editor) {
            $key = strval($editorId);
            foreach($editor as $modification) {
                if ($modification['action'] === 'modify') {
                    $lastModifications[$key] = [
                        'action' => $modification['action'],
                        'element' => $modification['data'],
                    ];
                } elseif (!array_key_exists($key, $addRemoveIdMap)) {
                    $addRemoveIdMap[$key] = [
                        'action' => $modification['action'],
                        'element' => $modification['data'],
                    ];
                    if ($modification['action'] === 'remove') {
                        unset($lastModifications[$key]);
                    }
                } else {
                    $existingEntry = $addRemoveIdMap[$key];
                    if ($existingEntry['action'] !== $modification['action']) {
                        unset($lastModifications[$key]);
                        unset($addRemoveIdMap[$key]);
                    } else {
                        $addRemoveIdMap[$key] = [
                            'action' => $modification['action'],
                            'element' => $modification['data'],
                        ];
                    }
                }
            }
            
        }
        return array_merge($lastModifications, $addRemoveIdMap);
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
    public static function handleUserLeave($bookId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session && count($session->users ?? []) == 1) {
            $session->update([
                'inactive' => true,
                'clearby' => now()->addMinutes(2),
                'users' => [],
            ]);
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
            return $user && ($user['lastUpdate'] == null || now()->greaterThan($user['lastUpdate']->modify('+1 minute')));
        }
        return true;
    }

    /**
     * Handle a user save request.
     */
    public static function handleUserSaveRequest($bookId, $userId)
    {
        $session = CentralSaverSession::where('book_id', $bookId)->first();
        if ($session) {
            $session->update([
                'diffs' => [],
                'users' => array_merge($session->users ?? [], [$userId => ['lastUpdate' => now()]]),
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

    public static function clearDiffs($sessionId) {
        CentralSaverSession::where('id', $sessionId)->update([
            "diffs" => [],
        ]);
    }
}