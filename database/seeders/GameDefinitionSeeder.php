<?php

namespace Database\Seeders;

use App\Models\GameDefinition;
use Illuminate\Database\Seeder;

class GameDefinitionSeeder extends Seeder
{
    public function run(): void
    {
        // All 8 approved putting games
        $games = [
            [
                'slug'        => 'par-18',
                'name'        => 'Par 18',
                'description' => 'Play 18 holes at random distances. Tap ✅ to record a one-putt, ❌ for a miss (retry). Beat par!',
                'icon'        => '🏌️',
                'difficulty'  => 2,
                'config'      => ['holes' => 18, 'par_per_hole' => 2],
            ],
            [
                'slug'        => 'around-the-world',
                'name'        => 'Around the World',
                'description' => 'Putt from every distance in a circuit from your min to max. Make each before advancing.',
                'icon'        => '🌍',
                'difficulty'  => 2,
                'config'      => ['step_feet' => 1],
            ],
            [
                'slug'        => 'ladder',
                'name'        => 'Ladder',
                'description' => 'Start short and work up. Make it → climb a rung. Miss twice → drop a rung. How high can you go?',
                'icon'        => '🪜',
                'difficulty'  => 3,
                'config'      => ['max_misses_before_drop' => 2],
            ],
            [
                'slug'        => 'streak-challenge',
                'name'        => 'Streak Challenge',
                'description' => 'Hole consecutive putts from random distances. One miss ends the game. Beat your best streak!',
                'icon'        => '🔥',
                'difficulty'  => 2,
                'config'      => [],
            ],
            [
                'slug'        => 'speed-round',
                'name'        => 'Speed Round',
                'description' => 'How many putts can you make in 60 seconds from one distance? Tap fast!',
                'icon'        => '⏱️',
                'difficulty'  => 3,
                'config'      => ['duration_seconds' => 60],
            ],
            [
                'slug'        => '9-hole-scramble',
                'name'        => '9-Hole Scramble',
                'description' => '9 holes, 3 attempts each. Scored like golf — birdie, par, bogey, or double.',
                'icon'        => '⛳',
                'difficulty'  => 2,
                'config'      => ['holes' => 9, 'max_putts_per_hole' => 3],
            ],
            [
                'slug'        => 'two-club-drill',
                'name'        => 'Two-Club Drill',
                'description' => 'Alternate between your shortest and longest distances. Make both to score a point. 10 rounds.',
                'icon'        => '🎯',
                'difficulty'  => 1,
                'config'      => ['rounds' => 10],
            ],
            [
                'slug'        => 'pressure-putt',
                'name'        => 'Pressure Putt',
                'description' => 'One-putt challenges at escalating distances. Miss one and it\'s over. How far can you go?',
                'icon'        => '💦',
                'difficulty'  => 3,
                'config'      => ['step_feet' => 1],
            ],
        ];

        foreach ($games as $game) {
            GameDefinition::updateOrCreate(['slug' => $game['slug']], $game);
        }
    }
}
