export const lookupClassForIsSolvedStatus = new Map<string, string>([
  ["successBefore", "table-success-before-contest"],
  ["successIntime", "table-success-intime"],
  ["success", "table-success"],
  ["warningIntime", "table-warning-intime"],
  ["warning", "table-warning"],
]);

export const makeElementDropdown = (element: HTMLElement, href: string) => {
  // ドロップダウン化する
  element.classList.add("dropdown", "dropdown-hover-open");
  element.firstElementChild?.setAttribute("data-toggle", "dropdown");
  // ドロップダウンにするとクリックで遷移しなくなるので、クリックイベント発火で遷移させる
  // イベントリスナー範囲はタブのみでドロップダウン部分は除く
  element.firstElementChild?.addEventListener("click", () => {
    location.href = href;
  });
};
