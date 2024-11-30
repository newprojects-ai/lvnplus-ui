import React from 'react';
import { Flag, Check, MinusCircle } from 'lucide-react';

interface QuestionNavigationProps {
  totalQuestions: number;
  currentQuestion: number;
  questionStatus: Record<number, 'unseen' | 'seen' | 'answered' | 'flagged'>;
  onQuestionSelect: (index: number) => void;
}

export function QuestionNavigation({
  totalQuestions,
  currentQuestion,
  questionStatus,
  onQuestionSelect,
}: QuestionNavigationProps) {
  const getStatusColor = (status: string, isActive: boolean) => {
    if (isActive) return 'ring-2 ring-indigo-500';
    
    switch (status) {
      case 'answered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'seen':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'flagged':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'answered':
        return <Check className="h-3 w-3" />;
      case 'flagged':
        return <Flag className="h-3 w-3" />;
      case 'seen':
        return <MinusCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  // Group questions into sections of 5
  const sections = Array.from(
    { length: Math.ceil(totalQuestions / 5) },
    (_, sectionIndex) => {
      const start = sectionIndex * 5;
      return Array.from(
        { length: Math.min(5, totalQuestions - start) },
        (_, i) => start + i + 1
      );
    }
  );

  return (
    <div className="space-y-4">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          <div className="text-xs font-medium text-gray-500 mb-2">
            Questions {section[0]}-{section[section.length - 1]}
          </div>
          <div className="grid grid-cols-5 gap-1">
            {section.map((questionNumber) => (
              <button
                key={questionNumber}
                onClick={() => onQuestionSelect(questionNumber - 1)}
                className={`p-2 rounded border text-sm flex items-center justify-center ${
                  getStatusColor(
                    questionStatus[questionNumber] || 'unseen',
                    currentQuestion === questionNumber - 1
                  )
                }`}
              >
                {getStatusIcon(questionStatus[questionNumber]) || questionNumber}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}