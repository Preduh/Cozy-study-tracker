'use client';

import React, { useState, useMemo } from 'react';
import { Plus, Trash2, BookOpen, ChevronRight, Hash, Edit2, Check, X } from 'lucide-react';
import { Subject, Topic, Area } from '@/lib/types';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import SearchInput from './SearchInput';

interface SubjectManagerProps {
  subjects: Subject[];
  areas: Area[];
  topics: Topic[];
  onAddSubject: (name: string, color: string) => void;
  onUpdateSubject: (id: string, name: string, color: string) => void;
  onDeleteSubject: (id: string) => void;
  onAddArea: (subjectId: string, name: string) => void;
  onUpdateArea: (id: string, name: string) => void;
  onDeleteArea: (id: string) => void;
  onAddTopic: (areaId: string, name: string) => void;
  onUpdateTopic: (id: string, name: string) => void;
  onDeleteTopic: (id: string) => void;
  onSelectTopic: (topic: Topic, subject: Subject) => void;
  activeTopicId?: string;
}

const COLORS = [
  '#d68c7a', // Terracotta
  '#a8b5a2', // Sage
  '#e6d5c3', // Clay
  '#94a3b8', // Slate
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#10b981', // Emerald
];

export default function SubjectManager({
  subjects,
  areas,
  topics,
  onAddSubject,
  onUpdateSubject,
  onDeleteSubject,
  onAddArea,
  onUpdateArea,
  onDeleteArea,
  onAddTopic,
  onUpdateTopic,
  onDeleteTopic,
  onSelectTopic,
  activeTopicId
}: SubjectManagerProps) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [expandedArea, setExpandedArea] = useState<string | null>(null);
  const [newAreaName, setNewAreaName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [editingSubjectId, setEditingSubjectId] = useState<string | null>(null);
  const [editSubjectName, setEditSubjectName] = useState('');
  const [editSubjectColor, setEditSubjectColor] = useState('');

  const [editingAreaId, setEditingAreaId] = useState<string | null>(null);
  const [editAreaName, setEditAreaName] = useState('');

  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [editTopicName, setEditTopicName] = useState('');

  const filteredSubjects = useMemo(() => {
    return subjects.filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      areas.some(a => a.subjectId === s.id && a.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      topics.some(t => {
        const area = areas.find(a => a.id === t.areaId);
        return area?.subjectId === s.id && t.name.toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, [subjects, areas, topics, searchTerm]);

  const handleAddSubject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      onAddSubject(newSubjectName.trim(), selectedColor);
      setNewSubjectName('');
    }
  };

  const handleAddArea = (subjectId: string) => {
    if (newAreaName.trim()) {
      onAddArea(subjectId, newAreaName.trim());
      setNewAreaName('');
    }
  };

  const handleAddTopic = (areaId: string) => {
    if (newTopicName.trim()) {
      onAddTopic(areaId, newTopicName.trim());
      setNewTopicName('');
    }
  };

  const startEditingSubject = (subject: Subject) => {
    setEditingSubjectId(subject.id);
    setEditSubjectName(subject.name);
    setEditSubjectColor(subject.color);
  };

  const saveSubjectEdit = (id: string) => {
    if (editSubjectName.trim()) {
      onUpdateSubject(id, editSubjectName.trim(), editSubjectColor);
      setEditingSubjectId(null);
    }
  };

  const startEditingArea = (area: Area) => {
    setEditingAreaId(area.id);
    setEditAreaName(area.name);
  };

  const saveAreaEdit = (id: string) => {
    if (editAreaName.trim()) {
      onUpdateArea(id, editAreaName.trim());
      setEditingAreaId(null);
    }
  };

  const startEditingTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setEditTopicName(topic.name);
  };

  const saveTopicEdit = (id: string) => {
    if (editTopicName.trim()) {
      onUpdateTopic(id, editTopicName.trim());
      setEditingTopicId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Nova Matéria Section */}
      <div className="cozy-card p-6">
        <button 
          onClick={() => setExpandedSubject(expandedSubject === 'new' ? null : 'new')}
          className="w-full flex items-center justify-between text-xl font-serif font-bold text-cozy-brown cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cozy-clay/30 flex items-center justify-center">
              <Plus size={18} className="text-cozy-brown" />
            </div>
            Nova Matéria
          </div>
          <motion.div animate={{ rotate: expandedSubject === 'new' ? 90 : 0 }}>
            <ChevronRight size={20} className="text-cozy-brown/30" />
          </motion.div>
        </button>
        
        <AnimatePresence>
          {expandedSubject === 'new' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-4"
            >
              <form onSubmit={handleAddSubject} className="space-y-4">
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Ex: Biologia, Química..."
                  className="cozy-input"
                />
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        "w-6 h-6 rounded-full transition-all border-2 cursor-pointer",
                        selectedColor === color ? "border-cozy-brown scale-110" : "border-transparent"
                      )}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <button type="submit" className="cozy-button-primary w-full py-2 text-sm cursor-pointer">
                  Adicionar Matéria
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Minhas Matérias Section */}
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
          <h3 className="text-2xl font-serif font-bold flex items-center gap-3 text-cozy-brown">
            <BookOpen size={24} className="text-cozy-brown/40" />
            Minhas Matérias
          </h3>
          <div className="max-w-xs w-full">
            <SearchInput
              placeholder="Pesquisar matérias..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredSubjects.map((subject) => (
              <motion.div
                key={subject.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "cozy-card overflow-hidden h-fit border-transparent hover:border-cozy-wood/20 transition-all"
                )}
              >
                {editingSubjectId === subject.id ? (
                  <div className="p-4 space-y-4 bg-cozy-sand/20">
                    <input
                      type="text"
                      value={editSubjectName}
                      onChange={(e) => setEditSubjectName(e.target.value)}
                      className="cozy-input"
                    />
                    <div className="flex flex-wrap gap-2">
                      {COLORS.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setEditSubjectColor(color)}
                          className={cn(
                            "w-6 h-6 rounded-full transition-all border-2 cursor-pointer",
                            editSubjectColor === color ? "border-cozy-brown scale-110" : "border-transparent"
                          )}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => saveSubjectEdit(subject.id)} className="flex-1 bg-cozy-sage text-white p-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer">
                        <Check size={16} /> Salvar
                      </button>
                      <button onClick={() => setEditingSubjectId(null)} className="flex-1 bg-cozy-clay/30 text-cozy-brown p-2 rounded-xl flex items-center justify-center gap-1 cursor-pointer">
                        <X size={16} /> Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div 
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-cozy-sand/30 transition-colors"
                    onClick={() => setExpandedSubject(expandedSubject === subject.id ? null : subject.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-5 h-5 rounded-full shadow-sm border-2 border-white" style={{ backgroundColor: subject.color }} />
                      <div>
                        <span className="font-serif font-bold text-lg block leading-tight text-cozy-brown">{subject.name}</span>
                        <span className="text-[10px] text-cozy-brown/30 font-bold uppercase tracking-widest">
                          {areas.filter(a => a.subjectId === subject.id).length} áreas
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startEditingSubject(subject);
                        }}
                        className="p-2 text-cozy-brown/30 hover:text-cozy-sage transition-colors cursor-pointer"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSubject(subject.id);
                        }}
                        className="p-2 text-cozy-brown/30 hover:text-cozy-terracotta transition-colors cursor-pointer"
                      >
                        <Trash2 size={18} />
                      </button>
                      <motion.div
                        animate={{ rotate: expandedSubject === subject.id ? 90 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronRight size={22} className="text-cozy-brown/30" />
                      </motion.div>
                    </div>
                  </div>
                )}

                <AnimatePresence>
                  {expandedSubject === subject.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="border-t border-cozy-clay/20 bg-cozy-sand/10"
                    >
                      <div className="p-5 space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newAreaName}
                            onChange={(e) => setNewAreaName(e.target.value)}
                            placeholder="Nova área (ex: Bioquímica)..."
                            className="cozy-input py-2 text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddArea(subject.id)}
                          />
                          <button
                            onClick={() => handleAddArea(subject.id)}
                            className="p-2 bg-cozy-wood text-white rounded-xl hover:bg-cozy-wood/90 cursor-pointer"
                          >
                            <Plus size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {areas
                            .filter((a) => a.subjectId === subject.id)
                            .map((area) => (
                              <div key={area.id} className="border border-cozy-clay/20 rounded-2xl overflow-hidden bg-white/50 shadow-sm hover:shadow-md transition-shadow">
                                <div 
                                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-cozy-sand/50 transition-colors"
                                  onClick={() => setExpandedArea(expandedArea === area.id ? null : area.id)}
                                >
                                  {editingAreaId === area.id ? (
                                    <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                                      <input
                                        type="text"
                                        value={editAreaName}
                                        onChange={(e) => setEditAreaName(e.target.value)}
                                        className="cozy-input py-1 text-xs"
                                        autoFocus
                                        onKeyDown={(e) => e.key === 'Enter' && saveAreaEdit(area.id)}
                                      />
                                      <button onClick={() => saveAreaEdit(area.id)} className="text-cozy-sage cursor-pointer"><Check size={16}/></button>
                                      <button onClick={() => setEditingAreaId(null)} className="text-cozy-terracotta cursor-pointer"><X size={16}/></button>
                                    </div>
                                  ) : (
                                    <>
                                      <div className="flex items-center gap-2">
                                        <span className="text-base font-bold text-cozy-brown/70">{area.name}</span>
                                        <span className="text-[10px] text-cozy-brown/40 font-bold uppercase tracking-wider">
                                          {topics.filter(t => t.areaId === area.id).length} itens
                                        </span>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startEditingArea(area);
                                          }}
                                          className="p-1.5 text-cozy-brown/30 hover:text-cozy-sage transition-colors cursor-pointer"
                                        >
                                          <Edit2 size={14} />
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onDeleteArea(area.id);
                                          }}
                                          className="p-1.5 text-cozy-brown/30 hover:text-cozy-terracotta transition-colors cursor-pointer"
                                        >
                                          <Trash2 size={14} />
                                        </button>
                                        <motion.div 
                                          animate={{ rotate: expandedArea === area.id ? 90 : 0 }}
                                          transition={{ duration: 0.2 }}
                                        >
                                          <ChevronRight size={16} className="text-cozy-brown/30" />
                                        </motion.div>
                                      </div>
                                    </>
                                  )}
                                </div>

                                <AnimatePresence>
                                  {expandedArea === area.id && (
                                    <motion.div
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      transition={{ duration: 0.2 }}
                                      className="border-t border-cozy-clay/10 bg-white/30"
                                    >
                                      <div className="p-4 space-y-3">
                                        <div className="flex gap-2">
                                          <input
                                            type="text"
                                            value={newTopicName}
                                            onChange={(e) => setNewTopicName(e.target.value)}
                                            placeholder="Novo conteúdo..."
                                            className="cozy-input py-1.5 text-xs"
                                            onKeyDown={(e) => e.key === 'Enter' && handleAddTopic(area.id)}
                                          />
                                          <button
                                            onClick={() => handleAddTopic(area.id)}
                                            className="p-1.5 bg-cozy-wood text-white rounded-lg hover:bg-cozy-wood/90 cursor-pointer"
                                          >
                                            <Plus size={18} />
                                          </button>
                                        </div>

                                        <div className="space-y-1">
                                          {topics
                                            .filter((t) => t.areaId === area.id)
                                            .map((topic) => (
                                              <div
                                                key={topic.id}
                                                className={cn(
                                                  "group flex items-center justify-between p-2.5 rounded-xl transition-all cursor-pointer",
                                                  activeTopicId === topic.id 
                                                    ? "bg-cozy-wood text-white shadow-sm" 
                                                    : "hover:bg-cozy-sand text-cozy-brown/80"
                                                )}
                                                onClick={() => onSelectTopic(topic, subject)}
                                              >
                                                {editingTopicId === topic.id ? (
                                                  <div className="flex items-center gap-2 w-full" onClick={(e) => e.stopPropagation()}>
                                                    <input
                                                      type="text"
                                                      value={editTopicName}
                                                      onChange={(e) => setEditTopicName(e.target.value)}
                                                      className="cozy-input py-1 text-xs text-cozy-brown"
                                                      autoFocus
                                                      onKeyDown={(e) => e.key === 'Enter' && saveTopicEdit(topic.id)}
                                                    />
                                                    <button onClick={() => saveTopicEdit(topic.id)} className="text-cozy-sage cursor-pointer"><Check size={14}/></button>
                                                    <button onClick={() => setEditingTopicId(null)} className="text-cozy-terracotta cursor-pointer"><X size={14}/></button>
                                                  </div>
                                                ) : (
                                                  <>
                                                    <div className="flex items-center gap-2">
                                                      <Hash size={14} className={activeTopicId === topic.id ? "text-white/60" : "text-cozy-brown/30"} />
                                                      <span className="text-sm font-medium">{topic.name}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          startEditingTopic(topic);
                                                        }}
                                                        className={cn(
                                                          "p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                                                          activeTopicId === topic.id ? "text-white/60 hover:text-white" : "text-cozy-brown/30 hover:text-cozy-sage"
                                                        )}
                                                      >
                                                        <Edit2 size={14} />
                                                      </button>
                                                      <button
                                                        onClick={(e) => {
                                                          e.stopPropagation();
                                                          onDeleteTopic(topic.id);
                                                        }}
                                                        className={cn(
                                                          "p-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer",
                                                          activeTopicId === topic.id ? "text-white/60 hover:text-white" : "text-cozy-brown/30 hover:text-cozy-terracotta"
                                                        )}
                                                      >
                                                        <Trash2 size={14} />
                                                      </button>
                                                    </div>
                                                  </>
                                                )}
                                              </div>
                                            ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        {filteredSubjects.length === 0 && (
          <div className="text-center py-12 text-cozy-brown/40 italic">
            {searchTerm ? "Nenhum resultado encontrado para sua pesquisa." : "Nenhuma matéria cadastrada ainda."}
          </div>
        )}
      </div>
    </div>
  );
}
