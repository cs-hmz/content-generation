<?php

namespace App\Http\Controllers;

use App\Models\Plan;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class BillingController extends Controller
{
    public function index(): Response
    {
        $user = auth()->user();
        $plans = Plan::all();
        $currentPlan = $user->currentPlan();
        $used = \Illuminate\Support\Facades\Cache::get("quota:{$user->id}:" . now()->format('Y-m'), 0);
        $limit = $currentPlan?->monthly_credits ?? 10;

        return Inertia::render('Billing/Index', [
            'plans' => $plans,
            'currentPlan' => $currentPlan,
            'used' => $used,
            'limit' => $limit,
        ]);
    }

    public function subscribe(Request $request): JsonResponse
    {
        $request->validate([
            'plan_id' => ['required', 'uuid', 'exists:plans,id'],
        ]);

        $plan = Plan::findOrFail($request->plan_id);

        if (!$plan->stripe_price_id) {
            return response()->json(['error' => 'This plan does not support subscriptions'], 400);
        }

        $checkout = $request->user()
            ->newSubscription('default', $plan->stripe_price_id)
            ->checkout([
                'success_url' => route('dashboard'),
                'cancel_url' => route('billing.index'),
            ]);

        return response()->json(['url' => $checkout->url]);
    }

    public function portal(Request $request): JsonResponse
    {
        return response()->json([
            'url' => $request->user()->billingPortalUrl(route('billing.index')),
        ]);
    }

    public function webhook(Request $request): void
    {
        // Handled by Cashier
    }
}