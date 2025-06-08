<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Solution extends Model
{
    /** @use HasFactory<\Database\Factories\QuestionFactory> */
    use HasFactory;
    protected $with = ['user:id,username', 'book:id,links'];
    protected $withCount = ['replies'];

    protected $fillable = [
        'book_id',
        'user_id',
        'keywords',
        'problem_text',
        'solution_text',
        'problem_number',
        'likes',
        'liked_users'
    ];

    protected $casts = [
        'keywords' => 'array',
        'liked_users' => 'array'
    ];

    public function scopeWhereLower($query, $column, $value) {
        return $query->whereRaw('LOWER(' . $column . ') LIKE ?', ['%' . strtolower($value) . '%']);
    }

    public function scopeOrWhereLower($query, $column, $value) {
        return $query->orWhereRaw('LOWER(' . $column . ') LIKE ?', ['%' . strtolower($value) . '%']);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }

    public function replies() {
        return $this->hasMany(Reply::class);
    }
}
