import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { ChatMessage, JobMatch, UserProfile } from '../types';
import { INITIAL_JOBS_CATALOG } from '../data/mockJobs';
import { JobDetailModal } from '../components/JobDetailModal';
import { calculateJobMatch } from '../utils/scoring';

interface ChatPageProps {
  activeProfile?: UserProfile | null;
}

export const ChatPage: React.FC<ChatPageProps> = ({ activeProfile }) => {
  const starterPrompts = [
    activeProfile
      ? `What are my strongest matches based on my skills?`
      : 'Find me remote junior developer roles',
    'What skills should I learn next to increase my match score?',
    'Compare backend roles at OpenAI vs Stripe',
    'Draft a personalized outreach note for an engineering hiring manager',
  ];

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: activeProfile
        ? `Hello ${activeProfile.name}! I have reviewed your profile and skills in ${activeProfile.skills.slice(0, 5).join(', ')}.\n\nI can help you explore matching roles, analyze skill gaps, or draft tailored application notes. What would you like to focus on today?`
        : 'Hello! I am your AI Career Assistant. I can search open positions, analyze skill requirements, and help you prepare tailored applications. What types of roles are you looking for?',
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  const handleSendPrompt = (textToSend?: string) => {
    const prompt = (textToSend || input).trim();
    if (!prompt) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: prompt,
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsThinking(true);

    const isSkillGap = prompt.toLowerCase().includes('skill') || prompt.toLowerCase().includes('learn') || prompt.toLowerCase().includes('gap');
    const isCompare = prompt.toLowerCase().includes('compare') || prompt.toLowerCase().includes('vs');
    const isOutreach = prompt.toLowerCase().includes('outreach') || prompt.toLowerCase().includes('draft') || prompt.toLowerCase().includes('note') || prompt.toLowerCase().includes('email');

    setTimeout(() => {
      setIsThinking(false);

      let replyContent = '';
      let cards: string[] | undefined = undefined;

      if (isSkillGap) {
        replyContent = `Based on your profile, here is where you have the highest leverage to increase your match percentage:\n\n` +
          `1. **PostgreSQL Indexing & Optimization:** Many top backend roles look for database query optimization and connection pooling.\n` +
          `2. **Docker & Container Workflows:** Containerizing services ensures seamless CI/CD across distributed environments.\n` +
          `3. **Modern API Architecture:** Demonstrating clean REST contracts with asynchronous handling.\n\n` +
          `Mastering these topics will noticeably boost your match across modern software engineering openings!`;
        cards = ['job-openai-backend', 'job-supabase-vector'];
      } else if (isCompare) {
        replyContent = `### Role Comparison: OpenAI vs Stripe\n\n` +
          `• **OpenAI (Software Engineer Intern - Systems):** Focuses heavily on high-throughput backend APIs, low-latency streaming endpoints, and vector search systems.\n` +
          `• **Stripe (Software Engineer - Developer Platform):** Focuses on payments infrastructure, sub-100ms API idempotency, and distributed financial storage.\n\n` +
          `**Recommendation:** Both are top-tier engineering organizations. If you want direct exposure to AI platform infrastructure, OpenAI is an exceptional fit. For large-scale distributed financial systems, Stripe is world-class.`;
        cards = ['job-openai-backend', 'job-stripe-devplatform'];
      } else if (isOutreach) {
        const candidateName = activeProfile?.name || 'Your Name';
        replyContent = `Here is a concise, high-converting outreach note tailored for an engineering manager:\n\n` +
          `---\n` +
          `**Subject:** Quick note regarding software engineering opportunities\n\n` +
          `Hi [Manager Name],\n\n` +
          `I've been following your team's engineering work and really admire your focus on high-reliability developer platforms.\n\n` +
          `I recently built full-stack and backend systems utilizing modern Python, PostgreSQL, and scalable API pipelines. I'd love the opportunity to contribute to your engineering team.\n\n` +
          `Would you have 10 minutes next week for a brief conversation?\n\n` +
          `Best regards,\n` +
          `${candidateName}\n` +
          `---`;
      } else {
        replyContent = `I searched our index for positions matching your background. Here are top-rated roles that align with your experience:`;
        cards = ['job-openai-backend', 'job-scale-ai'];
      }

      const replyMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: replyContent,
        cards,
        created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    }, 1200);
  };

  const getJobMatch = (id: string): JobMatch | undefined => {
    const job = INITIAL_JOBS_CATALOG.find((j) => j.id === id);
    if (!job) return undefined;
    return calculateJobMatch(job, activeProfile || null);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 h-[calc(100vh-8.5rem)] flex flex-col">
      {/* Agent Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-sky-400 flex items-center justify-center shadow-sm">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">Career Assistant</h2>
            <p className="text-xs text-slate-500">
              Personalized career guidance grounded in verified jobs and your profile
            </p>
          </div>
        </div>

        {activeProfile && (
          <div className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl font-medium hidden sm:block">
            Active: <strong className="text-slate-800">{activeProfile.name}</strong>
          </div>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto px-1 py-4 space-y-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-700 border border-slate-200'
              }`}
            >
              {m.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm space-y-3 ${
                m.role === 'user'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 shadow-sm text-slate-800'
              }`}
            >
              <div className="whitespace-pre-wrap leading-relaxed">{m.content}</div>

              {/* Embedded Job Cards in Chat */}
              {m.cards && m.cards.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Relevant Opportunities</div>
                  <div className="grid grid-cols-1 gap-2">
                    {m.cards.map((jobId) => {
                      const match = getJobMatch(jobId);
                      if (!match) return null;
                      return (
                        <div
                          key={jobId}
                          className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-slate-900 flex items-center justify-between gap-3 hover:border-slate-300 transition-colors"
                        >
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-slate-900">{match.job.company}</span>
                              {match.final_score > 0 && (
                                <span className="text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full">
                                  {match.final_score}% Match
                                </span>
                              )}
                            </div>
                            <h4 className="text-xs font-semibold text-slate-800">{match.job.title}</h4>
                            <div className="text-[11px] text-slate-500">{match.job.location} • {match.job.currency || '$'}{match.job.salary_min?.toLocaleString()}</div>
                          </div>

                          <button
                            onClick={() => setSelectedMatch(match)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-800 border border-slate-200 hover:bg-slate-100 shadow-2xs shrink-0 flex items-center gap-1"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div
                className={`text-[10px] pt-1 ${
                  m.role === 'user' ? 'text-slate-400 text-right' : 'text-slate-400'
                }`}
              >
                {m.created_at}
              </div>
            </div>
          </div>
        ))}

        {/* Live Active Thinking Indicator */}
        {isThinking && (
          <div className="flex items-center gap-2 bg-slate-100 text-slate-700 p-3 rounded-2xl border border-slate-200 text-xs max-w-xs animate-pulse">
            <Sparkles className="w-4 h-4 text-sky-600 animate-spin" />
            <span className="font-medium">Searching opportunities &amp; analyzing fit...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts */}
      <div className="py-2 flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
        <span className="text-slate-400 text-[11px] whitespace-nowrap">Suggested:</span>
        {starterPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSendPrompt(p)}
            className="px-3 py-1 bg-white border border-slate-200 hover:border-slate-800 hover:text-slate-900 rounded-full text-slate-600 whitespace-nowrap transition-colors shadow-2xs"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 shadow-sm flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask a question about open roles, skill gaps, or interview prep..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
          className="flex-1 px-3 py-2 text-xs sm:text-sm bg-transparent focus:outline-none text-slate-900 font-medium"
        />

        <button
          onClick={() => handleSendPrompt()}
          disabled={!input.trim()}
          className="p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white font-bold transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Slide-over Job Detail Drawer */}
      <JobDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onFeedback={() => {}}
      />
    </div>
  );
};
