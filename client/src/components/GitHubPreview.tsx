import React from 'react';
import { GitBranch, GitPullRequest, ShieldCheck, Sparkles, Cpu, CheckCircle } from 'lucide-react';

export const GitHubPreview: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
      <div className="glass-panel" style={{ padding: '24px', background: 'linear-gradient(135deg, rgba(13,19,33,0.9), rgba(99,102,241,0.15))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <GitBranch size={24} color="#38bdf8" />
          <h2 style={{ fontSize: '1.4rem' }}>GitHub Integration & CI/CD Pipelines</h2>
          <span style={{ fontSize: '0.7rem', background: '#38bdf8', color: '#000', padding: '2px 8px', borderRadius: '4px', fontWeight: 800 }}>
            MODULE 3 PREVIEW
          </span>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', maxWidth: '700px' }}>
          DevFlow acts as a centralized layer connecting GitHub Commits, Pull Requests, GitHub Actions CI/CD builds, and AI Assistant directly into your Kanban board.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {/* Card 1: Webhook Engine */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(56,189,248,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitPullRequest size={20} color="#38bdf8" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>GitHub Webhooks</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Listen to <code>push</code>, <code>pull_request</code>, and <code>issues</code> events to automatically update Kanban task statuses and branch linkings.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle size={14} /> Schema Models & Webhook Listener Designed
          </div>
        </div>

        {/* Card 2: CI/CD Monitor */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(16,185,129,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShieldCheck size={20} color="#10b981" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>GitHub Actions CI/CD</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Display test execution results (✅ Passed / ❌ Failed) live on tasks. Stream error tracebacks directly to the dashboard.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle size={14} /> Pipeline Status Badges Ready
          </div>
        </div>

        {/* Card 3: AI Developer Assistant */}
        <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 36, height: 36, borderRadius: '10px', background: 'rgba(139,92,246,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="#a855f7" />
            </div>
            <h3 style={{ fontSize: '1.1rem' }}>AI Developer Assistant</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            Summarize pull requests, diagnose broken CI/CD builds, and suggest root-cause fixes using attached LLM capabilities.
          </p>
          <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#10b981' }}>
            <CheckCircle size={14} /> LLM Prompt Architecture Prepared
          </div>
        </div>
      </div>
    </div>
  );
};
