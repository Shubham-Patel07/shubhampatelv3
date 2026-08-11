export type Stat = {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  label: string;
};

/**
 * Home "stats" panel. Kept honest: years of experience, the case studies on this
 * site, an SRE reliability target, and the breadth of the stack. Live GitHub /
 * WakaTime numbers live on the Dashboard.
 */
export const stats: Stat[] = [
  { value: 2, suffix: "+", label: "Years in production" },
  { value: 3, label: "Featured case studies" },
  { value: 99.9, decimals: 1, suffix: "%", label: "Reliability target" },
  { value: 25, suffix: "+", label: "Technologies" },
];
