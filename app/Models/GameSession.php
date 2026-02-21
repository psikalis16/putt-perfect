<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class GameSession extends Model
{
    protected $fillable = [
        'user_id',
        'game_definition_id',
        'min_distance',
        'max_distance',
        'score',
        'score_label',
        'completed_at',
    ];

    // Cast completed_at to Carbon datetime
    protected $casts = [
        'completed_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function gameDefinition(): BelongsTo
    {
        return $this->belongsTo(GameDefinition::class);
    }

    public function rounds(): HasMany
    {
        return $this->hasMany(GameRound::class);
    }
}
