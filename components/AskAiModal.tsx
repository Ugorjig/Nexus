
import React, { useState, useEffect, useRef } from 'react';
import { askGeneralAI } from '../services/geminiService';
import { SendIcon, SparklesIcon, BackIcon } from '../constants';

interface AskAiPageProps {
  onBack: () => void;
}

interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

const LoadingIndicator = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
    </div>
);

const AskAiPage: React.FC<AskAiPageProps> = ({ onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([{ role: 'model', parts: [{ text: "Hello! I'm Teo, your AI assistant for Cascade. How can I help you today?" }] }]);
    setInput('');
    setIsLoading(false);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const aiResponse = await askGeneralAI(input, newMessages);
      const aiMessage: ChatMessage = { role: 'model', parts: [{ text: aiResponse }] };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('AI response error:', error);
      const errorMessage: ChatMessage = { role: 'model', parts: [{ text: "Sorry, I couldn't process that request. Please try again." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border-x border-gray-200 dark:border-dark-border h-screen flex flex-col">
      <div className="sticky top-0 bg-background/80 dark:bg-dark-background/80 backdrop-blur-md z-10 px-4 py-3 flex items-center gap-4 border-b border-gray-200 dark:border-dark-border">
        <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-hover text-on-surface dark:text-dark-on-surface">
            <BackIcon className="w-6 h-6" />
        </button>
        <div className="flex-1 flex items-center gap-2">
          <SparklesIcon className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-bold">Teo</h1>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-md p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-surface dark:bg-dark-surface'}`}>
              <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
               <div className="max-w-md p-3 rounded-2xl bg-surface dark:bg-dark-surface">
                  <LoadingIndicator />
               </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-gray-200 dark:border-dark-border bg-background">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Teo anything..."
            disabled={isLoading}
            className="w-full bg-surface dark:bg-dark-surface rounded-full py-2 px-4 text-on-surface dark:text-dark-on-surface focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
          />
          <button type="submit" disabled={isLoading || !input.trim()} className="bg-primary text-white rounded-full p-3 hover:bg-primary/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
            <SendIcon className="w-6 h-6" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default AskAiPage;
