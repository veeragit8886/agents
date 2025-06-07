import React, { useState } from 'react';
import { Header } from './components/Layout/Header';
import { Hero } from './components/Dashboard/Hero';
import { AgentGrid } from './components/Dashboard/AgentGrid';
import { ChatInterface } from './components/Chat/ChatInterface';
import { AuthModal } from './components/Auth/AuthModal';
import { useAuth } from './hooks/useAuth';
import { Database } from './lib/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

function App() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, loading } = useAuth();

  const handleAgentSelect = (agent: Agent) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setSelectedAgent(agent);
  };

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    // Scroll to agents section
    const agentsSection = document.getElementById('agents-section');
    agentsSection?.scrollIntoView({ behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading AI Agent Platform...</p>
        </div>
      </div>
    );
  }

  if (selectedAgent) {
    return (
      <ChatInterface
        agent={selectedAgent}
        onBack={() => setSelectedAgent(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onAuthClick={() => setShowAuthModal(true)} />
      
      <main>
        <Hero onGetStarted={handleGetStarted} />
        
        <section id="agents-section" className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Meet Your AI Experts
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Each agent is specially trained in their field, ready to provide professional-grade assistance 
                tailored to your specific needs.
              </p>
            </div>
            
            <AgentGrid onSelectAgent={handleAgentSelect} />
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2025 AI Agent Platform. Specialized AI expertise at your fingertips.</p>
        </div>
      </footer>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
}

export default App;