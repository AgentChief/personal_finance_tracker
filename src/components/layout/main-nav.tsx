import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  CreditCard,
  Home,
  PiggyBank,
  Tags,
  Wallet,
} from 'lucide-react';

const items = [
  { title: 'Dashboard', href: '/', icon: Home },
  { title: 'Accounts', href: '/accounts', icon: CreditCard },
  { title: 'Transactions', href: '/transactions', icon: Wallet },
  { title: 'Categories', href: '/categories', icon: Tags },
  { title: 'Budgets', href: '/budgets', icon: PiggyBank },
  { title: 'Analysis', href: '/analysis', icon: BarChart3 },
];

export function MainNav() {
  return (
    <nav className="flex flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-primary hover:bg-muted',
            'text-sm font-medium'
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}