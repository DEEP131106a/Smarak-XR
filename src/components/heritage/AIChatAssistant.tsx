import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Sparkles, BookOpen, Compass, RotateCcw } from 'lucide-react';
import { AI_PREDEFINED_RESPONSES } from '../../data/heritageAliveData';

type Message = {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  source?: string;
  related?: string[];
  timestamp: string;
};

const SUGGESTED_QUESTIONS = [
  'Why is Phulkari important to Punjab?',
  'Tell me the story behind Bhangra.',
  'What traditional foods are disappearing?',
  'What festivals are unique to this region?',
];

export const AIChatAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Namaste! I am your Heritage AI Guardian. Ask me anything about vanishing crafts, ancient songs, heirloom recipes, or historical folk stories.',
      source: 'Heritage Alive AI Knowledge Engine (2026)',
      timestamp: 'Just now',
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      const lower = textToSend.toLowerCase();
      let matchKey = '';

      if (lower.includes('phulkari')) matchKey = 'phulkari';
      else if (lower.includes('bhangra')) matchKey = 'bhangra';
      else if (lower.includes('disappearing') || lower.includes('endangered') || lower.includes('food')) matchKey = 'disappearing';
      else if (lower.includes('festival')) matchKey = 'festivals';

      let aiResponseText = '';
      let sourceText = 'Smarak XR Heritage Knowledge Graph';
      let relatedItems: string[] = ['Culture Time Machine', 'Vanishing Culture Index', 'Adopt a Heritage'];

      if (matchKey && AI_PREDEFINED_RESPONSES[matchKey]) {
        aiResponseText = AI_PREDEFINED_RESPONSES[matchKey].answer;
        sourceText = AI_PREDEFINED_RESPONSES[matchKey].source;
        relatedItems = AI_PREDEFINED_RESPONSES[matchKey].related;
      } else {
        aiResponseText = `Thank you for asking about "${textToSend}". In our digital cultural repository, this tradition represents an irreplaceable piece of regional folklore. Oral stories and hand-crafting methods for this custom have been passed down over multiple generations across India.`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        source: sourceText,
        related: relatedItems,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto min-h-screen flex flex-col justify-between">
      {/* Header */}
      <div>
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 animate-pulse text-purple-400" />
            <span>AI Storyteller & Cultural Intelligence</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-stone-100 tracking-tight mb-3">
            Talk to Your <span className="heritage-gold-text">Heritage</span>
          </h1>
          <p className="text-stone-400 text-base">
            “Ask anything about culture, traditions, history, food or folklore.”
          </p>
        </div>

        {/* Suggested Prompt Pills */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-8">
          <span className="text-xs text-stone-400 font-semibold flex items-center gap-1 mr-2">
            <Compass className="w-3.5 h-3.5 text-purple-400" /> Suggested Prompts:
          </span>
          {SUGGESTED_QUESTIONS.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium glass-heritage text-stone-300 hover:text-white hover:border-purple-500/40 transition-all border border-stone-800"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Chat Window Box */}
        <div className="glass-heritage border border-purple-500/20 rounded-3xl p-4 sm:p-6 shadow-2xl min-h-[450px] max-h-[600px] flex flex-col justify-between relative overflow-hidden">
          {/* Scrollable Messages Area */}
          <div className="overflow-y-auto space-y-6 pr-2 mb-4 max-h-[480px]">
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-3 sm:gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar */}
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center flex-shrink-0 font-bold ${
                    msg.sender === 'user'
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                      : 'bg-gradient-to-tr from-purple-600 to-amber-500 text-white shadow-md shadow-purple-500/20'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[85%] sm:max-w-[75%] space-y-2`}>
                  <div
                    className={`p-4 sm:p-5 rounded-2xl text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-none'
                        : 'bg-stone-900/90 text-stone-200 border border-purple-500/20 rounded-tl-none shadow-xl'
                    }`}
                  >
                    <p>{msg.text}</p>

                    {/* AI Source Citation & Related Links */}
                    {msg.sender === 'ai' && (
                      <div className="mt-4 pt-3 border-t border-purple-500/20 text-xs space-y-2">
                        {msg.source && (
                          <p className="text-purple-300/80 font-mono text-[11px] flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-purple-400" /> Source: {msg.source}
                          </p>
                        )}
                        {msg.related && msg.related.length > 0 && (
                          <div className="flex flex-wrap items-center gap-1.5 pt-1">
                            <span className="text-stone-400 text-[10px] font-bold uppercase">Related:</span>
                            {msg.related.map((rel, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded bg-purple-950/60 text-purple-200 border border-purple-500/30 text-[11px]"
                              >
                                {rel}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-500 px-1">{msg.timestamp}</span>
                </div>
              </motion.div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3 items-center">
                <div className="w-9 h-9 rounded-2xl bg-purple-600/30 text-purple-300 flex items-center justify-center">
                  <Bot className="w-5 h-5 animate-pulse" />
                </div>
                <div className="glass-heritage px-4 py-3 rounded-2xl text-stone-400 text-xs flex items-center gap-2 border border-purple-500/20">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce [animation-delay:0.4s]" />
                  <span>AI Guardian is searching ancestral archives...</span>
                </div>
              </motion.div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 pt-2 border-t border-stone-800"
          >
            <input
              type="text"
              placeholder="Ask a question about Indian heritage, folk songs, or recipes..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-stone-900/90 border border-purple-500/30 text-stone-100 placeholder-stone-500 focus:outline-none focus:border-purple-400 text-sm"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-amber-500 text-stone-950 font-bold hover:opacity-90 disabled:opacity-50 transition-all shadow-lg shadow-purple-500/20"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
