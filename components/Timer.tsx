'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Save, Clock } from 'lucide-react';
import { formatTime, cn } from '@/lib/utils';
import { Topic, Subject } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';

interface TimerProps {
  activeTopic: Topic | null;
  activeSubject: Subject | null;
  onSave: (seconds: number) => void;
}

export default function Timer({ activeTopic, activeSubject, onSave }: TimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isActive]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
  };

  const handleSave = () => {
    if (seconds > 0) {
      onSave(seconds);
      resetTimer();
    }
  };

  if (!activeTopic) {
    return (
      <div className="cozy-card p-12 flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-20 h-20 bg-cozy-sand rounded-full flex items-center justify-center text-cozy-terracotta">
          <Clock size={40} />
        </div>
        <div>
          <h3 className="text-xl font-bold">Pronto para estudar?</h3>
          <p className="text-cozy-brown/60">Selecione uma matéria e um assunto para começar o cronômetro.</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="cozy-card p-10 md:p-16 flex flex-col items-center space-y-12 relative overflow-hidden"
    >
      {/* Background accent */}
      <div 
        className="absolute top-0 left-0 w-full h-1.5 opacity-30"
        style={{ backgroundColor: activeSubject?.color || '#d68c7a' }}
      />

      <div className="text-center space-y-4">
        <div 
          className="inline-block px-4 py-1.5 rounded-full text-[10px] font-bold text-white shadow-sm uppercase tracking-widest"
          style={{ backgroundColor: activeSubject?.color || '#d68c7a' }}
        >
          {activeSubject?.name}
        </div>
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-cozy-brown tracking-tight">{activeTopic.name}</h2>
        <p className="text-cozy-brown/40 font-bold uppercase tracking-widest text-xs">Sessão de estudo em andamento</p>
      </div>

      <div className="relative flex items-center justify-center">
        <svg className="w-72 h-72 md:w-80 md:h-80 transform -rotate-90">
          <circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-cozy-clay/20"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="45%"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray="100 100"
            pathLength="100"
            strokeDashoffset={100 - (seconds % 3600) / 36}
            strokeLinecap="round"
            className="text-cozy-brown"
            animate={{ strokeDashoffset: 100 - (seconds % 3600) / 36 }}
            transition={{ duration: 1, ease: "linear" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-7xl md:text-8xl font-serif font-bold tracking-tighter tabular-nums text-cozy-brown">
            {formatTime(seconds)}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-8">
        <button
          onClick={resetTimer}
          className="p-4 rounded-full bg-cozy-clay/20 text-cozy-brown hover:bg-cozy-clay/40 transition-all hover:scale-110 active:scale-95"
          title="Reiniciar"
        >
          <RotateCcw size={24} />
        </button>
        
        <button
          onClick={toggleTimer}
          className={cn(
            "p-8 rounded-full text-white shadow-xl transition-all transform hover:scale-110 active:scale-95",
            isActive ? "bg-cozy-brown/80" : "bg-cozy-brown"
          )}
        >
          {isActive ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={handleSave}
          disabled={seconds === 0}
          className="p-4 rounded-full bg-cozy-clay/20 text-cozy-brown hover:bg-cozy-clay/40 transition-all hover:scale-110 active:scale-95 disabled:opacity-30 disabled:hover:scale-100"
          title="Salvar tempo"
        >
          <Save size={24} />
        </button>
      </div>
    </motion.div>
  );
}
