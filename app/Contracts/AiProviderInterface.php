<?php

namespace App\Contracts;

use Generator;

interface AiProviderInterface
{
    public function streamGenerate(string $systemPrompt, string $userPrompt, array $options = []): Generator;
    public function countTokens(string $text): int;
    public function getCostPerToken(): float;
    public function getModelName(): string;
}