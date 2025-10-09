<?php

namespace App\Http\Controllers;

use App\Models\Editorial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EditorialController extends Controller
{
    public function index()
    {
        $editorials = Editorial::with('user')->select('id', 'user_id', 'company_name')->get();
        return response()->json([
            'success' => true,
            'data' => $editorials,
        ]);
    }
    public function me()
    {
        $editorial = Auth::user()->editorial;
        if (!$editorial) {
            return response()->json(['message' => 'No eres una editorial'], 403);
        }
        return response()->json($editorial->load('books'));
    }

    public function update(Request $request)
    {
        $editorial = Auth::user()->editorial;
        if (!$editorial) {
            return response()->json(['message' => 'No eres una editorial'], 403);
        }

        $data = $request->validate([
            'company_name' => 'sometimes|string|max:255',
            'website'      => 'nullable|string',
            'phone'        => 'nullable|string|max:20',
            'address'      => 'nullable|string|max:255',
            'description'  => 'nullable|string',
        ]);

        $editorial->update($data);
        return response()->json($editorial->load('books'));
    }
}

