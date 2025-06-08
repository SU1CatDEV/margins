<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reply extends Model
{
    /** @use HasFactory<\Database\Factories\ReplyFactory> */
    use HasFactory;

    protected $with = ["user:id,username"];

    protected $fillable = [
        'text',
        'likes',
        'liked_users',
        'previous',
        'thread',
        'question_id',
        'solution_id',
        'user_id'
    ];

    protected $casts = [
        'liked_users' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function previousReply()
    {
        return $this->belongsTo(Reply::class, 'previous');
    }

    public function subsequentReplies()
    {
        return $this->hasMany(Reply::class, 'previous');
    }

    public function question() {
        return $this->belongsTo(Question::class);
    }

    public function solution() {
        return $this->belongsTo(Solution::class);
    }

    public function originalReply() {
        return $this->belongsTo(Reply::class, 'thread');
    }

    public function wholeThread() {
        return $this->hasMany(Reply::class, 'thread');
    }

    // load initially a limited set of direct replies NOT through a relationship
    // then load the limited threads

    // upon requesting more top-lvl threads, we paginate them from 2nd page onward
    // and also get limited thread for them, no pagination bc its the first load

    // upon requesting more in thread just do as usual lmao

    public function limitedThread() {
        return $this->hasMany(Reply::class, 'thread')->limit(3); // 3 here 4 there bc this doesnt include the initial one
    }
}
