<?php

use App\Http\Middleware\CheckGenerationQuota;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

test('check quota passes when under limit', function () {
    $user = User::factory()->create();
    $request = Request::create('/api/generations', 'POST');
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    $middleware = new CheckGenerationQuota();
    $response = $middleware($request, function () {
        return response()->json(['success' => true]);
    });

    expect($response->getStatusCode())->toBe(200);
});

test('check quota returns 429 when exceeded', function () {
    $user = User::factory()->create();
    Cache::set("quota:{$user->id}:" . now()->format('Y-m'), 100);

    $request = Request::create('/api/generations', 'POST');
    $request->setUserResolver(function () use ($user) {
        return $user;
    });

    $middleware = new CheckGenerationQuota();
    $response = $middleware($request, function () {
        return response()->json(['success' => true]);
    });

    expect($response->getStatusCode())->toBe(429);
    $content = json_decode($response->getContent(), true);
    expect($content['error'])->toBe('quota_exceeded');
});