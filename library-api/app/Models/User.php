<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    public function author()
    {
        return $this->hasOne(Author::class, 'user_id');
    }

    public function editorial()
    {
        return $this->hasOne(Editorial::class);
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
