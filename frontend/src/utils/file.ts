import { find } from "lodash";

export const formatSize = (size: number) => {
  const parts = Intl.NumberFormat("en-US", {
    maximumFractionDigits: 1,
    notation: "compact",
  }).formatToParts(size);

  const integer = find(parts, { type: "integer" })?.value || "0";
  const fraction = find(parts, { type: "fraction" })?.value || "";
  const compact = find(parts, { type: "compact" })?.value || "";

  return `${integer}${fraction && "." + fraction} ${unit(compact)}`;
};

const unit = (compact: string) => {
  switch (compact) {
    case "K":
      return "kB";
    case "B":
      return "GB";
    default:
      return `${compact}B`;
  }
};
