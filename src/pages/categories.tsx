import { Shell } from '@/components/layout/shell';

export function Categories() {
  return (
    <Shell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
          <p className="text-muted-foreground">
            Organize your transactions with custom categories
          </p>
        </div>
        {/* Categories content will be added here */}
      </div>
    </Shell>
  );
}