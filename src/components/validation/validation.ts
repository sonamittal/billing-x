// zod schema >>>>>>>>>>>>>\
import * as z from "zod";
export const supFormSchema = z
  .object({
    name: z.string().min(1, { message: "name is  required" }),
    email: z.email({ message: "Email is required" }),
    password: z
      .string()
      .min(8, { message: "password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "password and confirm password should match",
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
    .min(8, { message: "password must be atleast 8 character" })
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
      .min(8, { message: "password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "password and confirm password should match",
        path: ["confirmPassword"],
      });
    }
  });
export type SetPasswordFormSchema = z.infer<typeof setPasswordFormSchema>;

// organization setup schema >>>>>>>>>>>
export const organizationSchema = z
  .object({
    name: z.string().min(1, { message: " organization name is  required" }),
    industry: z.string().min(1, { message: "Industry is required" }),
    country: z.string().min(1, { message: "country is required" }),
    state: z.string().min(1, "state is required"),
    city: z.string().min(1, { message: "city is required" }),
    address: z.string().min(1, { message: "location is required" }),
    currency: z.string().min(1, { message: "currency is required" }),
    language: z.string().trim().min(1, { message: "language is required" }),
    timezone: z.string().trim().min(1, { message: "timezone is required" }),
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
  username: z.string().min(1, { message: "username is required" }),
  email: z.email({ message: "email is required" }),
  role: z.enum(["admin", "staff", "staffAssigned", "timesheetStaff"], {
    message: "Role is required",
  }),
  banned: z.enum(["true", "false"], {
    message: "banned is required",
  }),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 character" })
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
  username: z.string().min(1, { message: "username is required" }),
  email: z.email({ message: "email is required" }),
  role: z.enum(["admin", "staff", "staffAssigned", "timesheetStaff"], {
    message: "Role is required",
  }),
  banned: z.enum(["true", "false"], {
    message: "banned is required",
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
      .min(8, { message: "password must be atleast 8 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least one letter and one number",
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "password must be atleast 8 character." }),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "password and confirm password should match",
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
  username: z.string().min(1, { message: "username is required" }),
  email: z.email({ message: "email is required" }),
  // phoneno: z
  //   .string()
  //   .length(10, { message: "Phone number must be exactly 10 digits" })
  //   .regex(/^\d+$/, "Phone number must contain only digits"),
  password: z
    .string()
    .min(8, { message: "password must be atleast 8 character" })
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
    currency: z.string().min(1, { message: "currency is required" }),
    language: z.string().trim().min(1, { message: "Language is required" }),
    country: z.string().min(1, { message: "country is required" }),
    state: z.string().min(1, { message: "state is required" }),
    city: z.string().min(1, { message: "city is required" }),
    pinCode: z
      .string()
      .trim()
      .regex(/^[1-9][0-9]{5}$/, "invalid pin code"),
    address: z.string().min(1, { message: "address is required" }),
  })
  .superRefine((data, ctx) => {
    // business case condition
    if (data.customerType === "business" && !data.companyName) {
      ctx.addIssue({
        code: "custom",
        message: "company name is required",
        path: ["companyName"],
      });
    }
  });

export type AddCustomerFormSchema = z.infer<typeof addCustomerFormSchema>;

// edit customer from schema >>>>>>>>>>>>>>
export const editCustomerFormSchema = z.object({
  customerType: z.enum(["individual", "business"]),
  primaryContact: z.object({
    salutation: z.string().min(1, { message: "salutation is required" }),
    firstName: z.string().min(1, { message: "first name is required" }),
    lastName: z.string().min(1, { message: "last name is required" }),
  }),
  companyName: z.string().min(1, { message: "company name is required" }),
  currency: z.string().min(1, { message: "currency is required" }),
  language: z.string().min(1, { message: "language is required" }),
  email: z.email({ message: "email is required" }),
  workPhone: z.string().min(10, { message: "work phone is required" }),
  mobile: z.string().min(10, { message: "mobile number is required" }),
});

export type EditCustomerFormSchema = z.infer<typeof editCustomerFormSchema>;

// edit address customer from schema >>>>>>>>>>>>>>
export const editAddressCustomerFormSchema = z.object({
  type: z.enum(["billing", "shipping"], {
    message: "address type isrequired",
  }),
  country: z.string().min(1, { message: "country is required" }),
  state: z.string().min(1, { message: "state is required" }),
  city: z.string().min(1, { message: "city is required" }),
  pinCode: z
    .string()
    .trim()
    .regex(/^[1-9][0-9]{5}$/, "invalid pin code"),
  address: z.object({
    street1: z.string().min(1, {
      message: "street1 is required",
    }),

    street2: z.string().min(1, {
      message: "street2 is required",
    }),
  }),
  phone: z.string().min(10, { message: "phone no is required" }),
});
export type EditAddressCustomerFormSchema = z.infer<
  typeof editAddressCustomerFormSchema
>;

// contact person schema >>>>>>>>>>>>>>>>>>>>>>>>>>
export const contactPersonSchema = z.object({
  salutation: z.string().min(1, { message: "salutation is required" }),
  firstName: z.string().min(1, { message: "first name is required" }),
  lastName: z.string().min(1, { message: "last name is required" }),
  email: z.email({ message: "email is required" }),
  workPhone: z.string().min(10, { message: "work phone is required" }),
  mobile: z.string().min(10, { message: "mobile number is required" }),
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
  paymentTerms: z.string().min(1, { message: "Payment terms are required" }),
  documents: z.string().min(1, { message: "documents are required " }),
  // meta info
  websiteURL: z.url({ message: "Enter a valid website URL" }),
  department: z.string().min(1, { message: " department is required " }),
  designation: z.string().min(1, { message: "designation is required " }),
  x: z.string().min(1, { message: "X is required" }),
  facebook: z.string().min(1, { message: "facebook is required" }),
});
export type OtherDetailsSchema = z.infer<typeof otherDetailsSchema>;

// payment term schema >>>>>>>>>>>>>>>>>>>>>>>>
export const paymentTermSchema = z.object({
  termName: z.string().min(1, {
    message: "Term name is required",
  }),
  dueAfter: z
    .number({ message: "Day must be a number" })
    .int({ message: "Day must be a whole number" })
    .min(1, { message: "Day cannot be less than 1" })
    .max(31, { message: "Day cannot be more than 31" }),
});

export type PaymentTermSchema = z.infer<typeof paymentTermSchema>;
