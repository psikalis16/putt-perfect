import { useState } from 'react';
import { type GameProps } from '../Index';

// Ladder — climb up distances, miss twice to drop a rung
const MISSES_TO_DROP = 2;

export default function Ladder({ game, distances, onComplete }: GameProps) {
    const steps = Array.from(
        { length: distances.max - distances.min + 1 },
        (_, i) => distances.min + i
    );

    // Current rung index into steps array
    const [rungIndex, setRungIndex] = useState(0);
    const [missesAtRung, setMissesAtRung] = useState(0);
    const [attempts, setAttempts] = useState(0);
    // Highest rung ever reached
    const [peakRung, setPeakRung] = useState(0);
    // Track if the game is over (fell off the bottom)
    const [over, setOver] = useState(false);

    const currentDistance = steps[rungIndex];
    const highestDistance = steps[peakRung];

    const handleMake = () => {
        const next = rungIndex + 1;
        setAttempts((a) => a + 1);
        setMissesAtRung(0);

        if (next >= steps.length) {
            // Reached the top!
            onComplete(highestDistance, `🏆 Topped out at ${highestDistance} ft`);
            return;
        }

        if (next > peakRung) setPeakRung(next);
        setRungIndex(next);
    };

    const handleMiss = () => {
        const newMisses = missesAtRung + 1;
        setAttempts((a) => a + 1);

        if (newMisses >= MISSES_TO_DROP) {
            // Drop a rung
            if (rungIndex === 0) {
                // Off the bottom — game over
                setOver(true);
                onComplete(highestDistance, `Peaked at ${highestDistance} ft`);
                return;
            }
            setRungIndex((r) => r - 1);
            setMissesAtRung(0);
        } else {
            setMissesAtRung(newMisses);
        }
    };

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Rung {rungIndex + 1} of {steps.length}</div>
                <div className="play-header__subtitle">
                    Miss {MISSES_TO_DROP - missesAtRung}× more to drop
                </div>
            </div>

            {/* Rung ladder visual */}
            <div className="ladder-rungs">
                {steps.map((dist, i) => (
                    <div
                        key={dist}
                        className={`ladder-rung ${i === rungIndex ? 'ladder-rung--current' : ''} ${i < rungIndex ? 'ladder-rung--completed' : ''}`}
                        aria-current={i === rungIndex ? 'step' : undefined}
                    >
                        <span className="text-sm font-semibold">{dist} ft</span>
                        <span className="text-sm text-muted">
                            {i < rungIndex ? '✅' : i === rungIndex ? '👟' : '—'}
                        </span>
                    </div>
                ))}
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Current</div>
                    <div className="score-bar__value">{currentDistance} ft</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Misses</div>
                    <div className={`score-bar__value ${missesAtRung > 0 ? 'text-danger' : ''}`}>
                        {missesAtRung}/{MISSES_TO_DROP}
                    </div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Peak</div>
                    <div className="score-bar__value text-gold">{highestDistance} ft</div>
                </div>
            </div>

            {/* Actions */}
            <div className="action-row">
                <button
                    id="make-btn"
                    className="action-btn action-btn--make"
                    onClick={handleMake}
                    disabled={over}
                    aria-label="Made the putt"
                >
                    <span className="action-btn__emoji">✅</span>
                    Made it
                </button>
                <button
                    id="miss-btn"
                    className="action-btn action-btn--miss"
                    onClick={handleMiss}
                    disabled={over}
                    aria-label="Missed the putt"
                >
                    <span className="action-btn__emoji">❌</span>
                    Missed
                </button>
            </div>
        </>
    );
}
