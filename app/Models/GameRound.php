<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GameRound extends Model
{
    protected $fillable = [
        'game_session_id',
        'hole_number',
        'distance',
        'putts_taken',
        'made',
    ];

    protected $casts = [
        'made' => 'boolean',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(GameSession::class, 'game_session_id');
    }
}
