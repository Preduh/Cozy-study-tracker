'use client';

import React, { useState } from 'react';
import { useStudyData } from '@/hooks/use-study-data';
import SubjectManager from '@/components/SubjectManager';
import Timer from '@/components/Timer';
import Dashboard from '@/components/Dashboard';
import Schedule from '@/components/Schedule';
import TimerTopicSelector from '@/components/TimerTopicSelector';
import { Topic, Subject } from '@/lib/types';
import { LayoutDashboard, Timer as TimerIcon, BookOpen, Coffee, CalendarCheck, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'timer' | 'progress' | 'subjects' | 'schedule';

export default function Home() {
  const {
    subjects,
    areas,
    topics,
    sessions,
    isLoaded,
    addSubject,
    updateSubject,
    deleteSubject,
    addArea,
    updateArea,
    deleteArea,
    addTopic,
    updateTopic,
    deleteTopic,
    saveStudySession,
    toggleTopicCompleted,
  } = useStudyData();

  const [activeTab, setActiveTab] = useState<Tab>('timer');
  const [activeTopic, setActiveTopic] = useState<Topic | null>(null);
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);

  const handleSelectTopic = (topic: Topic, subject: Subject) => {
    setActiveTopic(topic);
    setActiveSubject(subject);
    setActiveTab('timer');
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f9f4ef]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-cozy-wood"
        >
          <Coffee size={48} />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header Container - Full Width */}
      <div className="w-full border-b border-cozy-clay/30 bg-cozy-cream/80 backdrop-blur-md sticky top-0 z-50">
        <header className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setActiveTab('timer')}
          >
            <div className="w-10 h-10 bg-cozy-clay text-cozy-brown rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
              <Coffee size={20} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-bold tracking-tight text-cozy-brown leading-none">Cozy Study</h1>
              <p className="text-[10px] uppercase tracking-widest text-cozy-brown/40 font-bold mt-1">Março 2026</p>
            </div>
          </div>

          {/* Navigation - Pill Shape like screenshot */}
          <nav className="flex bg-cozy-clay/20 p-1 rounded-full border border-cozy-clay/30">
            <button
              onClick={() => setActiveTab('timer')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                activeTab === 'timer' ? "bg-cozy-brown text-white shadow-sm" : "text-cozy-brown/60 hover:text-cozy-brown"
              )}
            >
              Cronômetro
            </button>
            <button
              onClick={() => setActiveTab('subjects')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                activeTab === 'subjects' ? "bg-cozy-brown text-white shadow-sm" : "text-cozy-brown/60 hover:text-cozy-brown"
              )}
            >
              Matérias
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                activeTab === 'schedule' ? "bg-cozy-brown text-white shadow-sm" : "text-cozy-brown/60 hover:text-cozy-brown"
              )}
            >
              Cronograma
            </button>
            <button
              onClick={() => setActiveTab('progress')}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer",
                activeTab === 'progress' ? "bg-cozy-brown text-white shadow-sm" : "text-cozy-brown/60 hover:text-cozy-brown"
              )}
            >
              Progresso
            </button>
          </nav>
        </header>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <main>
        <AnimatePresence mode="wait">
          {activeTab === 'timer' && (
            <motion.div
              key="timer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full"
            >
              {activeTopic ? (
                <div className="max-w-2xl mx-auto space-y-8">
                  <button 
                    onClick={() => setActiveTopic(null)}
                    className="flex items-center gap-2 text-cozy-brown/60 hover:text-cozy-wood transition-colors font-bold text-sm px-2"
                  >
                    <ChevronLeft size={20} />
                    Trocar assunto
                  </button>
                  <Timer 
                    activeTopic={activeTopic} 
                    activeSubject={activeSubject}
                    onSave={(seconds) => activeTopic && saveStudySession(activeTopic.id, seconds)}
                  />
                </div>
              ) : (
                <TimerTopicSelector 
                  subjects={subjects}
                  areas={areas}
                  topics={topics}
                  onSelectTopic={handleSelectTopic}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'subjects' && (
            <motion.div
              key="subjects"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto w-full"
            >
              <SubjectManager 
                subjects={subjects}
                areas={areas}
                topics={topics}
                onAddSubject={addSubject}
                onUpdateSubject={updateSubject}
                onDeleteSubject={deleteSubject}
                onAddArea={addArea}
                onUpdateArea={updateArea}
                onDeleteArea={deleteArea}
                onAddTopic={addTopic}
                onUpdateTopic={updateTopic}
                onDeleteTopic={deleteTopic}
                onSelectTopic={handleSelectTopic}
                activeTopicId={activeTopic?.id}
              />
            </motion.div>
          )}

          {activeTab === 'schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto w-full"
            >
              <Schedule 
                subjects={subjects}
                areas={areas}
                topics={topics}
                onToggle={toggleTopicCompleted}
              />
            </motion.div>
          )}

          {activeTab === 'progress' && (
            <motion.div
              key="progress"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Dashboard 
                subjects={subjects}
                areas={areas}
                topics={topics}
                sessions={sessions}
              />
            </motion.div>
          )}
        </AnimatePresence>
        </main>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-cozy-clay/20 text-center text-cozy-brown/40 text-sm">
        <p>Feito com carinho para seus momentos de foco. ☕️</p>
      </footer>
    </div>
  );
}
