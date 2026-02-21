import { useCallback, useState } from 'react';
import { type GameProps } from '../Index';
import { randomDistance } from '../Index';

// Par 18 — 18 holes at random distances
// 1-putt = 1 (birdie), 2-putt = 2 (par), 3+ = bogey/bogey+
const PAR_PER_HOLE = 2;
const TOTAL_HOLES = 18;

export default function Par18({ game, distances, onComplete }: GameProps) {
    const [currentHole, setCurrentHole] = useState(1);
    // Running total putts taken
    const [totalPutts, setTotalPutts] = useState(0);
    // Current hole putt count (max 3 then auto-advance)
    const [holePutts, setHolePutts] = useState(0);
    // Distance for this hole
    const [distance, setDistance] = useState(() => randomDistance(distances.min, distances.max));

    const totalPar = TOTAL_HOLES * PAR_PER_HOLE;
    // vs par so far
    const scoreSoFar = totalPutts - (currentHole - 1) * PAR_PER_HOLE;

    const advanceHole = useCallback((finalHolePutts: number) => {
        const newTotal = totalPutts + finalHolePutts;
        const nextHole = currentHole + 1;

        if (nextHole > TOTAL_HOLES) {
            // Game over — calculate final score vs par
            const finalScore = newTotal - totalPar;
            const label = finalScore === 0 ? 'E (Even)' : finalScore > 0 ? `+${finalScore}` : `${finalScore}`;
            onComplete(finalScore, label);
        } else {
            setTotalPutts(newTotal);
            setCurrentHole(nextHole);
            setHolePutts(0);
            setDistance(randomDistance(distances.min, distances.max));
        }
    }, [currentHole, distances, onComplete, totalPar, totalPutts]);

    const handleMake = () => {
        // Made it — advance hole with 1 putt (or holePutts + 1 if missed before)
        advanceHole(holePutts + 1);
    };

    const handleMiss = () => {
        const newHolePutts = holePutts + 1;
        // After 3 misses automatically advance (counts as 4 putts)
        if (newHolePutts >= 3) {
            advanceHole(4);
        } else {
            setHolePutts(newHolePutts);
        }
    };

    const scoreLabel = (s: number) =>
        s === 0 ? 'E' : s > 0 ? `+${s}` : `${s}`;

    const scoreClass = scoreSoFar < 0 ? 'text-success' : scoreSoFar > 0 ? 'text-danger' : 'text-muted';

    return (
        <>
            {/* Game header */}
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Hole {currentHole} / {TOTAL_HOLES}</div>
            </div>

            {/* Progress bar */}
            <div className="progress-pill">
                <div
                    className="progress-pill__fill"
                    style={{ width: `${((currentHole - 1) / TOTAL_HOLES) * 100}%` }}
                />
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Hole</div>
                    <div className="score-bar__value">{currentHole}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Putts</div>
                    <div className="score-bar__value">{holePutts}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Score</div>
                    <div className={`score-bar__value ${scoreClass}`}>{scoreLabel(scoreSoFar)}</div>
                </div>
            </div>

            {/* Distance display */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">
                    📏 {distance} ft
                </div>
                {holePutts > 0 && (
                    <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                        {holePutts} putt{holePutts > 1 ? 's' : ''} — keep trying!
                    </p>
                )}
            </div>

            {/* Make / Miss buttons */}
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
