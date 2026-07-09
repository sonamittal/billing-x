"use client";
import { Document, Page, Text, View } from "@react-pdf/renderer";
import { modernStyles } from "@/components/website/pages/invoices/pdf/styles/modern";
import type { Invoice } from "@/components/website/pages/invoices/pdf/type";

interface InvoiceProps {
  invoice: Invoice;
}

const ModernTemplate = ({ invoice }: InvoiceProps) => {
  return (
    <Document>
      <Page size="A4" style={modernStyles.page}>
        {/* ================= HEADER ================= */}

        <View style={modernStyles.header}>
          <View style={modernStyles.companySection}>
            <Text style={modernStyles.companyName}>Your Company</Text>

            <Text style={modernStyles.companyText}>Company Address</Text>

            <Text style={modernStyles.companyText}>City, State</Text>

            <Text style={modernStyles.companyText}>Country</Text>

            <Text style={modernStyles.companyText}>Phone : +91 XXXXXXXXXX</Text>

            <Text style={modernStyles.companyText}>
              Email : company@example.com
            </Text>
          </View>

          <View
            style={{
              alignItems: "flex-end",
              justifyContent: "center",
            }}
          >
            <Text style={modernStyles.invoiceTitle}>INVOICE</Text>
          </View>
        </View>

        {/* ================= TOP DETAILS ================= */}

        <View style={modernStyles.infoWrapper}>
          {/* Invoice Details */}

          <View style={modernStyles.leftInfo}>
            <Text style={modernStyles.sectionTitle}>Invoice Details</Text>

            <View style={modernStyles.row}>
              <Text style={modernStyles.label}>Invoice No:</Text>

              <Text style={modernStyles.value}>{invoice.invoiceNo}</Text>
            </View>

            <View style={modernStyles.row}>
              <Text style={modernStyles.label}>Invoice Date:</Text>

              <Text style={modernStyles.value}>{invoice.invoiceDate}</Text>
            </View>

            <View style={modernStyles.row}>
              <Text style={modernStyles.label}>Due Date:</Text>

              <Text style={modernStyles.value}>{invoice.dueDate}</Text>
            </View>

            <View style={modernStyles.row}>
              <Text style={modernStyles.label}>Status:</Text>

              <Text style={modernStyles.value}>{invoice.status}</Text>
            </View>

            {invoice.paymentStatus !== "unpaid" && (
              <>
                <View style={modernStyles.row}>
                  <Text style={modernStyles.label}>Payment Status:</Text>

                  <Text style={modernStyles.value}>
                    {invoice.paymentStatus}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Billing Address */}

          <View style={modernStyles.rightInfo}>
            <Text style={modernStyles.sectionTitle}>Billing Address</Text>

            <Text style={modernStyles.customerText}>
              {invoice.customer.address.street1}
            </Text>

            <Text style={modernStyles.customerText}>
              {invoice.customer.city}, {invoice.customer.state}
            </Text>

            <Text style={modernStyles.customerText}>
              {invoice.customer.country}
            </Text>

            <Text style={modernStyles.customerText}>
              {invoice.customer.pinCode}
            </Text>

            <Text style={modernStyles.customerText}>
              Phone : {invoice.customer.phone}
            </Text>

            <Text style={modernStyles.customerText}>
              Email : {invoice.customer.email}
            </Text>
          </View>
        </View>

        {/* ================= BILL TO ================= */}

        <View style={modernStyles.billToSection}>
          <Text style={modernStyles.billToTitle}>Bill To</Text>

          <Text style={modernStyles.billToName}>{invoice.customer.name}</Text>
        </View>

        {/* ================= ITEMS TABLE ================= */}

        <View style={modernStyles.table}>
          {/* Header */}

          <View style={modernStyles.tableHeader}>
            <Text style={modernStyles.colItem}>Item</Text>

            <Text style={modernStyles.colQty}>Qty</Text>

            <Text style={modernStyles.colUnit}>Unit</Text>

            <Text style={modernStyles.colRate}>Rate</Text>

            <Text style={modernStyles.colAmount}>Amount</Text>
          </View>

          {/* Items */}

          {invoice.items.map((item, index) => (
            <View key={index} style={modernStyles.tableRow}>
              <View style={modernStyles.colItem}>
                <Text>{item.itemName}</Text>

                {!!item.description && (
                  <Text style={modernStyles.itemDescription}>
                    {item.description}
                  </Text>
                )}
              </View>

              <Text style={modernStyles.colQty}>{item.quantity}</Text>

              <Text style={modernStyles.colUnit}>{item.unit}</Text>

              <Text style={modernStyles.colRate}>₹{item.rate.toFixed(2)}</Text>

              <Text style={modernStyles.colAmount}>
                ₹{item.amount.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        <View style={modernStyles.bottomSection}>
          {/* Left Side */}
          <View style={modernStyles.leftBottom}>
            <View style={modernStyles.notesSection}>
              <Text style={modernStyles.sectionTitle}>Customer Notes</Text>

              <Text style={modernStyles.notesText}>
                {invoice.customerNotes}
              </Text>
            </View>

            <View style={modernStyles.notesSection}>
              <Text style={modernStyles.sectionTitle}>Terms & Conditions</Text>

              <Text style={modernStyles.notesText}>
                {invoice.termsAndConditions}
              </Text>
            </View>
          </View>

          {/* Right Side */}
          <View style={modernStyles.summary}>
            {/* Sub Total */}
            <View style={modernStyles.summaryRow}>
              <Text>Sub Total</Text>
              <Text>₹{invoice.subtotal.toFixed(2)}</Text>
            </View>

            {/* Discount */}
            {invoice.discount > 0 && (
              <View style={modernStyles.summaryRow}>
                <Text>Discount</Text>
                <Text>₹{invoice.discount.toFixed(2)}</Text>
              </View>
            )}

            {/* Total */}
            <View style={modernStyles.totalRow}>
              <Text>Total</Text>
              <Text>₹{invoice.totalAmount.toFixed(2)}</Text>
            </View>

            {/* Payment Details */}
            {invoice.paymentStatus !== "unpaid" && (
              <>
                <View style={modernStyles.summaryRow}>
                  <Text>Payment Made</Text>

                  <Text style={{ color: "#DC2626" }}>
                    (-) ₹{invoice.amountPaid.toFixed(2)}
                  </Text>
                </View>
              </>
            )}

            {/* Balance Due */}
            <View style={modernStyles.balanceRow}>
              <Text>Balance Due</Text>

              <Text>
                ₹
                {invoice.paymentStatus === "paid"
                  ? "0.00"
                  : invoice.balanceDue.toFixed(2)}
              </Text>
            </View>

            {/* Amount In Words */}
            <View style={modernStyles.amountInWordsSection}>
              <Text style={modernStyles.amountInWordsText}>
                <Text style={{ fontWeight: "bold" }}>Total in Words :</Text>{" "}
                <Text style={{ color: "#000" }}>
                  Indian {invoice.amountInWords}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* ================= FOOTER ================= */}

        <View style={modernStyles.signatureSection}>
          <Text
            style={{
              fontWeight: "bold",
              marginBottom: 30,
            }}
          >
            Authorized Signature
          </Text>

          <View style={modernStyles.signatureLine} />
        </View>
      </Page>
    </Document>
  );
};

export default ModernTemplate;
