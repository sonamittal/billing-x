"use client";
import { ConfigSettingDrawer } from "@/components/panel/layout/config-settings-drawer";
import { Header } from "@/components/panel/layout/header";
import { Main } from "@/components/panel/layout/main";
import { ProfileDropdown } from "@/components/panel/layout/profile-dropdown";
import { Search } from "@/components/panel/layout/search";
import { ThemeSwitch } from "@/components/panel/layout/theme-switch";
import InvoiceTable from "@/components/website/pages/invoices/invoice-table";
import AddCustomerDailog from "@/components/website/pages/customers/customers-dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Receipt } from "lucide-react";

export default function Users() {
  const [invitedOpen, setInvitedOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Header fixed>
        <Search />
        <div className="ms-auto flex items-center space-x-4">
          <ThemeSwitch />
          <ConfigSettingDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      {/* Main content */}
      <Main className="flex flex-1 flex-col gap-4 sm:gap-6">
        <div className="flex flex-wrap items-end justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Invoices List</h2>
            <p className="text-muted-foreground">
              View, manage and track all invoices, payments and billing records.
            </p>
          </div>
          <Button onClick={() => setInvitedOpen(true)}>
            <Receipt className="mt-0.6 h-4 w-4" />
            Add Invoice
          </Button>
        </div>
        {/* customers table */}
        <InvoiceTable />
        {/* invited User btn */}
        <AddCustomerDailog open={invitedOpen} onOpenChange={setInvitedOpen} />
      </Main>
    </div>
  );
}
