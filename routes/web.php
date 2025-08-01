<?php

use App\Http\Controllers\Actions\CategoryController;
use App\Http\Controllers\Actions\ItemController;
use App\Http\Controllers\PagesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;


Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::get('/categories', [PagesController::class, 'categories']);
    Route::get('/categories/create', [CategoryController::class, 'index']);
    Route::get('/categories/show/{id}', [CategoryController::class, 'show']);

    Route::get('/items', [PagesController::class, 'items']);
    Route::get('/items/create', [ItemController::class, 'index']);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
