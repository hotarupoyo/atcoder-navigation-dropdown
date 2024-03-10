import { monkeyWindow } from "$";

export type Contest = {
  id: string;
  start_epoch_second: number;
  duration_second: number;
  title: string;
  rate_change: string;
};
export type Problem = {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
};
export type ContestAndProblem = {
  contest_id: string;
  problem_id: string;
  problem_index: string;
};
export type MergedProblem = {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
  shortest_submission_id: number | null;
  shortest_contest_id: string | null;
  shortest_user_id: string | null;
  fastest_submission_id: number | null;
  fastest_contest_id: string | null;
  fastest_user_id: string | null;
  first_submission_id: number | null;
  first_contest_id: string | null;
  first_user_id: string | null;
  source_code_length: number | null;
  execution_time: number | null;
  point: number | null;
  solver_count: number;
};
export type ProblemModel = {
  slope: number;
  intercept: number;
  variance: number;
  difficulty: number;
  discrimination: number;
  irt_loglikelihood: number;
  irt_users: number;
  is_experimental: boolean;
};
export type UserRankEntry = {
  count: number;
  rank: number;
};
export type UserLangRankEntry = {
  language: string;
  count: number;
  rank: number;
};
export type RankingEntry = {
  count: number;
  user_id: string;
};
export type SumRankingEntry = {
  user_id: string;
  point_sum: number;
};
export type LangRankingEntry = {
  user_id: string;
  count: number;
  language: string;
};
export type SubmissionEntry = {
  id: number;
  epoch_second: number;
  problem_id: string;
  contest_id: string;
  user_id: string;
  language: string;
  point: number;
  length: number;
  result: string;
  execution_time?: number;
};

// DEV模式下获取不到@require的脚本里的全局变量 · Issue #12 · lisonge/vite-plugin-monkey https://github.com/lisonge/vite-plugin-monkey/issues/12
// グローバル変数はこう宣言する
// import { monkeyWindow } from "$";
// import type { GetContests } from "./types/atcoder-problems-api";
// @ts-ignore
// const getContests = monkeyWindow.getContests as GetContests;

type GetContests = () => Promise<Contest[]>;
type GetProblems = () => Promise<Problem[]>;
type GetDetailedProblems = () => Promise<MergedProblem[]>;
type GetContestsAndProblems = () => Promise<ContestAndProblem[]>;
type GetEstimatedDifficulties = () => Promise<{
  [key: string]: ProblemModel;
}>;
type GetAcceptedCountRanking = (from: number, to: number) => Promise<RankingEntry[]>;
type GetUserAcceptedCountRank = (user: string) => Promise<UserRankEntry>;
type GetRatedPointSumRanking = (from: number, to: number) => Promise<SumRankingEntry[]>;
type GetUserRatedPointSumRank = (user: string) => Promise<UserRankEntry>;
type GetLongestStreakRanking = (from: number, to: number) => Promise<RankingEntry[]>;
type GetUserLongestStreakRank = (user: string) => Promise<UserRankEntry>;

type GetLanguageAcceptedCountRanking = (from: number, to: number, language: string) => Promise<LangRankingEntry[]>;
type GetUserLanguageAcceptedCountRank = (user: string) => Promise<UserLangRankEntry[]>;
type GetLanguageList = () => Promise<string[]>;
type GetSubmissions = (user: string) => Promise<SubmissionEntry[]>;

// @ts-ignore
export const getContests = monkeyWindow.getContests as GetContests;
// @ts-ignore
export const getProblems = monkeyWindow.getProblems as GetProblems;
// @ts-ignore
export const getDetailedProblems = monkeyWindow.getDetailedProblems as GetDetailedProblems;
// @ts-ignore
export const getContestsAndProblems = monkeyWindow.getContestsAndProblems as GetContestsAndProblems;
// @ts-ignore
export const getEstimatedDifficulties = monkeyWindow.getEstimatedDifficulties as GetEstimatedDifficulties;
// @ts-ignore
export const getAcceptedCountRanking = monkeyWindow.getAcceptedCountRanking as GetAcceptedCountRanking;
// @ts-ignore
export const getUserAcceptedCountRank = monkeyWindow.getUserAcceptedCountRank as GetUserAcceptedCountRank;
// @ts-ignore
export const getRatedPointSumRanking = monkeyWindow.getRatedPointSumRanking as GetRatedPointSumRanking;
// @ts-ignore
export const getUserRatedPointSumRank = monkeyWindow.getUserRatedPointSumRank as GetUserRatedPointSumRank;
// @ts-ignore
export const getLongestStreakRanking = monkeyWindow.getLongestStreakRanking as GetLongestStreakRanking;
// @ts-ignore
export const getUserLongestStreakRank = monkeyWindow.getUserLongestStreakRank as GetUserLongestStreakRank;
export const getLanguageAcceptedCountRanking =
  // @ts-ignore
  monkeyWindow.getLanguageAcceptedCountRanking as GetLanguageAcceptedCountRanking;
export const getUserLanguageAcceptedCountRank =
  // @ts-ignore
  monkeyWindow.getUserLanguageAcceptedCountRank as GetUserLanguageAcceptedCountRank;
// @ts-ignore
export const getLanguageList = monkeyWindow.getLanguageList as GetLanguageList;
// @ts-ignore
export const getSubmissions = monkeyWindow.getSubmissions as GetSubmissions;
