<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Editorial extends Model
{
    protected $fillable = [
        'user_id',
        'company_name',
        'website',
        'phone',
        'address',
        'description',
    ];


    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function books()
    {
        return $this->hasMany(Book::class, 'editorial_id');
    }
}
