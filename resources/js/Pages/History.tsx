import { Head } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';
import { type GameStats } from '@/types';

interface Props {
    byGame: GameStats[];
    totalSessions: number;
}

// Sparkline bar chart using CSS only
function Sparkline({ scores }: { scores: (number | null)[] }) {
    const valid = scores.filter((s): s is number => s !== null);
    if (valid.length === 0) return null;

    const max = Math.max(...valid) || 1;

    return (
        <div className="sparkline" aria-hidden="true">
            {scores.map((s, i) => (
                <div
                    key={i}
                    className="sparkline__bar"
                    style={{ height: `${s !== null ? Math.max(4, (s / max) * 100) : 4}%` }}
                />
            ))}
        </div>
    );
}

// Format a date string to a short readable form
function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

export default function History({ byGame, totalSessions }: Props) {
    return (
        <AppLayout title="History">
            <Head title="History — Putt Perfect" />

            <div className="page">
                <h1 className="page-title">Your Stats</h1>
                <p className="page-subtitle">Track your putting progress over time</p>

                {/* Overall stats */}
                <div className="stat-row">
                    <div className="stat-card">
                        <div className="stat-card__value">{totalSessions}</div>
                        <div className="stat-card__label">Sessions</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card__value">{byGame.length}</div>
                        <div className="stat-card__label">Games Played</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-card__value">
                            {byGame.reduce((a, g) => a + (g.total_played ?? 0), 0)}
                        </div>
                        <div className="stat-card__label">Total Rounds</div>
                    </div>
                </div>

                {/* Empty state */}
                {byGame.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-state__icon">📊</div>
                        <p className="text-lg font-semibold">No sessions yet</p>
                        <p className="text-sm text-muted" style={{ marginTop: 8 }}>
                            Complete a game to see your stats here.
                        </p>
                    </div>
                )}

                {/* Per-game sections */}
                {byGame.map(({ game, sessions, total_played, best_score, avg_score, recent_scores }) => (
                    <div key={game.id} className="history-game-section">
                        {/* Game header */}
                        <div className="history-game-header">
                            <div className="history-game-icon">{game.icon}</div>
                            <div>
                                <div className="font-bold">{game.name}</div>
                                <div className="text-sm text-muted">{total_played} session{total_played !== 1 ? 's' : ''}</div>
                            </div>
                            {/* Mini sparkline */}
                            <div style={{ marginLeft: 'auto' }}>
                                <Sparkline scores={recent_scores} />
                            </div>
                        </div>

                        {/* Stat pills */}
                        <div className="flex gap-3 mb-4">
                            {best_score !== null && (
                                <div className="stat-card" style={{ flex: 1, padding: '10px 12px' }}>
                                    <div className="stat-card__value">{best_score}</div>
                                    <div className="stat-card__label">Best</div>
                                </div>
                            )}
                            {avg_score !== null && (
                                <div className="stat-card" style={{ flex: 1, padding: '10px 12px' }}>
                                    <div className="stat-card__value">{avg_score}</div>
                                    <div className="stat-card__label">Avg</div>
                                </div>
                            )}
                        </div>

                        {/* Recent session list */}
                        <div className="session-list">
                            {sessions.map((session) => (
                                <div key={session.id} className="session-item">
                                    <div>
                                        <div className="session-item__score">
                                            {session.score_label ?? '—'}
                                        </div>
                                        <div className="session-item__range">
                                            {session.min_distance}–{session.max_distance} ft
                                        </div>
                                    </div>
                                    <div className="session-item__date">
                                        {session.completed_at ? formatDate(session.completed_at) : '—'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </AppLayout>
    );
}
