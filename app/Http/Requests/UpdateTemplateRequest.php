<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['sometimes', 'string', 'max:255'],
            'category' => ['sometimes', 'string', 'in:article,email,social,custom'],
            'description' => ['nullable', 'string'],
            'system_prompt' => ['sometimes', 'string'],
            'variables' => ['nullable', 'json'],
            'is_public' => ['nullable', 'boolean'],
        ];
    }
}