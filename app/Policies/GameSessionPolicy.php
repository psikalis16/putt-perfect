<?php

namespace App\Policies;

use App\Models\GameSession;
use App\Models\User;

class GameSessionPolicy
{
    // Only the session owner can view it
    public function view(User $user, GameSession $session): bool
    {
        return $user->id === $session->user_id;
    }

    // Only the session owner can update/complete it
    public function update(User $user, GameSession $session): bool
    {
        return $user->id === $session->user_id;
    }
}
