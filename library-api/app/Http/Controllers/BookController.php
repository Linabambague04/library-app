<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

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

        $books = $query->paginate(10); 

        return response()->json([
            'success' => true,
            'message' => 'Lista de libros',
            'data'    => $books,
        ]);
    }


    public function store(Request $request)
    {
        $author = Auth::user()->author;

        if (!$author) {
            return response()->json([
                'success' => false,
                'message' => 'Solo un autor puede crear libros',
            ], 403);
        }

        $data = $request->validate([
            'ISBN'             => 'required|string|max:255|unique:books,ISBN',
            'title'            => 'required|string|max:255',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'subtitle'         => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages'     => 'nullable|integer',
            'genre'            => 'nullable|string',
            'editorial_id'     => 'nullable|exists:editorials,id',
            'language'         => 'nullable|string',
            'synopsis'         => 'nullable|string',
            'file'             => 'nullable|mimes:pdf|max:10240',
        ]);


        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('book_images', 'public');
        }

        if ($request->hasFile('file')) {
            $data['file'] = $request->file('file')->store('book_files', 'public');
        }

        $data['author_id'] = $author->id;

        $book = Book::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Libro creado correctamente',
            'data'    => $book->load('author.user', 'editorial.user'),
        ], 201);
    }


    public function show($id)
    {
        $book = Book::with(['author.user', 'editorial.user'])->find($id);

        if (!$book) {
            return response()->json([
                'success' => false,
                'message' => 'Libro no encontrado',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Detalle del libro',
            'data'    => $book,
        ]);
    }


    public function update(Request $request, $id)
    {
        $author = Auth::user()->author;

        if (!$author) {
            return response()->json([
                'success' => false,
                'message' => 'No eres un autor',
            ], 403);
        }

        $book = Book::find($id);

        if (!$book || $book->author_id !== $author->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes editar este libro',
            ], 403);
        }

        $data = $request->validate([
            'ISBN'             => 'sometimes|string|max:255|unique:books,ISBN,' . $id,
            'title'            => 'sometimes|string|max:255',
            'image'            => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            'subtitle'         => 'nullable|string',
            'publication_date' => 'nullable|date',
            'number_pages'     => 'nullable|integer',
            'genre'            => 'nullable|string',
            'editorial_id'     => 'nullable|exists:editorials,id',
            'language'         => 'nullable|string',
            'synopsis'         => 'nullable|string',
            'file'             => 'nullable|mimes:pdf|max:10240',
        ]);

        if ($request->hasFile('image')) {
            if ($book->image && Storage::disk('public')->exists($book->image)) {
                Storage::disk('public')->delete($book->image);
            }
            $data['image'] = $request->file('image')->store('book_images', 'public');
        }

        if ($request->hasFile('file')) {
            if ($book->file && Storage::disk('public')->exists($book->file)) {
                Storage::disk('public')->delete($book->file);
            }
            $data['file'] = $request->file('file')->store('book_files', 'public');
        }

        $book->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Libro actualizado correctamente',
            'data'    => $book->load('author.user', 'editorial.user'),
        ]);
    }

    public function destroy($id)
    {
        $author = Auth::user()->author;

        if (!$author) {
            return response()->json([
                'success' => false,
                'message' => 'No eres un autor',
            ], 403);
        }

        $book = Book::find($id);

        if (!$book || $book->author_id !== $author->id) {
            return response()->json([
                'success' => false,
                'message' => 'No puedes eliminar este libro',
            ], 403);
        }

        if ($book->image && Storage::disk('public')->exists($book->image)) {
            Storage::disk('public')->delete($book->image);
        }

        if ($book->file && Storage::disk('public')->exists($book->file)) {
            Storage::disk('public')->delete($book->file);
        }

        $book->delete();

        return response()->json([
            'success' => true,
            'message' => 'Libro eliminado correctamente',
        ]);
    }
}
