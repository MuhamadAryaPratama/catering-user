<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    AuthController,
    FoodController,
    OrderController,
    PaymentController,
    CategoryController,
    StockController,
    SuggestionController,
    ShoppingCartController
};
use App\Http\Controllers\Admin\{
    AuthController as AdminAuthController,
    OrderController as AdminOrderController,
    PaymentController as AdminPaymentController
};

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Food & Category Routes
Route::get('/foods', [FoodController::class, 'index']);
Route::get('/foods/{id}', [FoodController::class, 'show']);
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/categories/{id}/foods', [CategoryController::class, 'getFoodsByCategory']);

// Public Suggestion Routes
Route::get('/suggestions', [SuggestionController::class, 'index']);
Route::get('/suggestions/{id}', [SuggestionController::class, 'show']);

/*
|--------------------------------------------------------------------------
| Authentication Routes
|--------------------------------------------------------------------------
*/

// User Authentication
Route::prefix('auth')->group(function () {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);
    Route::post('forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AuthController::class, 'resetPassword']);

    Route::middleware('auth:api')->group(function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::post('refresh', [AuthController::class, 'refresh']);
        Route::post('me', [AuthController::class, 'me']);
        Route::put('update-profile', [AuthController::class, 'updateProfile']);
    });
});

// Admin Authentication
Route::prefix('admin/auth')->group(function () {
    Route::post('register', [AdminAuthController::class, 'register']);
    Route::post('login', [AdminAuthController::class, 'login']);
    Route::post('forgot-password', [AdminAuthController::class, 'forgotPassword']);
    Route::post('reset-password', [AdminAuthController::class, 'resetPassword']);

    Route::middleware('auth:admin-api')->group(function () {
        Route::post('logout', [AdminAuthController::class, 'logout']);
        Route::post('refresh', [AdminAuthController::class, 'refresh']);
        Route::post('me', [AdminAuthController::class, 'me']);
    });
});

/*
|--------------------------------------------------------------------------
| Protected User Routes
|--------------------------------------------------------------------------
*/

Route::middleware('auth:api')->group(function () {
    // Shopping Cart
    Route::prefix('cart')->controller(ShoppingCartController::class)->group(function () {
        Route::get('/', 'index');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // Orders
    Route::prefix('orders')->controller(OrderController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::post('/direct', 'storeDirect');
        Route::post('/cart', 'storeFromCart');
        Route::put('/{id}/status', 'updateStatus');
    });

    // Payments
    Route::prefix('payments')->controller(PaymentController::class)->group(function () {
        Route::post('/{orderId}', 'createPayment');
        Route::post('/callback', 'callback')->name('payments.callback');
        Route::get('/success', 'return')->name('payments.return');
    });

    // Protected Suggestion Routes
    Route::prefix('suggestions')->controller(SuggestionController::class)->group(function () {
        Route::post('/', 'store');
        
    });
});

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::prefix('admin')->middleware('auth:admin-api')->group(function () {
    // User Management
    Route::get('/users', [AdminAuthController::class, 'getAllUsers']);

    // Orders Management
    Route::prefix('orders')->controller(AdminOrderController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::put('/{id}/status', 'updateStatus');
    });

    // Payments Management
    Route::prefix('payments')->controller(AdminPaymentController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::put('/{id}/status', 'updateStatus');
    });

    // Stock Management
    Route::prefix('stocks')->controller(StockController::class)->group(function () {
        Route::get('/', 'index');
        Route::get('/{id}', 'show');
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // Suggestions Management
    Route::prefix('suggestions')->controller(SuggestionController::class)->group(function () {
        Route::delete('/{id}', 'destroy');
    });
});

/*
|--------------------------------------------------------------------------
| Admin Food Management Routes
|--------------------------------------------------------------------------
*/

Route::middleware('admin-only')->group(function () {
    // Food Management
    Route::prefix('foods')->controller(FoodController::class)->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });

    // Category Management
    Route::prefix('categories')->controller(CategoryController::class)->group(function () {
        Route::post('/', 'store');
        Route::put('/{id}', 'update');
        Route::delete('/{id}', 'destroy');
    });
});