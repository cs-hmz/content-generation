<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreTemplateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'category' => ['required', 'string', 'in:article,email,social,custom'],
            'description' => ['nullable', 'string'],
            'system_prompt' => ['required', 'string'],
            'variables' => ['nullable', 'json'],
            'is_public' => ['nullable', 'boolean'],
        ];
    }
}