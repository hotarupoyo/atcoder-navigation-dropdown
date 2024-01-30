import lscache from "lscache";
import { contestId, contestTitle } from "../consts/atcoder";
import { lscacheKeyMyScores, lscacheKeyMySubmissions, lscacheKeyTop } from "../consts/lscacheKey";
import { MyScore } from "../types";
import { parseMyScoresFromAtcoder, parseMySubmissionsFromAtcoder } from "./parseFromAtcoder";

/** 最近訪れた11コンテストをローカルストレージへ更新し返却する */
export const loadVisited11Contests = () => {
  let visited11Contests = (lscache.get(lscacheKeyTop) ?? []) as Contest[];
  // 更新する
  if (!visited11Contests.some((element) => element.id === contestId)) {
    const contest: Contest = {
      id: contestId ?? "",
      title: contestTitle ?? "",
      // 使わない値だし値取得が面倒だから仮の値を設定した
      start_epoch_second: 0,
      duration_second: 0,
      rate_change: "",
    };
    visited11Contests.push(contest);
  }
  visited11Contests = visited11Contests.slice(0, 11);
  lscache.set(lscacheKeyTop, visited11Contests, 365 * 24 * 60);
  return visited11Contests;
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
