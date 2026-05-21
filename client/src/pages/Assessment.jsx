import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  CheckCircle,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Zap,
  BookOpen,
  ClipboardList,
  Award,
  SkipForward,
  RotateCcw,
} from 'lucide-react';

const API_BASE_URL = 'https://skillgap-analyzer-server.onrender.com/api'

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export default function Assessment() {
  const [assessmentData, setAssessmentData] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [stepCompleted, setStepCompleted] = useState({});
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useAuth();
  const api = createAxiosInstance(token);

  useEffect(() => {
    if (token) {
      fetchAssessmentData();
    }
  }, [token]);

  const fetchAssessmentData = async () => {
    try {
      const skillName = location.state?.skillName || 'MERN Stack';
      const response = await api.get(`/assessments/skill/${skillName}`);

      if (response.data) {
        setAssessmentData(response.data);
      } else {
        setAssessmentData(generateMockAssessment(skillName));
      }
    } catch (err) {
      console.error('Error fetching assessment:', err);
      const skillName = location.state?.skillName || 'MERN Stack';
      setAssessmentData(generateMockAssessment(skillName));
    } finally {
      setLoading(false);
    }
  };

  const generateMockAssessment = (skillName) => {
    return {
      _id: 'mock-' + skillName,
      skillName: skillName,
      learningSteps: [
        {
          id: 1,
          title: 'Understanding Basics',
          description: 'Learn the fundamental concepts and core principles',
          duration: 120,
          resources: [
            {
              title: 'Introduction Video',
              link: 'https://youtube.com/watch?v=dQw4w9WgXcQ',
              type: 'video',
            },
            {
              title: 'Official Documentation',
              link: 'https://docs.example.com',
              type: 'article',
            },
          ],
        },
        {
          id: 2,
          title: 'Practical Implementation',
          description: 'Hands-on practice with real-world scenarios',
          duration: 180,
          resources: [
            {
              title: 'Tutorial Project',
              link: 'https://github.com/example/tutorial',
              type: 'code',
            },
            {
              title: 'Best Practices Guide',
              link: 'https://guide.example.com',
              type: 'article',
            },
          ],
        },
        {
          id: 3,
          title: 'Advanced Techniques',
          description: 'Dive deeper into advanced patterns and optimization',
          duration: 150,
          resources: [
            {
              title: 'Advanced Course',
              link: 'https://course.example.com',
              type: 'course',
            },
            {
              title: 'Code Examples',
              link: 'https://github.com/examples/advanced',
              type: 'code',
            },
          ],
        },
      ],
      quiz: {
        id: 1,
        title: `${skillName} Assessment Quiz`,
        description: 'Test your knowledge and understanding',
        questions: [
          {
            id: 1,
            question: `What is the primary purpose of ${skillName}?`,
            options: [
              'A) To handle data processing',
              'B) To manage user interfaces',
              'C) To optimize performance',
              'D) All of the above',
            ],
            correctAnswer: 'D',
            explanation: `${skillName} serves multiple purposes and is used comprehensively in modern web development.`,
          },
          {
            id: 2,
            question: `How do you implement best practices in ${skillName}?`,
            options: [
              'A) Follow documentation guidelines',
              'B) Use established design patterns',
              'C) Keep code clean and maintainable',
              'D) All of the above',
            ],
            correctAnswer: 'D',
            explanation: 'Best practices involve all these aspects working together.',
          },
          {
            id: 3,
            question: `What is a common challenge when working with ${skillName}?`,
            options: [
              'A) State management complexity',
              'B) Performance optimization',
              'C) Scaling applications',
              'D) All of the above',
            ],
            correctAnswer: 'D',
            explanation: 'All these are common challenges that need to be addressed.',
          },
          {
            id: 4,
            question: `How do you debug issues in ${skillName}?`,
            options: [
              'A) Use browser dev tools',
              'B) Add console logs',
              'C) Use debugging libraries',
              'D) All of the above',
            ],
            correctAnswer: 'D',
            explanation: 'Multiple debugging approaches are available and useful.',
          },
          {
            id: 5,
            question: `What is the importance of testing in ${skillName}?`,
            options: [
              'A) Ensure code quality',
              'B) Catch bugs early',
              'C) Enable refactoring',
              'D) All of the above',
            ],
            correctAnswer: 'D',
            explanation: 'Testing is crucial for maintaining high quality code.',
          },
        ],
      },
    };
  };

  const handleStepComplete = (stepIndex) => {
    setStepCompleted({
      ...stepCompleted,
      [stepIndex]: true,
    });
    if (stepIndex < assessmentData.learningSteps.length - 1) {
      setCurrentStep(stepIndex + 1);
    }
  };

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionIndex]: answer,
    });
  };

  const handleQuizSubmit = async () => {
    const quiz = assessmentData.quiz;
    let correctCount = 0;

    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setShowResults(true);

    try {
      await api.post('/assessments/save', {
        skillName: assessmentData.skillName,
        score: finalScore,
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        assessmentDate: new Date(),
      });
    } catch (err) {
      console.error('Error saving assessment:', err);
    }
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setScore(0);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  const isLearningPhase = currentStep < assessmentData.learningSteps.length;
  const currentLearningStep = isLearningPhase ? assessmentData.learningSteps[currentStep] : null;
  const currentQuestion = assessmentData.quiz.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            <span className="gradient-text">{assessmentData.skillName}</span> Learning & Assessment
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Complete learning steps and ace the final quiz
          </p>
        </div>

        {/* Progress Tracker */}
        <div className="card card-hover card-large mb-8 animate-fade-in-up">
          <h2 className="text-lg font-bold text-white mb-6">Learning Progress</h2>
          <div className="space-y-4">
            {/* Learning Steps */}
            {assessmentData.learningSteps.map((step, index) => (
              <div
                key={step.id}
                className={`flex items-center space-x-4 p-4 rounded-lg transition-all cursor-pointer ${
                  stepCompleted[index]
                    ? 'bg-green-500/10 border border-green-500/30'
                    : currentStep === index
                    ? 'bg-indigo-500/10 border border-indigo-500/30'
                    : 'bg-slate-700/30 border border-slate-600/30'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                <div className="flex-shrink-0">
                  {stepCompleted[index] ? (
                    <CheckCircle size={24} className="text-green-400" />
                  ) : (
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                        currentStep === index
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-600 text-slate-300'
                      }`}
                    >
                      {index + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`font-semibold ${
                      stepCompleted[index] || currentStep === index ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{step.duration} minutes</p>
                </div>
              </div>
            ))}

            {/* Quiz */}
            <div
              className={`flex items-center space-x-4 p-4 rounded-lg transition-all cursor-pointer ${
                !isLearningPhase
                  ? 'bg-purple-500/10 border border-purple-500/30'
                  : 'bg-slate-700/30 border border-slate-600/30'
              }`}
              onClick={() => setCurrentStep(assessmentData.learningSteps.length)}
            >
              <div className="flex-shrink-0">
                {!isLearningPhase ? (
                  <ClipboardList size={24} className="text-purple-400" />
                ) : (
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold bg-slate-600 text-slate-300">
                    ✓
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className={`font-semibold ${!isLearningPhase ? 'text-white' : 'text-slate-400'}`}>
                  Final Quiz
                </p>
                <p className="text-xs text-slate-400 mt-1">{assessmentData.quiz.questions.length} questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {isLearningPhase && currentLearningStep ? (
          // Learning Step
          <div className="card card-hover card-large mb-8 animate-fade-in-up">
            <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-slate-700/50">
              <div className="p-2 bg-indigo-500/20 rounded-lg">
                <BookOpen size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{currentLearningStep.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{currentLearningStep.description}</p>
              </div>
            </div>

            {/* Resources */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Learning Resources</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentLearningStep.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group p-4 bg-slate-700/30 hover:bg-slate-700/50 rounded-lg border border-slate-600/30 transition-all"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <p className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                        {resource.title}
                      </p>
                      <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
                    </div>
                    <p className="text-xs text-slate-400 capitalize">Type: {resource.type}</p>
                  </a>
                ))}
              </div>
            </div>

            {/* Step Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                disabled={currentStep === 0}
                className="btn btn-outline btn-md flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>
              <button
                onClick={() => handleStepComplete(currentStep)}
                className="btn btn-primary btn-md flex-1 flex items-center justify-center gap-2"
              >
                <span>Mark as Completed</span>
                <CheckCircle size={18} />
              </button>
              <button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="btn btn-outline btn-md flex-1 flex items-center justify-center gap-2"
              >
                <span>Skip Step</span>
                <SkipForward size={18} />
              </button>
            </div>
          </div>
        ) : showResults ? (
          // Quiz Results
          <div className="card card-hover card-large mb-8 animate-fade-in-up">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-6">
                {score >= 80 ? (
                  <div className="p-6 bg-green-500/10 rounded-full">
                    <CheckCircle size={64} className="text-green-400" />
                  </div>
                ) : score >= 60 ? (
                  <div className="p-6 bg-yellow-500/10 rounded-full">
                    <Award size={64} className="text-yellow-400" />
                  </div>
                ) : (
                  <div className="p-6 bg-orange-500/10 rounded-full">
                    <XCircle size={64} className="text-orange-400" />
                  </div>
                )}
              </div>
              <h2 className="text-4xl font-bold text-white mb-2">{score}%</h2>
              <p className="text-slate-400 mb-6">
                {score >= 80
                  ? 'Excellent! You have mastered this skill.'
                  : score >= 60
                  ? 'Good! You have a solid understanding.'
                  : 'Keep practicing to improve your score.'}
              </p>
            </div>

            {/* Quiz Breakdown */}
            <div className="bg-slate-700/30 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Quiz Breakdown</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Total Questions</p>
                  <p className="text-2xl font-bold text-white">{assessmentData.quiz.questions.length}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Correct Answers</p>
                  <p className="text-2xl font-bold text-green-400">
                    {Object.values(selectedAnswers).filter((ans, idx) => ans === assessmentData.quiz.questions[idx]?.correctAnswer)
                      .length}
                  </p>
                </div>
                <div>
                  <p className="text-slate-400 text-sm mb-1">Incorrect Answers</p>
                  <p className="text-2xl font-bold text-orange-400">
                    {assessmentData.quiz.questions.length -
                      Object.values(selectedAnswers).filter((ans, idx) => ans === assessmentData.quiz.questions[idx]?.correctAnswer)
                        .length}
                  </p>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Answer Review</h3>
              <div className="space-y-4">
                {assessmentData.quiz.questions.map((question, idx) => {
                  const userAnswer = selectedAnswers[idx];
                  const isCorrect = userAnswer === question.correctAnswer;
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-lg border ${
                        isCorrect ? 'bg-green-500/10 border-green-500/30' : 'bg-orange-500/10 border-orange-500/30'
                      }`}
                    >
                      <div className="flex items-start space-x-3 mb-3">
                        {isCorrect ? (
                          <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle size={20} className="text-orange-400 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-semibold text-white">{question.question}</p>
                          <p className="text-sm text-slate-400 mt-2">
                            Your answer: <span className={isCorrect ? 'text-green-400' : 'text-orange-400'}>{userAnswer}</span>
                          </p>
                          {!isCorrect && (
                            <p className="text-sm text-slate-400 mt-1">
                              Correct answer: <span className="text-green-400">{question.correctAnswer}</span>
                            </p>
                          )}
                          <p className="text-sm text-slate-300 mt-2 italic">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Result Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={handleRetakeQuiz}
                className="btn btn-outline btn-md flex-1 flex items-center justify-center gap-2"
              >
                <RotateCcw size={18} />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={handleBackToDashboard}
                className="btn btn-primary btn-md flex-1 flex items-center justify-center gap-2"
              >
                <span>Back to Dashboard</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ) : (
          // Quiz
          <div className="card card-hover card-large mb-8 animate-fade-in-up">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
              <div>
                <h2 className="text-2xl font-bold text-white">{assessmentData.quiz.title}</h2>
                <p className="text-sm text-slate-400 mt-1">{assessmentData.quiz.description}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-400">Question</p>
                <p className="text-2xl font-bold text-indigo-400">
                  {currentQuestionIndex + 1}/{assessmentData.quiz.questions.length}
                </p>
              </div>
            </div>

            {/* Question */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-6">{currentQuestion.question}</h3>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswerSelect(currentQuestionIndex, option[0])}
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedAnswers[currentQuestionIndex] === option[0]
                        ? 'bg-indigo-500/20 border-indigo-500/50'
                        : 'bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                          selectedAnswers[currentQuestionIndex] === option[0]
                            ? 'bg-indigo-500 border-indigo-500'
                            : 'border-slate-500'
                        }`}
                      >
                        {selectedAnswers[currentQuestionIndex] === option[0] && (
                          <CheckCircle size={16} className="text-white" />
                        )}
                      </div>
                      <span className="text-white">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-700/50">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0}
                className="btn btn-outline btn-md flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
                <span>Previous</span>
              </button>

              {currentQuestionIndex < assessmentData.quiz.questions.length - 1 ? (
                <button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                  className="btn btn-outline btn-md flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight size={18} />
                </button>
              ) : (
                <button
                  onClick={handleQuizSubmit}
                  disabled={!selectedAnswers[currentQuestionIndex]}
                  className="btn btn-primary btn-md flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Submit Quiz</span>
                  <Award size={18} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
