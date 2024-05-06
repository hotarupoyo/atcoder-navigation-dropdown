import lscache from "lscache";
import { mergeFetchedDataFromAtCoderAndProblemsApi, updateVisitedContestHistory } from "./apis";
import { modifySubmissionsTab } from "./features/submissions";
import { modifySubmitTab } from "./features/submit";
import { modifyTasksTab } from "./features/tasks";
import { modifyTopTab } from "./features/top";
import "./styles/custom.scss";
import "./styles/style.css";
import {
  type SubmissionEntry,
  getContests,
  getContestsAndProblems,
  getProblems,
  getSubmissions,
} from "./types/atcoder-problems-api";

(async () => {
  lscache.flushExpired();
  updateVisitedContestHistory();

  // APIコール
  const [contests, problems, contestProblems, submissions] = await Promise.all([
    getContests(),
    getProblems(),
    getContestsAndProblems(),
    userScreenName !== "" ? getSubmissions(userScreenName) : <SubmissionEntry[]>[],
  ]);

  const scoresCurrentContest = new Map<string, number>();
  mergeFetchedDataFromAtCoderAndProblemsApi(contests, problems, contestProblems, submissions, scoresCurrentContest);

  modifyTopTab(contests, contestProblems, submissions);
  modifyTasksTab(problems, contestProblems, submissions, scoresCurrentContest);
  modifySubmitTab(problems, contestProblems, submissions);
  modifySubmissionsTab();
})();
