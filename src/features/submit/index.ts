import type { ContestAndProblem, Problem, SubmissionEntry } from "../../types/atcoder-problems-api";
import { makeElementDropdown } from "../../utils";

export const modifySubmitTab = (
  problems: Problem[],
  contestProblems: ContestAndProblem[],
  submissions: SubmissionEntry[],
) => {
  const tab = getSubmitTabElement();
  if (tab == null) return;

  makeElementDropdown(tab, `/contests/${contestScreenName}/submit`);

  let htmlPart = "";

  const currentSubmissions = submissions.filter((element) => element.contest_id === contestScreenName);

  for (const iterator of currentSubmissions) {
    const p = problems.find((element) => element.id === iterator.problem_id);
    const cp = contestProblems.find(
      (element) => element.contest_id === iterator.contest_id && element.problem_id === iterator.problem_id,
    );
    if (p == null || cp == null) {
      continue;
    }
    const html2 = generateTrHtml(iterator, p, cp);
    htmlPart += html2;
  }

  const html = `
<ul
  class="dropdown-menu dropdown-menu-center table-hover scrollable-menu"
  role="menu"
>
  <table class="table table-bordered table-striped small th-center">
    <thead>
      <tr>
        <th>提出日時</th>
        <th>問題</th>
        <th>ユーザ</th>
        <th>言語</th>
        <th>得点</th>
        <th>コード長</th>
        <th>結果</th>
        <th>実行時間</th>
        <!-- <th width="8%">メモリ</th>Problemsに提出のメモリ情報がない 省略 -->
        <th></th>
      </tr>
    </thead>
    <tbody>
      ${htmlPart}
    </tbody>
  </table>
</ul>
`;
  tab.insertAdjacentHTML("beforeend", html);

  tab.firstElementChild?.insertAdjacentHTML("beforeend", `<span class="badge">${submissions.length}</span>`);
};

const getSubmitTabElement = () => {
  // ページ上部のタブをセレクトする
  const contestNavTabs = document.querySelectorAll<HTMLLIElement>("#contest-nav-tabs > ul > li");

  // biome-ignore lint/style/useForOf: NodeListOfはforof無理
  for (let i = 0; i < contestNavTabs.length; i++) {
    const element = contestNavTabs[i];
    const firstChild = element?.firstElementChild as HTMLAnchorElement;
    if (["提出", "Submit"].includes(firstChild.innerText.trim())) {
      return element;
    }
  }

  return undefined;
};

const generateTrHtml = (s: SubmissionEntry, p: Problem, cp: ContestAndProblem) => {
  const time = new Date(s.epoch_second * 1000).toLocaleString();
  const problemUrl = `/contests/${s.contest_id}/tasks/${s.problem_id}`;
  const problemTitle = `${cp.problem_index} - ${p.name}`;
  const labelStyle = s.result === "AC" ? "label-success" : s.result !== "WJ" ? "label-warning" : "label-default";

  return `
<tr>
  <td class="no-break">
    <time class="fixtime-second">${time}</time>
  </td>
  <td>
    <a href="${problemUrl}">${problemTitle}</a>
  </td>
  <td>
    <a href="/users/${s.user_id}">${s.user_id}</a>
  </td>
  <td>${s.language}</td>
  <td class="text-right submission-score">${s.point}</td>
  <td class="text-right">${s.length} Byte</td>
  <td class="text-center">
    <span class="label ${labelStyle}">${s.result}</span>
  </td>
  <td class="text-right">${s.execution_time} ms</td>
  <td class="text-center">
    <a href="/contests/${s.contest_id}/submissions/${s.id}">詳細</a>
  </td>
</tr>
`;
};
