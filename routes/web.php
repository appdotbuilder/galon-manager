<?php

use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\GalonController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/health-check', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now()->toISOString(),
    ]);
})->name('health-check');

// Main galon distribution page
Route::get('/', [GalonController::class, 'index'])->name('home');

// API routes for galon distribution (accessible without auth for barcode scanner)
Route::prefix('api')->group(function () {
    Route::get('/employee/{employee_id}', [GalonController::class, 'show'])->where('employee_id', '.*');
    Route::post('/galon/transaction', [GalonController::class, 'store']);
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Employee management (requires authentication)
    Route::resource('employees', EmployeeController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';