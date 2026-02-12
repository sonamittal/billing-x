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
    state: z.string().min(1, "State is required"),
    city: z.string().min(1, { message: "city is required" }),
    address: z.string().min(1, { message: "Location is required" }),
    currency: z.string().min(1, { message: "currency is required" }),
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
export const addNewUserFormSchema = z
  .object({
    username: z.string().min(1, { message: "username is required" }),
    email: z.email({ message: "email is required" }),
    role: z.enum(["admin", "staff", "staffAssigned", "timesheetStaff"], {
      message: "Role is required",
    }),
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
export type AddNewUserFormSchema = z.infer<typeof addNewUserFormSchema>;
