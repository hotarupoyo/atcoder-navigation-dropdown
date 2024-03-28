import { getVisitedContestHistory } from "../../apis";
import { contestStartTime } from "../../const/atcoder";
import type { Contest, ContestAndProblem, SubmissionEntry } from "../../types/atcoder-problems-api";
import { makeElementDropdown } from "../../utils";
import { countSuccessIntimeProblems, countSuccessProblems } from "../../utils/countSuccessProblems";

export const modifyTopTab = (
  contests: Contest[],
  contestProblems: ContestAndProblem[],
  submissions: SubmissionEntry[],
) => {
  const tab = getTopTabElement();
  if (tab == null) return;

  makeElementDropdown(tab, `/contests/${contestScreenName}`);

  const history = getVisitedContestHistory().slice(0, -1).toReversed();
  // 最新の履歴は除く 最近順に並び替える

  /** このコンテストと開始時間が近い11コンテスト */
  const adjacentContests = contests
    .toSorted(compareContest)
    .slice(0, 11)
    .toSorted((a, b) => a.start_epoch_second - b.start_epoch_second);
  // 近い順に並び変えて先頭31個を取る 再度開始時間順に並び替える

  let htmlAtHistory = "";
  for (const iterator of history) {
    const liClass = iterator.id === contestScreenName ? "disabled" : "";
    // 何問解けたか数える
    const problemIds = contestProblems
      .filter((element) => element.contest_id === iterator.id)
      .map((element) => element.problem_id);
    const countIntime = countSuccessIntimeProblems(submissions, iterator.id, problemIds);
    const count = countSuccessProblems(submissions, iterator.id, problemIds);
    const aClass =
      countIntime === problemIds.length ? "table-success-intime" : count === problemIds.length ? "table-success" : "";

    const url = `/contests/${iterator.id}`;
    const title = `${iterator.id.toUpperCase()} - ${iterator.title} `;
    const badge = `<span class="badge">${count}/${problemIds.length}</span>`;
    htmlAtHistory += `<li role="presentation" class="${liClass}"><a class="${aClass}" href="${url}">${title}${badge}</a></li>`;
  }

  let htmlAtAdjacent = "";
  for (const iterator of adjacentContests) {
    const liClass = iterator.id === contestScreenName ? "disabled" : "";
    // 何問解けたか数える
    const problemIds = contestProblems
      .filter((element) => element.contest_id === iterator.id)
      .map((element) => element.problem_id);
    const countIntime = countSuccessIntimeProblems(submissions, iterator.id, problemIds);
    const count = countSuccessProblems(submissions, iterator.id, problemIds);
    const aClass =
      countIntime === problemIds.length ? "table-success-intime" : count === problemIds.length ? "table-success" : "";

    const url = `/contests/${iterator.id}`;
    const title = `${iterator.id.toUpperCase()} - ${iterator.title} `;
    const badge = `<span class="badge">${count}/${problemIds.length}</span>`;
    htmlAtAdjacent += `<li role="presentation" class="${liClass}"><a class="${aClass}" href="${url}">${title}${badge}</a></li>`;
  }

  const html = `
  <ul class="dropdown-menu table-hover scrollable-menu" role="menu">
    <li role="presentation" class="dropdown-header">History</li>
    <!-- <li role="presentation"><a href="#">title</a></li> -->
    ${htmlAtHistory}
  <li role="presentation" class="divider"></li>
  <li role="presentation" class="dropdown-header">Adjacent</li>
    <!-- <li role="presentation"><a href="#">title</a></li> -->
    ${htmlAtAdjacent}
  </ul>
`;

  tab.insertAdjacentHTML("beforeend", html);
};

const getTopTabElement = () => {
  // ページ上部のタブをセレクトする
  const contestNavTabs = document.querySelectorAll<HTMLLIElement>("#contest-nav-tabs > ul > li");

  // biome-ignore lint/style/useForOf: NodeListOfはforof無理
  for (let i = 0; i < contestNavTabs.length; i++) {
    const element = contestNavTabs[i];
    const firstChild = element?.firstElementChild as HTMLAnchorElement;
    if (["トップ", "Top"].includes(firstChild.innerText.trim())) {
      return element;
    }
  }

  return undefined;
};

const compareContest = (a: Contest, b: Contest) =>
  Math.abs(a.start_epoch_second - contestStartTime.getTime() / 1000) -
  Math.abs(b.start_epoch_second - contestStartTime.getTime() / 1000);
