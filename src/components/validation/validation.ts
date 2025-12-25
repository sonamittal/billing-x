// zod schena >>>>>>>>>>>>>\
import * as z from "zod";
export const supFormSchema = z
  .object({
    name: z.string().min(1, { message: "name is  required" }),
    email: z.email({ message: "Email is required" }),
    password: z
      .string()
      .min(6, { message: "password must be atleast 6 character" })
      .regex(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
        "Password must contain at least one letter and one number"
      ),
    confirmPassword: z
      .string()
      .min(6, { message: "password must be atleast 6 character." }),
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
    .min(6, { message: "password must be atleast 6 character" })
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/,
      "Password must contain at least one letter and one number"
    ),
});
export type SigninFormSchema = z.infer<typeof sinFormSchema>;
