import lscache from "lscache";
import { contestScreenName, contestTitle } from "../const/atcoder";
import type { MyScore } from "../types";
import type { Contest, SubmissionEntry } from "../types/atcoder-problems-api";
import { lscacheKeyMyScores, lscacheKeyMySubmissions, lscacheVisitedContestHistory } from "./lscacheKey";
import { parseMyScoresFromAtcoder, parseMySubmissionsFromAtcoder } from "./parseFromAtcoder";

/** 最近訪れた31コンテストを更新する */
export const updateVisitedContestHistory = () => {
  // ローカルストレージに保存していない場合は、空配列にする
  let contests = (lscache.get(lscacheVisitedContestHistory) ?? []) as Contest[];
  // 更新する
  const tail = contests[contests.length - 1];
  if (tail?.id !== contestScreenName) {
    const contest: Contest = {
      id: contestScreenName ?? "",
      title: contestTitle ?? "",
      // 使わない値だし値取得が面倒だから仮の値を設定した
      start_epoch_second: 0,
      duration_second: 0,
      rate_change: "",
    };
    contests.push(contest);
  }
  contests = contests.slice(0, 31);
  lscache.set(lscacheVisitedContestHistory, contests, 365 * 24 * 60);
};

export const getVisitedContestHistory = () => {
  // ローカルストレージに保存していない場合は、空配列にする
  return (lscache.get(lscacheVisitedContestHistory) ?? []) as Contest[];
};

export const fetchMyScoresFromAtcoder = async (): Promise<MyScore[]> => {
  // キャッシュがまだ有効ならキャッシュを読む
  const scoresLs = lscache.get(lscacheKeyMyScores) as MyScore[] | null;
  if (scoresLs != null) {
    return scoresLs;
  }
  // AtCoderの自分の得点状況ページをパースしてキャッシュする
  try {
    const scoresA = await parseMyScoresFromAtcoder();
    // 負荷が問題になっているので、有効期限10分と長めにキャッシュする
    lscache.set(lscacheKeyMyScores, scoresA, 10);
    return scoresA;
  } catch (_error) {
    // 何らかの原因でAtCoderのページのリクエストに失敗したときは、空の配列をキャッシュして、連続でAtCoderのページをリクエストしないようにする
    lscache.set(lscacheKeyMyScores, [], 10);
    return [];
  }
};

export const fetchMySubmissionsFromAtcoder = async (): Promise<SubmissionEntry[]> => {
  // キャッシュがまだ有効ならキャッシュを読む
  const submissionsLs = lscache.get(lscacheKeyMySubmissions) as SubmissionEntry[] | null;
  if (submissionsLs != null) {
    return submissionsLs;
  }
  // AtCoderの自分の提出一覧ページをパースしてキャッシュする
  try {
    const submissionsA = await parseMySubmissionsFromAtcoder();
    // 負荷が問題になっているので、有効期限10分と長めにキャッシュする
    lscache.set(lscacheKeyMySubmissions, submissionsA, 10);
    return submissionsA;
  } catch (_error) {
    // 何らかの原因でAtCoderのページのリクエストに失敗したときは、空の配列をキャッシュして、連続でAtCoderのページをリクエストしないようにする
    lscache.set(lscacheKeyMySubmissions, [], 10);
    return [];
  }
};
