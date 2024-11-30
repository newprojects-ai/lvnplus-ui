export interface Subject {
  id: number;
  name: string;
}

export interface Subtopic {
  id: number;
  name: string;
  description: string;
}

export interface Topic {
  id: number;
  name: string;
  description: string;
  subject: Subject;
  subtopics: Subtopic[];
}