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

// payment stat
export const INVOICE_PAYMENTSTATUS = [
  "unpaid",
  "partially_paid",
  "paid",
] as const;

export type InvoicePaymentStatus = (typeof INVOICE_PAYMENTSTATUS)[number];

//Invoice Status
export const INVOICE_STATUS = ["draft", "sent"] as const;

export type InvoiceStatus = (typeof INVOICE_STATUS)[number];
