import lscache from "lscache";
import { fetchMyScoresFromAtcoder, fetchMySubmissionsFromAtcoder, loadVisited11Contests } from "./apis/api";
import "./components/custom.scss";
import "./components/style.css";
import submitHtml from "./components/submit.html?raw";
import { submitTr } from "./components/submitTr";
import tasksHtml from "./components/tasks.html?raw";
import topHtml from "./components/top.html?raw";
import { contestId, contestStartTime, userId } from "./consts/atcoder";
import { Contest, SubmissionEntry } from "./types";
import { getContests, getContestsAndProblems, getProblems, getSubmissions } from "./types/atcoder-problems-api";
import { comparelexicographically, lookupClassForIsSolvedStatus } from "./utils";
import { countSuccessIntimeProblems, countSuccessProblems } from "./utils/countSuccessProblems";
import { RepresentativeSubmissions, findRepresentativeSubmissions } from "./utils/findRepresentativeSubmissions";

(async () => {
  lscache.flushExpired();

  let tabTop = undefined; // トップ
  let tabTasks = undefined; // 問題
  let tabSubmit = undefined; // 提出
  let tabSubmissions = undefined; // 提出結果
  // ページ上部のタブをセレクトする
  const contestNavTabs = document.querySelectorAll<HTMLLIElement>("#contest-nav-tabs > ul > li");
  for (let i = 0; i < contestNavTabs.length; i++) {
    const element = contestNavTabs[i];
    const firstChild = element?.firstElementChild as HTMLAnchorElement;
    if (["トップ", "Top"].includes(firstChild.innerText.trim())) {
      tabTop = element;
    }
    if (["問題", "Tasks"].includes(firstChild.innerText.trim())) {
      tabTasks = element;
    }
    if (["提出", "Submit"].includes(firstChild.innerText.trim())) {
      tabSubmit = element;
    }
    if (["提出結果", "Results"].includes(firstChild.innerText.trim())) {
      tabSubmissions = element;
    }
  }
  // 例外処理 タブをセレクトできなければ終了する
  if (tabTop == null || tabTasks == null || tabSubmit == null || tabSubmissions == null) {
    return;
  }

  // ドロップダウン化する
  tabTop.classList.add("dropdown", "dropdown-hover-open");
  tabTop.firstElementChild?.setAttribute("data-toggle", "dropdown");
  tabTasks.classList.add("dropdown", "dropdown-hover-open");
  tabTasks.firstElementChild?.setAttribute("data-toggle", "dropdown");
  tabSubmit.classList.add("dropdown", "dropdown-hover-open");
  tabSubmit.firstElementChild?.setAttribute("data-toggle", "dropdown");
  tabSubmissions.classList.add("dropdown", "dropdown-hover-open"); // 提出結果をホバーで開くようにする
  // ドロップダウンにするとクリックで遷移しなくなるので、クリックイベント発火で遷移させる
  // イベントリスナー範囲はタブのみでドロップダウン部分は除く
  tabTop.firstElementChild?.addEventListener("click", () => {
    location.href = `/contests/${contestId}`;
  });
  tabTasks.firstElementChild?.addEventListener("click", () => {
    location.href = `/contests/${contestId}/tasks`;
  });
  tabSubmit.firstElementChild?.addEventListener("click", () => {
    location.href = `/contests/${contestId}/submit`;
  });
  tabSubmissions.firstElementChild?.addEventListener("click", () => {
    location.href = `/contests/${contestId}/submissions`;
  });

  // APIコール
  const visited11Contests = loadVisited11Contests();
  const [contests, problems, contestProblems, submissions] = await Promise.all([
    getContests(),
    getProblems(),
    getContestsAndProblems(),
    userId != null ? getSubmissions(userId) : <SubmissionEntry[]>[],
  ]);
  const scoresFromAtcoder = new Map<string, number>();

  // AtCoder Problemsがまだクロールしていないコンテストならば、AtCoderのページから問題、自分の提出一覧を取得する
  if (!contests.some((element) => element.id === contestId)) {
    const [problemsFromAtcoder, submissionsFromAtCoder] = await Promise.all([
      fetchMyScoresFromAtcoder(),
      fetchMySubmissionsFromAtcoder(),
    ]);

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

  // トップタブ前処理する
  const compareContest = (a: Contest, b: Contest) =>
    Math.abs(a.start_epoch_second - contestStartTime.getTime() / 1000) -
    Math.abs(b.start_epoch_second - contestStartTime.getTime() / 1000);
  /** このコンテストと開始時間が近い11コンテスト */
  const adjacentContests11 = contests
    .toSorted(compareContest)
    .slice(0, 11)
    .toSorted((a, b) => a.start_epoch_second - b.start_epoch_second)
    .toReversed();

  const contestProblemsHere = contestProblems.filter((element2) => element2.contest_id === contestId);
  // Problems Informationのcontest_idでフィルターするとABSの問題など再出題された問題が取得できないので
  // Pairs of Contests and Problemsでフィルターする
  const problemsHere = problems.filter((element) => {
    return contestProblemsHere.some((element2) => element2.problem_id === element.id);
  });
  problemsHere.sort((a, b) => -comparelexicographically(a.id, b.id));
  // HACK: 典型90問はproblem_idが順番通りではないので、典型90問を含め問題がアルファベットの数より多かったらproblem_indexでソートする
  // FIXME: ABSの問題順番がおかしい
  if (problemsHere.length > 26) {
    problemsHere.sort((a, b) => -comparelexicographically(a.problem_index, b.problem_index));
  }
  // 新しい順番に表示したいのでソートする
  const submissionsHere = submissions
    .filter((element) => element.contest_id === contestId)
    .toSorted((a, b) => -(a.epoch_second - b.epoch_second));

  const representativeSubmissions = new Map<string, RepresentativeSubmissions>();
  for (const iterator of problemsHere) {
    representativeSubmissions.set(
      iterator.id,
      findRepresentativeSubmissions(submissions, iterator.contest_id, iterator.id),
    );
  }

  // ドロップダウンを編集する
  // トップタブのドロップダウンを編集する
  const docTop = new DOMParser().parseFromString(topHtml, "text/html");
  if (docTop.body.firstElementChild != null) {
    // Recentグループ 最近訪れた10コンテストを表示する
    const groupRecent = docTop.querySelector(".group-recent");
    for (const iterator of visited11Contests) {
      if (iterator.id === contestId) {
        continue; // 今のコンテストは除く
      }
      const ids = contestProblems
        .filter((element) => element.contest_id === iterator.id)
        .map((element) => element.problem_id);
      const countIntime = countSuccessIntimeProblems(submissions, iterator.id, ids);
      const count = countSuccessProblems(submissions, iterator.id, ids);
      const aClass = countIntime === ids.length ? "table-success-intime" : count === ids.length ? "table-success" : "";
      const url = `/contests/${iterator.id}`;
      const title = `${iterator.id.toUpperCase()} - ${iterator.title} (${count}/${ids.length})`;
      const html = `<li role="presentation"><a class="${aClass}" href="${url}">${title}</a></li>`;
      groupRecent?.insertAdjacentHTML("afterend", html);
    }

    // Adjacentグループ
    const groupAdjacent = docTop.querySelector(".group-adjacent");
    for (const iterator of adjacentContests11) {
      const liClass = iterator.id === contestId ? "disabled" : "";
      const ids = contestProblems
        .filter((element) => element.contest_id === iterator.id)
        .map((element) => element.problem_id);
      const countIntime = countSuccessIntimeProblems(submissions, iterator.id, ids);
      const count = countSuccessProblems(submissions, iterator.id, ids);
      const aClass = countIntime === ids.length ? "table-success-intime" : count === ids.length ? "table-success" : "";
      const url = `/contests/${iterator.id}`;
      const title = `${iterator.id.toUpperCase()} - ${iterator.title} (${count}/${ids.length})`;
      const html = `<li role="presentation" class="${liClass}"><a class="${aClass}" href="${url}">${title}</a></li>`;
      groupAdjacent?.insertAdjacentHTML("afterend", html);
    }

    tabTop.insertAdjacentElement("beforeend", docTop.body.firstElementChild);
  }

  // 問題タブのドロップダウンを編集する
  const docTasks = new DOMParser().parseFromString(tasksHtml, "text/html");
  if (docTasks.body.firstElementChild != null) {
    // Problemグループ
    const groupProblem = docTasks.querySelector(".group-problem");
    // Submissionグループ
    const groupSubmission = docTasks.querySelector(".group-submission");

    for (const iterator of problemsHere) {
      const representative = representativeSubmissions.get(iterator.id);
      let aClass = lookupClassForIsSolvedStatus(representative?.isSolvedStatus);
      // 得点ページから得点を取り問題解いたか判定する 提出一覧は1ページしか取得しないので2ページあると困る
      if ((scoresFromAtcoder.get(iterator.id) ?? 0) > 0) {
        aClass = lookupClassForIsSolvedStatus("successIntime");
      }
      // Problems Informationのproblem_indexは初出題のもので、ABSの問題など再出題のものとは異なる
      // Pairs of Contests and Problemsのproblem_indexから取得する
      const problemIndex = contestProblemsHere.find((element) => element.problem_id === iterator.id)?.problem_index;

      const urlProblem = `/contests/${iterator.contest_id}/tasks/${iterator.id}`;
      const titleProblem = `${problemIndex} - ${iterator.name}`;
      const htmlProblem = `<li role="presentation"><a class="${aClass}" href="${urlProblem}">${titleProblem}</li>`;
      groupProblem?.insertAdjacentHTML("afterend", htmlProblem);

      // 最後のACの提出 なければ最後の提出
      const submissionToLink =
        representative?.after.latestAc?.id ??
        representative?.intime.latestAc?.id ??
        representative?.before.latestAc?.id ??
        representative?.another.latestAc?.id ??
        representative?.after.latest?.id ??
        representative?.intime.latest?.id ??
        representative?.before.latest?.id ??
        representative?.another.latest?.id ??
        undefined;
      if (submissionToLink == null) {
        continue;
      }
      const urlSubmission = `/contests/${iterator.contest_id}/submissions/${submissionToLink}`;
      const titleSubmission = `${problemIndex}の提出`;
      const htmlSubmission = `<li role="presentation"><a class="${aClass}" href="${urlSubmission}">${titleSubmission}</a></li>`;
      groupSubmission?.insertAdjacentHTML("afterend", htmlSubmission);
    }
    tabTasks.insertAdjacentElement("beforeend", docTasks.body.firstElementChild);
  }

  // 提出タブのドロップダウンを編集する
  // ※提出結果タブはドロップダウンがあるので、代わりに提出タブを編集する
  const docSubmit = new DOMParser().parseFromString(submitHtml, "text/html");
  if (docSubmit.body.firstElementChild != null && submissionsHere.length > 0) {
    const tbody = docSubmit.querySelector("tbody");
    for (const iterator of submissionsHere) {
      const p = problemsHere.find((element) => element.id === iterator.problem_id);
      const cp = contestProblemsHere.find((element) => element.problem_id === iterator.problem_id);
      if (p == null || cp == null) {
        continue;
      }
      const html = submitTr(iterator, p, cp);
      tbody?.insertAdjacentHTML("beforeend", html);
    }
    tabSubmit.insertAdjacentElement("beforeend", docSubmit.body.firstElementChild);
  }
})();
