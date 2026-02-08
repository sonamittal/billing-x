"use client"
import { ConfigSettingDrawer } from '@/components/panel/layout/config-settings-drawer'
import { Header } from '@/components/panel/layout/header'
import { Main } from '@/components/panel/layout/main'
import { ProfileDropdown } from '@/components/panel/layout/profile-dropdown'
import { Search } from '@/components/panel/layout/search'
import { ThemeSwitch } from '@/components/panel/layout/theme-switch'
import { UsersTable } from '@/components/panel/pages/settings/users/users-table'

export  default function Users() {
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
            <h2 className="text-2xl font-bold tracking-tight">User List</h2>
            <p className="text-muted-foreground">
              Manage your users and their roles here.
            </p>
          </div>
        </div>

        {/* Users table */}
        <UsersTable />
      </Main>
    </div>
  )
}
