<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Author;
use App\Models\Editorial;
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:6|confirmed',
            'role'     => 'required|in:author,editorial,admin',
            'author.biography'    => 'sometimes|required_if:role,author|string',
            'editorial.company_name' => 'sometimes|required_if:role,editorial|string',
        ]);


        $user = User::create([
            'name'     => $data['name'],
            'email'    => $data['email'],
            'password' => Hash::make($data['password']),
            'role'     => $data['role'],
        ]);

        if ($user->isAuthor()) {
            Author::create([
                'user_id'   => $user->id,
                'last_name' => $data['author']['last_name'] ?? null,
                'date_birth' => $data['author']['date_birth'] ?? null,
                'nationality' => $data['author']['nationality'] ?? null,
                'biography' => $data['author']['biography'] ?? null,
                'contact' => $data['author']['contact'] ?? null,

            ]);
        } elseif ($user->isEditorial()) {
            Editorial::create([
                'user_id'      => $user->id,
                'company_name' => $data['editorial']['company_name'] ?? null,
                'website' => $data['editorial']['website'] ?? null,
                'phone' => $data['editorial']['phone'] ?? null,
                'address' => $data['editorial']['address'] ?? null,
                'description' => $data['editorial']['description'] ?? null,
            ]);
        }

        return response()->json([
            'message' => 'Usuario creado exitosamente',
            'user'    => $user->load('author', 'editorial'),
        ], 201);
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
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
