<?php

namespace App\Http\Controllers;

use App\Models\GameDefinition;
use App\Models\GameSession;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class SessionController extends Controller
{
    // Start a new game session
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'game_definition_id' => 'required|exists:game_definitions,id',
            'min_distance'       => 'required|integer|min:1|max:100',
            'max_distance'       => 'required|integer|min:1|max:100|gte:min_distance',
        ]);

        $session = GameSession::create([
            'user_id'            => $request->user()->id,
            'game_definition_id' => $validated['game_definition_id'],
            'min_distance'       => $validated['min_distance'],
            'max_distance'       => $validated['max_distance'],
        ]);

        return response()->json(['session' => $session->load('gameDefinition')], 201);
    }

    // Mark a session as complete with final score
    public function complete(Request $request, GameSession $session): JsonResponse
    {
        // Only the session owner can complete it
        abort_if($session->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'score'       => 'required|integer',
            'score_label' => 'required|string|max:50',
        ]);

        $session->update([
            'score'        => $validated['score'],
            'score_label'  => $validated['score_label'],
            'completed_at' => now(),
        ]);

        return response()->json(['session' => $session->fresh('gameDefinition', 'rounds')]);
    }
}
