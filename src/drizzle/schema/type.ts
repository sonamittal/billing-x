
export const UNIT_VALUES = [
  "pcs",
  "cm",
  "mm",
  "m",
  "km",
  "ft",
  "in",
  "g",
  "kg",
  "mg",
  "lb",
  "ml",
  "l",
  "box",
  "pack",
  "dozen",
] as const;

export type Unit = (typeof UNIT_VALUES)[number];