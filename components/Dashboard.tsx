'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { Subject, Topic, StudySession, Area } from '@/lib/types';
import { formatDuration } from '@/lib/utils';
import { TrendingUp, Clock, BookOpen, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  subjects: Subject[];
  areas: Area[];
  topics: Topic[];
  sessions: StudySession[];
}

export default function Dashboard({ subjects, areas, topics, sessions }: DashboardProps) {
  // Calculate total time per subject
  const subjectData = subjects.map(subject => {
    const subjectAreas = areas.filter(a => a.subjectId === subject.id);
    const subjectTopics = topics.filter(t => subjectAreas.some(a => a.id === t.areaId));
    const totalSeconds = subjectTopics.reduce((acc, t) => acc + t.totalSeconds, 0);
    return {
      name: subject.name,
      seconds: totalSeconds,
      color: subject.color,
      formatted: formatDuration(totalSeconds)
    };
  }).filter(d => d.seconds > 0);

  // Calculate total time per topic (top 5)
  const topTopics = [...topics]
    .sort((a, b) => b.totalSeconds - a.totalSeconds)
    .slice(0, 5)
    .map(topic => ({
      name: topic.name,
      seconds: topic.totalSeconds,
      formatted: formatDuration(topic.totalSeconds)
    }))
    .filter(d => d.seconds > 0);

  const totalStudyTime = topics.reduce((acc, t) => acc + t.totalSeconds, 0);
  const totalSessions = sessions.length;
  
  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
    const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();
    
    const daySessions = sessions.filter(s => s.timestamp >= startOfDay && s.timestamp <= endOfDay);
    const daySeconds = daySessions.reduce((acc, s) => acc + s.duration, 0);
    
    return {
      date: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
      seconds: daySeconds,
      hours: Number((daySeconds / 3600).toFixed(1))
    };
  }).reverse();

  return (
    <div className="space-y-8 pb-12">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="cozy-card p-8 flex items-center gap-6">
          <div className="p-4 bg-cozy-clay/20 text-cozy-brown rounded-2xl">
            <Clock size={28} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-cozy-brown/30 mb-1">Tempo Total</p>
            <p className="text-3xl font-serif font-bold text-cozy-brown">{formatDuration(totalStudyTime)}</p>
          </div>
        </div>
        <div className="cozy-card p-8 flex items-center gap-6">
          <div className="p-4 bg-cozy-clay/20 text-cozy-brown rounded-2xl">
            <TrendingUp size={28} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-cozy-brown/30 mb-1">Sessões</p>
            <p className="text-3xl font-serif font-bold text-cozy-brown">{totalSessions}</p>
          </div>
        </div>
        <div className="cozy-card p-8 flex items-center gap-6">
          <div className="p-4 bg-cozy-clay/20 text-cozy-brown rounded-2xl">
            <BookOpen size={28} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-widest font-bold text-cozy-brown/30 mb-1">Matérias</p>
            <p className="text-3xl font-serif font-bold text-cozy-brown">{subjects.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weekly Activity */}
        <div className="cozy-card p-8">
          <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-3 text-cozy-brown">
            <Calendar size={24} className="text-cozy-brown/30" />
            Atividade Semanal
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e8e4de" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#4a3728', fontSize: 10, fontWeight: 700 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#4a3728', fontSize: 10, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: '#f4e9dc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}
                />
                <Bar dataKey="hours" fill="#4a3728" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Distribution by Subject */}
        <div className="cozy-card p-8">
          <h3 className="text-xl font-serif font-bold mb-8 flex items-center gap-3 text-cozy-brown">
            <TrendingUp size={24} className="text-cozy-brown/30" />
            Distribuição por Matéria
          </h3>
          <div className="h-64 flex items-center justify-center">
            {subjectData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="seconds"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => value ? formatDuration(Number(value)) : ''}
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', fontFamily: 'var(--font-sans)', fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-cozy-brown/30 italic font-medium">Nenhum dado para exibir</p>
            )}
          </div>
        </div>
      </div>

      {/* Top Topics List */}
      <div className="cozy-card p-8">
        <h3 className="text-xl font-serif font-bold mb-8">Assuntos mais estudados</h3>
        <div className="space-y-6">
          {topTopics.length > 0 ? (
            topTopics.map((topic, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-6 flex-1">
                  <span className="text-cozy-brown/20 font-serif font-bold text-2xl w-8">0{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-bold text-cozy-brown">{topic.name}</p>
                    <div className="w-full bg-cozy-clay/20 h-2 rounded-full mt-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(topic.seconds / topTopics[0].seconds) * 100}%` }}
                        className="bg-cozy-brown h-full rounded-full"
                      />
                    </div>
                  </div>
                </div>
                <span className="ml-6 font-mono text-xs font-bold text-cozy-brown/40">{topic.formatted}</span>
              </div>
            ))
          ) : (
            <p className="text-center py-8 text-cozy-brown/30 italic font-medium">Comece a estudar para ver seu progresso!</p>
          )}
        </div>
      </div>
    </div>
  );
}
