import { MainNav } from './main-nav';
import { UserNav } from './user-nav';

interface ShellProps {
  children: React.ReactNode;
}

export function Shell({ children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 lg:block lg:w-64">
        <div className="flex h-full flex-col gap-6">
          <div className="flex h-16 items-center border-b px-6">
            <span className="text-lg font-semibold">Finance Tracker</span>
          </div>
          <div className="flex-1 px-4">
            <MainNav />
          </div>
          <div className="border-t p-4">
            <UserNav />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1">
        <div className="h-full py-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}