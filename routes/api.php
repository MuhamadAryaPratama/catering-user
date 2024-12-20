<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\FoodController;
use App\Http\Controllers\ShoppingCartController;
use App\Http\Controllers\CategoryController;

// Public Routes (tanpa autentikasi)
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}/foods', [CategoryController::class, 'getFoodsByCategory']);
Route::get('/foods/{id}', [FoodController::class, 'show']);

// Auth Routes
Route::group(['middleware' => 'api', 'prefix' => 'auth'], function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:api');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:api');
    Route::post('me', [AuthController::class, 'me'])->middleware('auth:api');
    Route::post('change', [AuthController::class, 'changePassword'])->middleware('auth:api');
});

// Protected Routes (memerlukan autentikasi)
Route::group(['middleware' => 'auth:api'], function () {
    // Food Routes
    Route::post('/foods', [FoodController::class, 'store']);
    Route::put('/foods/{id}', [FoodController::class, 'update']);
    Route::delete('/foods/{id}', [FoodController::class, 'destroy']);

    // Category Routes
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Shopping Cart Routes
    Route::get('/cart', [ShoppingCartController::class, 'index']);
    Route::post('/cart', [ShoppingCartController::class, 'store']);
    Route::put('/cart/{id}', [ShoppingCartController::class, 'update']);
    Route::delete('/cart/{id}', [ShoppingCartController::class, 'destroy']);
});