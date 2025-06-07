import { useState, useEffect } from 'react';
import { supabase, Database } from '../lib/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('agents')
        .select('*')
        .order('created_at');

      if (error) throw error;
      setAgents(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { agents, loading, error, refetch: fetchAgents };
}