import React from 'react';
import { Bot, Sparkles, Zap, Target } from 'lucide-react';

interface HeroProps {
  onGetStarted: () => void;
}

export function Hero({ onGetStarted }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 px-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%239C92AC%22 fill-opacity=%220.05%22%3E%3Ccircle cx=%2230%22 cy=%2230%22 r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40" />
      
      <div className="relative max-w-7xl mx-auto text-center">
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl">
            <Bot className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent mb-6">
          AI Agent Platform
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Meet your team of specialized AI experts, each designed to excel in their domain. 
          From code review to prompt engineering, get professional assistance tailored to your needs.
        </p>

        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span className="font-medium text-gray-700">6 Expert Agents</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <Zap className="h-5 w-5 text-blue-500" />
            <span className="font-medium text-gray-700">Instant Responses</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-white/20">
            <Target className="h-5 w-5 text-green-500" />
            <span className="font-medium text-gray-700">Specialized Expertise</span>
          </div>
        </div>

        <button
          onClick={onGetStarted}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-2xl hover:shadow-3xl transform hover:-translate-y-1"
        >
          Start Your Journey
        </button>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <div className="bg-emerald-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Bot className="h-6 w-6 text-emerald-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Code Doctor</h3>
            <p className="text-gray-600 text-sm">Expert code review and optimization for JavaScript and React applications.</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <div className="bg-purple-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Prompt Sensei</h3>
            <p className="text-gray-600 text-sm">Master prompt engineering with expert guidance and analysis.</p>
          </div>
          
          <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg">
            <div className="bg-blue-100 p-3 rounded-xl w-fit mx-auto mb-4">
              <Target className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">UI Critic</h3>
            <p className="text-gray-600 text-sm">Professional UX review and modern design pattern recommendations.</p>
          </div>
        </div>
      </div>
    </div>
  );
}