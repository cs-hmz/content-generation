<?php

use App\Exceptions\InvalidProviderException;
use App\Services\Ai\AiProviderFactory;
use App\Services\Ai\ClaudeProvider;
use App\Services\Ai\OpenAiProvider;

test('ai provider factory returns openai provider', function () {
    $factory = new AiProviderFactory();
    $provider = $factory->make('openai');

    expect($provider)->toBeInstanceOf(OpenAiProvider::class);
});

test('ai provider factory returns claude provider', function () {
    $factory = new AiProviderFactory();
    $provider = $factory->make('claude');

    expect($provider)->toBeInstanceOf(ClaudeProvider::class);
});

test('ai provider factory throws exception for invalid provider', function () {
    $factory = new AiProviderFactory();

    $factory->make('invalid');
})->throws(InvalidProviderException::class);