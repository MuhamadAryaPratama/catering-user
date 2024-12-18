<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CategoryController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Auth Routes
Route::group(['middleware' => 'api', 'prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('logout', [AuthController::class, 'logout']);
    Route::post('refresh', [AuthController::class, 'refresh']);
    Route::post('me', [AuthController::class, 'me']);
});

// Food Routes
Route::prefix('foods')->group(function () {
    Route::get('/', [FoodController::class, 'index']); // Menampilkan semua makanan
    Route::post('/', [FoodController::class, 'store']); // Menambahkan makanan baru
    Route::get('/{id}', [FoodController::class, 'show']); // Menampilkan detail makanan berdasarkan ID
    Route::put('/{id}', [FoodController::class, 'update']); // Memperbarui makanan berdasarkan ID
    Route::delete('/{id}', [FoodController::class, 'destroy']); // Menghapus makanan berdasarkan ID
});

Route::prefix('cart')->group(function () {
    Route::get('/', [ShoppingCartController::class, 'index']); // Menampilkan semua item di cart
    Route::post('/', [ShoppingCartController::class, 'store']); // Menambahkan item ke cart
    Route::put('/{id}', [ShoppingCartController::class, 'update']); // Memperbarui item di cart
    Route::delete('/{id}', [ShoppingCartController::class, 'destroy']); // Menghapus item dari cart
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::post('/', [CategoryController::class, 'store']);
    Route::get('/{id}', [CategoryController::class, 'show']);
    Route::put('/{id}', [CategoryController::class, 'update']);
    Route::delete('/{id}', [CategoryController::class, 'destroy']);
    Route::get('/{id}/foods', [CategoryController::class, 'getFoodsByCategory']);
});