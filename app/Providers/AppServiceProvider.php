<?php

namespace App\Providers;

use App\Listeners\BroadcastMessage;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Event;
use Laravel\Reverb\Events\MessageReceived;
use Illuminate\Support\Facades\Log;
use App\Workarounds\PresenceProcessingServer;
use App\Workarounds\PresenceProcessingEventHandler;
use Laravel\Reverb\Protocols\Pusher\Server as PusherServer;
use Laravel\Reverb\Protocols\Pusher\EventHandler;

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

        // $this->app->bind(RedisPubSubProvider::class, SessionPubSubProvider::class);
        $this->app->bind(EventHandler::class, PresenceProcessingEventHandler::class);
        $this->app->bind(PusherServer::class, PresenceProcessingServer::class);
        // $this->app->bind(
        //     Channel::class, 
        //     ModdedChannel::class,
        //     true
        // );
        // $this->app->rebinding(PresenceChannel::class, function () {
        //     Log::info("uhmm? its not seeig this??");
        // });

        // $this->app->extend(
        //     "Laravel\\Reverb\\Protocols\\Pusher\\Channels\\PresenceChannel", function ($service, $container) {
        //         var_dump("rawrrr");
        //         return $service;
        //     }
        // );

        Event::listen(
            MessageReceived::class,
            BroadcastMessage::class
        );
    }
}
