<?php

namespace App\Http\Controllers;

use App\Models\Suggestion;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class SuggestionController extends Controller
{
    /**
     * Display a listing of suggestions.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        $suggestions = Suggestion::with('user:id,name')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $suggestions,
        ], 200);
    }

    /**
     * Store a newly created suggestion.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'content' => 'required|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => $validator->errors(),
            ], 400);
        }

        $suggestion = Suggestion::create([
            'user_id' => Auth::id(),
            'content' => $request->content,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Suggestion submitted successfully',
            'data' => $suggestion,
        ], 201);
    }

    /**
     * Display the specified suggestion.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        $suggestion = Suggestion::with('user:id,name')->find($id);

        if (!$suggestion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Suggestion not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $suggestion,
        ], 200);
    }

    /**
     * Remove the specified suggestion.
     *
     * @param  int  $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        $suggestion = Suggestion::find($id);

        if (!$suggestion) {
            return response()->json([
                'status' => 'error',
                'message' => 'Suggestion not found',
            ], 404);
        }

        // Hanya admin yang bisa menghapus
        if (!Auth::guard('admin-api')->check()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized to delete this suggestion. Only admins are allowed.',
            ], 403);
        }

        try {
            $suggestion->delete();
            return response()->json([
                'status' => 'success',
                'message' => 'Suggestion deleted successfully',
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error deleting suggestion: ' . $e->getMessage(),
            ], 500);
        }
    }
}