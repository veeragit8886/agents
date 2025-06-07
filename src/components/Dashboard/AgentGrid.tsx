import React, { useState, useEffect } from 'react';
import { AgentCard } from '../Agents/AgentCard';
import { useAgents } from '../../hooks/useAgents';
import { useAuth } from '../../hooks/useAuth';
import { supabase, Database } from '../../lib/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

interface AgentGridProps {
  onSelectAgent: (agent: Agent) => void;
}

export function AgentGrid({ onSelectAgent }: AgentGridProps) {
  const { agents, loading, error } = useAgents();
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('user_favorites')
      .select('agent_id')
      .eq('user_id', user.id);

    if (data) {
      setFavorites(data.map(fav => fav.agent_id));
    }
  };

  const toggleFavorite = async (agent: Agent) => {
    if (!user) return;

    const isFavorite = favorites.includes(agent.id);
    
    if (isFavorite) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('agent_id', agent.id);
      
      setFavorites(prev => prev.filter(id => id !== agent.id));
    } else {
      await supabase
        .from('user_favorites')
        .insert({
          user_id: user.id,
          agent_id: agent.id,
        });
      
      setFavorites(prev => [...prev, agent.id]);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
            <div className="h-12 w-12 bg-gray-200 rounded-xl mb-4" />
            <div className="h-6 bg-gray-200 rounded mb-2" />
            <div className="h-16 bg-gray-200 rounded mb-4" />
            <div className="h-8 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error loading agents: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onSelect={onSelectAgent}
          isFavorite={user ? favorites.includes(agent.id) : false}
          onToggleFavorite={user ? toggleFavorite : undefined}
        />
      ))}
    </div>
  );
}