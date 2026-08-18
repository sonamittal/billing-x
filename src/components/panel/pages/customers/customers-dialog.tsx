"use client";

import { useEffect, useState } from "react";
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
import CAddUserForm from "@/components/panel/pages/customers/users-form";
import AddCustomerForm from "@/components/panel/pages/customers/customers-form";
import { useQuery } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/auth-client";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type User = {
  id: string;
  image?: string;
  name: string;
  email: string;
  banned?: boolean;
};

const AddCustomerDialog = ({ open, onOpenChange }: Props) => {
  const [selectType, setSelectType] = useState<"exists" | "new" | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [searchQuery, setSearchQuery] = useState("");

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [isDebouncing, setIsDebouncing] = useState(false);

  const [step, setStep] = useState<"selectUser" | "userForm" | "customerForm">(
    "selectUser",
  );

  // Debounce search
  useEffect(() => {
    const query = searchQuery.trim();

    if (query.length < 2) {
      setDebouncedSearchQuery("");
      setIsDebouncing(false);
      return;
    }

    setIsDebouncing(true);

    const timer = setTimeout(() => {
      setDebouncedSearchQuery(query);
      setIsDebouncing(false);
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [searchQuery]);

  // Fetch users
  const { data: users = [], isFetching } = useQuery<User[]>({
    queryKey: ["users", debouncedSearchQuery],

    queryFn: async () => {
      const query = debouncedSearchQuery.trim();

      // Search users by name
      const nameResult = await authClient.admin.listUsers({
        query: {
          searchValue: query,
          searchField: "name",
          searchOperator: "contains",
          limit: 20,
        },
      });

      // Search users by email
      const emailResult = await authClient.admin.listUsers({
        query: {
          searchValue: query,
          searchField: "email",
          searchOperator: "contains",
          limit: 100,
        },
      });

      if (nameResult.error) {
        throw new Error(nameResult.error.message);
      }

      if (emailResult.error) {
        throw new Error(emailResult.error.message);
      }

      const nameUsers = nameResult.data?.users ?? [];
      const emailUsers = emailResult.data?.users ?? [];

      // Combine users
      const combinedUsers = [...nameUsers, ...emailUsers];

      // Remove duplicate users
      const uniqueUsers = Array.from(
        new Map(
          combinedUsers.map((user) => [
            user.id,
            {
              id: user.id,
              image: user.image || "",
              name: user.name || "Unknown",
              email: user.email,
              banned: user.banned ?? false,
            },
          ]),
        ).values(),
      );

      // Limit results
      return uniqueUsers.slice(0, 100);
    },

    enabled: debouncedSearchQuery.length >= 2,
  });

  // Handle back
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

  // Existing user
  const handleExistingUser = () => {
    setSelectType("exists");
    setSelectedUser(null);

    setSearchQuery("");
    setDebouncedSearchQuery("");
    setIsDebouncing(false);
  };

  // New user
  const handleNewUser = () => {
    setSelectType("new");
    setSelectedUser(null);

    setTimeout(() => {
      setStep("userForm");
    }, 300);
  };

  // Select user
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setStep("customerForm");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="md:max-w-100">
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>

          <DialogDescription>
            Select an existing user or create a new customer account.
          </DialogDescription>
        </DialogHeader>

        {/* Step 1 - Select user type */}
        {step === "selectUser" && (
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-2">
            {/* Existing user */}
            <button
              type="button"
              onClick={handleExistingUser}
              className={`flex flex-col items-start rounded-lg border-2 p-4 transition-all ${
                selectType === "exists"
                  ? "border-primary bg-primary/5"
                  : "border-muted-100"
              }`}
            >
              <div className="mb-2 flex w-full items-center gap-2">
                <UserCheck className="size-5" />

                {selectType === "exists" && (
                  <CircleCheck className="ml-auto size-4 text-primary" />
                )}
              </div>

              <p className="text-sm font-semibold">User Exists</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Select from existing users
              </p>
            </button>

            {/* New user */}
            <button
              type="button"
              onClick={handleNewUser}
              className={`flex flex-col items-start rounded-lg border-2 p-4 transition-all ${
                selectType === "new"
                  ? "border-primary bg-primary/5"
                  : "border-muted-100"
              }`}
            >
              <div className="mb-2 flex w-full items-center gap-2">
                <UserX className="size-5" />

                {selectType === "new" && (
                  <CircleCheck className="ml-auto size-4 text-primary" />
                )}
              </div>

              <p className="text-sm font-semibold">User Not Exists</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Create new user
              </p>
            </button>
          </div>
        )}

        {/* Existing user */}
        {step === "selectUser" && selectType === "exists" && !selectedUser && (
          <div className="mb-4 space-y-2">
            <label className="text-sm font-medium">
              Select User <span className="text-red-500">*</span>
            </label>

            {/* Search input */}
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="text"
                placeholder="Search and select user..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-11 w-full rounded-md border border-input bg-background py-2.5 pl-9 pr-5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>

            {/* Search message */}
            {searchQuery.length === 0 && (
              <div className="mt-5 rounded-md bg-accent p-4 text-center">
                <Search className="mx-auto size-6 text-primary" />

                <p className="mt-2 text-sm font-medium">
                  Type at least 2 characters to search
                </p>
              </div>
            )}

            {/* Search validation */}
            {searchQuery.length > 0 && searchQuery.length < 2 && (
              <div className="mt-4 flex items-center gap-2 rounded-md border p-3">
                <Info className="size-4 text-muted-foreground" />

                <p className="text-xs font-medium text-muted-foreground">
                  Type at least 2 characters to search
                </p>
              </div>
            )}

            {/* Loading state */}
            {searchQuery.length >= 2 && (isDebouncing || isFetching) && (
              <div className="flex items-center justify-center py-6">
                <p className="text-sm text-muted-foreground">Loading...</p>
              </div>
            )}

            {/* Search results */}
            {searchQuery.length >= 2 &&
              !isDebouncing &&
              !isFetching &&
              debouncedSearchQuery.length >= 2 && (
                <div className="mt-2 max-h-72 space-y-2 overflow-y-auto">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button
                        type="button"
                        key={user.id}
                        onClick={() => handleSelectUser(user)}
                        className="w-full rounded-lg border p-3 text-left transition-colors hover:bg-muted/50"
                      >
                        <div className="flex items-center justify-between gap-3">
                          {/* User info */}
                          <div className="flex min-w-0 items-center gap-3">
                            {/* Avatar */}
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <User className="h-5 w-5 text-primary" />
                              )}
                            </div>

                            {/* Name and email */}
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">
                                {user.name}
                              </p>

                              <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                              </p>
                            </div>
                          </div>

                          {/* User status */}
                          <div className="shrink-0">
                            {user.banned ? (
                              <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-600">
                                Banned
                              </span>
                            ) : (
                              <span className="rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
                                Active
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="mt-4 flex items-center gap-2 rounded-md border p-3">
                      <Info className="size-4" />

                      <p className="text-xs font-medium">No user found!!</p>
                    </div>
                  )}
                </div>
              )}
          </div>
        )}

        {/* Step 2 - User form */}
        {step === "userForm" && (
          <CAddUserForm
            onBack={handleBack}
            onNext={(user) => {
              setSelectedUser(user);
              setStep("customerForm");
            }}
          />
        )}

        {/* Step 3 - Customer form */}
        {step === "customerForm" && (
          <AddCustomerForm
            open={open}
            onOpenChange={onOpenChange}
            onBack={handleBack}
            selectedUser={selectedUser}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
