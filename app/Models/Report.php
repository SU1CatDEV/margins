<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory;

    protected $fillable = [
        "nameOfRequester",
        "nameOfOwner",
        "workTitle",
        "workDescription",
        "infringingMaterial",
        "infringingDescription",
        "locationUrl",
        "infringedWork",
        "email",
        "phone",
        "post",
        "preference",
        "fullName",
        "eSignature"
    ];

    public function reporter()
    {
        return $this->belongsTo(User::class, "reporter");
    }

    public function infringer()
    {
        return $this->belongsTo(User::class, "infringer");
    }

    public function book()
    {
        return $this->belongsTo(Book::class);
    }
}
