<?php

namespace App\Events;

use App\Models\Generation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class GenerationTokenReceived implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public string $token;
    public string $generationId;

    public function __construct(string $generationId, string $token)
    {
        $this->generationId = $generationId;
        $this->token = $token;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("generation.{$this->generationId}");
    }

    public function broadcastAs(): string
    {
        return 'token.received';
    }
}