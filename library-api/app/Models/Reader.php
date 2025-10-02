<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reader extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'nickname',
        'date_birth',
        'favorite_genre',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function books()
    {
        return $this->belongsToMany(Book::class, 'book_reader')
                    ->withPivot('status', 'started_at', 'finished_at', 'rating')
                    ->withTimestamps();
    }
}
