type Contest = {
  id: string;
  start_epoch_second: number;
  duration_second: number;
  title: string;
  rate_change: string;
};
type Problem = {
  id: string;
  contest_id: string;
  problem_index: string;
  name: string;
  title: string;
};
type ContestAndProblem = {
  contest_id: string;
  problem_id: string;
  problem_index: string;
};
type MergedProblem = {
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
type ProblemModel = {
  slope: number;
  intercept: number;
  variance: number;
  difficulty: number;
  discrimination: number;
  irt_loglikelihood: number;
  irt_users: number;
  is_experimental: boolean;
};
type UserRankEntry = {
  count: number;
  rank: number;
};
type UserLangRankEntry = {
  language: string;
  count: number;
  rank: number;
};
type RankingEntry = {
  count: number;
  user_id: string;
};
type SumRankingEntry = {
  user_id: string;
  point_sum: number;
};
type LangRankingEntry = {
  user_id: string;
  count: number;
  language: string;
};
type SubmissionEntry = {
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
