<?php

namespace App\Events;

use App\Models\Generation;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;

class GenerationCompleted implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets;

    public string $generationId;
    public array $data;

    public function __construct(Generation $generation)
    {
        $this->generationId = $generation->id;
        $this->data = [
            'result' => $generation->result,
            'tokens_used' => $generation->tokens_used,
            'cost_micro_usd' => $generation->cost_micro_usd,
        ];
    }

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("generation.{$this->generationId}");
    }

    public function broadcastAs(): string
    {
        return 'completed';
    }
}