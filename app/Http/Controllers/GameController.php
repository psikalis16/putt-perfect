<?php

namespace App\Http\Controllers;

use App\Models\GameDefinition;
use Inertia\Inertia;
use Inertia\Response;

class GameController extends Controller
{
    // Return the home page with all available games
    public function index(): Response
    {
        $games = GameDefinition::orderBy('difficulty')
            ->orderBy('name')
            ->get();

        return Inertia::render('Home', [
            'games' => $games,
        ]);
    }

    // Return the play screen for a specific game
    public function show(string $slug): Response
    {
        $game = GameDefinition::where('slug', $slug)->firstOrFail();

        return Inertia::render('Play/Index', [
            'game' => $game,
        ]);
    }
}
