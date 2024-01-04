export const contestScreenName = location.pathname.split("/")[2] ?? "";
export const contestTitle = document.querySelector<HTMLAnchorElement>(".contest-title")?.innerText ?? "";

export const userScreenName: string | undefined = (() => {
  const aElements = document.querySelectorAll<HTMLAnchorElement>("ul > li > ul > li > a");
  for (let i = 0; i < aElements.length; i++) {
    const element = aElements[i];
    if (element != null && ["マイプロフィール", "My Profile"].includes(element.innerText.trim())) {
      return element.pathname.split("/")[2];
    }
  }
  return undefined;
})();

const ConvertIso8601BasicToExtended = (iso8601basic: string): string => {
  // example: "20231210T2100"
  const d = iso8601basic;
  return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 11)}:${d.substring(11, 13)}`;
};

const contestDuration = document.querySelectorAll<HTMLAnchorElement>(".contest-duration > a");
export const contestStartTime = new Date(
  ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(0).search).get("iso") ?? "0"),
);
export const contestEndTime = new Date(
  ConvertIso8601BasicToExtended(new URLSearchParams(contestDuration.item(1).search).get("iso") ?? "0"),
);

export const hasContestStarted = new Date() >= contestStartTime;
export const hasContestEnded = new Date() >= contestEndTime;
export const IsContestPermanent = contestEndTime.getTime() - contestStartTime.getTime() >= 365 * 24 * 60 * 60 * 1000; // コンテスト時間が1年以上なら常設中のコンテストとみなす

export const nonPenaltyJudgeStatuses = ["AC", "CE", "IE", "WJ", "WR"];
