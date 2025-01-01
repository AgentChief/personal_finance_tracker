import { useEffect, useState } from 'react';
import { getProfile, signOut } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Database } from '@/types/supabase';
import { Loader2 } from 'lucide-react';

type Profile = Database['public']['Tables']['profiles']['Row'];

export function UserNav() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  if (loading) {
    return <Loader2 className="h-4 w-4 animate-spin" />;
  }

  if (!profile) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={profile.avatar_url || undefined} />
          <AvatarFallback>
            {profile.full_name?.[0] || profile.email[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-start">
          <p className="text-sm font-medium">{profile.full_name || 'User'}</p>
          <p className="text-xs text-muted-foreground">{profile.email}</p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}