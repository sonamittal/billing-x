"use client";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useSearch } from "@/providers/search-provider";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { sidebarData } from "@/components/panel/layout/data/sidebar-data";
import { ScrollArea } from "@/components/ui/scroll-area";

export function CommandMenu() {
  const { open, setOpen } = useSearch();

  return (
    <CommandDialog modal open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <ScrollArea type="hover" className="h-72 pe-1">
          <CommandEmpty>No results found.</CommandEmpty>

          {sidebarData.navGroups.map((group) => (
            <CommandGroup key={group.title} heading={group.title}>
              {group.items.map((navItem, i) => {
                if (navItem.url) {
                  return (
                    <CommandItem
                      key={`${navItem.url}-${i}`}
                      value={navItem.title}
                      asChild
                      onSelect={() => setOpen(false)}
                    >
                      <Link href={navItem.url}>
                        <div className="flex size-4 items-center justify-center">
                          <ArrowRight className="size-2 text-muted-foreground/80" />
                        </div>
                        {navItem.title}
                      </Link>
                    </CommandItem>
                  );
                }

                return navItem.items?.map((subItem, j) => (
                  <CommandItem
                    key={`${navItem.title}-${subItem.url}-${j}`}
                    value={`${navItem.title}-${subItem.title}`}
                    asChild
                    onSelect={() => setOpen(false)}
                  >
                    <Link href={subItem.url}>
                      <div className="flex size-4 items-center justify-center">
                        <ArrowRight className="size-2 text-muted-foreground/80" />
                      </div>
                      {navItem.title} <ChevronRight className="mx-1 size-3" />{" "}
                      {subItem.title}
                    </Link>
                  </CommandItem>
                ));
              })}
            </CommandGroup>
          ))}
        </ScrollArea>
      </CommandList>
    </CommandDialog>
  );
}
