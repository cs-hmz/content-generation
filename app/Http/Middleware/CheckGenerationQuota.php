<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

class CheckGenerationQuota
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $used = Cache::get("quota:{$user->id}:" . now()->format('Y-m'), 0);
        $limit = $user->currentPlan()?->monthly_credits ?? 10;

        if ($used >= $limit) {
            return response()->json([
                'error' => 'quota_exceeded',
                'used' => $used,
                'limit' => $limit,
            ], 429);
        }

        return $next($request);
    }
}