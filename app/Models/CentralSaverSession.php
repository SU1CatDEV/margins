<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CentralSaverSession extends Model
{
    use HasFactory;

    protected $table = 'central_saver_sessions';

    protected $fillable = [
        'book_id',
        'inactive',
        'clearby',
        'diffs',
        'users',
    ];

    protected $casts = [
        'diffs' => 'array',
        'users' => 'array',
    ];

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}