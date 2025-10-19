<?php

namespace App\Workarounds;

use Laravel\Reverb\Protocols\Pusher\Channels\Concerns\InteractsWithPresenceChannels;
use Laravel\Reverb\Contracts\Connection;

trait InteractsWithCSRPresence
{
    use InteractsWithPresenceChannels;

    /**
     * Subscribe to the given channel.
     */
    public function subscribe(Connection $connection, ?string $auth = null, ?string $data = null): void
    {
        parent::subscribe($connection, $auth, $data);
        var_dump("yayyayaya subbed!");
    }

    /**
     * Unsubscribe from the given channel.
     */
    public function unsubscribe(Connection $connection): void
    {
        parent::unsubscribe($connection);
        var_dump("yayyayaya unsubbed!");
    }
}
