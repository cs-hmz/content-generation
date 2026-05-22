<?php

namespace Database\Seeders;

use App\Models\Plan;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PlanSeeder extends Seeder
{
    public function run(): void
    {
        Plan::create([
            'id' => Str::uuid(),
            'name' => 'Free',
            'monthly_credits' => 10,
            'price_cents' => 0,
            'stripe_price_id' => null,
        ]);

        Plan::create([
            'id' => Str::uuid(),
            'name' => 'Pro',
            'monthly_credits' => 200,
            'price_cents' => 1900,
            'stripe_price_id' => 'price_pro_monthly',
        ]);

        Plan::create([
            'id' => Str::uuid(),
            'name' => 'Business',
            'monthly_credits' => 1000,
            'price_cents' => 7900,
            'stripe_price_id' => 'price_business_monthly',
        ]);
    }
}