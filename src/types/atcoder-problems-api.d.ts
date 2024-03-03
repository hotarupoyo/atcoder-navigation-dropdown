import {
  Contest,
  ContestAndProblem,
  LangRankingEntry,
  MergedProblem,
  Problem,
  ProblemModel,
  RankingEntry,
  SubmissionEntry,
  SumRankingEntry,
  UserLangRankEntry,
  UserRankEntry,
} from ".";

declare const getContests: () => Promise<Contest[]>;
declare const getProblems: () => Promise<Problem[]>;
declare const getDetailedProblems: () => Promise<MergedProblem[]>;
declare const getContestsAndProblems: () => Promise<ContestAndProblem[]>;
declare const getEstimatedDifficulties: () => Promise<{
  [key: string]: ProblemModel;
}>;
declare const getAcceptedCountRanking: (from: number, to: number) => Promise<RankingEntry[]>,
  getUserAcceptedCountRank: (user: string) => Promise<UserRankEntry>;
declare const getRatedPointSumRanking: (from: number, to: number) => Promise<SumRankingEntry[]>,
  getUserRatedPointSumRank: (user: string) => Promise<UserRankEntry>;
declare const getLongestStreakRanking: (from: number, to: number) => Promise<RankingEntry[]>,
  getUserLongestStreakRank: (user: string) => Promise<UserRankEntry>;
declare const getLanguageAcceptedCountRanking: (
  from: number,
  to: number,
  language: string,
) => Promise<LangRankingEntry[]>;
declare const getUserLanguageAcceptedCountRank: (user: string) => Promise<UserLangRankEntry[]>;
declare const getLanguageList: () => Promise<string[]>;
declare function getSubmissions(user: string): Promise<SubmissionEntry[]>;
