<?php

return [
    'default_provider' => env('AI_DEFAULT_PROVIDER', 'openai'),

    'openai' => [
        'api_key' => env('OPENAI_API_KEY'),
        'model' => env('OPENAI_MODEL', 'gpt-4o'),
        'max_tokens' => 4000,
        'temperature' => 0.7,
    ],

    'claude' => [
        'api_key' => env('ANTHROPIC_API_KEY'),
        'model' => env('CLAUDE_MODEL', 'claude-sonnet-4-6'),
        'max_tokens' => 4000,
    ],
];