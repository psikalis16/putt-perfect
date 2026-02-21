import { useState } from 'react';
import { type GameProps } from '../Index';

// Around the World — putt from every foot between min and max
// Must make each before advancing
export default function AroundTheWorld({ game, distances, onComplete }: GameProps) {
    // Build an array of distances from min to max (1 ft steps)
    const stops = Array.from(
        { length: distances.max - distances.min + 1 },
        (_, i) => distances.min + i
    );

    const [currentIndex, setCurrentIndex] = useState(0);
    const [totalPutts, setTotalPutts] = useState(0);
    const [missesAtCurrent, setMissesAtCurrent] = useState(0);

    const currentDistance = stops[currentIndex];
    const totalStops = stops.length;

    const handleMake = () => {
        const newTotal = totalPutts + missesAtCurrent + 1;
        const next = currentIndex + 1;

        if (next >= totalStops) {
            onComplete(newTotal, `${newTotal} putts`);
        } else {
            setTotalPutts(newTotal);
            setCurrentIndex(next);
            setMissesAtCurrent(0);
        }
    };

    const handleMiss = () => {
        setMissesAtCurrent((m) => m + 1);
        setTotalPutts((t) => t + 1);
    };

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Stop {currentIndex + 1} / {totalStops}</div>
                <div className="play-header__subtitle">Make it to move on!</div>
            </div>

            {/* Progress */}
            <div className="progress-pill">
                <div
                    className="progress-pill__fill"
                    style={{ width: `${(currentIndex / totalStops) * 100}%` }}
                />
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Stop</div>
                    <div className="score-bar__value">{currentIndex + 1}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Misses Here</div>
                    <div className="score-bar__value">{missesAtCurrent}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Total Putts</div>
                    <div className="score-bar__value">{totalPutts + missesAtCurrent}</div>
                </div>
            </div>

            {/* Distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {currentDistance} ft</div>
                <p className="text-sm text-muted" style={{ marginTop: 4 }}>
                    {distances.min}–{distances.max} ft circuit
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
