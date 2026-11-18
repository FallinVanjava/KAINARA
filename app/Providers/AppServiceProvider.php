<?php

namespace App\Providers;

use Illuminate\Foundation\Console\ServeCommand;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Laravel strips non-allowlisted env vars from `php artisan serve` child process on Windows.
        // SystemRoot is required by PHP's socket layer; without it the child cannot bind the port.
        ServeCommand::$passthroughVariables[] = 'SystemRoot';
        foreach (['APP_KEY', 'APP_URL', 'DB_CONNECTION', 'DB_HOST', 'DB_PORT', 'DB_DATABASE', 'DB_USERNAME', 'DB_PASSWORD', 'ADMIN_EMAIL', 'ADMIN_PASSWORD', 'SESSION_DRIVER', 'SESSION_LIFETIME', 'SESSION_ENCRYPT', 'CACHE_STORE', 'CACHE_PREFIX'] as $name) {
            ServeCommand::$passthroughVariables[] = $name;
        }

        if (config('app.env') === 'production') {
            URL::forceScheme('https');
        }
    }
}
