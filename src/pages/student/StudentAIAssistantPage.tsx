import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Lightbulb,
  BookOpen,
  HelpCircle,
  RotateCcw,
  PlusCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  topicSummary?: {
    title: string;
    keyPoints: string[];
  };
  generatedQuestion?: {
    questionText: string;
    options: string[];
    correctAnswer: string;
    explanation: string;
  };
  timestamp: string;
}

export const StudentAIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: 'Namaskaram! I am your Kerala PYQ AI Study Assistant. You can ask me to summarize Kerala Renaissance leaders, explain constitutional articles, break down complex arithmetic formulas, or generate high-yield practice questions.',
      timestamp: 'Just now',
    },
  ]);

  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const suggestedPrompts = [
    'Explain the difference between Article 32 and Article 226',
    'Generate a 1-question mock drill on Kerala Rivers',
    'Summarize the Vaikom Satyagraha timeline and key leaders',
    'How do I calculate Time & Work using the LCM shortcut?',
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiReply: ChatMessage;

      if (query.toLowerCase().includes('article 32') || query.toLowerCase().includes('226')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Both Article 32 and Article 226 empower courts to issue prerogative writs (Habeas Corpus, Mandamus, Prohibition, Quo-Warranto, Certiorari), but they have vital jurisdictional differences for competitive exams:',
          topicSummary: {
            title: 'Article 32 vs Article 226 - Comparison Matrix',
            keyPoints: [
              'Jurisdiction Level: Art 32 is in Supreme Court (New Delhi); Art 226 is in High Courts (e.g. Kerala HC in Ernakulam).',
              'Fundamental Right status: Art 32 is itself a Fundamental Right under Part III. Art 226 is a constitutional power, not a Part III fundamental right.',
              'Scope: Art 32 can ONLY be invoked for Fundamental Rights. Art 226 can be invoked for Fundamental Rights AND ordinary legal rights (wider scope).'
            ]
          },
          timestamp: 'Just now',
        };
      } else if (query.toLowerCase().includes('generate') || query.toLowerCase().includes('mock') || query.toLowerCase().includes('rivers')) {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: 'Here is a newly generated practice question based on Kerala PSC trends:',
          generatedQuestion: {
            questionText: 'Which tributary of Bharathapuzha (Nila) flows through the Silent Valley National Park?',
            options: ['A. Kunthipuzha', 'B. Gayathripuzha', 'C. Kalpathipuzha', 'D. Bhavani'],
            correctAnswer: 'A',
            explanation: 'Kunthipuzha originates from the Silent Valley plateau and flows through the entire evergreen national park untouched by vehicular pollution before meeting Bharathapuzha.'
          },
          timestamp: 'Just now',
        };
      } else {
        aiReply = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Based on verified Kerala PSC syllabi, here is an overview for "${query}": Keep focus on constitutional amendments, SCERT factual citations, and chronological order of social reform movements.`,
          topicSummary: {
            title: `Study Capsule: ${query.slice(0, 30)}...`,
            keyPoints: [
              'Verify official notifications and final gazetted keys rather than unmoderated forum notes.',
              'Revise related questions from our Previous-Year Paper Library.',
              'Add recurring doubts to your Mistake Notebook.'
            ]
          },
          timestamp: 'Just now',
        };
      }

      setMessages((prev) => [...prev, aiReply]);
      setIsTyping(false);
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-slate-800 text-navy-800 dark:text-sky-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Learning Assistant &bull; Demonstration Preview</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            AI Study Assistant
          </h1>
        </div>
      </div>

      {/* Demo Disclaimer notice */}
      <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 text-xs flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
        <span>
          <strong>Frontend Demonstration:</strong> In this phase, AI interactions are simulated using curriculum templates. Live LLM API endpoints will be integrated in Phase 2 with full verification pipelines.
        </span>
      </div>

      {/* Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[580px] overflow-hidden">
        {/* Messages Stream */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${
                msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-navy-700 text-white'
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`space-y-3 p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-navy-700 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800/70 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700/60'
                }`}
              >
                <p>{msg.text}</p>

                {/* Optional Structured Topic Summary */}
                {msg.topicSummary && (
                  <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                    <h4 className="font-bold text-navy-800 dark:text-sky-300 text-xs flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-emerald-500" />
                      {msg.topicSummary.title}
                    </h4>
                    <ul className="space-y-1 text-xs list-disc list-inside text-slate-700 dark:text-slate-300">
                      {msg.topicSummary.keyPoints.map((pt, i) => (
                        <li key={i}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Optional Generated Question Preview */}
                {msg.generatedQuestion && (
                  <div className="mt-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-emerald-200 dark:border-emerald-800 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                      AI Generated Practice Drill
                    </span>
                    <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                      {msg.generatedQuestion.questionText}
                    </h5>
                    <div className="grid grid-cols-2 gap-1.5 text-xs">
                      {msg.generatedQuestion.options.map((opt, i) => (
                        <div key={i} className="p-1.5 rounded bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {opt}
                        </div>
                      ))}
                    </div>
                    <div className="pt-1 text-[11px] text-emerald-700 dark:text-emerald-400">
                      <strong>Answer: ({msg.generatedQuestion.correctAnswer})</strong> &bull; {msg.generatedQuestion.explanation}
                    </div>
                  </div>
                )}

                <div
                  className={`text-[10px] pt-1 text-right ${
                    msg.sender === 'user' ? 'text-white/70' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Bot className="w-4 h-4 text-emerald-500" />
              <span>AI Assistant is compiling verified facts...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-2 sm:px-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 shrink-0 flex items-center gap-1">
            <Lightbulb className="w-3 h-3 text-amber-500" /> Suggested:
          </span>
          {suggestedPrompts.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shrink-0 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSend();
            }}
            placeholder="Ask a question about syllabus, constitutional articles, or request an explanation..."
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs sm:text-sm text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-navy-500"
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputText.trim() || isTyping}
            className="p-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white disabled:opacity-40 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
