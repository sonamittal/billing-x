import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
  // project: ["create", "share", "update", "delete"],
} as const;
export const ac = createAccessControl(statement);
export const admin = ac.newRole({
  user: [...adminAc.statements.user, "get"],
  session: [...adminAc.statements.session],
});

export const staff = ac.newRole({
  user: ["create", "update"],
  session: ["list"],
});

export const staffAssigned = ac.newRole({
  user: ["create", "update"],
  session: [],
});

export const timesheetStaff = ac.newRole({
  user: ["create", "update"],
  session: ["list"],
});
