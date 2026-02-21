<?php

use App\Http\Controllers\GameController;
use App\Http\Controllers\HistoryController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RoundController;
use App\Http\Controllers\SessionController;
use Illuminate\Support\Facades\Route;

// Redirect root to games list (home screen)
Route::get('/', function () {
    return redirect()->route('home');
});

// Breeze redirects to 'dashboard' after login/register — send them straight to home
Route::get('/dashboard', function () {
    return redirect()->route('home');
})->middleware(['auth', 'verified'])->name('dashboard');

// All app routes require auth
Route::middleware(['auth', 'verified'])->group(function () {

    // Home — game picker
    Route::get('/home', [GameController::class, 'index'])->name('home');

    // Play screen for a specific game
    Route::get('/play/{slug}', [GameController::class, 'show'])->name('play');

    // Session API — start and complete
    Route::post('/sessions', [SessionController::class, 'store'])->name('sessions.store');
    Route::patch('/sessions/{session}/complete', [SessionController::class, 'complete'])->name('sessions.complete');

    // Rounds API — record individual putts within a session
    Route::post('/sessions/{session}/rounds', [RoundController::class, 'store'])->name('rounds.store');

    // History — overview and single session detail
    Route::get('/history', [HistoryController::class, 'index'])->name('history');
    Route::get('/history/{session}', [HistoryController::class, 'show'])->name('history.show');

    // Profile (from Breeze scaffolding)
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
