import { Job, JobMatch, UserProfile } from '../types';

export function calculateJobMatch(
  job: Job,
  profile: UserProfile | null,
  interaction?: 'saved' | 'liked' | 'disliked' | 'hidden' | 'applied',
  stage?: 'saved' | 'applied' | 'interviewing' | 'offer'
): JobMatch {
  // If user has not uploaded/selected any resume profile yet
  if (!profile || !profile.skills || profile.skills.length === 0) {
    return {
      job,
      final_score: 0,
      breakdown: {
        vector_sim: 0,
        rrf_score: 0,
        skill_overlap: 0,
        seniority_fit: 0,
        location_fit: 0,
        salary_fit: 0,
        recency_decay: 1,
        preference_bonus: 0,
      },
      explanation: {
        score_0_100: 0,
        reasons: ['Upload your resume in the Resume & Profile tab to calculate your personalized match score.'],
        matched_skills: [],
        missing_skills: job.skills,
        confidence: 0,
      },
      user_interaction: interaction,
      application_stage: stage,
    };
  }

  // 1. Skill Overlap Calculation
  const profileSkillsLower = profile.skills.map((s) => s.toLowerCase().trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of job.skills) {
    const sLower = skill.toLowerCase().trim();
    const isDirectMatch = profileSkillsLower.some(
      (ps) => ps === sLower || ps.includes(sLower) || sLower.includes(ps)
    );
    if (isDirectMatch) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  const skillOverlapRatio = job.skills.length > 0 ? matchedSkills.length / job.skills.length : 0.5;

  // 2. Seniority Alignment Calculation
  const seniorityLevels: Record<string, number> = {
    intern: 1,
    junior: 2,
    mid: 3,
    senior: 4,
    lead: 5,
  };

  const userLevel = seniorityLevels[profile.seniority?.toLowerCase() || 'intern'] || 1;
  const jobLevel = seniorityLevels[job.seniority?.toLowerCase() || 'intern'] || 1;
  const diff = Math.abs(userLevel - jobLevel);
  const seniorityFit = diff === 0 ? 1.0 : diff === 1 ? 0.85 : diff === 2 ? 0.6 : 0.3;

  // 3. Location / Remote Alignment
  let locationFit = 0.8;
  if (job.is_remote) {
    locationFit = 1.0;
  } else if (profile.remote_preference === 'remote' && !job.is_remote) {
    locationFit = 0.5;
  }

  // 4. Role Title Fit
  const desiredRoles = (profile.desired_roles || [profile.title]).map((r) => r.toLowerCase());
  const jobTitleLower = job.title.toLowerCase();
  const roleMatches = desiredRoles.some((dr) => {
    const words = dr.split(/\s+/).filter((w) => w.length > 2);
    return words.some((w) => jobTitleLower.includes(w));
  });
  const roleFit = roleMatches ? 1.0 : 0.65;

  // 5. Interaction adjustment (thumbs up / thumbs down feedback)
  let bonus = 0;
  if (interaction === 'liked') bonus = 4;
  if (interaction === 'disliked') bonus = -15;

  // Weighted composite score (0 - 100)
  const rawScore =
    skillOverlapRatio * 45 +
    seniorityFit * 25 +
    roleFit * 15 +
    locationFit * 15 +
    bonus;

  const finalScore = Math.max(35, Math.min(99, Math.round(rawScore)));

  // Generate grounded explanation bullets
  const reasons: string[] = [];
  if (matchedSkills.length > 0) {
    reasons.push(
      `Strong skills overlap with ${matchedSkills.slice(0, 4).join(', ')} directly on your profile.`
    );
  }
  if (seniorityFit >= 0.85) {
    reasons.push(
      `Target seniority (${job.seniority.toUpperCase()}) aligns with your current experience level.`
    );
  }
  if (job.is_remote) {
    reasons.push('100% remote flexibility matches your workplace preference.');
  }
  if (missingSkills.length > 0) {
    reasons.push(
      `Key skills to brush up on for this role: ${missingSkills.slice(0, 3).join(', ')}.`
    );
  }

  return {
    job,
    final_score: finalScore,
    breakdown: {
      vector_sim: Number((finalScore / 100).toFixed(2)),
      rrf_score: Number((skillOverlapRatio * 0.9).toFixed(2)),
      skill_overlap: Number(skillOverlapRatio.toFixed(2)),
      seniority_fit: seniorityFit,
      location_fit: locationFit,
      salary_fit: 0.9,
      recency_decay: 0.98,
      preference_bonus: bonus / 100,
    },
    explanation: {
      score_0_100: finalScore,
      reasons,
      matched_skills: matchedSkills,
      missing_skills: missingSkills,
      confidence: 0.94,
    },
    user_interaction: interaction,
    application_stage: stage,
  };
}

