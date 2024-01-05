import { contestId, userId } from "./atcoder";

export const lscacheKeyPrefix = "atcoder-navigation-dropdown";
export const lscacheKeyTop = `${lscacheKeyPrefix}-top`;
export const lscacheKeyMyScores = `${lscacheKeyPrefix}-my-scores-${contestId}`;
export const lscacheKeyMySubmissions = `${lscacheKeyPrefix}-my-submissions-${userId}-${contestId}`;
