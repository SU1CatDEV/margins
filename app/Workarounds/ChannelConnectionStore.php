<?php 

namespace App\Workarounds;

class ChannelConnectionStore {
    static private $store = [];

    public static function getChannel($connectionId) {
        return self::$store[$connectionId] ?? null;
    }

    public static function addToStore($connectionId, $channelId) {
        self::$store[$connectionId] = $channelId;
        // var_dump(self::$store);
    }

    public static function disconnectFromStore($connectionId) {
        unset(self::$store[$connectionId]);
    }
}