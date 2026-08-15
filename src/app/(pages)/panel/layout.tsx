import { getCookie } from "@/lib/data-table/cookies";
import { cn } from "@/utils";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/panel/layout/app-sidebar";
import { SkipToMain } from "@/components/panel/layout/skip-to-main";
import { auth } from "@/lib/auth/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

type DashboardLayoutProps = {
  children?: React.ReactNode;
};

const Layout = async ({ children }: DashboardLayoutProps) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || session === null) redirect("/auth/signin");

  const defaultOpen = getCookie("sidebar_state") !== "false";
  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <SkipToMain />
      <AppSidebar user={session.user} />
      <SidebarInset
        className={cn(
          // Set content container, so we can use container queries
          "@container/content",

          // If layout is fixed, set the height
          // to 100svh to prevent overflow
          "has-data-[layout=fixed]:h-svh",

          // If layout is fixed and sidebar is inset,
          // set the height to 100svh - spacing (total margins) to prevent overflow
          "peer-data-[variant=inset]:has-data-[layout=fixed]:h-[calc(100svh-(var(--spacing)*4))]",
        )}
      >
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;
