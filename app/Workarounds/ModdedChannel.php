<?php

namespace App\Workarounds;

use Laravel\Reverb\Protocols\Pusher\Channels\Channel;
use Illuminate\Support\Facades\Log;
use Laravel\Reverb\Protocols\Pusher\Concerns\SerializesChannels;
use Laravel\Reverb\Protocols\Pusher\Contracts\ChannelConnectionManager;
use Laravel\Reverb\Protocols\Pusher\Contracts\ChannelManager;

class ModdedChannel extends Channel
{

    /**
     * Create a new channel instance.
     */
    public function __construct(protected string $name)
    {
        parent::__construct($name);
        Log::info("modded channel logged");
        var_dump("constructed. hooray");
    }
}
