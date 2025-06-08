<?php

namespace App\Providers;

use App\Http\Middleware\DeleteBannedUserOnSession;
use App\Listeners\BroadcastMessage;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Workarounds\PresenceProcessingServer;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Support\Facades\Event;
use Laravel\Reverb\Events\MessageReceived;
use Laravel\Reverb\Protocols\Pusher\Server as PusherServer;

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
        Vite::prefetch(concurrency: 3);

        $this->app->bind(PusherServer::class, PresenceProcessingServer::class);

        Event::listen(
            MessageReceived::class,
            BroadcastMessage::class
        );
    }
}
