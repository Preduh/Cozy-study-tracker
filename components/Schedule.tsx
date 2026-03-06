'use client';

import React, { useState, useMemo } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { Subject, Topic, Area } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import SearchInput from './SearchInput';

interface ScheduleProps {
  subjects: Subject[];
  areas: Area[];
  topics: Topic[];
  onToggle: (id: string) => void;
}

export default function Schedule({ subjects, areas, topics, onToggle }: ScheduleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});
  const [expandedAreas, setExpandedAreas] = useState<Record<string, boolean>>({});

  // Expand the first uncompleted topic on initial load
  React.useEffect(() => {
    const firstUncompleted = topics.find(t => !t.completed);
    if (firstUncompleted) {
      const area = areas.find(a => a.id === firstUncompleted.areaId);
      if (area) {
        setExpandedCategories({ [area.subjectId]: true });
        setExpandedAreas({ [area.id]: true });
      }
    }
  }, [topics, areas]);

  const filteredData = useMemo(() => {
    const result: Record<string, { 
      subject: Subject, 
      areas: Record<string, { area: Area, topics: Topic[] }> 
    }> = {};
    
    subjects.forEach(subject => {
      const subjectAreas = areas.filter(a => a.subjectId === subject.id);
      const areaMap: Record<string, { area: Area, topics: Topic[] }> = {};
      
      subjectAreas.forEach(area => {
        const areaTopics = topics.filter(t => t.areaId === area.id);
        const filteredTopics = areaTopics.filter(item => {
          const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                               area.name.toLowerCase().includes(searchTerm.toLowerCase());
          const matchesFilter = 
            filter === 'all' || 
            (filter === 'completed' && item.completed) || 
            (filter === 'pending' && !item.completed);
          return matchesSearch && matchesFilter;
        });
        
        if (filteredTopics.length > 0) {
          areaMap[area.id] = { area, topics: filteredTopics };
        }
      });
      
      if (Object.keys(areaMap).length > 0) {
        result[subject.id] = { subject, areas: areaMap };
      }
    });
    
    return result;
  }, [subjects, areas, topics, searchTerm, filter]);

  const toggleCategory = (id: string) => {
    setExpandedCategories(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const toggleArea = (id: string) => {
    setExpandedAreas(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const totalItems = topics.length;
  const completedItems = topics.filter(i => i.completed).length;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Progress Header */}
      <div className="cozy-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-serif font-bold text-cozy-brown">Meu Cronograma</h3>
            <p className="text-cozy-brown/40 text-sm font-medium">Acompanhe seu progresso em todas as matérias.</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-serif font-bold text-cozy-brown">{Math.round(progress)}%</span>
            <p className="text-[10px] uppercase tracking-widest font-bold text-cozy-brown/30">{completedItems} de {totalItems} concluídos</p>
          </div>
        </div>
        <div className="w-full bg-cozy-sand h-3 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            className="bg-cozy-wood h-full"
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <SearchInput
            placeholder="Buscar assunto ou área..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex bg-cozy-clay/20 p-1 rounded-full border border-cozy-clay/30">
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-4 py-1.5 rounded-full text-xs font-bold transition-all capitalize",
                filter === f ? "bg-cozy-brown text-white shadow-sm" : "text-cozy-brown/60 hover:text-cozy-brown"
              )}
            >
              {f === 'all' ? 'Todos' : f === 'pending' ? 'Pendentes' : 'Concluídos'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {Object.entries(filteredData).map(([subjectId, { subject, areas: subjectAreas }]) => {
          const isExpanded = !!expandedCategories[subjectId];
          const subjectTopics = Object.values(subjectAreas).flatMap(a => a.topics);
          const categoryCompleted = subjectTopics.filter(i => i.completed).length;
          const categoryTotal = subjectTopics.length;

          return (
            <div key={subjectId} className="cozy-card overflow-hidden">
              <button
                onClick={() => toggleCategory(subjectId)}
                className="w-full p-4 flex items-center justify-between hover:bg-cozy-sand/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full shadow-sm border border-white" style={{ backgroundColor: subject.color }} />
                  <h4 className="font-serif font-bold text-cozy-brown">{subject.name}</h4>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-cozy-brown/30">
                    {categoryCompleted}/{categoryTotal}
                  </span>
                </div>
                {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-cozy-clay/10"
                  >
                    <div className="p-4 space-y-4">
                      {Object.entries(subjectAreas).map(([areaId, { area, topics: areaTopics }]) => {
                        const isAreaExpanded = !!expandedAreas[areaId];
                        const areaCompleted = areaTopics.filter(i => i.completed).length;
                        const areaTotal = areaTopics.length;

                        return (
                          <div key={areaId} className="border border-cozy-clay/10 rounded-2xl overflow-hidden bg-cozy-sand/5">
                            <button
                              onClick={() => toggleArea(areaId)}
                              className="w-full p-3 flex items-center justify-between hover:bg-cozy-sand/20 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-cozy-brown/70">{area.name}</span>
                                <span className="text-[10px] text-cozy-brown/40">
                                  ({areaCompleted}/{areaTotal})
                                </span>
                              </div>
                              {isAreaExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>

                            <AnimatePresence>
                              {isAreaExpanded && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="border-t border-cozy-clay/5 bg-white/30"
                                >
                                  <div className="p-2 space-y-1">
                                    {areaTopics.map((item) => (
                                      <button
                                        key={item.id}
                                        onClick={() => onToggle(item.id)}
                                        className={cn(
                                          "w-full flex items-center gap-4 p-3 rounded-xl transition-all text-left group",
                                          item.completed ? "bg-cozy-sage/5 text-cozy-brown/50" : "hover:bg-cozy-sand"
                                        )}
                                      >
                                        <div className={cn(
                                          "transition-colors",
                                          item.completed ? "text-cozy-sage" : "text-cozy-brown/20 group-hover:text-cozy-brown/40"
                                        )}>
                                          {item.completed ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                                        </div>
                                        <span className={cn(
                                          "text-sm font-medium",
                                          item.completed && "line-through"
                                        )}>
                                          {item.name}
                                        </span>
                                      </button>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {Object.keys(filteredData).length === 0 && (
          <div className="text-center py-20 text-cozy-brown/40 italic">
            Nenhum assunto encontrado para sua busca.
          </div>
        )}
      </div>
    </div>
  );
}
