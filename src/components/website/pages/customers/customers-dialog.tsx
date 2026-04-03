"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  UserCheck,
  UserX,
  CircleCheck,
  Search,
  Info,
  User,
} from "lucide-react";
import CAddUserForm from "@/components/website/pages/customers/users-form";
import AddCustomerForm from "@/components/website/pages/customers/customers-form";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
// dummy data
const dummyUsers = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210" },
  {
    name: "Vaishvik Mohatkar",
    email: "vaishvik@example.com",
    phone: "9123456780",
  },
];

const AddCustomerDialog = ({ open, onOpenChange }: Props) => {
  const [selectType, setSelectType] = useState<"exists" | "new" | null>(null);
  const [selectedUser, setSelectedUser] = useState<
    (typeof dummyUsers)[0] | null
  >(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [step, setStep] = useState<"selectUser" | "userForm" | "customerForm">(
    "selectUser",
  );

  // Filter users
  const filteredUsers = dummyUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  //
  const handleBack = () => {
    if (step === "customerForm") {
      if (selectType === "new") {
        setStep("userForm");
      } else {
        setStep("selectUser");
        setSelectedUser(null);
      }
    } else if (step === "userForm") {
      setStep("selectUser");
      setSelectType(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-100">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
          <DialogDescription>
            Select an existing user or create a new customer account.
          </DialogDescription>
        </DialogHeader>

        {step === "selectUser" && (
          <div className="grid grid-cols-2 gap-3 mb-4">
            {/* user exists */}
            <button
              onClick={() => {
                setSelectType("exists");
                setSelectedUser(null);
              }}
              className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${
                selectType === "exists"
                  ? "border-primary bg-primary/5"
                  : "border-muted-100"
              }`}
            >
              <div className="flex items-center gap-2 w-full mb-2">
                <UserCheck className="size-5" />
                {selectType === "exists" && (
                  <CircleCheck className="size-4 text-primary ml-auto" />
                )}
              </div>
              <p className="font-semibold text-sm">User Exists</p>
              <p className="text-xs text-muted-foreground mt-1">
                Select from existing users
              </p>
            </button>

            {/* user not exists */}
            <button
              onClick={() => {
                setSelectType("new");
                setSelectedUser(null);
                setTimeout(() => {
                  setStep("userForm");
                }, 300);
              }}
              className={`flex flex-col items-start p-4 rounded-lg border-2 transition-all ${
                selectType === "new"
                  ? "border-primary bg-primary/5"
                  : "border-muted-100"
              }`}
            >
              <div className="flex items-center gap-2 w-full mb-2">
                <UserX className="size-5" />
                {selectType === "new" && (
                  <CircleCheck className="size-4 text-primary ml-auto" />
                )}
              </div>
              <p className="font-semibold text-sm">User Not Exists</p>
              <p className="text-xs text-muted-foreground mt-1">
                Create new user
              </p>
            </button>
          </div>
        )}

        {/* search user */}
        {step === "selectUser" && selectType === "exists" && !selectedUser && (
          <div className="space-y-2 mb-4">
            <label className="text-sm font-medium">
              Select User <span className="text-red-500">*</span>
            </label>

            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search and select user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex w-full h-11 pl-9 px-5 py-2.5 text-sm rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {searchQuery.length === 0 && (
              <div className="p-4 rounded-md bg-accent mt-5 text-center">
                <Search className="size-6 text-primary mx-auto" />
                <p className="mt-2 text-sm font-medium">
                  Type at least 2 characters to search
                </p>
              </div>
            )}

            {searchQuery.length > 0 && (
              <div className="space-y-2 max-h-72 overflow-y-auto mt-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedUser(user);
                        setStep("customerForm");
                      }}
                      className="w-full text-left rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <div className="flex gap-3">
                        <div className="rounded-full bg-primary/10 p-2">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="flex gap-2 mt-4 items-center border rounded-md p-3">
                    <Info className="size-4" />
                    <p className="text-xs font-medium">No user found!!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {step === "userForm" && (
          <CAddUserForm
            onBack={handleBack}
            onNext={() => setStep("customerForm")}
          />
        )}

        {step === "customerForm" && (
          <AddCustomerForm
            open={open}
            onOpenChange={onOpenChange}
            onBack={handleBack}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
