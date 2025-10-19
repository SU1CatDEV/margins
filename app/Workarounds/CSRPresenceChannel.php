<?php

namespace App\Workarounds;

use Laravel\Reverb\Protocols\Pusher\Channels\PresenceChannel;
use Laravel\Reverb\Contracts\Connection;
use Illuminate\Support\Facades\Log;

class CSRPresenceChannel extends PresenceChannel
{
    public function subscribe(Connection $connection, ?string $auth = null, ?string $data = null): void
    {
        parent::subscribe($connection, $auth, $data);
        // $this->traitSub($connection, $auth, $data);
        Log::info("r u gonna bother functioning orrrrr");
        var_dump("yayyayaya subbed!");
    }

    public function unsubscribe(Connection $connection): void
    {
        parent::unsubscribe($connection);
        // $this->traitUnsub($connection);
        Log::info("it unsubbed lol");
        var_dump("yayyayaya unsubbed!");
    }
}
