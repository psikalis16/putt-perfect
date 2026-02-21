import { Head, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { type GameDefinition } from '@/types';
import { useEffect, useState } from 'react';

interface Props {
    games: GameDefinition[];
}

// Render difficulty dots (1–3 filled out of 3)
function DifficultyDots({ level }: { level: number }) {
    return (
        <div className="difficulty-dots" aria-label={`Difficulty ${level} of 3`}>
            {[1, 2, 3].map((n) => (
                <span
                    key={n}
                    className={`difficulty-dot ${n <= level ? 'difficulty-dot--filled' : ''}`}
                />
            ))}
        </div>
    );
}

export default function Home({ games }: Props) {
    // Read saved distance settings from localStorage
    const [hasSettings, setHasSettings] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem('putt_distances');
        setHasSettings(!!saved);
    }, []);

    const handleGameSelect = (game: GameDefinition) => {
        router.visit(`/play/${game.slug}`);
    };

    return (
        <AppLayout>
            <Head title="Putt Perfect — Choose a Game" />

            <div className="page">
                <h1 className="page-title">Choose a Game</h1>
                <p className="page-subtitle">
                    {hasSettings
                        ? 'Tap a game to start putting 🏌️'
                        : 'Set your mat distances on the play screen before starting.'}
                </p>

                {/* Game grid */}
                <div className="game-grid">
                    {games.map((game) => (
                        <button
                            key={game.id}
                            id={`game-card-${game.slug}`}
                            className="game-card"
                            onClick={() => handleGameSelect(game)}
                            aria-label={`Play ${game.name}`}
                        >
                            <span className="game-card__icon">{game.icon}</span>
                            <span className="game-card__name">{game.name}</span>
                            <span className="game-card__desc">{game.description}</span>
                            <div className="game-card__footer">
                                <DifficultyDots level={game.difficulty} />
                                <span className="text-sm text-muted">▶</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
