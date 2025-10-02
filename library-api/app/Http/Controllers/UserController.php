<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Models\Author;
use App\Models\Editorial;
use App\Models\Reader;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function me()
    {
        return response()->json(
            Auth::user()->load('author', 'editorial', 'reader.books')
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }
    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'name'     => 'sometimes|string|max:255',
            'email'    => 'sometimes|email|unique:users,email,' . $user->id,
            'password' => 'sometimes|string|min:6|confirmed',

            'nickname'       => 'sometimes|string|max:255',
            'date_birth'     => 'sometimes|date',
            'favorite_genre' => 'sometimes|string|max:255',
        ]);

        if (isset($validated['password'])) {
            $validated['password'] = bcrypt($validated['password']);
        }

        $user->update($validated);

        if ($user->isReader() && $user->reader) {
            $user->reader->update($request->only(['nickname', 'date_birth', 'favorite_genre']));
        }

        return response()->json($user->load('author', 'editorial', 'reader.books'));
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
