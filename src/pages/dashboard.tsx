import { useEffect, useState } from 'react';
import { Shell } from '@/components/layout/shell';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RecentTransactions } from '@/components/dashboard/recent-transactions';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

type Transaction = Database['public']['Tables']['transactions']['Row'];

export function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    monthlySavings: 0,
  });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        // Get total balance from accounts
        const { data: accounts } = await supabase
          .from('bank_accounts')
          .select('balance');
        
        const totalBalance = accounts?.reduce((sum, account) => sum + account.balance, 0) || 0;

        // Get current month's transactions
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        const { data: transactions } = await supabase
          .from('transactions')
          .select('*')
          .gte('transaction_date', startOfMonth.toISOString())
          .order('transaction_date', { ascending: false });

        if (transactions) {
          const monthlyIncome = transactions
            .filter(t => t.transaction_type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

          const monthlyExpenses = transactions
            .filter(t => t.transaction_type === 'expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);

          setStats({
            totalBalance,
            monthlyIncome,
            monthlyExpenses,
            monthlySavings: monthlyIncome - monthlyExpenses,
          });

          // Get recent transactions
          setRecentTransactions(transactions.slice(0, 5));
        }
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Shell>
        <div className="flex justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your financial overview
          </p>
        </div>

        <StatsCards {...stats} />

        <RecentTransactions transactions={recentTransactions} />
      </div>
    </Shell>
  );
}