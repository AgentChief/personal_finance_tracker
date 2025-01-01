import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { RouterProvider } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';
import { router } from '@/routes';
import { LoginForm } from '@/components/auth/login-form';
import { Toaster } from '@/components/ui/toaster';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {!session ? (
        <div className="h-screen flex flex-col items-center justify-center gap-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">Personal Finance Tracker</h1>
            <p className="text-muted-foreground">
              Take control of your finances with our powerful tracking tools
            </p>
          </div>
          <LoginForm />
        </div>
      ) : (
        <RouterProvider router={router} />
      )}
      <Toaster />
    </div>
  );
}