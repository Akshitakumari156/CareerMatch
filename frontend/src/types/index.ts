export interface Job {
  id: string;
  source: 'remotive' | 'arbeitnow' | 'adzuna' | 'direct';
  external_id: string;
  url: string;
  title: string;
  company: string;
  company_logo?: string;
  location: string;
  is_remote: boolean;
  employment_type: string;
  seniority: 'intern' | 'junior' | 'mid' | 'senior' | 'lead';
  salary_min?: number;
  salary_max?: number;
  currency?: string;
  description: string;
  skills: string[];
  posted_at: string;
  role_family: 'backend' | 'ml_ai' | 'frontend' | 'fullstack' | 'devops' | 'data';
}

export interface MatchScoreBreakdown {
  vector_sim: number; // 0-1
  rrf_score: number;  // 0-1
  skill_overlap: number; // 0-1
  seniority_fit: number; // 0-1
  location_fit: number; // 0-1
  salary_fit: number; // 0-1
  recency_decay: number; // 0-1
  preference_bonus: number; // 0-1
}

export interface SkillGapItem {
  skill: string;
  priority: 'high' | 'medium' | 'low';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimated_hours: number;
  learning_resource: string;
}

export interface MatchExplanation {
  score_0_100: number;
  reasons: string[];
  missing_skills: string[];
  matched_skills: string[];
  skill_gap_roadmap?: SkillGapItem[];
  confidence: number;
}

export interface JobMatch {
  job: Job;
  final_score: number;
  breakdown: MatchScoreBreakdown;
  explanation: MatchExplanation;
  user_interaction?: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied';
  application_stage?: 'saved' | 'applied' | 'interviewing' | 'offer';
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  skills: string[];
  years_experience: number;
  seniority: 'intern' | 'junior' | 'mid' | 'senior';
  desired_roles: string[];
  preferred_locations: string[];
  remote_preference: 'remote' | 'hybrid' | 'onsite' | 'any';
  min_salary: number;
  summary: string;
  experience: {
    role: string;
    company: string;
    period: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    graduation_year: string;
  }[];
  version: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'tool';
  content: string;
  tool_invocations?: {
    tool: string;
    params: Record<string, any>;
    result_preview?: string;
  }[];
  cards?: string[]; // Job IDs
  created_at: string;
}
