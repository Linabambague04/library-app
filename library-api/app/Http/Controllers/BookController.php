<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BookController extends Controller
{
    public function index(Request $request)
    {
        $query = Book::with(['author.user', 'editorial.user']);

        if ($request->has('genre')) {
            $query->where('genre', $request->genre);
        }

        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->title . '%');
        }

        $books = $query->get();

        return response()->json($books);
    }


    public function store(Request $request)
    {
        $author = Auth::user()->author;  // relación hasOne en User

        if (!$author) {
            return response()->json(['message' => 'Solo un autor puede crear libros'], 403);
        }

        $data = $request->validate([
            'ISBN'             => 'required|string|max:255|unique:books,ISBN',
            'title'            => 'required|string|max:255',
            'image'            => 'nullable|string',
            'subtitle'         => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages'     => 'nullable|integer',
            'genre'            => 'nullable|string',
            'editorial_id'     => 'nullable|exists:editorials,id',
            'language'         => 'nullable|string',
            'synopsis'         => 'nullable|string',
        ]);

        $data['author_id'] = $author->id;  // ahora sí, ID válido en tabla authors

        $book = Book::create($data);

        return response()->json($book->load('author.user', 'editorial.user'), 201);

    }


    public function show($id)
    {
        $book = Book::with(['author.user', 'editorial.user'])->find($id);
        if (!$book) {
            return response()->json(['message' => 'Libro no encontrado'], 404);
        }
        return response()->json($book);
    }

    public function update(Request $request, $id)
    {
        $author = Auth::user()->author;
        if (!$author) {
            return response()->json(['message' => 'No eres un autor'], 403);
        }

        $book = Book::find($id);
        if (!$book || $book->author_id !== $author->id) {
            return response()->json(['message' => 'No puedes editar este libro'], 403);
        }

        $data = $request->validate([
            'ISBN'             => 'sometimes|string|max:255|unique:books,ISBN,' . $id,
            'title'            => 'sometimes|string|max:255',
            'image'            => 'nullable|string',
            'subtitle'         => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages'     => 'nullable|integer',
            'genre'            => 'nullable|string',
            'editorial_id'     => 'nullable|exists:editorials,id',
            'language'         => 'nullable|string',
            'synopsis'         => 'nullable|string',
        ]);

        $book->update($data);
        return response()->json($book->load('author.user', 'editorial.user'));
    }

    public function destroy($id)
    {
        $author = Auth::user()->author;
        if (!$author) {
            return response()->json(['message' => 'No eres un autor'], 403);
        }

        $book = Book::find($id);
        if (!$book || $book->author_id !== $author->id) {
            return response()->json(['message' => 'No puedes eliminar este libro'], 403);
        }

        $book->delete();
        return response()->json(['message' => 'Libro eliminado']);
    }
}
