<?php

namespace App\Workarounds;

use App\Models\CentralSaverRepo;
use Laravel\Reverb\Contracts\Connection;
use Laravel\Reverb\Protocols\Pusher\Server as BaseServer;
use Laravel\Reverb\Loggers\Log;
use Exception;
use Illuminate\Support\Facades\Log as FacadesLog;

class PresenceProcessingServer extends BaseServer
{
    public function close(Connection $connection): void
    {
        $allChannels = $this->channels->for($connection->app())->all();
        foreach($allChannels as $channel) {
            $comparableRawConnectionObjects = array_map(function($channelConnection) { return $channelConnection->connection(); }, $channel->connections());
            if (in_array($connection, $comparableRawConnectionObjects) && str_starts_with($channel->name(), 'presence-book.')) {
                CentralSaverRepo::handleUserLeave(intval(str_replace('presence-book.', '', $channel->name())));
            }
        }

        $this->channels
            ->for($connection->app())
            ->unsubscribeFromAll($connection);

        $connection->disconnect();

        Log::info('Connection Closed', $connection->id());
    }
}