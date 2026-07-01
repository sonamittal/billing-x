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

// payment mode

export const PAYMENT_MODE = [
  "cash",
  "upi",
  "bank",
  "cheque",
  "credit card",
] as const;

export type PaymentMode = (typeof PAYMENT_MODE)[number];
