<?php

use App\Models\User;
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('book.{bookId}', function (User $user, $roomId) {
    return $user->only('id', 'name');
});

Broadcast::channel('book.down.{bookId}', function (User $user, $roomId) {
    return true;
});