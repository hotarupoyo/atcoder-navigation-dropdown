import type { ContestAndProblem, Problem, SubmissionEntry } from "../types/atcoder-problems-api";

export const submitTr = (s: SubmissionEntry, p: Problem, cp: ContestAndProblem) => {
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
    <span
      class="label ${labelStyle}"
      >${s.result}</span
    >
  </td>
  <td class="text-right">${s.execution_time} ms</td>
  <td class="text-center">
    <a href="/contests/${s.contest_id}/submissions/${s.id}">詳細</a>
  </td>
</tr>

  `;
};
