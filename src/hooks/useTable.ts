import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Options {
  orderBy?: string;
  ascending?: boolean;
  /** Re-subscribe/re-fetch when this changes (e.g. after login) */
  key?: unknown;
  enabled?: boolean;
}

/**
 * Load a Supabase table and keep it live with Realtime.
 * Row-level security decides what each visitor is allowed to see.
 */
export function useTable<T>(table: string, { orderBy = 'id', ascending = false, key, enabled = true }: Options = {}) {
  const [rows, setRows] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending });
    if (!mounted.current) return;
    if (error) setError(error.message);
    else {
      setError(null);
      setRows((data ?? []) as T[]);
    }
    setLoading(false);
  }, [table, orderBy, ascending]);

  useEffect(() => {
    mounted.current = true;
    if (!enabled) return;
    setLoading(true);
    refresh();

    let timer: ReturnType<typeof setTimeout> | undefined;
    const channel = supabase
      .channel(`${table}-${Math.random().toString(36).slice(2)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, () => {
        // debounce bursts of changes
        clearTimeout(timer);
        timer = setTimeout(refresh, 250);
      })
      .subscribe();

    return () => {
      mounted.current = false;
      clearTimeout(timer);
      supabase.removeChannel(channel);
    };
  }, [table, refresh, key, enabled]);

  return { rows, loading, error, refresh, setRows } as const;
}
