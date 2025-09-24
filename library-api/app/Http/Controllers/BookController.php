<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Book;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $books = Book::with('author')->get();
        return response()->json($books);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'ISBN' => 'required|string|max:255',
            'title' => 'required|string|max:255',
            'image' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages' => 'nullable|integer',
            'genre' => 'nullable|string',
            'editorial' => 'nullable|string',
            'id_author' => 'required|exists:authors,id',
            'language' => 'nullable|string',
            'synopsis' => 'nullable|string',
        ]);

        $book = Book::create($validated);
        return response()->json($book, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Book $book)
    {
        $book->load('author');
        return response()->json($book);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Book $book)
    {
        $validated = $request->validate([
            'ISBN' => 'sometimes|required|string|max:255',
            'title' => 'sometimes|required|string|max:255',
            'image' => 'nullable|string',
            'subtitle' => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages' => 'nullable|integer',
            'genre' => 'nullable|string',
            'editorial' => 'nullable|string',
            'id_author' => 'sometimes|required|exists:authors,id',
            'language' => 'nullable|string',
            'synopsis' => 'nullable|string',
        ]);

        $book->update($validated);
        return response()->json($book);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(null, 204);
    }
}
