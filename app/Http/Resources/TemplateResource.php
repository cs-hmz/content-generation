<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            'system_prompt' => $this->system_prompt,
            'variables' => $this->variables,
            'is_public' => $this->is_public,
            'created_at' => $this->created_at,
        ];
    }
}