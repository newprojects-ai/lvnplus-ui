import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, AlertCircle, Send, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface Question {
  id: number;
  latex: string;
  answer: string;
}

type QuestionStatus = 'unseen' | 'seen' | 'answered' | 'flagged';

// Generate 50 questions
const questions: Question[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  latex: `${Math.floor(Math.random() * 100)} + ${Math.floor(Math.random() * 100)}`, // Example formula
  answer: ''
}));

export function TestPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [questionStatus, setQuestionStatus] = useState<{ [key: number]: QuestionStatus }>(
    questions.reduce((acc, q) => ({ ...acc, [q.id]: 'unseen' }), {})
  );

  // Group questions into sections of 10
  const questionSections = questions.reduce((acc, question) => {
    const sectionIndex = Math.floor((question.id - 1) / 10);
    if (!acc[sectionIndex]) {
      acc[sectionIndex] = [];
    }
    acc[sectionIndex].push(question);
    return acc;
  }, [] as Question[][]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerChange = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
    setQuestionStatus((prev) => ({
      ...prev,
      [questionId]: value.trim() ? 'answered' : 'seen'
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      navigate('/progress');
    }, 3000);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const navigateQuestion = (direction: 'prev' | 'next') => {
    const newQuestion = direction === 'next' 
      ? Math.min(currentQuestion + 1, questions.length)
      : Math.max(currentQuestion - 1, 1);
    setCurrentQuestion(newQuestion);
    updateQuestionStatus(newQuestion);
  };

  const jumpToQuestion = (questionId: number) => {
    setCurrentQuestion(questionId);
    updateQuestionStatus(questionId);
  };

  const updateQuestionStatus = (questionId: number) => {
    if (questionStatus[questionId] === 'unseen') {
      setQuestionStatus(prev => ({
        ...prev,
        [questionId]: 'seen'
      }));
    }
  };

  const toggleFlagged = (questionId: number) => {
    setQuestionStatus(prev => ({
      ...prev,
      [questionId]: prev[questionId] === 'flagged' 
        ? (answers[questionId] ? 'answered' : 'seen')
        : 'flagged'
    }));
  };

  const getStatusColor = (status: QuestionStatus) => {
    switch (status) {
      case 'answered': return 'bg-green-100 text-green-800 border-green-200';
      case 'seen': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'flagged': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getQuestionProgress = () => {
    const total = questions.length;
    const answered = Object.values(questionStatus).filter(status => status === 'answered').length;
    const flagged = Object.values(questionStatus).filter(status => status === 'flagged').length;
    return { total, answered, flagged };
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Test Completed!</h2>
        <p className="text-gray-600">Redirecting to your progress page...</p>
      </div>
    );
  }

  const progress = getQuestionProgress();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Mathematics Test</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Clock className="h-5 w-5" />
              <span className="font-medium">{formatTime(timeLeft)}</span>
            </div>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 flex items-center space-x-2"
            >
              <span>Submit</span>
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Question Navigation Panel */}
          <div className="w-80 bg-white rounded-lg shadow-sm p-4 flex flex-col h-[calc(100vh-12rem)]">
            {/* Progress Summary */}
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm font-medium text-gray-600 mb-2">Progress</div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2 rounded">
                  <div className="text-lg font-semibold">{progress.total}</div>
                  <div className="text-xs text-gray-500">Total</div>
                </div>
                <div className="bg-green-50 p-2 rounded">
                  <div className="text-lg font-semibold text-green-600">{progress.answered}</div>
                  <div className="text-xs text-gray-500">Answered</div>
                </div>
                <div className="bg-red-50 p-2 rounded">
                  <div className="text-lg font-semibold text-red-600">{progress.flagged}</div>
                  <div className="text-xs text-gray-500">Flagged</div>
                </div>
              </div>
            </div>

            {/* Question Grid Sections */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
              {questionSections.map((section, sectionIndex) => (
                <div key={sectionIndex}>
                  <div className="text-xs font-medium text-gray-500 mb-2">
                    Questions {sectionIndex * 10 + 1}-{Math.min((sectionIndex + 1) * 10, questions.length)}
                  </div>
                  <div className="grid grid-cols-5 gap-1">
                    {section.map((question) => (
                      <button
                        key={question.id}
                        onClick={() => jumpToQuestion(question.id)}
                        className={`p-2 rounded border text-sm ${
                          currentQuestion === question.id
                            ? 'ring-2 ring-indigo-500'
                            : ''
                        } ${getStatusColor(questionStatus[question.id])}`}
                      >
                        {question.id}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-green-100 border border-green-200"></div>
                  <span className="text-xs">Answered</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-yellow-100 border border-yellow-200"></div>
                  <span className="text-xs">Seen</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div>
                  <span className="text-xs">Flagged</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded bg-gray-100 border border-gray-200"></div>
                  <span className="text-xs">Not Seen</span>
                </div>
              </div>
            </div>
          </div>

          {/* Question Display */}
          <div className="flex-1 bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-medium">Question {currentQuestion}</h2>
              <button
                onClick={() => toggleFlagged(currentQuestion)}
                className={`p-2 rounded-md ${
                  questionStatus[currentQuestion] === 'flagged'
                    ? 'text-red-600 bg-red-50'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Flag className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-8">
              <div className="text-xl mb-4">
                <InlineMath math={questions[currentQuestion - 1].latex} />
              </div>
              <input
                type="text"
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswerChange(currentQuestion, e.target.value)}
                placeholder="Enter your answer"
                className="w-full p-3 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => navigateQuestion('prev')}
                disabled={currentQuestion === 1}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                <ChevronLeft className="h-5 w-5 mr-1" />
                Previous
              </button>
              <button
                onClick={() => navigateQuestion('next')}
                disabled={currentQuestion === questions.length}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-5 w-5 ml-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}