<?php

namespace App\Listeners;

use App\Events\BookDown;
use App\Models\Book;
use App\Models\CentralSaverRepo;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Events\MessageReceived;
use Laravel\Reverb\Contracts\Connection;

class BroadcastMessage
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle($event): void
    {
        $message = json_decode($event->message, true);
        Log::info("seding event " . $message["event"]);
        if ($message['event'] == "pusher:subscribe") {
            if (str_starts_with($message['data']['channel'], 'presence-book.')) {
                $bookId = intval(str_replace('presence-book.', '', $message['data']['channel']));
                $userId = intval(json_decode($message['data']['channel_data'], true)['user_id']);
                $book = Book::find($bookId);
                $activeUsers = $book->active_users;
                if (!in_array($userId, $activeUsers)) {
                    array_push($activeUsers, $userId);
                    $book->active_users = $activeUsers;
                    $book->save();
                    // Log::info($book);
                }
            }
        }
        elseif ($message['event'] == "client-booksync") {
            CentralSaverRepo::stageAnnotationData(intval(str_replace("private-book.down.", "", $message['channel'])), $message['data']['diffs']);
        }
    }
}
