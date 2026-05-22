<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use App\Exceptions\InvalidProviderException;

class AiProviderFactory
{
    public function make(string $provider = null): AiProviderInterface
    {
        $provider ??= config('ai.default_provider');

        return match ($provider) {
            'openai' => app(OpenAiProvider::class),
            'claude' => app(ClaudeProvider::class),
            default => throw new InvalidProviderException($provider),
        };
    }
}