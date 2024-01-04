import { IsSolvedStatus } from "./findRepresentativeSubmissions";

export const ConvertIso8601BasicToExtended = (iso8601basic: string): string => {
  // example: "20231210T2100"
  const d = iso8601basic;
  return `${d.substring(0, 4)}-${d.substring(4, 6)}-${d.substring(6, 11)}:${d.substring(11, 13)}`;
};

export const comparelexicographically = (a: string, b: string): number => {
  if (a === b) {
    return 0;
  }
  return a < b ? -1 : 1;
};

export const lookupClassForIsSolvedStatus = (a: IsSolvedStatus) => {
  if (a === "successBefore") {
    return "table-success-before-contest";
  }
  if (a === "successIntime") {
    return "table-success-intime";
  }
  if (a === "success") {
    return "table-success";
  }
  if (a === "warningIntime") {
    return "table-warning-intime";
  }
  if (a === "warning") {
    return "table-warning";
  }
  return "";
};
