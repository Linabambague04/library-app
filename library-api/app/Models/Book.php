<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Author;

class Book extends Model
{
    protected $fillable = [
        'ISBN',
        'title',
        'image',
        'subtitle',
        'publication_date',
        'number_pages',
        'genre',
        'editorial',
        'id_author',
        'language',
        'synopsis',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class, 'id_author');
    }
}
