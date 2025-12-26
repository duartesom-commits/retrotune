
export const GameState = {
  SETUP: 'SETUP',
  PLAYING: 'PLAYING',
  FINISHED: 'FINISHED',
  LEADERBOARD: 'LEADERBOARD',
} as const;

export type GameState = typeof GameState[keyof typeof GameState];

export type Decade = '80s' | '90s' | '00s' | '2010s' | '2020s' | 'all';
export type Category = 'portuguese' | 'international' | 'both';


export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string;
  type: 'text';
  decade: Decade;
  category: Category;
}

export interface PlayerScore {
  name: string;
  score: number;
  decade: Decade;
  category: Category;
  durationMinutes: number;
  date: string;
}

export interface GameConfig {
  decade: Decade;
  durationMinutes: number;
  playerName: string;
  category: Category;
}
