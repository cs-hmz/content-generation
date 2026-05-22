<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Export extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = [
        'generation_id',
        'format',
        'storage_path',
        'created_at',
    ];

    protected $casts = [
        'created_at' => 'datetime',
    ];

    public function generation(): BelongsTo
    {
        return $this->belongsTo(Generation::class);
    }
}