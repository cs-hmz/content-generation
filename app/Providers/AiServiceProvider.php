<?php

namespace App\Providers;

use App\Services\Ai\AiProviderFactory;
use Illuminate\Support\ServiceProvider;

class AiServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(AiProviderFactory::class, function ($app) {
            return new AiProviderFactory();
        });
    }

    public function boot(): void
    {
        //
    }
}