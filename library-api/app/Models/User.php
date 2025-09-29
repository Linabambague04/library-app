<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Author;
use App\Models\Editorial;
use App\Models\Book;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];


    public function author()
    {
        return $this->hasOne(Author::class);
    }

    public function editorial()
    {
        return $this->hasOne(Editorial::class);
    }


    public function booksWritten()
    {
        return $this->hasMany(Book::class, 'author_id');
    }


    public function booksPublished()
    {
        return $this->hasMany(Book::class, 'editorial_id');
    }

    public function isAuthor()
    {
        return $this->role === 'author';
    }

    public function isEditorial()
    {
        return $this->role === 'editorial';
    }

    public function isAdmin()
    {
        return $this->role === 'admin';
    }
}
