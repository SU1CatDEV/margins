<?php

namespace App\Workarounds;

use App\Models\CentralSaverRepo;
use Laravel\Reverb\Contracts\Connection;
use Laravel\Reverb\Protocols\Pusher\Server as BaseServer;
use Laravel\Reverb\Loggers\Log;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log as FacadesLog;

// OKAY SCREW IT WERE REWRITING IT TO USE SOCKET IDS BECAUSE I HATE MYSELF . GOOD NIGHT A
class PresenceProcessingServer extends BaseServer
{

    // public function open(Connection $connection): void
    // {
    //     try {
    //         $this->verifyOrigin($connection);

    //         $connection->touch();

    //         $this->handler->handle($connection, 'pusher:connection_established');

            

    //         Log::info('hallo!!', $connection->id());
    //     } catch (Exception $e) {
    //         $this->error($connection, $e);
    //     }
    // }

    // this is terrible code but it wont let me bind anything else lol
    public function close(Connection $connection): void
    {
        // $allChannels = $this->channels->for($connection->app())->all();
        // var_dump(count($allChannels));
        
        $channelName = ChannelConnectionStore::getChannel($connection->id());
        if ($channelName) {
            CentralSaverRepo::handleUserLeave(intval(str_replace('presence-book.', '', $channelName)), $connection->id());
        } // else: the user did not properly connect in the first place

        ChannelConnectionStore::disconnectFromStore($connection->id());

        $this->channels
            ->for($connection->app())
            ->unsubscribeFromAll($connection);

        $connection->disconnect();

        Log::info('lalallala', $connection->id());
    }
}