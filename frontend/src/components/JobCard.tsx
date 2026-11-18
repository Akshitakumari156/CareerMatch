import React, { useState } from 'react';
import {
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  Building2,
  MapPin,
  DollarSign,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { JobMatch } from '../types';

interface JobCardProps {
  match: JobMatch;
  onFeedback: (jobId: string, type: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied') => void;
  onSelectJob: (match: JobMatch) => void;
}

export const JobCard: React.FC<JobCardProps> = ({ match, onFeedback, onSelectJob }) => {
  const [showQuickExplanation, setShowQuickExplanation] = useState(false);
  const { job, final_score, explanation, user_interaction } = match;

  const hasScore = final_score > 0;

  const scoreBadgeColor =
    final_score >= 88
      ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
      : final_score >= 75
      ? 'bg-sky-50 text-sky-800 border-sky-200'
      : final_score >= 60
      ? 'bg-amber-50 text-amber-800 border-amber-200'
      : 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 hover:shadow-md hover:border-slate-300 p-5 sm:p-6 ${
        user_interaction === 'liked'
          ? 'border-sky-300 ring-1 ring-sky-100'
          : user_interaction === 'disliked'
          ? 'opacity-60 bg-slate-50/80 border-slate-200'
          : 'border-slate-200'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          {/* Metadata chips */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-800 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              {job.company}
            </span>
            {job.is_remote && (
              <span className="px-2 py-0.5 rounded-md font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                Remote
              </span>
            )}
            {job.seniority && (
              <span className="px-2 py-0.5 rounded-md font-medium bg-slate-100 text-slate-600 uppercase tracking-wider text-[10px]">
                {job.seniority}
              </span>
            )}
          </div>

          {/* Job Title */}
          <h3
            onClick={() => onSelectJob(match)}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 cursor-pointer transition-colors leading-snug flex items-center gap-2"
          >
            <span>{job.title}</span>
            <ArrowRight className="w-4 h-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-slate-400 hidden sm:inline" />
          </h3>

          {/* Location & Compensation */}
          <div className="flex items-center flex-wrap gap-4 text-xs text-slate-500 pt-0.5">
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
            )}
            {(job.salary_min || job.salary_max) && (
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                {job.currency || '$'}{job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Match Score Display */}
        <div className="shrink-0 text-right">
          {hasScore ? (
            <div className={`px-3 py-1.5 rounded-xl border text-center font-black text-sm ${scoreBadgeColor}`}>
              <span className="text-[10px] font-bold block uppercase tracking-wider opacity-70">Fit</span>
              {final_score}%
            </div>
          ) : (
            <div className="px-3 py-1.5 rounded-xl border border-dashed border-slate-200 text-slate-400 text-[11px] font-medium text-center">
              Upload resume
              <br />
              to see fit
            </div>
          )}
        </div>
      </div>

      {/* Tech Stack Pills */}
      <div className="mt-4 flex flex-wrap gap-1.5 items-center">
        {job.skills.slice(0, 7).map((skill) => {
          const isMatched = explanation?.matched_skills.includes(skill);
          return (
            <span
              key={skill}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                isMatched
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {skill}
            </span>
          );
        })}
        {job.skills.length > 7 && (
          <span className="text-xs text-slate-400 font-medium px-1">
            +{job.skills.length - 7} more
          </span>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-1">
          <button
            onClick={() => onFeedback(job.id, 'liked')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-all ${
              user_interaction === 'liked'
                ? 'bg-slate-900 text-white border-slate-900'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Prioritize similar roles"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prioritize</span>
          </button>

          <button
            onClick={() => onFeedback(job.id, 'disliked')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-all ${
              user_interaction === 'disliked'
                ? 'bg-rose-600 text-white border-rose-600'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Show fewer roles like this"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Deprioritize</span>
          </button>

          <button
            onClick={() => onFeedback(job.id, 'saved')}
            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border flex items-center gap-1 font-medium transition-all ${
              user_interaction === 'saved'
                ? 'bg-amber-500 text-white border-amber-500'
                : 'text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Bookmark role"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Save</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {hasScore && explanation && (
            <button
              onClick={() => setShowQuickExplanation(!showQuickExplanation)}
              className="text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 px-2 py-1 rounded-md hover:bg-slate-100 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-500" />
              <span>{showQuickExplanation ? 'Hide Match' : 'Why Match?'}</span>
              {showQuickExplanation ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
            </button>
          )}

          <button
            onClick={() => onSelectJob(match)}
            className="px-3 py-1.5 rounded-lg bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors flex items-center gap-1"
          >
            <span>View Role</span>
          </button>
        </div>
      </div>

      {/* Quick Accordion Explanation */}
      {showQuickExplanation && hasScore && explanation && (
        <div className="mt-3 pt-3 border-t border-dashed border-slate-200 text-xs space-y-2 bg-slate-50/70 p-3 rounded-xl animate-fadeIn">
          <div className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            <span>Match Insights</span>
          </div>
          <ul className="space-y-1.5 pl-1">
            {explanation.reasons.map((reason, idx) => (
              <li key={idx} className="flex items-start gap-2 text-slate-600">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
