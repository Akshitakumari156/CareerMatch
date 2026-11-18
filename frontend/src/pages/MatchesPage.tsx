import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Bookmark,
  TrendingUp,
  X,
  ArrowUpDown,
  Briefcase,
  FileText,
  ArrowRight,
} from 'lucide-react';
import { JobCard } from '../components/JobCard';
import { JobDetailModal } from '../components/JobDetailModal';
import { INITIAL_JOBS_CATALOG } from '../data/mockJobs';
import { JobMatch, UserProfile } from '../types';
import { calculateJobMatch } from '../utils/scoring';

interface MatchesPageProps {
  activeProfile: UserProfile | null;
  onNavigateToOnboarding: () => void;
}

export const MatchesPage: React.FC<MatchesPageProps> = ({
  activeProfile,
  onNavigateToOnboarding,
}) => {
  const [selectedMatch, setSelectedMatch] = useState<JobMatch | null>(null);
  const [viewTab, setViewTab] = useState<'ranked' | 'bookmarked' | 'pipeline'>('ranked');

  // User interactions map: jobId -> { interaction, stage }
  const [interactions, setInteractions] = useState<
    Record<string, { interaction?: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied'; stage?: 'saved' | 'applied' | 'interviewing' | 'offer' }>
  >({});

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [minScore, setMinScore] = useState(activeProfile ? 60 : 0);
  const [selectedSeniority, setSelectedSeniority] = useState<string>('all');
  const [selectedRoleFamily, setSelectedRoleFamily] = useState<string>('all');

  // Friendly toast
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Compute dynamic match list based on activeProfile and user interactions
  const allMatches: JobMatch[] = useMemo(() => {
    return INITIAL_JOBS_CATALOG.map((job) => {
      const userState = interactions[job.id] || {};
      return calculateJobMatch(job, activeProfile, userState.interaction, userState.stage);
    }).sort((a, b) => b.final_score - a.final_score);
  }, [activeProfile, interactions]);

  const handleFeedback = (jobId: string, type: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied') => {
    const target = allMatches.find((m) => m.job.id === jobId);
    if (!target) return;

    setInteractions((prev) => {
      const current = prev[jobId] || {};
      let nextStage = current.stage;
      if (type === 'saved') nextStage = 'saved';
      if (type === 'applied') nextStage = 'applied';

      return {
        ...prev,
        [jobId]: {
          interaction: type,
          stage: nextStage,
        },
      };
    });

    if (type === 'liked') {
      setToastMessage({
        title: `Preference Saved`,
        subtitle: `We'll prioritize similar roles at ${target.job.company} in your feed.`,
      });
    } else if (type === 'disliked') {
      setToastMessage({
        title: `Role Deprioritized`,
        subtitle: `We'll show fewer positions similar to this one.`,
      });
    } else if (type === 'saved') {
      setToastMessage({
        title: `Saved to Bookmarks`,
        subtitle: `Added ${target.job.title} to your saved list.`,
      });
    } else if (type === 'applied') {
      setToastMessage({
        title: `Application Tracked`,
        subtitle: `Marked as applied in your personal job pipeline.`,
      });
    }

    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filter matches
  const filteredMatches = allMatches.filter((m) => {
    // Hidden roles
    if (m.user_interaction === 'hidden') return false;

    // View Tab filter
    if (viewTab === 'bookmarked') {
      if (m.user_interaction !== 'saved' && m.application_stage !== 'saved') return false;
    } else if (viewTab === 'pipeline') {
      if (!m.application_stage) return false;
    }

    // Standard filters
    if (remoteOnly && !m.job.is_remote) return false;
    if (activeProfile && m.final_score < minScore) return false;
    if (selectedSeniority !== 'all' && m.job.seniority !== selectedSeniority) return false;
    if (selectedRoleFamily !== 'all' && m.job.role_family !== selectedRoleFamily) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = m.job.title.toLowerCase().includes(q);
      const matchCompany = m.job.company.toLowerCase().includes(q);
      const matchSkills = m.job.skills.some((s) => s.toLowerCase().includes(q));
      if (!matchTitle && !matchCompany && !matchSkills) return false;
    }

    return true;
  });

  const savedCount = allMatches.filter((m) => m.application_stage === 'saved' || m.user_interaction === 'saved').length;
  const appliedCount = allMatches.filter((m) => m.application_stage === 'applied' || m.user_interaction === 'applied').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 max-w-sm animate-slideUp">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div className="space-y-0.5 flex-1">
              <h5 className="font-bold text-xs text-white">{toastMessage.title}</h5>
              <p className="text-[11px] text-slate-300 leading-snug">{toastMessage.subtitle}</p>
            </div>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Discover Roles Tailored to You
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {activeProfile
              ? `Personalized recommendations for ${activeProfile.name} based on your skills in ${activeProfile.skills.slice(0, 4).join(', ')}.`
              : 'Explore verified engineering roles at top tech companies. Upload your resume to calculate your exact fit score.'}
          </p>
        </div>
      </div>

      {/* Prompt to upload resume if missing */}
      {!activeProfile && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload your resume to see your match score</h3>
              <p className="text-xs text-slate-600">
                Our AI analyzes your skills, experience, and projects to show exact fit percentages and personalized gap roadmaps.
              </p>
            </div>
          </div>
          <button
            onClick={onNavigateToOnboarding}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center space-x-1.5 shrink-0 shadow-sm transition-colors"
          >
            <span>Upload Resume</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Tabs (Ranked Matches, Bookmarked, Pipeline) */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex space-x-2 text-xs sm:text-sm font-semibold">
          <button
            onClick={() => setViewTab('ranked')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              viewTab === 'ranked'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Opportunities ({allMatches.length})</span>
          </button>

          <button
            onClick={() => setViewTab('bookmarked')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              viewTab === 'bookmarked'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Saved ({savedCount})</span>
          </button>

          <button
            onClick={() => setViewTab('pipeline')}
            className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 ${
              viewTab === 'pipeline'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Applied ({appliedCount})</span>
          </button>
        </div>

        {activeProfile && (
          <div className="text-xs text-slate-500 hidden sm:block">
            Profile: <strong className="text-slate-800">{activeProfile.name}</strong> ({activeProfile.seniority})
          </div>
        )}
      </div>

      {/* Discipline Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-medium">
        {[
          { id: 'all', label: 'All Roles' },
          { id: 'backend', label: 'Backend' },
          { id: 'fullstack', label: 'Full Stack' },
          { id: 'frontend', label: 'Frontend' },
          { id: 'ml_ai', label: 'AI & Machine Learning' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setSelectedRoleFamily(f.id)}
            className={`px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap ${
              selectedRoleFamily === f.id
                ? 'bg-slate-900 text-white font-bold shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by role, company, or skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-slate-900 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        <div className="flex items-center flex-wrap gap-4 w-full lg:w-auto justify-between lg:justify-end text-xs font-medium text-slate-600">
          <div className="flex items-center space-x-1.5">
            <span className="text-slate-500">Level:</span>
            <select
              value={selectedSeniority}
              onChange={(e) => setSelectedSeniority(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 font-semibold focus:outline-none focus:border-slate-900"
            >
              <option value="all">All Levels</option>
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
            </select>
          </div>

          <label className="flex items-center space-x-2 cursor-pointer select-none bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-slate-300 text-slate-900 focus:ring-slate-900 w-4 h-4"
            />
            <span className="font-semibold text-slate-700">Remote Only</span>
          </label>

          {activeProfile && (
            <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1 rounded-xl border border-slate-200">
              <span className="text-slate-500">Min Fit:</span>
              <input
                type="range"
                min="40"
                max="90"
                step="5"
                value={minScore}
                onChange={(e) => setMinScore(Number(e.target.value))}
                className="accent-slate-900 w-20 cursor-pointer"
              />
              <span className="font-bold text-slate-900 w-8">{minScore}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Match Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredMatches.length}</strong> opportunities
          </span>
          {activeProfile && (
            <span className="flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              Ranked by personalized fit
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredMatches.map((match) => (
            <JobCard
              key={match.job.id}
              match={match}
              onFeedback={handleFeedback}
              onSelectJob={(m) => setSelectedMatch(m)}
            />
          ))}
        </div>

        {filteredMatches.length === 0 && (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Filter className="w-8 h-8 text-slate-400 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No positions found with current criteria</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting the filters or clearing the search query.
            </p>
            <button
              onClick={() => {
                setMinScore(40);
                setRemoteOnly(false);
                setSelectedSeniority('all');
                setSelectedRoleFamily('all');
                setSearchQuery('');
              }}
              className="mt-2 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Slide-over Job Detail Drawer */}
      <JobDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onFeedback={handleFeedback}
      />
    </div>
  );
};
