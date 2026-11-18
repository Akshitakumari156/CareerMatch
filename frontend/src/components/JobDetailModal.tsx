import React, { useState } from 'react';
import {
  X,
  Building2,
  MapPin,
  DollarSign,
  ExternalLink,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Bookmark,
  ThumbsUp,
  ThumbsDown,
  BarChart3,
} from 'lucide-react';
import { JobMatch } from '../types';

interface JobDetailModalProps {
  match: JobMatch | null;
  onClose: () => void;
  onFeedback: (jobId: string, type: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied') => void;
}

export const JobDetailModal: React.FC<JobDetailModalProps> = ({ match, onClose, onFeedback }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'explanation' | 'roadmap' | 'breakdown'>('overview');

  if (!match) return null;

  const { job, final_score, explanation, breakdown, user_interaction, application_stage } = match;
  const hasScore = final_score > 0;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {job.company}
              </span>
              {job.is_remote && (
                <span className="text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Remote
                </span>
              )}
              {job.seniority && (
                <span className="text-xs font-medium text-slate-600 bg-white px-2 py-0.5 rounded-md border border-slate-200 uppercase tracking-wider">
                  {job.seniority}
                </span>
              )}
            </div>

            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{job.title}</h2>

            <div className="flex items-center gap-4 text-xs text-slate-500 pt-0.5">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {job.location}
              </span>
              {(job.salary_min || job.salary_max) && (
                <span className="flex items-center gap-1 font-semibold text-slate-700">
                  <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                  {job.currency || '$'}{job.salary_min?.toLocaleString()} – {job.salary_max?.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {hasScore ? (
              <div className="text-center bg-slate-900 text-white px-3.5 py-1.5 rounded-xl">
                <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">Fit</div>
                <div className="text-lg font-black leading-none text-sky-400">{final_score}%</div>
              </div>
            ) : null}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Role Overview
          </button>
          <button
            onClick={() => setActiveTab('explanation')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'explanation'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-500" />
            Why You Fit
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'roadmap'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-500" />
            Skills &amp; Prep ({explanation?.missing_skills.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`py-3 px-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'breakdown'
                ? 'border-slate-900 text-slate-900 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
            Match Insights
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Required Skills &amp; Stack</h4>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((skill) => {
                    const matched = explanation?.matched_skills.includes(skill);
                    return (
                      <span
                        key={skill}
                        className={`px-3 py-1 rounded-lg text-xs font-medium ${
                          matched
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}
                      >
                        {matched && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {skill}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Description</h4>
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-slate-800 whitespace-pre-wrap leading-relaxed text-xs sm:text-sm font-sans">
                  {job.description}
                </div>
              </div>

              <div className="bg-white rounded-xl p-3 border border-slate-200 text-xs text-slate-500 flex items-center justify-between">
                <span>Verified posting from: <strong className="text-slate-700 capitalize">{job.source}</strong></span>
                <span>Posted: {new Date(job.posted_at).toLocaleDateString()}</span>
              </div>
            </div>
          )}

          {/* TAB 2: EXPLANATION */}
          {activeTab === 'explanation' && (
            <div className="space-y-5">
              {!hasScore ? (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 space-y-2">
                  <Sparkles className="w-6 h-6 text-slate-400 mx-auto" />
                  <p className="font-semibold text-slate-700">No Resume Uploaded Yet</p>
                  <p>Upload your resume in the Resume &amp; Profile tab to calculate your personalized fit score and rationale for this role.</p>
                </div>
              ) : (
                <>
                  <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 space-y-1.5">
                    <div className="flex items-center gap-2 text-sky-800 font-bold text-xs">
                      <Sparkles className="w-4 h-4 text-sky-600" />
                      Personalized Match Analysis
                    </div>
                    <p className="text-xs text-sky-900 leading-relaxed">
                      Every insight below is derived by comparing your verified resume proficiencies directly against the job requirements.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Key Match Factors</h4>
                    <ul className="space-y-2.5">
                      {explanation?.reasons.map((reason, idx) => (
                        <li key={idx} className="flex items-start gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-800 font-medium leading-relaxed">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Matching Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {explanation?.matched_skills.map((s) => (
                          <span key={s} className="bg-white text-emerald-800 text-[11px] font-medium px-2 py-0.5 rounded border border-emerald-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3.5 space-y-1.5">
                      <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Skills to Learn</span>
                      <div className="flex flex-wrap gap-1">
                        {explanation?.missing_skills.map((s) => (
                          <span key={s} className="bg-white text-amber-800 text-[11px] font-medium px-2 py-0.5 rounded border border-amber-200">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 3: ROADMAP */}
          {activeTab === 'roadmap' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {explanation?.missing_skills && explanation.missing_skills.length > 0 ? (
                  explanation.missing_skills.map((skill, i) => (
                    <div key={i} className="bg-white border border-slate-200 rounded-2xl p-4 space-y-2 hover:border-slate-300 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-sm">{skill}</span>
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Recommended
                        </span>
                      </div>
                      <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        Review the official documentation and build a small demonstration project utilizing {skill}.
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-xs text-slate-500">
                    You have all core skills requested for this position!
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: BREAKDOWN */}
          {activeTab === 'breakdown' && (
            <div className="space-y-4">
              {!hasScore ? (
                <div className="text-center py-8 text-xs text-slate-500">
                  Upload your resume to view the dimensional fit breakdown.
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { label: 'Technical Skill Overlap', val: breakdown?.skill_overlap || 0.8 },
                    { label: 'Seniority Alignment', val: breakdown?.seniority_fit || 0.9 },
                    { label: 'Location & Workplace Flexibility', val: breakdown?.location_fit || 1.0 },
                  ].map((item, idx) => (
                    <div key={idx} className="space-y-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-800">{item.label}</span>
                        <span className="font-bold text-slate-700">{(item.val * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-slate-900 h-2 rounded-full transition-all"
                          style={{ width: `${item.val * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onFeedback(job.id, 'liked')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                user_interaction === 'liked'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="hidden sm:inline">Prioritize</span>
            </button>

            <button
              onClick={() => onFeedback(job.id, 'disliked')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                user_interaction === 'disliked'
                  ? 'bg-rose-600 text-white border-rose-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="hidden sm:inline">Deprioritize</span>
            </button>

            <button
              onClick={() => onFeedback(job.id, 'saved')}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                application_stage === 'saved' || user_interaction === 'saved'
                  ? 'bg-amber-500 text-white border-amber-500'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span className="hidden sm:inline">Save</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onFeedback(job.id, 'applied')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                application_stage === 'applied'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{application_stage === 'applied' ? 'Applied' : 'Mark Applied'}</span>
            </button>

            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white flex items-center gap-1.5 shadow-sm transition-all"
            >
              <span>Apply</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
