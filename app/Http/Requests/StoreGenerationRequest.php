<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreGenerationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'template_id' => ['nullable', 'uuid', 'exists:templates,id'],
            'prompt' => ['required', 'string'],
            'model' => ['nullable', 'string', 'in:openai,claude'],
        ];
    }
}