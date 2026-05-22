<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GenerationResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'prompt' => $this->prompt,
            'result' => $this->result,
            'model' => $this->model,
            'status' => $this->status,
            'tokens_used' => $this->tokens_used,
            'cost_micro_usd' => $this->cost_micro_usd,
            'created_at' => $this->created_at,
            'template' => new TemplateResource($this->whenLoaded('template')),
        ];
    }
}