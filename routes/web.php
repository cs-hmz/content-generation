<?php

use App\Http\Controllers\BillingController;
use App\Http\Controllers\ProfileController;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/generate', function () {
        return Inertia::render('Generate/Index', [
            'templates' => TemplateResource::collection(Template::public()->get()),
        ]);
    })->name('generate');

    Route::inertia('/history', 'History/Index')->name('history');

    Route::get('/templates', function () {
        $templates = Template::where(function ($q) {
            $q->where('is_public', true)->orWhere('user_id', request()->user()->id);
        })->get();
        return Inertia::render('Templates/Index', [
            'templates' => TemplateResource::collection($templates),
        ]);
    })->name('templates');

    Route::get('/billing', [BillingController::class, 'index'])->name('billing.index');
    Route::post('/billing/subscribe', [BillingController::class, 'subscribe'])->name('billing.subscribe');
    Route::post('/billing/portal', [BillingController::class, 'portal'])->name('billing.portal');
});

Route::post('/billing/webhook', [BillingController::class, 'webhook'])->name('billing.webhook');

require __DIR__.'/auth.php';