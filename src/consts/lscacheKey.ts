import { contestScreenName, userScreenName } from "./atcoder";

export const lscacheKeyPrefix = "atcoder-navigation-dropdown";
export const lscacheKeyTop = `${lscacheKeyPrefix}-top`;
export const lscacheKeyMyScores = `${lscacheKeyPrefix}-my-scores-${contestScreenName}`;
export const lscacheKeyMySubmissions = `${lscacheKeyPrefix}-my-submissions-${userScreenName}-${contestScreenName}`;
