'use client';

import React, { useState, useMemo } from 'react';
import { Subject, Area, Topic } from '@/lib/types';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import { BookOpen, ChevronRight, Hash } from 'lucide-react';
import SearchInput from './SearchInput';

interface TimerTopicSelectorProps {
  subjects: Subject[];
  areas: Area[];
  topics: Topic[];
  onSelectTopic: (topic: Topic, subject: Subject) => void;
}

export default function TimerTopicSelector({ subjects, areas, topics, onSelectTopic }: TimerTopicSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    return subjects.map(subject => {
      const subjectAreas = areas.filter(a => a.subjectId === subject.id);
      const filteredAreas = subjectAreas.map(area => {
        const areaTopics = topics.filter(t => t.areaId === area.id);
        const filteredTopics = areaTopics.filter(topic => 
          topic.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          subject.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...area, topics: filteredTopics };
      }).filter(area => area.topics.length > 0);

      return { ...subject, areas: filteredAreas };
    }).filter(subject => subject.areas.length > 0);
  }, [subjects, areas, topics, searchTerm]);

  return (
    <div className="space-y-12">
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-serif font-bold text-cozy-brown tracking-tight">O que vamos estudar hoje?</h2>
          <p className="text-cozy-brown/50 font-medium">Selecione um assunto para iniciar seu cronômetro.</p>
        </div>

        <div className="max-w-md mx-auto">
          <SearchInput
            placeholder="Pesquisar matéria, área ou assunto..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-16">
        {filteredData.map((subject) => {
          return (
            <div key={subject.id} className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <div className="w-5 h-5 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: subject.color }} />
                <h3 className="text-2xl font-serif font-bold text-cozy-brown">{subject.name}</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subject.areas.map((area) => {
                  return (
                    <motion.div
                      key={area.id}
                      whileHover={{ y: -4 }}
                      transition={{ duration: 0.2 }}
                      className="cozy-card p-6 flex flex-col h-full cursor-pointer border-transparent hover:border-cozy-clay/50 transition-colors"
                    >
                      <div className="mb-6">
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cozy-brown/30 block mb-2">Área de Estudo</span>
                        <h4 className="text-xl font-serif font-bold text-cozy-brown leading-tight">{area.name}</h4>
                      </div>

                      <div className="space-y-2 flex-1">
                        {area.topics.map((topic) => (
                          <button
                            key={topic.id}
                            onClick={() => onSelectTopic(topic, subject)}
                            className={cn(
                              "w-full flex items-center justify-between p-3 rounded-xl transition-all group text-left cursor-pointer",
                              topic.completed ? "opacity-40" : "hover:bg-cozy-clay/10"
                            )}
                          >
                            <div className="flex items-center gap-3 overflow-hidden">
                              <Hash size={14} className="text-cozy-brown/20 flex-shrink-0" />
                              <span className="text-sm font-semibold text-cozy-brown/80 group-hover:text-cozy-brown truncate">{topic.name}</span>
                            </div>
                            <ChevronRight size={16} className="text-cozy-brown/10 group-hover:text-cozy-brown/40 transition-colors flex-shrink-0" />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="cozy-card p-12 text-center space-y-4">
          <BookOpen size={48} className="mx-auto text-cozy-clay/40" />
          <p className="text-cozy-brown/60 italic">
            {searchTerm ? "Nenhum resultado encontrado para sua pesquisa." : "Você ainda não cadastrou nenhuma matéria."}
          </p>
          {!searchTerm && <p className="text-sm">Vá para a aba &quot;Matérias&quot; para começar.</p>}
        </div>
      )}
    </div>
  );
}
