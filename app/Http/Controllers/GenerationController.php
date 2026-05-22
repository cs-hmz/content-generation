<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreGenerationRequest;
use App\Http\Resources\GenerationResource;
use App\Jobs\GenerateContentJob;
use App\Models\Generation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;
use Illuminate\Support\Facades\Cache;

class GenerationController extends Controller
{
    public function index(): ResourceCollection
    {
        $generations = Generation::where('user_id', auth()->id())
            ->with('template')
            ->orderBy('created_at', 'desc')
            ->paginate(15);

        return GenerationResource::collection($generations);
    }

    public function store(StoreGenerationRequest $request): JsonResponse
    {
        $user = $request->user();

        $generation = Generation::create([
            'user_id' => $user->id,
            'template_id' => $request->template_id,
            'prompt' => $request->prompt,
            'model' => $request->model ?? config('ai.default_provider'),
            'status' => 'pending',
        ]);

        GenerateContentJob::dispatch($generation)->onQueue('ai');

        Cache::increment("quota:{$user->id}:" . now()->format('Y-m'));

        return response()->json([
            'generation_id' => $generation->id,
            'channel' => "generation.{$generation->id}",
        ], 201);
    }

    public function show(Generation $generation): GenerationResource
    {
        $this->authorize('view', $generation);

        return new GenerationResource($generation->load('template'));
    }
}