import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type BankAccount = Database['public']['Tables']['bank_accounts']['Insert'];

export function AccountForm({ onSuccess }: { onSuccess?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const account: BankAccount = {
      user_id: (await supabase.auth.getUser()).data.user!.id,
      account_name: formData.get('accountName') as string,
      bank_name: formData.get('bankName') as string,
      account_number: formData.get('accountNumber') as string,
      bsb: formData.get('bsb') as string,
      account_type: formData.get('accountType') as 'savings' | 'checking' | 'credit' | 'investment',
      balance: Number(formData.get('balance')) || 0,
    };

    const { error } = await supabase.from('bank_accounts').insert(account);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create account. Please try again.",
      });
    } else {
      toast({
        title: "Success",
        description: "Account created successfully.",
      });
      setOpen(false);
      onSuccess?.();
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Bank Account</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input id="bankName" name="bankName" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input id="accountName" name="accountName" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bsb">BSB</Label>
              <Input id="bsb" name="bsb" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="accountNumber">Account Number</Label>
              <Input id="accountNumber" name="accountNumber" required />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select name="accountType" required>
              <SelectTrigger>
                <SelectValue placeholder="Select account type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings">Savings</SelectItem>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="investment">Investment</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input 
              id="balance" 
              name="balance" 
              type="number" 
              step="0.01"
              defaultValue="0.00" 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}