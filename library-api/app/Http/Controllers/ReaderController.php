<?php

namespace App\Http\Controllers;

use App\Models\Reader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReaderController extends Controller
{

    public function index()
    {
        $readers = Reader::with('user')->get();
        return view('readers.index', compact('readers'));
    }


    public function create()
    {
        return view('readers.create');
    }

   
    public function store(Request $request)
    {
        $request->validate([
            'nickname' => 'nullable|string|max:255',
            'date_birth' => 'nullable|date',
            'favorite_genre' => 'nullable|string|max:255',
        ]);

        Reader::create([
            'user_id' => Auth::id(), 
            'nickname' => $request->nickname,
            'date_birth' => $request->date_birth,
            'favorite_genre' => $request->favorite_genre,
        ]);

        return redirect()->route('readers.index')->with('success', 'Lector creado correctamente.');
    }

    
    public function show(Reader $reader)
    {
        return view('readers.show', compact('reader'));
    }

    
    public function edit(Reader $reader)
    {
        return view('readers.edit', compact('reader'));
    }

   
    public function update(Request $request, Reader $reader)
    {
        $request->validate([
            'nickname' => 'nullable|string|max:255',
            'date_birth' => 'nullable|date',
            'favorite_genre' => 'nullable|string|max:255',
        ]);

        $reader->update($request->only(['nickname', 'date_birth', 'favorite_genre']));

        return redirect()->route('readers.index')->with('success', 'Lector actualizado correctamente.');
    }

 
    public function destroy(Reader $reader)
    {
        $reader->delete();
        return redirect()->route('readers.index')->with('success', 'Lector eliminado correctamente.');
    }

    public function addBook(Request $request, Reader $reader)
    {
        $request->validate([
            'book_id' => 'required|exists:books,id',
            'status' => 'nullable|in:wishlist,reading,finished',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        if ($reader->books()->where('book_id', $request->book_id)->exists()) {
            return back()->with('error', 'Este libro ya está en tu lista.');
        }

        $reader->books()->attach($request->book_id, [
            'status' => $request->status ?? 'wishlist',
            'started_at' => $request->started_at,
            'finished_at' => $request->finished_at,
            'rating' => $request->rating,
        ]);

        return back()->with('success', 'Libro agregado a tu lista.');
    }

    public function updateBook(Request $request, Reader $reader, Book $book)
    {
        $request->validate([
            'status' => 'nullable|in:wishlist,reading,finished',
            'started_at' => 'nullable|date',
            'finished_at' => 'nullable|date',
            'rating' => 'nullable|integer|min:1|max:5',
        ]);

        $reader->books()->updateExistingPivot($book->id, [
            'status' => $request->status,
            'started_at' => $request->started_at,
            'finished_at' => $request->finished_at,
            'rating' => $request->rating,
        ]);

        return back()->with('success', 'Libro actualizado en tu lista.');
    }

    public function removeBook(Reader $reader, Book $book)
    {
        $reader->books()->detach($book->id);

        return back()->with('success', 'Libro eliminado de tu lista.');
    }
}
