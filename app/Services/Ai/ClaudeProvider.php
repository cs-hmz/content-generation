<?php

namespace App\Services\Ai;

use App\Contracts\AiProviderInterface;
use Generator;
use GuzzleHttp\Client;
use GuzzleHttp\Exception\ClientException;
use App\Exceptions\RateLimitException;
use App\Exceptions\InvalidApiKeyException;

class ClaudeProvider implements AiProviderInterface
{
    protected Client $client;
    protected string $model;
    protected int $maxTokens;

    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.anthropic.com/v1/',
            'headers' => [
                'x-api-key' => config('ai.claude.api_key'),
                'anthropic-version' => '2023-06-01',
                'Content-Type' => 'application/json',
            ],
            'stream' => true,
        ]);
        $this->model = config('ai.claude.model', 'claude-sonnet-4-6');
        $this->maxTokens = config('ai.claude.max_tokens', 4000);
    }

    public function streamGenerate(string $systemPrompt, string $userPrompt, array $options = []): Generator
    {
        $params = array_merge([
            'model' => $options['model'] ?? $this->model,
            'system' => $systemPrompt,
            'messages' => [
                ['role' => 'user', 'content' => $userPrompt],
            ],
            'max_tokens' => $options['max_tokens'] ?? $this->maxTokens,
            'stream' => true,
        ], $options);

        try {
            $response = $this->client->post('messages', ['json' => $params]);
            $body = $response->getBody();
            $buffer = '';

            while (!$body->eof()) {
                $line = $this->readLine($body);
                if (empty($line)) {
                    continue;
                }

                if (str_starts_with($line, 'event: ')) {
                    $buffer = $line;
                    continue;
                }

                if (str_starts_with($line, 'data: ')) {
                    $eventType = str_replace('event: ', '', $buffer);
                    $data = substr($line, 6);
                    $json = json_decode($data, true);

                    if ($eventType === 'content_block_delta' && isset($json['delta']['text'])) {
                        yield $json['delta']['text'];
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
        return (int) ceil(mb_strlen($text) / 3.5);
    }

    public function getCostPerToken(): float
    {
        return 0.015; // $0.015 per 1K tokens for Claude Sonnet output
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