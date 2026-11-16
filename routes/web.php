<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AdminOutfitController;
use App\Http\Controllers\AdminTapisController;
use App\Http\Controllers\PublicController;
use App\Http\Controllers\ScanController;
use Illuminate\Support\Facades\Route;

Route::get('/', [PublicController::class, 'home'])->name('home');

Route::get('/galeri-tapis', [PublicController::class, 'galeri'])->name('galeri.index');
Route::get('/galeri-tapis/{motif:slug}', [PublicController::class, 'motifDetail'])->name('galeri.detail');

Route::get('/katalog-outfit', [PublicController::class, 'outfitIndex'])->name('outfit.index');
Route::get('/katalog-outfit/{outfit:slug}', [PublicController::class, 'outfitDetail'])->name('outfit.detail');

Route::get('/scan', [ScanController::class, 'scan'])->name('scan');
Route::post('/scan/motif', [ScanController::class, 'motif'])->middleware('throttle:10,1')->name('scan.motif');
Route::post('/scan/skintone', [ScanController::class, 'skintone'])->middleware('throttle:10,1')->name('scan.skintone');

// Admin
Route::redirect('/login', '/admin/login')->name('login');
Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('login', [AdminAuthController::class, 'loginForm'])->name('login');
    Route::post('login', [AdminAuthController::class, 'login'])->middleware('throttle:5,1')->name('login.attempt');
    Route::post('logout', [AdminAuthController::class, 'logout'])->middleware('auth')->name('logout');
    Route::middleware('auth')->group(function () {
        Route::get('/', function () {
            return view('admin.dashboard', [
                'motifCount' => \App\Models\TapisMotif::count(),
                'outfitCount' => \App\Models\Outfit::count(),
            ]);
        })->name('dashboard');

        Route::resource('motifs', AdminTapisController::class)
            ->parameters(['motifs' => 'motif'])
            ->names('motifs');

        Route::resource('outfits', AdminOutfitController::class)
            ->parameters(['outfits' => 'outfit'])
            ->names('outfits');
    });
});
