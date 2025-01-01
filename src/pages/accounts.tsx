import { Shell } from '@/components/layout/shell';
import { AccountForm } from '@/components/accounts/account-form';
import { AccountList } from '@/components/accounts/account-list';
import { useState } from 'react';

export function Accounts() {
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <Shell>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Accounts</h1>
            <p className="text-muted-foreground">
              Manage your bank accounts and track balances
            </p>
          </div>
          <AccountForm onSuccess={() => setRefreshKey(k => k + 1)} />
        </div>
        <AccountList key={refreshKey} />
      </div>
    </Shell>
  );
}