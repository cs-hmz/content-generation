<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use Generator;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\Exceptions\RateLimitException;
use App\Exceptions\InvalidApiKeyException;

class OpenAiProvider implements AiProviderInterface
{
    protected Client $client;
    protected string $model;
    protected int $maxTokens;
    protected float $temperature;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.openai.com/v1/',
            'headers' => [
                'Authorization' => 'Bearer ' . config('ai.openai.api_key'),
                'Content-Type' => 'application/json',
            ],
            'stream' => true,
        ]);
        $this->model = config('ai.openai.model', 'gpt-4o');
        $this->maxTokens = config('ai.openai.max_tokens', 4000);
        $this->temperature = config('ai.openai.temperature', 0.7);
    }

    public function streamGenerate(string $systemPrompt, string $userPrompt, array $options = []): Generator
    {
        $params = array_merge([
            'model' => $options['model'] ?? $this->model,
            'messages' => [
                ['role' => 'system', 'content' => $systemPrompt],
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'max_tokens' => $options['max_tokens'] ?? $this->maxTokens,
            'temperature' => $options['temperature'] ?? $this->temperature,
            'stream' => true,
        ], $options);

        try {
            $response = $this->client->post('chat/completions', ['json' => $params]);
            $body = $response->getBody();

            while (!$body->eof()) {
                $line = $this->readLine($body);
                if (str_starts_with($line, 'data: ')) {
                    $data = substr($line, 6);
                    if ($data === '[DONE]') {
                        break;
                    }
                    $json = json_decode($data, true);
                    if (isset($json['choices'][0]['delta']['content'])) {
                        yield $json['choices'][0]['delta']['content'];
                    }
                }
            }
        } catch (ClientException $e) {
            $statusCode = $e->getResponse()->getStatusCode();
            $body = (string) $e->getResponse()->getBody();
            $error = json_decode($body, true);

            if ($statusCode === 429) {
                throw new RateLimitException($error['error']['message'] ?? 'Rate limit exceeded');
            }
            if ($statusCode === 401) {
                throw new InvalidApiKeyException($error['error']['message'] ?? 'Invalid API key');
            }
            throw $e;
        }
    }

    public function countTokens(string $text): int
    {
        return (int) ceil(mb_strlen($text) / 4);
    }

    public function getCostPerToken(): float
    {
        return 0.015; // $0.015 per 1K tokens for output
    }

    public function getModelName(): string
    {
        return $this->model;
    }

    protected function readLine($body): string
    {
        $line = '';
        while (!$body->eof()) {
            $char = $body->read(1);
            if ($char === "\n") {
                break;
            }
            $line .= $char;
        }
        return trim($line);
    }
}