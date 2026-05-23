<?php

namespace App\Http\Controllers;

use App\Models\Generation;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $currentMonth = now()->format('Y-m');

        $totalGenerations = Generation::where('user_id', $user->id)->count();
        $generationsThisMonth = Generation::where('user_id', $user->id)
            ->whereYear('created_at', now()->year)
            ->whereMonth('created_at', now()->month)
            ->count();

        $tokensUsed = Generation::where('user_id', $user->id)
            ->whereNotNull('tokens_used')
            ->sum('tokens_used');

        $quota = $user->subscription()?->plan->monthly_credits ?? 100;
        $used = cache("quota:{$user->id}:{$currentMonth}", 0);

        $recentGenerations = Generation::where('user_id', $user->id)
            ->with('template')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(fn($gen) => [
                'id' => $gen->id,
                'template_name' => $gen->template?->name ?? 'Prompt libre',
                'model' => $gen->model,
                'status' => $gen->status,
                'created_at' => $gen->created_at->format('Y-m-d H:i'),
            ]);

        return response()->json([
            'stats' => [
                'totalGenerations' => $totalGenerations,
                'generationsThisMonth' => $generationsThisMonth,
                'tokensUsed' => $tokensUsed,
                'used' => $used,
                'limit' => $quota,
            ],
            'recentGenerations' => $recentGenerations,
        ]);
    }
}
