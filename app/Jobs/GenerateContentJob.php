<?php

namespace App\Jobs;

use App\Events\GenerationCompleted;
use App\Events\GenerationFailed;
use App\Events\GenerationTokenReceived;
use App\Models\Generation;
use App\Services\Ai\AiProviderFactory;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class GenerateContentJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public Generation $generation;

    public function __construct(Generation $generation)
    {
        $this->generation = $generation;
    }

    public function handle(AiProviderFactory $factory): void
    {
        $generation = $this->generation;
        $generation->update(['status' => 'streaming']);
        $result = '';

        try {
            $provider = $factory->make($generation->model);
            $template = $generation->template;

            $systemPrompt = $template?->system_prompt ?? 'You are a helpful AI assistant.';
            $userPrompt = $generation->prompt;

            foreach ($provider->streamGenerate($systemPrompt, $userPrompt) as $token) {
                $result .= $token;
                broadcast(new GenerationTokenReceived($generation->id, $token));
            }

            $tokensUsed = $provider->countTokens($result);
            $costMicroUsd = (int) ($tokensUsed * $provider->getCostPerToken() * 1000);

            $generation->update([
                'result' => $result,
                'status' => 'completed',
                'tokens_used' => $tokensUsed,
                'cost_micro_usd' => $costMicroUsd,
            ]);

            broadcast(new GenerationCompleted($generation->fresh()));
        } catch (\Throwable $e) {
            $generation->update(['status' => 'failed']);
            Log::error('Generation failed', [
                'generation_id' => $generation->id,
                'error' => $e->getMessage(),
            ]);
            broadcast(new GenerationFailed($generation->id, $e->getMessage()));
        }
    }
}