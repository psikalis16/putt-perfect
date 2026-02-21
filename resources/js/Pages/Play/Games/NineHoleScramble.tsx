import { useState } from 'react';
import { type GameProps } from '../Index';
import { randomDistance } from '../Index';

const TOTAL_HOLES = 9;
const MAX_PUTTS = 3;
// Par per hole for scoring
const PAR = 2;

// Score name per putts taken
const SCORE_NAMES: Record<number, string> = {
    1: 'Birdie 🐦',
    2: 'Par ✅',
    3: 'Bogey 😬',
    4: 'Double 😱',
};

export default function NineHoleScramble({ game, distances, onComplete }: GameProps) {
    const [hole, setHole] = useState(1);
    const [holePutts, setHolePutts] = useState(0);
    const [totalScore, setTotalScore] = useState(0);
    const [lastResult, setLastResult] = useState<string | null>(null);
    const [distance, setDistance] = useState(() => randomDistance(distances.min, distances.max));

    const scoreDelta = totalScore - (hole - 1) * PAR;

    const advanceHole = (finalPutts: number) => {
        const delta = finalPutts - PAR;
        const newTotal = totalScore + delta;
        const next = hole + 1;

        const name = SCORE_NAMES[finalPutts] ?? `+${finalPutts - PAR}`;
        setLastResult(name);

        if (next > TOTAL_HOLES) {
            const label = newTotal === 0 ? 'E (Even)' : newTotal > 0 ? `+${newTotal}` : `${newTotal}`;
            onComplete(newTotal, label);
        } else {
            setTotalScore(newTotal);
            setHole(next);
            setHolePutts(0);
            setDistance(randomDistance(distances.min, distances.max));
        }
    };

    const handleMake = () => advanceHole(holePutts + 1);

    const handleMiss = () => {
        const next = holePutts + 1;
        // After 3 missed putts auto-advance with 4 total (double bogey)
        if (next >= MAX_PUTTS) {
            advanceHole(4);
        } else {
            setHolePutts(next);
        }
    };

    const scoreLabel = scoreDelta === 0 ? 'E' : scoreDelta > 0 ? `+${scoreDelta}` : `${scoreDelta}`;
    const scoreClass = scoreDelta < 0 ? 'text-success' : scoreDelta > 0 ? 'text-danger' : 'text-muted';

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Hole {hole} / {TOTAL_HOLES}</div>
                {lastResult && (
                    <div className="play-header__subtitle">{lastResult}</div>
                )}
            </div>

            {/* Progress */}
            <div className="progress-pill">
                <div
                    className="progress-pill__fill"
                    style={{ width: `${((hole - 1) / TOTAL_HOLES) * 100}%` }}
                />
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Hole</div>
                    <div className="score-bar__value">{hole}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Putts</div>
                    <div className="score-bar__value">{holePutts} / {MAX_PUTTS}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Score</div>
                    <div className={`score-bar__value ${scoreClass}`}>{scoreLabel}</div>
                </div>
            </div>

            {/* Distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {distance} ft</div>
                {holePutts > 0 && (
                    <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                        {MAX_PUTTS - holePutts} putt{MAX_PUTTS - holePutts !== 1 ? 's' : ''} remaining
                    </p>
                )}
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
