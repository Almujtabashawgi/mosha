import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export type AdminStatus = 'loading' | 'signed-out' | 'not-admin' | 'admin';

/**
 * Google sign-in state + server-side admin check (public.is_admin()).
 * The UI check is only for convenience — the database enforces it with RLS.
 */
export function useAdmin() {
  const [session, setSession] = useState<Session | null>(null);
  const [status, setStatus] = useState<AdminStatus>('loading');

  useEffect(() => {
    let active = true;

    const evaluate = async (s: Session | null) => {
      if (!active) return;
      setSession(s);
      if (!s) {
        setStatus('signed-out');
        return;
      }
      const { data, error } = await supabase.rpc('is_admin');
      if (!active) return;
      setStatus(!error && data === true ? 'admin' : 'not-admin');
    };

    supabase.auth.getSession().then(({ data }) => evaluate(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      // run outside the auth callback to avoid deadlocks in supabase-js
      setTimeout(() => evaluate(s), 0);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin`,
        queryParams: { prompt: 'select_account' },
      },
    });

  const signOut = () => supabase.auth.signOut();

  return { session, status, user: session?.user ?? null, signInWithGoogle, signOut } as const;
}
