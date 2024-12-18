<?php

namespace App\Http\Controllers;

use App\Models\Food;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FoodController extends Controller
{
    public function index()
    {
        $foods = Food::all()->map(function ($food) {
            $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;
            return $food;
        });

        return response()->json(['status' => 'success', 'data' => $foods], 200);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            $file = $request->file('gambar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('foods', $filename, 'public');
            $validated['gambar'] = $filename;
        }

        $food = Food::create($validated);

        // Include category name and image URL
        $food->category_name = $food->category ? $food->category->name : null;
        $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

        return response()->json([
            'status' => 'success',
            'message' => 'Food added successfully',
            'data' => $food,
        ], 201);
    }

    public function show($id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        $food->gambar_url = $food->gambar ? asset('storage/foods/' . $food->gambar) : null;

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
            'harga' => 'sometimes|numeric|min:0',
            'gambar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('gambar')) {
            // Hapus file gambar lama jika ada
            if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
                Storage::disk('public')->delete('foods/' . $food->gambar);
            }

            $file = $request->file('gambar');
            $filename = time() . '_' . $file->getClientOriginalName();
            $file->storeAs('foods', $filename, 'public');
            $validated['gambar'] = $filename;
        }

        $food->update($validated);

        return response()->json(['status' => 'success', 'data' => $food], 200);
    }

    public function destroy($id)
    {
        $food = Food::find($id);

        if (!$food) {
            return response()->json(['status' => 'error', 'message' => 'Food not found'], 404);
        }

        // Hapus file gambar jika ada
        if ($food->gambar && Storage::disk('public')->exists('foods/' . $food->gambar)) {
            Storage::disk('public')->delete('foods/' . $food->gambar);
        }

        $food->delete();

        return response()->json(['status' => 'success', 'message' => 'Food deleted'], 200);
    }
}