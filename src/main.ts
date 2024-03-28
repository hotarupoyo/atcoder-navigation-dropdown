import lscache from "lscache";
import { fetchMyScoresFromAtcoder, fetchMySubmissionsFromAtcoder, updateVisitedContestHistory } from "./apis";
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
  const scoresFromAtcoder = new Map<string, number>();

  // AtCoder Problemsがまだクロールしていないコンテストならば、AtCoderのページから問題、自分の提出一覧を取得する
  if (!contests.some((element) => element.id === contestScreenName)) {
    const [problemsFromAtcoder, submissionsFromAtCoder] = await Promise.all([
      fetchMyScoresFromAtcoder(),
      fetchMySubmissionsFromAtcoder(),
    ]);

    // AtCoder Problems APIの取得結果とAtCoderの取得結果をマージする
    problems.concat(problemsFromAtcoder);
    submissions.concat(submissionsFromAtCoder);
    for (const iterator of problemsFromAtcoder) {
      contestProblems.push({
        contest_id: iterator.contest_id,
        problem_id: iterator.id,
        problem_index: iterator.problem_index,
      });
    }
    // 得点ページから得点を取り問題解いたか判定する 提出一覧は1ページしか取得しないので2ページあると困る
    for (const iterator of problemsFromAtcoder) {
      scoresFromAtcoder.set(iterator.id, iterator.score);
    }
  }

  modifyTopTab(contests, contestProblems, submissions);
  modifyTasksTab(problems, contestProblems, submissions, scoresFromAtcoder);
  modifySubmitTab(problems, contestProblems, submissions);
  modifySubmissionsTab();
})();
