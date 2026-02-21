import { useState } from 'react';
import { type GameProps } from '../Index';
import { randomDistance } from '../Index';

// Streak Challenge — consecutive makes, one miss ends the game
export default function StreakChallenge({ game, distances, onComplete }: GameProps) {
    const [streak, setStreak] = useState(0);
    const [best, setBest] = useState(0);
    const [distance, setDistance] = useState(() => randomDistance(distances.min, distances.max));
    const [total, setTotal] = useState(0);

    const handleMake = () => {
        const newStreak = streak + 1;
        const newBest = Math.max(best, newStreak);
        setStreak(newStreak);
        setBest(newBest);
        setTotal((t) => t + 1);
        setDistance(randomDistance(distances.min, distances.max));
    };

    const handleMiss = () => {
        const newTotal = total + 1;
        setTotal(newTotal);
        // Game ends on a miss — report the streak reached
        onComplete(best, `Streak: ${best}`);
    };

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Keep it going!</div>
                <div className="play-header__subtitle">One miss ends the run</div>
            </div>

            {/* Big streak counter */}
            <div className="streak-display">
                <div className="streak-number" aria-live="polite">{streak}</div>
                <div className="streak-label">Current streak</div>
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Streak</div>
                    <div className="score-bar__value text-success">{streak}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Best</div>
                    <div className="score-bar__value text-gold">{best}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Total</div>
                    <div className="score-bar__value">{total}</div>
                </div>
            </div>

            {/* Current distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {distance} ft</div>
            </div>

            {/* Actions */}
            <div className="action-row">
                <button
                    id="make-btn"
                    className="action-btn action-btn--make"
                    onClick={handleMake}
                    aria-label="Made the putt"
                >
                    <span className="action-btn__emoji">✅</span>
                    Made it
                </button>
                <button
                    id="miss-btn"
                    className="action-btn action-btn--miss"
                    onClick={handleMiss}
                    aria-label="Missed the putt"
                >
                    <span className="action-btn__emoji">❌</span>
                    Missed (End)
                </button>
            </div>
        </>
    );
}
