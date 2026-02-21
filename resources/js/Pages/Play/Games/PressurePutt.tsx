import { useState } from 'react';
import { type GameProps } from '../Index';

// Pressure Putt — one putt at each escalating distance, miss one = game over
export default function PressurePutt({ game, distances, onComplete }: GameProps) {
    const steps = Array.from(
        { length: distances.max - distances.min + 1 },
        (_, i) => distances.min + i
    );

    const [currentStep, setCurrentStep] = useState(0);
    const [made, setMade] = useState(0);

    const currentDistance = steps[currentStep];

    const handleMake = () => {
        const next = currentStep + 1;
        const newMade = made + 1;

        if (next >= steps.length) {
            // Completed all distances — perfect round!
            onComplete(currentDistance, `🏆 Perfect! ${currentDistance} ft`);
        } else {
            setMade(newMade);
            setCurrentStep(next);
        }
    };

    const handleMiss = () => {
        // Miss = game over, report the last distance made
        const farthest = made > 0 ? steps[currentStep - 1] ?? distances.min : 0;
        onComplete(farthest, farthest > 0 ? `Farthest: ${farthest} ft` : 'Missed the first one!');
    };

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                <div className="play-header__hole">Attempt {currentStep + 1} / {steps.length}</div>
                <div className="play-header__subtitle">Miss one and it's over!</div>
            </div>

            {/* Progress */}
            <div className="progress-pill">
                <div
                    className="progress-pill__fill"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                />
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Current</div>
                    <div className="score-bar__value">{currentDistance} ft</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Made</div>
                    <div className="score-bar__value text-success">{made}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Remaining</div>
                    <div className="score-bar__value">{steps.length - currentStep}</div>
                </div>
            </div>

            {/* Distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {currentDistance} ft</div>
                <p className="text-sm text-danger" style={{ marginTop: 4, fontWeight: 600 }}>
                    ⚠️ One miss ends the game
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
                    Missed (End)
                </button>
            </div>
        </>
    );
}
