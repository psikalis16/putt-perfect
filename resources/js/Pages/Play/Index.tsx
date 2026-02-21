import { Head, router } from '@inertiajs/react';
import { useCallback, useEffect, useState } from 'react';
import AppLayout from '@/Layouts/AppLayout';
import { type GameDefinition, type DistanceSettings } from '@/types';
import axios from 'axios';

// Game component imports
import Par18 from './Games/Par18';
import AroundTheWorld from './Games/AroundTheWorld';
import Ladder from './Games/Ladder';
import StreakChallenge from './Games/StreakChallenge';
import SpeedRound from './Games/SpeedRound';
import NineHoleScramble from './Games/NineHoleScramble';
import TwoClubDrill from './Games/TwoClubDrill';
import PressurePutt from './Games/PressurePutt';

interface Props {
    game: GameDefinition;
}

// Shared interface each game component receives
export interface GameProps {
    game: GameDefinition;
    distances: DistanceSettings;
    onComplete: (score: number, label: string) => void;
}

// Map slugs to game components
const GAME_COMPONENTS: Record<string, React.ComponentType<GameProps>> = {
    'par-18':          Par18,
    'around-the-world': AroundTheWorld,
    'ladder':           Ladder,
    'streak-challenge': StreakChallenge,
    'speed-round':      SpeedRound,
    '9-hole-scramble':  NineHoleScramble,
    'two-club-drill':   TwoClubDrill,
    'pressure-putt':    PressurePutt,
};

// Generate a random distance within the user's range
export function randomDistance(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function PlayIndex({ game }: Props) {
    const [distances, setDistances] = useState<DistanceSettings | null>(null);
    const [settingUp, setSettingUp] = useState(false);
    const [tempMin, setTempMin] = useState(3);
    const [tempMax, setTempMax] = useState(10);
    const [completed, setCompleted] = useState(false);
    const [finalScore, setFinalScore] = useState<{ score: number; label: string } | null>(null);
    const [saving, setSaving] = useState(false);

    // Load saved distances from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('putt_distances');
        if (saved) {
            setDistances(JSON.parse(saved));
        } else {
            // No saved distances — show the settings panel
            setSettingUp(true);
        }
    }, []);

    const saveDistances = () => {
        const d = { min: tempMin, max: tempMax };
        localStorage.setItem('putt_distances', JSON.stringify(d));
        setDistances(d);
        setSettingUp(false);
    };

    // Called by game component when the player finishes
    const handleComplete = useCallback(async (score: number, label: string) => {
        setFinalScore({ score, label });
        setCompleted(true);

        // Fire-and-forget: persist the completed session via axios (handles CSRF automatically)
        if (!saving) {
            setSaving(true);
            try {
                const { data } = await axios.post('/sessions', {
                    game_definition_id: game.id,
                    min_distance: distances?.min ?? tempMin,
                    max_distance: distances?.max ?? tempMax,
                });
                // Mark session complete with score
                await axios.patch(`/sessions/${data.session.id}/complete`, {
                    score,
                    score_label: label,
                });
            } catch {
                // Non-blocking — session save failure doesn't disrupt UX
            } finally {
                setSaving(false);
            }
        }
    }, [distances, game.id, saving, tempMax, tempMin]);

    const GameComponent = GAME_COMPONENTS[game.slug];

    return (
        <AppLayout title={game.name}>
            <Head title={`${game.name} — Putt Perfect`} />

            {/* Distance setup screen */}
            {settingUp && (
                <div className="page">
                    <h1 className="page-title">Set Your Distances</h1>
                    <p className="page-subtitle">How long is your putting mat or practice green?</p>

                    <div className="card" style={{ marginBottom: 24 }}>
                        {/* Min distance slider */}
                        <div className="slider-group">
                            <div className="slider-label">
                                <span>Minimum Distance</span>
                                <span className="slider-value">{tempMin} ft</span>
                            </div>
                            <input
                                type="range"
                                id="min-distance"
                                min={1}
                                max={30}
                                value={tempMin}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setTempMin(v);
                                    if (v > tempMax) setTempMax(v);
                                }}
                            />
                        </div>

                        {/* Max distance slider */}
                        <div className="slider-group">
                            <div className="slider-label">
                                <span>Maximum Distance</span>
                                <span className="slider-value">{tempMax} ft</span>
                            </div>
                            <input
                                type="range"
                                id="max-distance"
                                min={1}
                                max={30}
                                value={tempMax}
                                onChange={(e) => {
                                    const v = Number(e.target.value);
                                    setTempMax(v);
                                    if (v < tempMin) setTempMin(v);
                                }}
                            />
                        </div>
                    </div>

                    <button
                        id="save-distances-btn"
                        className="btn btn--primary btn--lg w-full"
                        onClick={saveDistances}
                        disabled={tempMin > tempMax}
                    >
                        Start {game.name} ⛳
                    </button>
                </div>
            )}

            {/* Game play screen */}
            {!settingUp && distances && !completed && (
                <div className="play-screen">
                    {/* Change distances button */}
                    <div style={{ textAlign: 'right' }}>
                        <button
                            className="btn btn--ghost"
                            style={{ fontSize: '0.8rem', padding: '6px 14px' }}
                            onClick={() => setSettingUp(true)}
                        >
                            📏 {distances.min}–{distances.max} ft
                        </button>
                    </div>

                    {GameComponent ? (
                        <GameComponent
                            game={game}
                            distances={distances}
                            onComplete={handleComplete}
                        />
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state__icon">🚧</div>
                            <p>Game "{game.name}" coming soon!</p>
                        </div>
                    )}
                </div>
            )}

            {/* Completion modal */}
            {completed && finalScore && (
                <div className="modal-overlay">
                    <div className="modal" role="dialog" aria-labelledby="modal-title">
                        <div className="modal__title" id="modal-title">Game Complete! 🎉</div>
                        <div className="modal__score">{finalScore.label}</div>
                        <div className="modal__label">{game.name}</div>

                        <div className="modal__actions">
                            <button
                                id="play-again-btn"
                                className="btn btn--primary btn--lg w-full"
                                onClick={() => {
                                    setCompleted(false);
                                    setFinalScore(null);
                                }}
                            >
                                Play Again ↻
                            </button>
                            <button
                                id="back-to-games-btn"
                                className="btn btn--ghost btn--lg w-full"
                                onClick={() => router.visit('/home')}
                            >
                                Choose Game
                            </button>
                            <button
                                className="btn btn--ghost btn--lg w-full"
                                onClick={() => router.visit('/history')}
                            >
                                View History 📊
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AppLayout>
    );
}
