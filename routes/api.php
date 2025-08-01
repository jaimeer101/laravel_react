<?php

use App\Http\Controllers\Actions\CategoryController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::middleware(['auth:sanctum'])->group(function () {
    Route::POST('categories/store', [CategoryController::class, 'store']);
    Route::POST('categories/update/{id}', [CategoryController::class, 'update']);
    Route::GET('categories/delete/{id}', [CategoryController::class, 'destroy']);
});

