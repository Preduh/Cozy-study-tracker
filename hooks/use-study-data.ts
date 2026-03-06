'use client';

import { useState, useEffect } from 'react';
import { Subject, Area, Topic, StudySession } from '@/lib/types';

interface StudyDataState {
  subjects: Subject[];
  areas: Area[];
  topics: Topic[];
  sessions: StudySession[];
  isLoaded: boolean;
}

export function useStudyData() {
  const [state, setState] = useState<StudyDataState>({
    subjects: [],
    areas: [],
    topics: [],
    sessions: [],
    isLoaded: false,
  });

  // Load data once on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/study');
        const data = await response.json();
        
        setState({
          subjects: data.subjects || [],
          areas: data.areas || [],
          topics: data.topics.map((t: any) => ({ ...t, completed: !!t.completed })) || [],
          sessions: data.sessions || [],
          isLoaded: true,
        });
      } catch (error) {
        console.error('Failed to fetch study data:', error);
      }
    };
    
    fetchData();
  }, []);

  const addSubject = async (name: string, color: string) => {
    const newSubject: Subject = {
      id: crypto.randomUUID(),
      name,
      color,
    };
    
    try {
      await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({ type: 'subject', data: newSubject }),
      });
      setState(prev => ({ ...prev, subjects: [...prev.subjects, newSubject] }));
    } catch (error) {
      console.error('Failed to add subject:', error);
    }
  };

  const updateSubject = async (id: string, name: string, color: string) => {
    try {
      await fetch('/api/study', {
        method: 'PATCH',
        body: JSON.stringify({ type: 'subject', id, data: { name, color } }),
      });
      setState(prev => ({
        ...prev,
        subjects: prev.subjects.map(s => s.id === id ? { ...s, name, color } : s)
      }));
    } catch (error) {
      console.error('Failed to update subject:', error);
    }
  };

  const deleteSubject = async (id: string) => {
    try {
      await fetch(`/api/study?type=subject&id=${id}`, { method: 'DELETE' });
      setState(prev => ({
        ...prev,
        subjects: prev.subjects.filter(s => s.id !== id),
        areas: prev.areas.filter(a => a.subjectId !== id),
        topics: prev.topics.filter(t => !prev.areas.find(a => a.id === t.areaId && a.subjectId === id)),
      }));
    } catch (error) {
      console.error('Failed to delete subject:', error);
    }
  };

  const addArea = async (subjectId: string, name: string) => {
    const newArea: Area = {
      id: crypto.randomUUID(),
      subjectId,
      name,
    };
    
    try {
      await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({ type: 'area', data: newArea }),
      });
      setState(prev => ({ ...prev, areas: [...prev.areas, newArea] }));
    } catch (error) {
      console.error('Failed to add area:', error);
    }
  };

  const updateArea = async (id: string, name: string) => {
    try {
      await fetch('/api/study', {
        method: 'PATCH',
        body: JSON.stringify({ type: 'area', id, data: { name } }),
      });
      setState(prev => ({
        ...prev,
        areas: prev.areas.map(a => a.id === id ? { ...a, name } : a)
      }));
    } catch (error) {
      console.error('Failed to update area:', error);
    }
  };

  const deleteArea = async (id: string) => {
    try {
      await fetch(`/api/study?type=area&id=${id}`, { method: 'DELETE' });
      setState(prev => ({
        ...prev,
        areas: prev.areas.filter(a => a.id !== id),
        topics: prev.topics.filter(t => t.areaId !== id),
      }));
    } catch (error) {
      console.error('Failed to delete area:', error);
    }
  };

  const addTopic = async (areaId: string, name: string) => {
    const newTopic: Topic = {
      id: crypto.randomUUID(),
      areaId,
      name,
      totalSeconds: 0,
      completed: false,
    };
    
    try {
      await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({ type: 'topic', data: newTopic }),
      });
      setState(prev => ({ ...prev, topics: [...prev.topics, newTopic] }));
    } catch (error) {
      console.error('Failed to add topic:', error);
    }
  };

  const updateTopic = async (id: string, name: string) => {
    try {
      await fetch('/api/study', {
        method: 'PATCH',
        body: JSON.stringify({ type: 'topic', id, data: { name } }),
      });
      setState(prev => ({
        ...prev,
        topics: prev.topics.map(t => t.id === id ? { ...t, name } : t)
      }));
    } catch (error) {
      console.error('Failed to update topic:', error);
    }
  };

  const deleteTopic = async (id: string) => {
    try {
      await fetch(`/api/study?type=topic&id=${id}`, { method: 'DELETE' });
      setState(prev => ({
        ...prev,
        topics: prev.topics.filter(t => t.id !== id),
        sessions: prev.sessions.filter(s => s.topicId !== id),
      }));
    } catch (error) {
      console.error('Failed to delete topic:', error);
    }
  };

  const saveStudySession = async (topicId: string, duration: number) => {
    const newSession: StudySession = {
      id: crypto.randomUUID(),
      topicId,
      duration,
      timestamp: Date.now(),
    };
    
    try {
      await fetch('/api/study', {
        method: 'POST',
        body: JSON.stringify({ type: 'session', data: newSession }),
      });
      
      setState(prev => ({
        ...prev,
        sessions: [...prev.sessions, newSession],
        topics: prev.topics.map(t => 
          t.id === topicId ? { ...t, totalSeconds: t.totalSeconds + duration } : t
        )
      }));
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const toggleTopicCompleted = async (id: string) => {
    const topic = state.topics.find(t => t.id === id);
    if (!topic) return;
    
    const newCompleted = !topic.completed;
    
    try {
      await fetch('/api/study', {
        method: 'PATCH',
        body: JSON.stringify({ type: 'topic', id, data: { completed: newCompleted } }),
      });
      
      setState(prev => ({
        ...prev,
        topics: prev.topics.map(t => t.id === id ? { ...t, completed: newCompleted } : t)
      }));
    } catch (error) {
      console.error('Failed to toggle topic:', error);
    }
  };

  return {
    subjects: state.subjects,
    areas: state.areas,
    topics: state.topics,
    sessions: state.sessions,
    isLoaded: state.isLoaded,
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
  };
}
