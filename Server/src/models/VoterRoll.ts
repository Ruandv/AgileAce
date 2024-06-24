export interface VoterRoll {
    votes: number;
    value: number;
    average: number;
    closest: number;
    cards: { value: string; users: string[]; }[];
}
