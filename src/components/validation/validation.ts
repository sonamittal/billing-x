// zod schema >>>>>>>>>>>>>\
import * as z from "zod";
export const supFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is  required" }),
    email: z.email({ message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password should match",
        path: ["confirmPassword"],
      });
    }
  });
export type SignupFormSchema = z.infer<typeof supFormSchema>;

// sigin schema >>>>>>>>>>
export const sinFormSchema = z.object({
  email: z.email({ message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 character" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one letter and one number",
    ),
});
export type SigninFormSchema = z.infer<typeof sinFormSchema>;

// otp schema >>>>>>>>>>
export const otpFormSchema = z.object({
  email: z.email(),
  verificationCode: z.string().min(6).max(6),
});
export type OtpFormSchema = z.infer<typeof otpFormSchema>;

// forgot password schema >>>>>>>>>
export const forgotPasswordFormSchema = z.object({
  email: z.email({ message: "Email is required" }),
});
export type ForgotPasswordFormSchema = z.infer<typeof forgotPasswordFormSchema>;
// set password schema >>>>>>>>>
export const setPasswordFormSchema = z
  .object({
    // email: z.email({ message: "Email is required" }),
    verificationCode: z
      .string()
      .min(1, { message: "Verification code is required" })
      .min(6, { message: "Verification code should have 6 digits" })
      .max(6, { message: "Verification code can have max 6 digits" }),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password should match",
        path: ["confirmPassword"],
      });
    }
  });
export type SetPasswordFormSchema = z.infer<typeof setPasswordFormSchema>;

// organization setup schema >>>>>>>>>>>
export const organizationSchema = z
  .object({
    name: z.string().min(1, { message: " Organization name is  required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, { message: "City is required" }),
    address: z.string().min(1, { message: "Location is required" }),
    currency: z.string().min(1, { message: "Currency is required" }),
    language: z.string().trim().min(1, { message: "Language is required" }),
    timezone: z.string().trim().min(1, { message: "Timezone is required" }),
    gstRegistered: z.boolean(),
    gstNumber: z.string().trim().optional(),
    invoicingMethod: z
      .string()
      .trim()
      .min(1, { message: "Invoicing method is required" }),
  })
  .superRefine((data, ctx) => {
    if (data.gstRegistered && !data.gstNumber) {
      ctx.addIssue({
        path: ["gstNumber"],
        message: "GST Number is required when business is GST registered",
        code: "custom",
      });
    }
  });
export type OrganizationSchema = z.infer<typeof organizationSchema>;

// add user form schema >>>>>>>>>>
export const addNewUserFormSchema = z.object({
  image: z.string().min(1, { message: "Image is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
  role: z.enum(["admin", "staff", "staffAssigned", "timesheetStaff"], {
    message: "Role is required",
  }),
  banned: z.enum(["true", "false"], {
    message: "Banned is required",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 character" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one letter and one number",
    ),
  isVerified: z.boolean().optional(),
});

export type AddNewUserFormSchema = z.infer<typeof addNewUserFormSchema>;

// edit user form schema >>>>>>>>>>
export const editUserFormSchema = z.object({
  image: z.string().min(1, { message: "Image is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
  role: z.enum(["admin", "staff", "staffAssigned", "timesheetStaff"], {
    message: "Role is required",
  }),
  banned: z.enum(["true", "false"], {
    message: "Banned is required",
  }),
  banReason: z.string().optional(),
  banExpires: z.string().optional(),
  isVerified: z.boolean().optional(),
});
export type EditUserFormSchema = z.infer<typeof editUserFormSchema>;

// update user password schema >>>>>>>>>>>
export const updateUserPasswordFormSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "Password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Password and confirm password should match",
        path: ["confirmPassword"],
      });
    }
  });
export type UpdateUserPasswordFormSchema = z.infer<
  typeof updateUserPasswordFormSchema
>;

// customer (user-form) schema >>>>>>>>>>>>>>>
export const userFormSchema = z.object({
  image: z.string().min(1, { message: "Image is required" }),
  name: z.string().min(1, { message: "Name is required" }),
  email: z.email({ message: "Email is required" }),
  // phoneno: z
  //   .string()
  //   .length(10, { message: "Phone number must be exactly 10 digits" })
  //   .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z
    .string()
    .min(8, { message: "Password must be atleast 8 character" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must contain at least one letter and one number",
    ),
});
export type UserFormSchema = z.infer<typeof userFormSchema>;

// add customer from schema >>>>>>>>>>>>>>
export const addCustomerFormSchema = z
  .object({
    userId: z.string().optional(),
    customerType: z.enum(["individual", "business"]),
    companyName: z.string().optional(),
    currency: z.string().min(1, { message: "Currency is required" }),
    language: z.string().trim().min(1, { message: "Language is required" }),
    country: z.string().min(1, { message: "Country is required" }),
    state: z.string().min(1, { message: "State is required" }),
    city: z.string().min(1, { message: "City is required" }),
    pinCode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "Invalid pin code"),
    address: z.object({
      street1: z.string().min(1, {
        message: "Street1 is required",
      }),

      street2: z.string().min(1, {
        message: "Street2 is required",
      }),
    }),
  })
  .superRefine((data, ctx) => {
    // business case condition
    if (data.customerType === "business" && !data.companyName) {
      ctx.addIssue({
        code: "custom",
        message: "Company name is required",
        path: ["companyName"],
      });
    }
  });

export type AddCustomerFormSchema = z.infer<typeof addCustomerFormSchema>;

// edit customer from schema >>>>>>>>>>>>>>
export const editCustomerFormSchema = z.object({
  customerType: z.enum(["individual", "business"]),
  // primaryContact: z.object({
  //   salutation: z.string().min(1, { message: "salutation is required" }),
  //   firstName: z.string().min(1, { message: "first name is required" }),
  //   lastName: z.string().min(1, { message: "last name is required" }),
  // }),
  companyName: z.string().optional(),
  currency: z.string().min(1, { message: "Currency is required" }),
  language: z.string().min(1, { message: "Language is required" }),
  email: z.email({ message: "Email is required" }),
  workPhone: z
    .string()
    .length(10, { message: "Work phone must be exactly 10 digits" })
    .regex(/^\d+$/, "Phone number must contain only digits"),
  mobile: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^\d+$/, "Phone number must contain only digits"),
});

export type EditCustomerFormSchema = z.infer<typeof editCustomerFormSchema>;

// edit address customer from schema >>>>>>>>>>>>>>
export const editAddressCustomerFormSchema = z.object({
  country: z.string().min(1, { message: "Country is required" }),
  state: z.string().min(1, { message: "State is required" }),
  city: z.string().min(1, { message: "City is required" }),
  pinCode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "Invalid pin code"),
  address: z.object({
    street1: z.string().min(1, {
      message: "Street1 is required",
    }),

    street2: z.string().min(1, {
      message: "Street2 is required",
    }),
  }),
  mobile: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^\d+$/, "Phone number must contain only digits"),
});
export type EditAddressCustomerFormSchema = z.infer<
  typeof editAddressCustomerFormSchema
>;

// contact person schema >>>>>>>>>>>>>>>>>>>>>>>>>>
export const contactPersonSchema = z.object({
  id: z.string().optional(),
  salutation: z.string().min(1, { message: "Salutation is required" }),
  firstName: z.string().min(1, { message: "First name is required" }),
  lastName: z.string().min(1, { message: "Last name is required" }),
  email: z.email({ message: "Email is required" }),
  workPhone: z
    .string()
    .length(10, { message: "Mobile number must be exactly 10 digits" })
    .regex(/^\d+$/, "Phone number must contain only digits"),
  mobile: z
    .string()
    .length(10, { message: "Work phone must be exactly 10 digits" })
    .regex(/^\d+$/, "Phone number must contain only digits"),
  designation: z.string().min(1, { message: "Designation is required" }),
  department: z.string().min(1, { message: "Department is required" }),
});

export const contactPersonsSchema = z.object({
  contacts: z.array(contactPersonSchema),
});

export type ContactPersonsSchema = z.infer<typeof contactPersonsSchema>;

// other details schema >>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const otherDetailsSchema = z.object({
  pan: z.string().min(1, { message: "pan is required" }),
  paymentTermId: z.string().min(1, {
    message: "Payment terms are required",
  }),
  documents: z
    .array(
      z.union([
        z.instanceof(File),
        z.object({
          url: z.string(),
          key: z.string(),
          name: z.string().optional(),
        }),
      ]),
    )
    .optional(),
  // meta info
  websiteUrl: z.url({ message: "Enter a valid website URL" }),
  department: z.string().min(1, { message: "Department is required " }),
  designation: z.string().min(1, { message: "Designation is required " }),
  x: z.string().min(1, { message: "X is required" }),
  facebook: z.string().min(1, { message: "Facebook is required" }),
});
export type OtherDetailsSchema = z.infer<typeof otherDetailsSchema>;

// add payment term schema >>>>>>>>>>>>>>>>>>>>>>>>
export const paymentTermSchema = z.object({
  termName: z.string().min(1, {
    message: "Term name is required",
  }),
  dueAfter: z
    .number({ message: "Day must be a number" })
    .int({ message: "Day must be a whole number" })
    .min(1, { message: "Day cannot be less than 1" })
    .max(365, { message: "Day cannot be more than 365" }),
});

export type PaymentTermSchema = z.infer<typeof paymentTermSchema>;

// edit remarks >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const editCRSchema = z.object({
  remarks: z.string().min(1, {
    message: "remarks is required",
  }),
});
export type EditCRSchema = z.infer<typeof editCRSchema>;

// add invoice schema >>>>>>>>>>>>>>>>>>>>>>>>>>
export const addInvoiceSchema = z.object({
  customerName: z.string().min(1, {
    message: "Customer name is required",
  }),
  invoiceNumber: z.string().min(1, {
    message: "Invoice number is required",
  }),
  invoiceDate: z.date({
    message: "Invoice date is required",
  }),
  dueDate: z.date({
    message: "Due date is required",
  }),
  subject: z.string().optional(),
  attachments: z
    .array(
      z.object({
        url: z.string(),
        key: z.string(),
        name: z.string().optional(),
      }),
    )
    .min(1, {
      message: "At least one attachment is required",
    }),
  subtotal: z.number().min(0, {
    message: "Subtotal cannot be negative",
  }),
  discount: z.number().min(0, {
    message: "Discount cannot be negative",
  }),
  totalAmount: z.number().min(0, {
    message: "Total amount cannot be negative",
  }),
  customerNotes: z.string().min(1, {
    message: "Customer notes is required",
  }),
  termsAndConditions: z.string().min(1, {
    message: "Terms And Conditions is required",
  }),
});

export type AddInvoiceSchema = z.infer<typeof addInvoiceSchema>;

// add invoice item schema >>>>>>>>>>>>>>>>>>>>>>
export const addItemSchema = z.object({
  itemName: z.string().min(1, {
    message: "Item name is required",
  }),
  unit: z.string().min(1, {
    message:
      "The item will be measured in terms of this unit (e.g.: kg, dozen)",
  }),

  sellingPrice: z.coerce.number().min(0, {
    message: "Selling price must be greater than or equal to 0",
  }),

  description: z.string().min(1, {
    message: "Description is required",
  }),
});

export type AddItemSchema = z.infer<typeof addItemSchema>;
