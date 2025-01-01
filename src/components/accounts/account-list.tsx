import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from '@/types/supabase';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

export function AccountList() {
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAccounts() {
    const { data, error } = await supabase
      .from('bank_accounts')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setAccounts(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadAccounts();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{account.account_name}</span>
              <span className="text-sm font-normal text-muted-foreground">
                {account.account_type}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">
                ${account.balance.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">
                {account.bank_name}
              </div>
              <div className="text-sm text-muted-foreground">
                BSB: {account.bsb} • ACC: {account.account_number}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}