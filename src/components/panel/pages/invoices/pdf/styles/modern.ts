import { StyleSheet } from "@react-pdf/renderer";

export const modernStyles = StyleSheet.create({
  /* ================= PAGE ================= */

  page: {
    padding: 28,
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#374151",
    backgroundColor: "#FFFFFF",
  },

  /* ================= HEADER ================= */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: "#2563EB",
    paddingBottom: 12,
    marginBottom: 14,
  },

  companySection: {
    width: "60%",
  },

  companyName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 8,
  },

  companyText: {
    fontSize: 9,
    color: "#6B7280",
    marginBottom: 1,
    lineHeight: 1.2,
  },

  invoiceTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#2563EB",
    letterSpacing: 1,
  },

  /* ================= TOP BOX ================= */

  infoWrapper: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    overflow: "hidden",
  },

  leftInfo: {
    width: "50%",
    padding: 14,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
  },

  rightInfo: {
    width: "50%",
    padding: 14,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E40AF",
    marginBottom: 10,
    textTransform: "uppercase",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  label: {
    width: "42%",
    color: "#6B7280",
    fontSize: 9.5,
  },

  value: {
    width: "58%",
    textAlign: "right",
    fontWeight: "bold",
    color: "#111827",
    fontSize: 9.5,
  },

  customerText: {
    fontSize: 9.5,
    color: "#4B5563",
    marginBottom: 4,
    lineHeight: 1.5,
  },

  /* ================= BILL TO ================= */

  billToSection: {
    marginTop: 14,
    marginBottom: 18,
    padding: 10,
    backgroundColor: "#F9FAFB",
    borderLeftWidth: 4,
    borderLeftColor: "#2563EB",
  },

  billToTitle: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#6B7280",
    marginBottom: 4,
    textTransform: "uppercase",
  },

  billToName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },

  /* ================= TABLE ================= */

  table: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 5,
    overflow: "hidden",
    marginTop: 5,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563EB",
    color: "#FFFFFF",
    paddingVertical: 9,
    alignItems: "center",
  },

  tableRow: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
    alignItems: "center",
  },

  colItem: {
    flex: 4,
    paddingHorizontal: 10,
  },

  colQty: {
    flex: 1,
    textAlign: "center",
  },

  colUnit: {
    flex: 1,
    textAlign: "center",
  },

  colRate: {
    flex: 2,
    textAlign: "right",
    paddingRight: 10,
  },

  colAmount: {
    flex: 2,
    textAlign: "right",
    paddingRight: 10,
  },

  itemDescription: {
    marginTop: 3,
    fontSize: 8.5,
    color: "#6B7280",
    lineHeight: 1.4,
  },

  /* ================= SUMMARY ================= */
  summary: {
    width: "40%",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    padding: 10,
    backgroundColor: "#FFFFFF",
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
    fontSize: 10,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#D1D5DB",
    marginTop: 8,
    paddingTop: 10,
    fontSize: 11,
    fontWeight: "bold",
    color: "#111827",
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: "#EFF6FF",
    borderWidth: 1,
    borderColor: "#BFDBFE",
    borderRadius: 4,
    fontWeight: "bold",
    fontSize: 11,
    color: "#1D4ED8",
  },

  /* ================= AMOUNT IN WORDS ================= */

  amountInWordsSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 10,
  },

  amountInWordsText: {
    fontSize: 8.5,
    lineHeight: 1.6,
    color: "#6B7280",
  },

  /* ================= NOTES ================= */
  notesSection: {
    marginBottom: 14,
  },

  notesText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: "#4B5563",
  },

  /* ================= SIGNATURE ================= */

  signatureSection: {
    marginTop: 35,
    alignItems: "flex-end",
  },

  signatureTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#374151",
    marginBottom: 35,
  },

  signatureLine: {
    width: 170,
    borderBottomWidth: 1,
    borderBottomColor: "#6B7280",
  },

  /* ================= FOOTER ================= */

  footer: {
    position: "absolute",
    left: 30,
    right: 30,
    bottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  footerLeft: {
    fontSize: 8,
    color: "#9CA3AF",
  },

  footerRight: {
    fontSize: 8,
    color: "#9CA3AF",
  },

  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 18,
  },

  leftBottom: {
    width: "55%",
    paddingRight: 20,
  },
});
