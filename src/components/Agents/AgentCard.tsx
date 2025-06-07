import React from 'react';
import { 
  Stethoscope, 
  Sparkles, 
  Lightbulb, 
  GraduationCap, 
  TrendingUp, 
  Palette,
  Heart,
  MessageCircle
} from 'lucide-react';
import { Database } from '../../lib/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

interface AgentCardProps {
  agent: Agent;
  onSelect: (agent: Agent) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (agent: Agent) => void;
}

const iconMap = {
  Stethoscope,
  Sparkles,
  Lightbulb,
  GraduationCap,
  TrendingUp,
  Palette,
};

const colorSchemes = {
  emerald: 'from-emerald-500 to-emerald-600',
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  orange: 'from-orange-500 to-orange-600',
  cyan: 'from-cyan-500 to-cyan-600',
  rose: 'from-rose-500 to-rose-600',
};

export function AgentCard({ agent, onSelect, isFavorite, onToggleFavorite }: AgentCardProps) {
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Stethoscope;
  const gradientClass = colorSchemes[agent.color_scheme as keyof typeof colorSchemes] || colorSchemes.blue;

  return (
    <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <div className={`h-2 bg-gradient-to-r ${gradientClass}`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg`}>
            <IconComponent className="h-6 w-6 text-white" />
          </div>
          
          {onToggleFavorite && (
            <button
              onClick={() => onToggleFavorite(agent)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                isFavorite 
                  ? 'text-red-500 bg-red-50 hover:bg-red-100' 
                  : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
          {agent.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 leading-relaxed">
          {agent.description}
        </p>

        <div className="mb-6">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Expertise
          </h4>
          <div className="flex flex-wrap gap-1">
            {agent.expertise.split(', ').slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className={`px-2 py-1 text-xs font-medium bg-gradient-to-r ${gradientClass} text-white rounded-full`}
              >
                {skill}
              </span>
            ))}
            {agent.expertise.split(', ').length > 3 && (
              <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                +{agent.expertise.split(', ').length - 3} more
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => onSelect(agent)}
          className={`w-full bg-gradient-to-r ${gradientClass} text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group-hover:shadow-xl`}
        >
          <MessageCircle className="h-4 w-4" />
          <span>Start Conversation</span>
        </button>
      </div>
    </div>
  );
}