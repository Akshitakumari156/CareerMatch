import React, { useState } from 'react';
import { X, Layers, Database, CheckCircle2, Code2, Network } from 'lucide-react';

interface HowItWorksModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HowItWorksModal: React.FC<HowItWorksModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'math' | 'vectorshift' | 'agent' | 'ingestion'>('pipeline');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 text-sky-400 flex items-center justify-center font-black">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">CareerMatch Architecture & System Design</h2>
              <p className="text-xs text-slate-500">
                End-to-End Production Guide: pgvector, Hybrid RRF, Online Personalization & LangGraph
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 px-6 bg-white gap-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('pipeline')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'pipeline' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            1. Pipeline Architecture
          </button>
          <button
            onClick={() => setActiveTab('math')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'math' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            2. Hybrid RRF Math
          </button>
          <button
            onClick={() => setActiveTab('vectorshift')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'vectorshift' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            3. Vector Centroid Shifting
          </button>
          <button
            onClick={() => setActiveTab('agent')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'agent' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            4. LangGraph Agent
          </button>
          <button
            onClick={() => setActiveTab('ingestion')}
            className={`py-3 px-3 border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ingestion' ? 'border-sky-600 text-sky-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            5. Ingestion & Evals
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-700">
          {/* TAB 1: PIPELINE OVERVIEW */}
          {activeTab === 'pipeline' && (
            <div className="space-y-6">
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                CareerMatch does not simply perform naive keyword search or raw vector dumps. It runs a multi-stage production information retrieval (IR) and personalization pipeline designed to serve sub-50ms recommendation results:
              </p>

              {/* Step by Step Cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded-full inline-block">STAGE 1</div>
                  <h4 className="font-bold text-slate-900 text-xs">Query Vectorization</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    User resume is parsed and embedded using Gemini 768-dim embeddings (<code className="bg-white px-1 rounded">text-embedding-004</code>).
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full inline-block">STAGE 2</div>
                  <h4 className="font-bold text-slate-900 text-xs">Hard Filtering</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    SQL WHERE clauses filter candidate pool on minimum salary floor, location/remote constraints, and seniority brackets.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">STAGE 3</div>
                  <h4 className="font-bold text-slate-900 text-xs">Hybrid Fusion (RRF)</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    pgvector HNSW cosine ranking fuses with PostgreSQL GIN full-text BM25 rankings via Reciprocal Rank Fusion.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full inline-block">STAGE 4</div>
                  <h4 className="font-bold text-slate-900 text-xs">7-Feature Scoring</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Top 50 candidates are scored with exact skill overlap, seniority alignment, recency decay, and user interaction bonuses.
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full inline-block">STAGE 5</div>
                  <h4 className="font-bold text-slate-900 text-xs">LLM Rerank & Evals</h4>
                  <p className="text-[11px] text-slate-600 leading-snug">
                    Top 20 roles receive grounded citations and personalized skill-gap roadmaps via structured Gemini output.
                  </p>
                </div>
              </div>

              {/* Data Flow Diagram */}
              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 font-mono text-xs">
                <div className="text-sky-400 font-bold flex items-center gap-2">
                  <Network className="w-4 h-4" />
                  System Component Data Flow
                </div>
                <div className="text-slate-300 leading-relaxed text-[11px]">
                  [External Job APIs] (Remotive, Arbeitnow, Adzuna)
                  <br />&nbsp;&nbsp;└── (Hourly Celery Worker) ──&gt; [PostgreSQL DB: jobs] (Deduped by url/hash)
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└── (Batch Embedding) ──&gt; [pgvector HNSW index: title_embedding, desc_embedding]
                  <br /><br />
                  [User Request / Feed]
                  <br />&nbsp;&nbsp;├── [Personalized Query Vector q&#39;] (Shifted by liked/disliked interactions)
                  <br />&nbsp;&nbsp;├── [Fast Hybrid SQL Query] (pgvector &lt;=&gt; operator + tsvector @@ match)
                  <br />&nbsp;&nbsp;├── [Linear 7-Feature Scorer] (Fast sub-10ms memory compute)
                  <br />&nbsp;&nbsp;└── [Gemini 1.5/2.5 Flash Reranker] ──&gt; [Clean JSON Feed with Grounded Reasons]
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HYBRID RRF MATH */}
          {activeTab === 'math' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Why Pure Vector Search Fails (and Why RRF Wins)</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                Vector search excels at conceptual matches (e.g. knowing that &quot;autonomous agent&quot; is related to &quot;LangGraph&quot;), but struggles with exact acronyms and boolean constraints (e.g. &quot;Kubernetes&quot; or &quot;pgvector&quot;).
                Full-text search (BM25) excels at exact keywords but misses semantic paraphrasing. CareerMatch fuses both using <strong>Reciprocal Rank Fusion (RRF)</strong>:
              </p>

              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 font-mono">
                <div className="text-sky-400 font-bold text-xs">Reciprocal Rank Fusion Formula:</div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-emerald-400">
                  {"RRF_score(d) = \\sum_{m \\in M} \\frac{1}{k + r_m(d)}"}
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Where:</div>
                  <div>• <code className="text-sky-300">k = 60</code> (standard Cormack &amp; Clarke constant prevents top-rank domination)</div>
                  <div>• <code className="text-sky-300">r_dense(d)</code> = rank position in dense vector similarity list</div>
                  <div>• <code className="text-sky-300">r_sparse(d)</code> = rank position in PostgreSQL BM25 ts_rank list</div>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Performance Guarantee
                </div>
                <p>
                  Because RRF relies on rank orders rather than uncalibrated raw scores, it eliminates score normalization artifacts across varying document lengths and embedding models.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: VECTOR CENTROID SHIFTING */}
          {activeTab === 'vectorshift' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Real-Time Interaction Personalization</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                When a user browses matches, clicking &quot;Prioritize&quot; (Thumbs Up) or &quot;Deprioritize&quot; (Thumbs Down) doesn&apos;t just toggle a badge. It dynamically recalculates the candidate&apos;s active query embedding vector in real time:
              </p>

              <div className="bg-slate-900 text-slate-100 p-5 rounded-2xl space-y-3 font-mono">
                <div className="text-sky-400 font-bold text-xs">Rocchio Centroid Vector Shift:</div>
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-sm text-sky-300 overflow-x-auto">
                  {"q' = normalize(q_profile + α · (1/|L|) ∑_{v ∈ L} v - β · (1/|D|) ∑_{u ∈ D} u)"}
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>Hyperparameters in CareerMatch:</div>
                  <div>• <code className="text-emerald-400">\alpha = 0.5</code> (attraction weight for liked job embeddings)</div>
                  <div>• <code className="text-rose-400">\beta = 0.3</code> (repulsion weight for disliked job embeddings)</div>
                  <div>• <code className="text-sky-300">normalize()</code> ensures unit Euclidean length for exact cosine calculation in pgvector (<code className="text-slate-300">&lt;=&gt;</code> operator)</div>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-2">
                <h4 className="font-bold text-slate-800">Cold Start vs Active User:</h4>
                <p className="text-slate-600 leading-relaxed">
                  • <strong>Cold start (0 interactions):</strong> <code className="text-slate-800">q&#39; = q_profile</code>. Matching is driven purely by the extracted resume embedding.
                  <br />• <strong>Active user (&gt;3 interactions):</strong> <code className="text-slate-800">q&#39;</code> shifts dynamically toward the user&apos;s real latent preferences (e.g. if the user likes startup roles and skips enterprise roles, the embedding automatically navigates the manifold towards startup embeddings).
                </p>
              </div>
            </div>
          )}

          {/* TAB 4: LANGGRAPH CAREER AGENT */}
          {activeTab === 'agent' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Autonomous Agent with Deterministic Tools & Memory</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                The CareerMatch Agent is built on <strong>LangGraph</strong>. It maintains stateful conversation checkpointers and executes deterministic tools against the PostgreSQL database:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Code2 className="w-4 h-4 text-sky-600" />
                    Agent Tool Registry
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><code className="text-slate-800">search_jobs(query, filters)</code>: Queries pgvector + DB</li>
                    <li><code className="text-slate-800">analyze_skill_gap(job_id)</code>: Computes missing skills</li>
                    <li><code className="text-slate-800">save_job_interaction(job_id, type)</code>: Records user feedback</li>
                    <li><code className="text-slate-800">remember_user_fact(key, value)</code>: Writes to memory table</li>
                  </ul>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-1.5">
                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Database className="w-4 h-4 text-indigo-600" />
                    Memory Hierarchy
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside">
                    <li><strong>Short-term memory:</strong> LangGraph Postgres Checkpointer per thread.</li>
                    <li><strong>Long-term memory:</strong> User preferences &amp; interaction vectors stored in pgvector.</li>
                    <li><strong>Untrusted Data Defense:</strong> Resume &amp; job text is sanitized; instructions inside them are strictly ignored.</li>
                  </ul>
                </div>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-mono space-y-2">
                <div className="text-sky-400 font-bold">LangGraph State Machine:</div>
                <div className="text-slate-300">
                  User Message ──&gt; [Agent Planner Node]
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;├── Need DB search? ──&gt; [Tool Node: search_jobs] ──&gt; [Agent Node]
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;├── Need Skill Gap? ──&gt; [Tool Node: analyze_skill_gap] ──&gt; [Agent Node]
                  <br />&nbsp;&nbsp;&nbsp;&nbsp;└── Finished? ──&gt; Stream Answer + Structured Job Cards ──&gt; [END]
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: INGESTION & EVALS */}
          {activeTab === 'ingestion' && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base">Continuous Ingestion & Ragas LLM Evals</h3>
              <p className="text-xs leading-relaxed text-slate-600">
                To keep recommendations fresh and prevent hallucinations, CareerMatch runs scheduled background jobs and automated evaluations:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-900">Ingestion Schedulers (Celery / Beat)</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    • <strong>Remotive API:</strong> Ingests verified remote software roles every hour.
                    <br />• <strong>Arbeitnow API:</strong> Ingests European &amp; global tech roles with visa sponsorship tags.
                    <br />• <strong>Adzuna API:</strong> Ingests broad market opportunities with salary normalization.
                    <br />• <strong>Deduplication:</strong> Normalizes URLs, hashes job text, and skips already indexed positions.
                  </p>
                </div>

                <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-2">
                  <div className="text-xs font-bold text-slate-900">LLM Evaluation Metrics</div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    • <strong>Faithfulness (0-1):</strong> Verifies every claim in the explanation exists in either the resume or the job posting. Target: &gt; 0.90.
                    <br />• <strong>Answer Relevancy (0-1):</strong> Measures whether recommended roles directly satisfy user seniority and skill filters. Target: &gt; 0.88.
                    <br />• <strong>Latency &amp; Token Tracking:</strong> Every call logged to <code className="bg-white px-1 rounded">llm_calls</code> with latency in milliseconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Compliant with <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-700">docs/SPEC.md</code>
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
};
