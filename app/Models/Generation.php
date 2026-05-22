<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Generation extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'template_id',
        'prompt',
        'result',
        'model',
        'status',
        'tokens_used',
        'cost_micro_usd',
        'metadata',
    ];

    protected $casts = [
        'metadata' => 'json',
        'tokens_used' => 'integer',
        'cost_micro_usd' => 'integer',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class);
    }

    public function exports(): HasMany
    {
        return $this->hasMany(Export::class);
    }
}