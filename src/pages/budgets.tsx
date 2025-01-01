import { Shell } from '@/components/layout/shell';

export function Budgets() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Budgets</h1>
          <p className="text-muted-foreground">
            Set and track your spending budgets
          </p>
        </div>
        {/* Budgets content will be added here */}
      </div>
    </Shell>
  );
}