<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Book;

class Author extends Model
{
    protected $fillable = [
        'name',
        'last_name',
        'date_birth',
        'nationality',
        'user_id',
        'biography',
        'contact'
    ];

    public function books()
    {
        return $this->hasMany(Book::class);
    }
}
