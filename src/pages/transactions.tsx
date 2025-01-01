import { Shell } from '@/components/layout/shell';

export function Transactions() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            View and manage your financial transactions
          </p>
        </div>
        {/* Transactions content will be added here */}
      </div>
    </Shell>
  );
}