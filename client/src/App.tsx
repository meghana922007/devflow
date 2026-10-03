import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { ProjectProvider, useProjects } from './context/ProjectContext';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { KanbanBoard } from './components/KanbanBoard';
import { AnalyticsView } from './components/AnalyticsView';
import { TeamView } from './components/TeamView';
import { GitHubPreview } from './components/GitHubPreview';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { AddMemberModal } from './components/AddMemberModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';
import { Task } from './types';
import { Activity, Clock } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const { activeProject, loading, activities } = useProjects();

  const [activeTab, setActiveTab] = useState<ActiveTab>('kanban');
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [addMemberModalOpen, setAddMemberModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setTaskModalOpen(true);
  };

  const handleOpenNewTask = () => {
    setTaskToEdit(null);
    setTaskModalOpen(true);
  };

  return (
    <div className="app-container">
      <Navbar
        onOpenNewTaskModal={handleOpenNewTask}
        onOpenNewProjectModal={() => setProjectModalOpen(true)}
        onOpenAuthModal={() => setAuthModalOpen(true)}
      />

      <div className="app-main-layout">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="content-area">
          {loading ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#9ca3af' }}>
              Initializing DevFlow Workspace...
            </div>
          ) : !activeProject ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: '16px' }}>
              <h2 style={{ fontSize: '1.5rem' }}>No Active Project</h2>
              <p style={{ color: '#9ca3af' }}>Create a project or sign in to get started.</p>
              <button className="btn btn-primary" onClick={() => setProjectModalOpen(true)}>
                + Create First Project
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'kanban' && <KanbanBoard onEditTask={handleEditTask} />}
              {activeTab === 'analytics' && <AnalyticsView />}
              {activeTab === 'team' && <TeamView onOpenAddMemberModal={() => setAddMemberModalOpen(true)} />}
              {activeTab === 'activity' && (
                <div className="glass-panel" style={{ padding: '24px' }}>
                  <h3 style={{ fontSize: '1.2rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Activity size={20} color="#818cf8" /> Real-time Activity Log ({activities.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {activities.map((act) => (
                      <div
                        key={act.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.06)',
                          borderRadius: '10px',
                        }}
                      >
                        <img
                          src={act.user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${act.user?.name}`}
                          alt={act.user?.name}
                          style={{ width: 32, height: 32, borderRadius: '50%' }}
                        />
                        <div style={{ flex: 1 }}>
                          <span style={{ fontWeight: 600, color: '#fff' }}>{act.user?.name}</span>{' '}
                          <span style={{ color: '#d1d5db' }}>{act.details}</span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} /> {new Date(act.createdAt).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {activeTab === 'github_preview' && <GitHubPreview />}
            </>
          )}
        </main>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        taskToEdit={taskToEdit}
      />
      <ProjectModal
        isOpen={projectModalOpen}
        onClose={() => setProjectModalOpen(false)}
      />
      <AddMemberModal
        isOpen={addMemberModalOpen}
        onClose={() => setAddMemberModalOpen(false)}
      />
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ProjectProvider>
          <MainAppContent />
        </ProjectProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
