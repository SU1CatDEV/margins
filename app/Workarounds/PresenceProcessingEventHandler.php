<?php

namespace App\Workarounds;

use Laravel\Reverb\Protocols\Pusher\EventHandler;
use Exception;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Laravel\Reverb\Contracts\Connection;
use Laravel\Reverb\Protocols\Pusher\Channels\CacheChannel;
use Laravel\Reverb\Protocols\Pusher\Channels\Channel;
use Laravel\Reverb\Protocols\Pusher\Contracts\ChannelManager;
use App\Models\CentralSaverRepo;

// ok so. the request sends both the 
class PresenceProcessingEventHandler extends EventHandler
{
    /**
     * Create a new Pusher event instance.
     */
    public function __construct(protected ChannelManager $channels)
    {
        //
    }
    /**
     * Carry out any actions that should be performed after a subscription.
     */
    protected function afterSubscribe(Channel $channel, Connection $connection): void
    {
        $channelName = $channel->name();
        if (str_starts_with($channelName, 'presence-book.')) {
            ChannelConnectionStore::addToStore($connection->id(), $channelName);
            $bookId = intval(str_replace('presence-book.', '', $channelName));
            CentralSaverRepo::handleUserJoin($bookId, $connection->id());
        }
        $this->sendInternally($connection, 'subscription_succeeded', $channel->data(), $channel->name());

        match (true) {
            $channel instanceof CacheChannel => $this->sendCachedPayload($channel, $connection),
            default => null,
        };
    }
}
