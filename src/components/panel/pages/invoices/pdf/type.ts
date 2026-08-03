export interface InvoiceItem {
  itemName: string;
  description?: string;
  unit: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface Invoice {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  status: string;

  customer: {
    name: string;
    address: {
      street1: string;
    };
    city: string;
    state: string;
    country: string;
    pinCode: string;
    phone: string;
    email: string;
  };

  items: InvoiceItem[];

  subject?: string;

  subtotal: number;
  discount: number;
  totalAmount: number;

  amountPaid: number;

  amountInWords: string;

  balanceDue: number;
  paymentStatus: "unpaid" | "partially_paid" | "paid";

  customerNotes: string;
  termsAndConditions: string;
}
