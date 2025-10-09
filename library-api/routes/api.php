<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AuthorController;
use App\Http\Controllers\EditorialController;
use App\Http\Controllers\BookController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public file streaming for embedded PDF viewing (avoid iframe auth issues)
Route::get('/books/{id}/file', [BookController::class, 'file']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::get('/me', [UserController::class, 'me']);
    Route::put('/me', [UserController::class, 'update']);

    Route::get('/author/me', [AuthorController::class, 'me']);
    Route::put('/author/me', [AuthorController::class, 'update']);

    Route::get('/editorial/me', [EditorialController::class, 'me']);
    Route::put('/editorial/me', [EditorialController::class, 'update']);

    // editorials listing for forms
    Route::get('/editorials', [EditorialController::class, 'index']);

    Route::get('/books', [BookController::class, 'index']);
    Route::post('/books', [BookController::class, 'store']);
    Route::get('/books/{id}', [BookController::class, 'show']);
    Route::put('/books/{id}', [BookController::class, 'update']);
    Route::delete('/books/{id}', [BookController::class, 'destroy']);
    // Reader action: save to "Mis libros" when reading
    Route::post('/books/{id}/read', [BookController::class, 'read']);
});

