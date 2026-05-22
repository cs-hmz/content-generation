<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreTemplateRequest;
use App\Http\Requests\UpdateTemplateRequest;
use App\Http\Resources\TemplateResource;
use App\Models\Template;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\ResourceCollection;

class TemplateController extends Controller
{
    public function index(): ResourceCollection
    {
        $templates = Template::where(function ($query) {
            $query->where('is_public', true)
                ->orWhere('user_id', auth()->id());
        })
        ->orderBy('is_public', 'desc')
        ->orderBy('created_at', 'desc')
        ->paginate(20);

        return TemplateResource::collection($templates);
    }

    public function store(StoreTemplateRequest $request): TemplateResource
    {
        $template = Template::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'category' => $request->category,
            'description' => $request->description,
            'system_prompt' => $request->system_prompt,
            'variables' => json_decode($request->variables ?? '[]', true),
            'is_public' => $request->boolean('is_public', false),
        ]);

        return new TemplateResource($template);
    }

    public function show(Template $template): TemplateResource
    {
        $this->authorize('view', $template);

        return new TemplateResource($template);
    }

    public function update(UpdateTemplateRequest $request, Template $template): TemplateResource
    {
        $this->authorize('update', $template);

        $template->update($request->validated());

        return new TemplateResource($template);
    }

    public function destroy(Template $template): JsonResponse
    {
        $this->authorize('delete', $template);

        $template->delete();

        return response()->json(['message' => 'Template deleted successfully']);
    }

    public function duplicate(Template $template): TemplateResource
    {
        $duplicate = $template->replicate()->fill([
            'user_id' => auth()->id(),
            'name' => $template->name . ' (Copy)',
            'is_public' => false,
        ]);

        $duplicate->save();

        return new TemplateResource($duplicate);
    }
}