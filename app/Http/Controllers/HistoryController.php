<?php

namespace App\Http\Controllers;

use App\Models\GameDefinition;
use App\Models\GameSession;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HistoryController extends Controller
{
    // History overview — all completed sessions grouped by game
    public function index(Request $request): Response
    {
        $sessions = GameSession::with('gameDefinition')
            ->where('user_id', $request->user()->id)
            ->whereNotNull('completed_at')
            ->orderByDesc('completed_at')
            ->get();

        // Group sessions by game and build per-game stats
        $byGame = $sessions->groupBy('game_definition_id')->map(function ($gameSessions) {
            $def = $gameSessions->first()->gameDefinition;
            $scores = $gameSessions->pluck('score')->filter();

            return [
                'game'         => $def,
                'sessions'     => $gameSessions->take(20)->values(),
                'total_played' => $gameSessions->count(),
                'best_score'   => $scores->min(),
                'avg_score'    => $scores->isNotEmpty() ? round($scores->average(), 1) : null,
                // Last 10 scores for sparkline chart
                'recent_scores' => $gameSessions->take(10)->pluck('score')->values(),
            ];
        })->values();

        return Inertia::render('History', [
            'byGame'        => $byGame,
            'totalSessions' => $sessions->count(),
        ]);
    }

    // Single session detail
    public function show(Request $request, GameSession $session): Response
    {
        $this->authorize('view', $session);

        return Inertia::render('HistoryDetail', [
            'session' => $session->load('gameDefinition', 'rounds'),
        ]);
    }
}
