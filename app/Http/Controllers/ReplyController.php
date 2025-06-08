<?php

namespace App\Http\Controllers;

use App\Models\Reply;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ReplyController extends Controller
{
    public function addReply(Reply $reply, Request $request) {
        $request->validate([
            'text' => 'required|string'
        ]);

        $newReply = new Reply();
        $newReply->text = $request->input("text");
        $newReply->liked_users = [];
        $newReply->previous = $reply->id;
        $newReply->thread = $reply->thread ? $reply->thread : $reply->id;
        $newReply->question_id = $reply->question_id;
        $newReply->solution_id = $reply->solution_id;
        $newReply->user_id = $request->user()->id;

        $newReply->save();

        $newReply->load(['previousReply.user:id,username', 'user:id,username']);

        return response()->json(["reply" => $newReply], 201);
    }

    public function loadMoreReplies($threadId, Request $request)
    {
        $page = $request->input('page') ?? 2;
        $perPage = $request->input('perPage') ?? 3;

        $replies = Reply::where('thread', $threadId)
            ->paginate($perPage, ['*'], 'page', $page);

        return response()->json([
            'replies' => $replies,
            'has_more' => $replies->hasMorePages()
        ]);
    }

    public function likeReply(Reply $reply, Request $request) {
        $request->validate([
            "liking" => "required|boolean"
        ]);

        $userId = $request->user()->id;

        if (in_array($userId, $reply->liked_users) && !$request->input("liking")) {
            $reply->likes -= 1;
            $likedUsers = $reply->liked_users;
            
            unset($likedUsers[array_search($userId, $likedUsers)]);
            $reply->liked_users = $likedUsers;
            $reply->save();
        } else if (!in_array($userId, $reply->liked_users) && $request->input("liking")) {
            $reply->likes += 1;
            $likedUsers = $reply->liked_users;

            array_push($likedUsers, $userId);
            $reply->liked_users = $likedUsers;
            $reply->save();
        } else {
            return response()->json(["message" => "You have already liked this"], 403);
        }

        return response()->json(200);
    }
}
