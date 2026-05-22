<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Template extends Model
{
    use HasUuids;

    protected $fillable = [
        'user_id',
        'name',
        'category',
        'description',
        'system_prompt',
        'variables',
        'is_public',
    ];

    protected $casts = [
        'variables' => 'json',
        'is_public' => 'boolean',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function generations(): HasMany
    {
        return $this->hasMany(Generation::class);
    }

    public function scopePublic($query)
    {
        return $query->where('is_public', true);
    }

    public function scopePersonal($query)
    {
        return $query->whereNotNull('user_id');
    }
}