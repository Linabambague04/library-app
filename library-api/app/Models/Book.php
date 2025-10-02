<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'ISBN',
        'title',
        'image',
        'subtitle',
        'publication_date',
        'number_pages',
        'genre',
        'author_id',
        'editorial_id',
        'language',
        'synopsis',
    ];

    public function author()
    {
        return $this->belongsTo(Author::class, 'author_id');
    }


    public function editorial()
    {
        return $this->belongsTo(Editorial::class);
    }

    public function readers()
    {
        return $this->belongsToMany(Reader::class, 'book_reader')
                    ->withPivot('status', 'started_at', 'finished_at', 'rating')
                    ->withTimestamps();
    }

}
