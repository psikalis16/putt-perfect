// Shared TypeScript types for the Putt Perfect app

// Breeze auth types (required by Breeze-generated Profile and Welcome pages)
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User;
    };
};


export interface GameDefinition {
    id: number;
    slug: string;
    name: string;
    description: string;
    icon: string;
    difficulty: 1 | 2 | 3;
    config: Record<string, number | string | boolean>;
}

export interface GameSession {
    id: number;
    user_id: number;
    game_definition_id: number;
    min_distance: number;
    max_distance: number;
    score: number | null;
    score_label: string | null;
    completed_at: string | null;
    created_at: string;
    game_definition?: GameDefinition;
    rounds?: GameRound[];
}

export interface GameRound {
    id: number;
    game_session_id: number;
    hole_number: number;
    distance: number;
    putts_taken: number;
    made: boolean;
    created_at: string;
}

// Per-game stat aggregation returned by HistoryController
export interface GameStats {
    game: GameDefinition;
    sessions: GameSession[];
    total_played: number;
    best_score: number | null;
    avg_score: number | null;
    recent_scores: (number | null)[];
}

// Distance settings stored client-side and server-side per user
export interface DistanceSettings {
    min: number;
    max: number;
}
