import { useState } from 'react';
import { type GameProps } from '../Index';

const TOTAL_ROUNDS = 10;

// Two-Club Drill — alternate short and long, score a point for making both
export default function TwoClubDrill({ game, distances, onComplete }: GameProps) {
    const [round, setRound] = useState(1);
    const [points, setPoints] = useState(0);
    // Each round needs a near and far make
    const [madeNear, setMadeNear] = useState(false);
    // Track whether we are on near or far putt within the round
    const [phase, setPhase] = useState<'near' | 'far'>('near');

    const nearDist = distances.min;
    const farDist = distances.max;

    const handleMake = () => {
        if (phase === 'near') {
            setMadeNear(true);
            setPhase('far');
        } else {
            // Made the far putt
            const scored = madeNear; // only score if both made
            const newPoints = scored ? points + 1 : points;

            if (round >= TOTAL_ROUNDS) {
                onComplete(newPoints, `${newPoints} / ${TOTAL_ROUNDS} pts`);
            } else {
                setPoints(newPoints);
                setRound((r) => r + 1);
                setMadeNear(false);
                setPhase('near');
            }
        }
    };

    const handleMiss = () => {
        if (phase === 'near') {
            // Missed near — still go to far but can't score this round
            setMadeNear(false);
            setPhase('far');
        } else {
            // Missed far — no point this round
            if (round >= TOTAL_ROUNDS) {
                onComplete(points, `${points} / ${TOTAL_ROUNDS} pts`);
            } else {
                setRound((r) => r + 1);
                setMadeNear(false);
                setPhase('near');
            }
        }
    };

    const current = phase === 'near' ? nearDist : farDist;

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Round {round} / {TOTAL_ROUNDS}</div>
                <div className="play-header__subtitle">
                    {phase === 'near' ? '📍 Near putt' : '🏔️ Far putt'}
                    {phase === 'far' && !madeNear && ' (missed near — no point available)'}
                </div>
            </div>

            {/* Progress */}
            <div className="progress-pill">
                <div
                    className="progress-pill__fill"
                    style={{ width: `${((round - 1) / TOTAL_ROUNDS) * 100}%` }}
                />
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Points</div>
                    <div className="score-bar__value text-gold">{points}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Round</div>
                    <div className="score-bar__value">{round}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Remaining</div>
                    <div className="score-bar__value">{TOTAL_ROUNDS - round}</div>
                </div>
            </div>

            {/* Distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {current} ft</div>
                <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                    Near: {nearDist} ft · Far: {farDist} ft
                </p>
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
                    Missed
                </button>
            </div>
        </>
    );
}
