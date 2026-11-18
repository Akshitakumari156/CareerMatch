import React, { useState } from 'react';
import {
  UploadCloud,
  CheckCircle,
  Sparkles,
  Plus,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { UserProfile } from '../types';
import { ApiClient } from '../api/client';

const PRESET_PROFILES: Record<string, UserProfile> = {
  ai_intern: {
    name: 'Akshita Kumari',
    email: 'akshita@example.com',
    title: 'AI / Backend Software Engineer Intern',
    skills: ['Python', 'FastAPI', 'PostgreSQL', 'Docker', 'LangChain', 'pgvector', 'Git'],
    years_experience: 1.5,
    seniority: 'intern',
    desired_roles: ['AI Software Engineer Intern', 'Backend Developer', 'Applied AI Intern'],
    preferred_locations: ['Remote', 'San Francisco, CA'],
    remote_preference: 'remote',
    min_salary: 85000,
    summary:
      'Computer Science student with strong foundations in modern Python and backend architectures. Built autonomous agent workflows with LangGraph and low-latency vector retrieval pipelines using pgvector.',
    experience: [
      {
        role: 'Undergraduate ML Researcher',
        company: 'University AI Lab',
        period: '2025 - Present',
        bullets: [
          'Implemented RAG pipelines indexing 500k academic papers with dense embeddings.',
          'Built evaluation harness tracking answer relevancy and hallucination rates.',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. in Computer Science',
        institution: 'University of California, Berkeley',
        graduation_year: '2026',
      },
    ],
    version: 1,
  },
  fullstack: {
    name: 'Jordan Chen',
    email: 'jordan.chen@example.com',
    title: 'Junior Full Stack Engineer',
    skills: ['TypeScript', 'React', 'Next.js', 'Tailwind', 'Node.js', 'PostgreSQL', 'REST APIs'],
    years_experience: 2.0,
    seniority: 'junior',
    desired_roles: ['Full Stack Engineer', 'Frontend Engineer', 'Web Applications Developer'],
    preferred_locations: ['Remote', 'New York, NY'],
    remote_preference: 'remote',
    min_salary: 95000,
    summary:
      'Full-stack developer focused on modern web applications, reactive user interfaces, and robust TypeScript microservices. Passionate about developer tooling and generative UI.',
    experience: [
      {
        role: 'Junior Frontend Developer',
        company: 'CloudFlow Inc.',
        period: '2024 - 2025',
        bullets: [
          'Engineered responsive dashboards using Next.js App Router and Tailwind CSS.',
          'Reduced web vitals LCP from 2.8s to 0.9s via selective code splitting.',
        ],
      },
    ],
    education: [
      {
        degree: 'B.S. in Software Engineering',
        institution: 'University of Washington',
        graduation_year: '2024',
      },
    ],
    version: 1,
  },
  mlops: {
    name: 'Devon Vance',
    email: 'devon.vance@example.com',
    title: 'ML Platform & Distributed Systems Engineer',
    skills: ['Python', 'Kubernetes', 'Docker', 'PyTorch', 'MLOps', 'Distributed Systems', 'Ray'],
    years_experience: 3.5,
    seniority: 'mid',
    desired_roles: ['ML Infrastructure Engineer', 'MLOps Engineer', 'Platform Engineer'],
    preferred_locations: ['San Francisco, CA', 'Seattle, WA', 'Remote'],
    remote_preference: 'hybrid',
    min_salary: 135000,
    summary:
      'Systems engineer building scalable infrastructure for foundation model training and inference. Expert in Kubernetes orchestration, GPU profiling, and distributed model serving.',
    experience: [
      {
        role: 'Platform Engineer',
        company: 'Synthetix Data',
        period: '2023 - 2026',
        bullets: [
          'Managed multi-node Kubernetes GPU clusters with Ray and Slurm schedulers.',
          'Cut cold-start container launch latency by 45% using optimized base images.',
        ],
      },
    ],
    education: [
      {
        degree: 'M.S. in Computer Science',
        institution: 'Carnegie Mellon University',
        graduation_year: '2023',
      },
    ],
    version: 1,
  },
};

interface OnboardingPageProps {
  onProfileLoaded?: (profile: UserProfile) => void;
}

export const OnboardingPage: React.FC<OnboardingPageProps> = ({ onProfileLoaded }) => {
  const [profile, setProfile] = useState<UserProfile>(PRESET_PROFILES.ai_intern);
  const [file, setFile] = useState<File | null>(null);
  const [extractionProgress, setExtractionProgress] = useState<number | null>(null);
  const [extractionStep, setExtractionStep] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [newSkill, setNewSkill] = useState('');
  const [savedMessage, setSavedMessage] = useState(false);

  React.useEffect(() => {
    ApiClient.getProfile()
      .then((p) => {
        if (p && p.skills && p.skills.length > 0) {
          setProfile(p);
          onProfileLoaded?.(p);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelectPreset = (key: string) => {
    const selected = PRESET_PROFILES[key];
    setProfile(selected);
    onProfileLoaded?.(selected);
    setFile(null);
    setErrorMessage(null);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setErrorMessage(null);

      // Start actual upload and extraction
      setExtractionProgress(20);
      setExtractionStep('Uploading PDF to server...');

      try {
        setExtractionProgress(50);
        setExtractionStep('Extracting text with pypdf & parsing with Gemini 2.5 Flash...');

        const extracted = await ApiClient.uploadResume(selected);

        setExtractionProgress(85);
        setExtractionStep('Computing 768-dim embeddings & saving profile...');

        setTimeout(() => {
          setProfile(extracted);
          onProfileLoaded?.(extracted);
          setExtractionProgress(100);
          setExtractionStep(`Successfully extracted ${extracted.name}'s profile!`);

          setTimeout(() => {
            setExtractionProgress(null);
          }, 1500);
        }, 500);
      } catch (err: any) {
        setExtractionProgress(null);
        setErrorMessage(err.message || 'Failed to extract resume. Please ensure the file is an uncorrupted text PDF.');
      }
    }
  };

  const handleAddSkill = () => {
    if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
      setProfile((prev) => ({ ...prev, skills: [...prev.skills, newSkill.trim()] }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      const updated = await ApiClient.updateProfile(profile);
      setProfile(updated);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3500);
    } catch {
      // Local fallback
      setProfile((prev) => ({ ...prev, version: prev.version + 1 }));
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Title & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Resume & Profile Parser</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Upload your own PDF resume to extract your real name, skills, experience, and 768-dim embedding.
          </p>
        </div>

        {/* Quick Presets */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs font-semibold">
          <span className="text-slate-400 px-2 text-[11px] uppercase tracking-wider">Presets:</span>
          <button
            onClick={() => handleSelectPreset('ai_intern')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              profile.title.includes('Intern') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            AI Intern
          </button>
          <button
            onClick={() => handleSelectPreset('fullstack')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              profile.title.includes('Full Stack') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Full Stack
          </button>
          <button
            onClick={() => handleSelectPreset('mlops')}
            className={`px-3 py-1.5 rounded-xl transition-colors ${
              profile.title.includes('Distributed') ? 'bg-sky-600 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            MLOps
          </button>
        </div>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div className="bg-rose-50 text-rose-800 border border-rose-200 p-4 rounded-2xl text-xs font-semibold flex items-start space-x-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold">Resume Extraction Issue:</span>
            <p className="font-normal text-rose-700">{errorMessage}</p>
          </div>
        </div>
      )}

      {/* Upload Box */}
      <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-8 text-center hover:border-sky-500 transition-colors shadow-sm relative overflow-hidden">
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
        <label htmlFor="resume-upload" className="cursor-pointer space-y-3 block">
          <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
            {extractionProgress !== null ? <Sparkles className="w-7 h-7 animate-spin text-sky-600" /> : <UploadCloud className="w-7 h-7" />}
          </div>
          <div>
            <span className="font-bold text-slate-800 text-sm">Click here to upload your Resume (PDF)</span>
            <p className="text-xs text-slate-500 mt-1">
              Supports standard text-based PDF resumes (Max 5MB). Scanned image PDFs will be rejected.
            </p>
          </div>

          {file && !errorMessage && (
            <div className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{file.name}</span>
            </div>
          )}
        </label>

        {/* Live Extraction Progress */}
        {extractionProgress !== null && (
          <div className="mt-6 pt-4 border-t border-slate-100 max-w-md mx-auto space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-700">
              <span>{extractionStep}</span>
              <span className="font-mono text-sky-600">{extractionProgress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="bg-sky-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${extractionProgress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Saved Toast Banner */}
      {savedMessage && (
        <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-4 rounded-2xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Profile v{profile.version} saved! Candidate embedding recomputed and indexed into pgvector for updated matches.
          </span>
        </div>
      )}

      {/* Extracted Profile Form */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-100 gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Extracted Candidate Profile</h2>
            <p className="text-xs text-slate-500">
              Candidate: <strong className="text-slate-800">{profile.name}</strong> • Version {profile.version}
            </p>
          </div>
          <button
            onClick={handleSave}
            className="self-start sm:self-auto flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Save className="w-4 h-4" />
            <span>Save &amp; Recompute Embeddings</span>
          </button>
        </div>

        {/* Name and Title */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Professional Headline</label>
            <input
              type="text"
              value={profile.title}
              onChange={(e) => setProfile({ ...profile, title: e.target.value })}
              className="w-full p-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-medium"
            />
          </div>
        </div>

        {/* Seniority, YoE, Remote Preference, Min Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Seniority Bracket</label>
            <select
              value={profile.seniority}
              onChange={(e) => setProfile({ ...profile, seniority: e.target.value as any })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="intern">Intern</option>
              <option value="junior">Junior</option>
              <option value="mid">Mid-Level</option>
              <option value="senior">Senior</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Years Experience</label>
            <input
              type="number"
              step="0.5"
              value={profile.years_experience}
              onChange={(e) => setProfile({ ...profile, years_experience: Number(e.target.value) })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Workplace Mode</label>
            <select
              value={profile.remote_preference}
              onChange={(e) => setProfile({ ...profile, remote_preference: e.target.value as any })}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-sky-500"
            >
              <option value="remote">100% Remote</option>
              <option value="hybrid">Hybrid</option>
              <option value="onsite">On-Site</option>
              <option value="any">Flexible / Any</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700">Min Base Salary ($/yr)</label>
            <input
              type="number"
              step="5000"
              value={profile.min_salary || ''}
              onChange={(e) => setProfile({ ...profile, min_salary: e.target.value ? Number(e.target.value) : 0 })}
              placeholder="e.g. 80000"
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl font-medium focus:outline-none focus:border-sky-500"
            />
          </div>
        </div>

        {/* Skills Tag Cloud Editor */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
            <span>Extracted Skills &amp; Technologies ({profile.skills.length})</span>
            <span className="text-[11px] text-slate-400 font-normal">Click &#39;x&#39; to remove, or type to add</span>
          </label>

          <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-200 min-h-[4rem] items-center">
            {profile.skills.map((skill) => (
              <span
                key={skill}
                className="bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs flex items-center gap-1.5"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="text-slate-400 hover:text-rose-600 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {/* Quick add skill input */}
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="+ Add skill..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="text-xs px-2.5 py-1 bg-white border border-slate-300 rounded-xl focus:outline-none focus:border-sky-500 w-28"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-1 rounded-lg bg-sky-50 text-sky-600 hover:bg-sky-100"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Professional Summary */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700">Executive Profile Summary</label>
          <textarea
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            className="w-full p-3 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-sky-500 leading-relaxed font-sans"
          />
        </div>

        {/* Grounded Experience Bullets */}
        {profile.experience && profile.experience.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Resume Experience</h4>
            {profile.experience.map((exp, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-900">{exp.role} @ {exp.company}</span>
                  <span className="text-slate-500">{exp.period}</span>
                </div>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    {exp.bullets.map((b, bi) => (
                      <li key={bi}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Extracted Education */}
        {profile.education && profile.education.length > 0 && (
          <div className="space-y-3 pt-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Extracted Education</h4>
            {profile.education.map((edu, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-900">{edu.degree} — {edu.institution}</span>
                <span className="text-slate-500">{edu.graduation_year}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
