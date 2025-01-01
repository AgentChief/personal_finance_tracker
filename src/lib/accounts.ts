import { supabase } from './supabase';
import { Database } from '@/types/supabase';

type BankAccount = Database['public']['Tables']['bank_accounts']['Row'];

export async function getTotalBalance(): Promise<number> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('balance');

  if (error) {
    throw error;
  }

  return data.reduce((sum, account) => sum + account.balance, 0);
}

export async function getAccounts(): Promise<BankAccount[]> {
  const { data, error } = await supabase
    .from('bank_accounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}