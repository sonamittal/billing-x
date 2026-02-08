"use client";
import { useState } from "react";
import { SETTINGS_ITEM } from "@/lib/constants";
import { Settings, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export function ConfigSettingDrawer() {
  const [search, setSearch] = useState("");

  const filteredItems = SETTINGS_ITEM.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Open settings">
          <Settings />
        </Button>
      </SheetTrigger>

      <SheetContent side="right" className="w-80 p-0 flex flex-col h-full">
        {/* Header */}
        <SheetHeader className="pb-2 text-start px-4 pt-4">
          <SheetTitle>Settings</SheetTitle>
        </SheetHeader>

        {/* Search */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search settings..."
              className="pl-9 pr-9"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <Separator />

        {/* Menu Items  */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted cursor-pointer"
                >
                  <Icon className="h-4 w-4 text-muted-foreground" />
                  <span>{item.label}</span>
                </div>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground px-3 py-2">
              No settings found
            </p>
          )}
        </div>

        {/* Footer */}
        <SheetFooter className="gap-2 px-4 py-2">
          {/* <Button variant="destructive" onClick={handleReset}>
            Reset
          </Button> */}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
