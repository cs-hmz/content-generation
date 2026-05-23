<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\GenerationController;
use App\Http\Controllers\TemplateController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index']);

    Route::post('/generations', [GenerationController::class, 'store'])
        ->middleware('check.quota');
    Route::get('/generations', [GenerationController::class, 'index']);
    Route::get('/generations/{generation}', [GenerationController::class, 'show']);
    Route::post('/generations/{generation}/export', [ExportController::class, 'store']);

    Route::apiResource('templates', TemplateController::class);
    Route::post('templates/{template}/duplicate', [TemplateController::class, 'duplicate']);
});