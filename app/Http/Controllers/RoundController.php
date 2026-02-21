<?php

namespace App\Http\Controllers;

use App\Models\GameRound;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoundController extends Controller
{
    // Record a single putt round (shot/hole) within a session
    public function store(Request $request, GameSession $session): JsonResponse
    {
        // Ensure the logged-in user owns this session
        abort_if($session->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'hole_number' => 'required|integer|min:1',
            'distance'    => 'required|integer|min:1|max:100',
            'putts_taken' => 'required|integer|min:1|max:10',
            'made'        => 'required|boolean',
        ]);

        $round = GameRound::create(array_merge(
            $validated,
            ['game_session_id' => $session->id]
        ));

        return response()->json(['round' => $round], 201);
    }
}
