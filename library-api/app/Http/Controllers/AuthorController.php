<?php

namespace App\Http\Controllers;

use App\Models\Author;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthorController extends Controller
{
    public function me()
    {
        $author = Auth::user()->author;
        if (!$author) {
            return response()->json(['message' => 'No eres un autor'], 403);
        }
        return response()->json($author->load('books'));
    }

    public function update(Request $request)
    {
        $author = Auth::user()->author;
        if (!$author) {
            return response()->json(['message' => 'No eres un autor'], 403);
        }

        $data = $request->validate([
            'last_name'   => 'sometimes|string|max:255',
            'date_birth'  => 'nullable|date',
            'nationality' => 'nullable|string|max:255',
            'biography'   => 'nullable|string',
            'contact'     => 'nullable|string|max:255',
        ]);

        $author->update($data);
        return response()->json($author->load('books'));
    }
}
