<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Author;
use App\Models\Editorial;
use App\Models\Reader;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|string|email|unique:users',
            'password' => 'required|string|min:6',
            'role'     => 'required|in:author,editorial,reader,admin',

            // author
            'last_name'     => 'nullable|string|max:255',
            'date_birth'    => 'nullable|date',
            'nationality'   => 'nullable|string|max:255',
            'biography'     => 'nullable|string',
            'contact'       => 'nullable|string|max:255',

            // editorial
            'company_name'  => 'nullable|string|max:255',
            'website'       => 'nullable|string|max:255',
            'phone'         => 'nullable|string|max:255',
            'address'       => 'nullable|string|max:255',
            'description'   => 'nullable|string',

            // reader
            'nickname'       => 'nullable|string|max:255',
            'favorite_genre' => 'nullable|string|max:255',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => $request->role,
        ]);

        if ($user->role === 'author') {
            Author::create([
                'user_id'     => $user->id,
                'last_name'   => $request->last_name ?? '',
                'date_birth'  => $request->date_birth ?? null,
                'nationality' => $request->nationality ?? null,
                'biography'   => $request->biography ?? null,
                'contact'     => $request->contact ?? null,
            ]);
        }

        if ($user->role === 'editorial') {
            Editorial::create([
                'user_id'      => $user->id,
                'company_name' => $request->company_name ?? '',
                'website'      => $request->website ?? null,
                'phone'        => $request->phone ?? null,
                'address'      => $request->address ?? null,
                'description'  => $request->description ?? null,
            ]);
        }

        if ($user->role === 'reader') {
            Reader::create([
                'user_id'       => $user->id,
                'nickname'      => $request->nickname ?? '',
                'date_birth'    => $request->date_birth ?? null,
                'favorite_genre'=> $request->favorite_genre ?? null,
            ]);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('author', 'editorial', 'reader'),
            'token' => $token,
        ]);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Credenciales inválidas'], 401);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user'  => $user->load('author', 'editorial', 'reader'),
            'token' => $token,
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();
        return response()->json(['message' => 'Sesión cerrada']);
    }
}
