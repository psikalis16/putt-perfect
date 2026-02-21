<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameDefinition extends Model
{
    protected $fillable = [
        'slug',
        'name',
        'description',
        'icon',
        'difficulty',
        'config',
    ];

    // Cast config JSON to array automatically
    protected $casts = [
        'config' => 'array',
    ];

    public function sessions(): HasMany
    {
        return $this->hasMany(GameSession::class);
    }
}
