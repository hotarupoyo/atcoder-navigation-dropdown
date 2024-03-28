import { makeElementDropdown } from "../../utils";

export const modifySubmissionsTab = () => {
  const tab = getSubmissionsTabElement();
  if (tab == null) return;

  makeElementDropdown(tab, `/contests/${contestScreenName}/submissions`);
};

const getSubmissionsTabElement = () => {
  // ページ上部のタブをセレクトする
  const contestNavTabs = document.querySelectorAll<HTMLLIElement>("#contest-nav-tabs > ul > li");

  // biome-ignore lint/style/useForOf: NodeListOfはforof無理
  for (let i = 0; i < contestNavTabs.length; i++) {
    const element = contestNavTabs[i];
    const firstChild = element?.firstElementChild as HTMLAnchorElement;
    if (["提出結果", "Results"].includes(firstChild.innerText.trim())) {
      return element;
    }
  }

  return undefined;
};
