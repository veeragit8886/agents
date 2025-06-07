import React, { useState, useRef, useEffect } from 'react';
import { Send, ArrowLeft, Bot, User } from 'lucide-react';
import { Database } from '../../lib/supabase';

type Agent = Database['public']['Tables']['agents']['Row'];

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  agent: Agent;
  onBack: () => void;
}

export function ChatInterface({ agent, onBack }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: getAgentGreeting(agent.name),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI response (in production, this would call your AI service)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateAgentResponse(agent.name, userMessage.content),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg bg-gradient-to-br from-${agent.color_scheme}-500 to-${agent.color_scheme}-600`}>
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">{agent.name}</h2>
            <p className="text-sm text-gray-500">{agent.expertise.split(', ')[0]}</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.role === 'user'
                  ? `bg-gradient-to-r from-${agent.color_scheme}-500 to-${agent.color_scheme}-600 text-white`
                  : 'bg-white text-gray-900 shadow-sm border border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="h-4 w-4 mt-1 text-gray-500 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className={`text-xs mt-1 ${
                    message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                {message.role === 'user' && (
                  <User className="h-4 w-4 mt-1 text-white/70 flex-shrink-0" />
                )}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-900 shadow-sm border border-gray-200 max-w-xs lg:max-w-md px-4 py-2 rounded-2xl">
              <div className="flex items-center space-x-2">
                <Bot className="h-4 w-4 text-gray-500" />
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex space-x-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={`Ask ${agent.name} anything...`}
            className="flex-1 resize-none border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className={`px-6 py-3 bg-gradient-to-r from-${agent.color_scheme}-500 to-${agent.color_scheme}-600 text-white rounded-xl font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2`}
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function getAgentGreeting(agentName: string): string {
  const greetings = {
    'Code Doctor': "Hello! I'm Code Doctor, your expert in fullstack JavaScript development. I can help you identify issues in your code, suggest improvements, and optimize performance. What code would you like me to review?",
    'Prompt Sensei': "Greetings! I'm Prompt Sensei, your master guide in prompt engineering. I'll help you craft better prompts, analyze their effectiveness, and teach you the principles of excellent AI communication. Share a prompt you'd like me to improve!",
    'Daily AI Tips': "Hi there! I'm Daily AI Tips, your source for valuable insights about AI productivity and prompt engineering. I share practical tips and best practices to help you become more effective with AI tools. What aspect of AI would you like to learn about?",
    'Prompt Trainer': "Welcome! I'm Prompt Trainer, your AI tutor for mastering prompt engineering. I'll challenge you with exercises, provide feedback, and help you develop expert-level skills. Ready for your first prompt engineering challenge?",
    'AI Trends Mentor': "Hello! I'm AI Trends Mentor, keeping you updated on the latest in AI and prompt engineering. I provide insights on new models, tools, and research breakthroughs. What recent AI developments interest you?",
    'UI Critic': "Hi! I'm UI Critic, your frontend and UX expert specializing in React and Tailwind CSS. I'll review your UI for usability, accessibility, and modern design patterns. Share your code or design for a thorough review!"
  };
  
  return greetings[agentName as keyof typeof greetings] || "Hello! How can I help you today?";
}

function generateAgentResponse(agentName: string, userInput: string): string {
  // This is a simplified response generator. In production, you'd integrate with actual AI services.
  const responses = {
    'Code Doctor': `I've analyzed your request about "${userInput}". Here are my recommendations:\n\n1. **Code Structure**: Consider breaking this into smaller, focused functions\n2. **Performance**: Look for opportunities to optimize loops and reduce complexity\n3. **Best Practices**: Ensure proper error handling and type safety\n\nWould you like me to provide specific code examples for any of these improvements?`,
    
    'Prompt Sensei': `Excellent question about "${userInput}"! Let me help you improve this:\n\n**Current Analysis**: Your prompt has good intentions but could be more precise.\n\n**Improved Version**: Try being more specific about the desired output format and context.\n\n**Why This Works Better**: Specificity reduces ambiguity and gives the AI clearer instructions.\n\nWould you like me to demonstrate with a concrete example?`,
    
    'Daily AI Tips': `Great topic! Here's today's tip about "${userInput}":\n\n💡 **Pro Tip**: When working with AI models, always provide context and examples in your prompts. This improves accuracy by 40-60%.\n\n**Quick Implementation**: Start your prompts with "Given this context: [your context]" followed by your actual request.\n\n**Advanced Technique**: Use the "few-shot" approach by providing 2-3 examples of desired input-output pairs.\n\nWant more tips on this topic?`,
    
    'Prompt Trainer': `Excellent! Let's work on "${userInput}". Here's your challenge:\n\n**Exercise**: Rewrite this prompt to be more effective:\n"Make this better"\n\n**Your Task**: Transform it into a specific, actionable prompt with:\n- Clear context\n- Specific requirements\n- Desired output format\n\n**Scoring Criteria**: Clarity (3 pts), Specificity (3 pts), Actionability (4 pts)\n\nShare your rewrite and I'll score it with detailed feedback!`,
    
    'AI Trends Mentor': `Great question about "${userInput}"! Here's the latest:\n\n**This Week's Highlights**:\n🔥 New multimodal capabilities in latest models\n📈 Improved reasoning in code generation\n⚡ Faster inference times across major platforms\n\n**Impact for Developers**: These improvements mean better code completion and more accurate technical responses.\n\n**What to Watch**: Integration of these features into popular IDEs and development tools.\n\nWant the full weekly briefing with links to sources?`,
    
    'UI Critic': `Thanks for sharing "${userInput}"! Here's my UX review:\n\n**Strengths**:\n✅ Good use of spacing and hierarchy\n✅ Consistent color scheme\n\n**Areas for Improvement**:\n🔧 **Accessibility**: Add proper ARIA labels and focus states\n🔧 **Mobile**: Consider responsive breakpoints for smaller screens\n🔧 **Performance**: Optimize image loading and component rendering\n\n**Specific Recommendations**:\n- Use \`focus:ring-2\` for better keyboard navigation\n- Implement \`loading="lazy"\` for images\n- Add hover states for better interactivity\n\nWould you like me to provide the improved code?`
  };
  
  return responses[agentName as keyof typeof responses] || "I understand your question. Let me provide a helpful response based on my expertise.";
}