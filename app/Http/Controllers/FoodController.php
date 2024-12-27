<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Food::with('category:id,name')
            ->get()
            ->map(function ($food) {
                $food->gambar_url = $food->getGambarUrlAttribute();
                $food->category_name = $food->category ? $food->category->name : null;
                return $food;
            });

        return response()->json(['status' => 'success', 'data' => $foods], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|integer|min:0',
            'category_id' => 'required|exists:categories,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            if ($request->hasFile('gambar')) {
                $fileName = $request->file('gambar')->store('foods', 'public');
                $validated['gambar'] = basename($fileName);
            }

            $food = Food::create($validated);

            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;
            $food->category_name = $food->category->name;

            return response()->json([
                'status' => 'success',
                'message' => 'Food added successfully',
                'data' => $food,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to save food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }


    public function show($id)
    {
        $food = Food::with('category:id,name')->find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        $food->gambar_url = $food->getGambarUrlAttribute();
        $food->category_name = $food->category ? $food->category->name : null;

        return response()->json(['status' => 'success', 'data' => $food], 200);
    }

    public function update(Request $request, $id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        $validated = $request->validate([
            'nama' => 'sometimes|string|max:255',
            'deskripsi' => 'sometimes|string',
            'harga' => 'sometimes|integer|min:0',
            'category_id' => 'sometimes|exists:categories,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        try {
            if ($request->hasFile('gambar')) {
                // Delete old image
                if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
                    Storage::disk('public')->delete('foods/' . $food->gambar);
                }

                $fileName = $request->file('gambar')->store('foods', 'public');
                $validated['gambar'] = basename($fileName);
            }

            $food->update($validated);

            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

            return response()->json(['status' => 'success', 'data' => $food], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to update food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    public function destroy($id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        try {
            // Delete image file if exists
            if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
                Storage::disk('public')->delete('foods/' . $food->gambar);
            }

            $food->delete();

            return response()->json(['status' => 'success', 'message' => 'Food deleted'], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Failed to delete food',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}