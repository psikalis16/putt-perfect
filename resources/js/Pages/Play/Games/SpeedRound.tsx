import { useCallback, useEffect, useRef, useState } from 'react';
import { type GameProps } from '../Index';

const DURATION_SECONDS = 60;

// Speed Round — make as many putts as possible in 60 seconds
export default function SpeedRound({ game, distances, onComplete }: GameProps) {
    const [started, setStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(DURATION_SECONDS);
    const [makes, setMakes] = useState(0);
    const [misses, setMisses] = useState(0);
    // Fixed distance for the whole speed round
    const [distance] = useState(() =>
        Math.round((distances.min + distances.max) / 2)
    );

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const endGame = useCallback(() => {
        if (timerRef.current) clearInterval(timerRef.current);
        onComplete(makes, `${makes} makes`);
    }, [makes, onComplete]);

    // Start countdown when first tap happens
    const startTimer = useCallback(() => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(timerRef.current!);
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
    }, []);

    // End game when timer hits 0
    useEffect(() => {
        if (started && timeLeft === 0) {
            endGame();
        }
    }, [timeLeft, started, endGame]);

    // Clean up on unmount
    useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

    const handleMake = () => {
        if (!started) {
            setStarted(true);
            startTimer();
        }
        setMakes((m) => m + 1);
    };

    const handleMiss = () => {
        if (!started) {
            setStarted(true);
            startTimer();
        }
        setMisses((m) => m + 1);
    };

    const isLow = timeLeft <= 10 && started;

    return (
        <>
            <div className="play-header">
                <div className="play-header__game-name">{game.icon} {game.name}</div>
                {!started && (
                    <div className="play-header__subtitle">Tap Make or Miss to start the clock!</div>
                )}
            </div>

            {/* Timer */}
            <div className={`timer ${isLow ? 'timer--low' : ''}`} aria-live="polite">
                {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
            </div>

            {/* Score bar */}
            <div className="score-bar">
                <div className="score-bar__item">
                    <div className="score-bar__label">Makes</div>
                    <div className="score-bar__value text-success">{makes}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Misses</div>
                    <div className="score-bar__value text-danger">{misses}</div>
                </div>
                <div className="score-bar__item">
                    <div className="score-bar__label">Rate</div>
                    <div className="score-bar__value">
                        {makes + misses > 0 ? Math.round((makes / (makes + misses)) * 100) : 0}%
                    </div>
                </div>
            </div>

            {/* Distance */}
            <div style={{ textAlign: 'center' }}>
                <div className="distance-badge">📏 {distance} ft</div>
                <p className="text-sm text-muted" style={{ marginTop: 4 }}>Fixed distance for speed round</p>
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
