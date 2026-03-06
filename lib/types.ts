export interface Subject {
  id: string;
  name: string;
  color: string;
}

export interface Area {
  id: string;
  subjectId: string;
  name: string;
}

export interface Topic {
  id: string;
  areaId: string;
  name: string;
  totalSeconds: number;
  completed: boolean;
}

export interface StudySession {
  id: string;
  topicId: string;
  duration: number;
  timestamp: number;
}
