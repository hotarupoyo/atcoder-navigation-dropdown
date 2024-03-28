import type { ContestAndProblem, Problem, SubmissionEntry } from "../../types/atcoder-problems-api";
import { lookupClassForIsSolvedStatus, makeElementDropdown } from "../../utils";
import { countSuccessProblems } from "../../utils/countSuccessProblems";
import { findRepresentativeSubmissions } from "../../utils/findRepresentativeSubmissions";

/**
 * トップタブに最近訪れた10コンテストと開始時間が近い10コンテストを表示する
 * 全完は緑背景、一部正答は薄緑背景でぬる
 */
export const modifyTasksTab = (
  problems: Problem[],
  contestProblems: ContestAndProblem[],
  submissions: SubmissionEntry[],
  scoresFromAtcoder: Map<string, number>,
) => {
  const tab = getTasksTabElement();
  if (tab == null) return;

  makeElementDropdown(tab, `/contests/${contestScreenName}/tasks`);

  // 前処理
  const currentContestProblems = contestProblems.filter((element2) => element2.contest_id === contestScreenName);
  // Problems Informationのcontest_idでフィルターすると、再出題された問題が取得できない 例：ABS
  // Pairs of Contests and Problemsでフィルターする
  const currentProblems = problems
    .filter((element) => {
      return currentContestProblems.some((element2) => element2.problem_id === element.id);
    })
    .toSorted((a, b) => compareProblemIndex(a.id, b.id));

  let htmlProblem = "";
  let htmlSubmissions = "";

  for (const iterator of currentProblems) {
    const representative = findRepresentativeSubmissions(submissions, iterator.contest_id, iterator.id);

    let aClass = lookupClassForIsSolvedStatus.get(representative.isSolvedStatus ?? "") ?? "";
    // 得点ページから得点を取り問題解いたか判定する 提出一覧は1ページしか取得しないので2ページあると困る
    if ((scoresFromAtcoder.get(iterator.id) ?? 0) > 0) {
      aClass = lookupClassForIsSolvedStatus.get("successIntime") ?? "";
    }

    // Problems Informationのproblem_indexは初出題のもので、ABSの問題など再出題のものとは異なる
    // Pairs of Contests and Problemsのproblem_indexから取得する
    const problemIndex = currentContestProblems.find((element) => element.problem_id === iterator.id)?.problem_index;

    const urlProblem = `/contests/${iterator.contest_id}/tasks/${iterator.id}`;
    const titleProblem = `${problemIndex} - ${iterator.name}`;
    htmlProblem += `<li role="presentation"><a class="${aClass}" href="${urlProblem}">${titleProblem}</a></li>\n`;

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
    htmlSubmissions += `<li role="presentation"><a class="${aClass}" href="${urlSubmission}">${titleSubmission}</a></li>\n`;
  }

  const html = `
  <ul class="dropdown-menu table-hover scrollable-menu" role="menu">
    <li role="presentation" class="dropdown-header">Problem</li>
    <!-- <li role="presentation"><a href="#">title</a></li> -->
    ${htmlProblem}
  <li role="presentation" class="divider"></li>
  <li role="presentation" class="dropdown-header">
      Submission
    </li>
    <!-- <li role="presentation"><a href="#">問題Nの提出</a></li> -->
    ${htmlSubmissions}
  </ul>
`;
  // FIXME: 本当は提出リンクを問題リンクの右に出したいけどドロップダウンの2列化が面倒だから下に出している

  tab.insertAdjacentHTML("beforeend", html);

  // 何問解けたかバッジをタブに追加する
  const count = countSuccessProblems(
    submissions,
    contestScreenName,
    currentProblems.map((element) => element.id),
  );

  tab.firstElementChild?.insertAdjacentHTML(
    "beforeend",
    `<span class="badge">${count}/${currentProblems.length}</span>`,
  );
};

const getTasksTabElement = () => {
  // ページ上部のタブをセレクトする
  const contestNavTabs = document.querySelectorAll<HTMLLIElement>("#contest-nav-tabs > ul > li");

  // biome-ignore lint/style/useForOf: NodeListOfはforof無理
  for (let i = 0; i < contestNavTabs.length; i++) {
    const element = contestNavTabs[i];
    const firstChild = element?.firstElementChild as HTMLAnchorElement;
    if (["問題", "Tasks"].includes(firstChild.innerText.trim())) {
      return element;
    }
  }

  return undefined;
};

export const compareProblemIndex = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  // Ex対応
  if (a === "Ex") {
    return 1;
  }
  // APG4b対応 idがEX1, EX10 ゼロ埋めしていない 数字部分を数値に変換してソートする
  if (a.match(/EX\d/) && b.match(/EX\d/)) {
    return Number(a.slice(2)) < Number(b.slice(2)) ? -1 : 1;
  }
  return a < b ? -1 : 1;
};
