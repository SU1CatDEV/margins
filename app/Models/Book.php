<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Saver\DiffSaver;

class Book extends Model
{
    /** @use HasFactory<\Database\Factories\BookFactory> */
    use HasFactory;

    protected $with = ['user'];

    protected $casts = [
        'state' => 'array',
        'links' => 'array',
        'subjects' => 'array',
        'ratings' => 'array',
        'active_users' => 'array'
    ];

    protected $fillable = [
        'state',
        'links',
        'subjects',
        'title',
        'author',
        'ratings',
        'description',
        'active_users',
        'user_id',
    ];

    public function scopePublic($query)
    {
        return $query->where('private', false);
    }

    protected static function booted()
    {
        static::addGlobalScope('public', function ($builder) {
            $builder->where('private', false);
        });
    }

    /**
     * if there happens to be data in the central_saver_sessions and we have before it
     * can be autosaved, we need to clear that out. since we're going to write this
     * as a cron job in deployment, we're allowed to access central saver here.
     */
    public static function clearState($bookId) {
        $data = CentralSaverRepo::getByBook($bookId);
        // this might be terrible but eh
        DiffSaver::handleDiffTransfer($data);
        Book::where('id', $bookId)->update([
            'state' => [],
        ]);
    }

    public function scopeWhereLower($query, $column, $value) {
        return $query->whereRaw('LOWER(' . $column . ') LIKE ?', ['%' . strtolower($value) . '%']);
    }

    public function scopeOrWhereLower($query, $column, $value) {
        return $query->orWhereRaw('LOWER(' . $column . ') LIKE ?', ['%' . strtolower($value) . '%']);
    }

    public function centralSaverSession()
    {
        return $this->hasOne(CentralSaverSession::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class, "user_id");
    }

    public function questions() {
        return $this->hasMany(Question::class);
    }

    public function solutions() {
        return $this->hasMany(Solution::class);
    }

    public function reports() {
        return $this->hasMany(Report::class);
    }
}
