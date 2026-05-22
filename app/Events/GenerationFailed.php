<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class GenerationFailed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public string $generationId;
    public string $error;

    public function __construct(string $generationId, string $error = 'Generation failed')
    {
        $this->generationId = $generationId;
        $this->error = $error;
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("generation.{$this->generationId}");
    }

    public function broadcastAs(): string
    {
        return 'failed';
    }
}