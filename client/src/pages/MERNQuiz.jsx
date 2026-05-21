import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, AlertCircle, RotateCcw, Download, ArrowRight } from 'lucide-react';

// 25 MERN Stack Questions
const MERN_QUESTIONS = [
  {
    id: 1,
    category: 'JavaScript',
    question: 'What does ES6 stand for?',
    options: [
      'ECMAScript 6',
      'European Script 6',
      'ECM Script 6',
      'Enhanced Standard 6',
    ],
    correct: 0,
    explanation: 'ES6 stands for ECMAScript 6, the 6th edition of the ECMA-262 standard.',
  },
  {
    id: 2,
    category: 'JavaScript',
    question: 'What is the difference between "let" and "var"?',
    options: [
      'let is block-scoped, var is function-scoped',
      'var is block-scoped, let is function-scoped',
      'They are the same',
      'let cannot be redeclared, var can',
    ],
    correct: 0,
    explanation: 'let is block-scoped and cannot be redeclared in the same scope, while var is function-scoped.',
  },
  {
    id: 3,
    category: 'JavaScript',
    question: 'What is a Promise in JavaScript?',
    options: [
      'An object representing eventual completion of async operation',
      'A variable declaration',
      'A function that returns a value',
      'An array method',
    ],
    correct: 0,
    explanation: 'A Promise is an object that represents eventual completion or failure of an async operation.',
  },
  {
    id: 4,
    category: 'JavaScript',
    question: 'What does destructuring do?',
    options: [
      'Unpacks values from objects/arrays into variables',
      'Deletes properties from objects',
      'Creates a copy of an object',
      'Converts objects to arrays',
    ],
    correct: 0,
    explanation: 'Destructuring extracts values from objects or arrays and assigns them to individual variables.',
  },
  {
    id: 5,
    category: 'JavaScript',
    question: 'What is async/await?',
    options: [
      'Syntax for handling promises more readably',
      'A loop construct',
      'A type of array',
      'A debugging tool',
    ],
    correct: 0,
    explanation: 'async/await is syntactic sugar for working with promises in a more readable, synchronous-looking way.',
  },
  {
    id: 6,
    category: 'React',
    question: 'What is JSX?',
    options: [
      'JavaScript XML syntax extension',
      'A JavaScript library',
      'A database query language',
      'A CSS framework',
    ],
    correct: 0,
    explanation: 'JSX is a syntax extension that allows writing HTML-like code in JavaScript.',
  },
  {
    id: 7,
    category: 'React',
    question: 'What is the purpose of useState hook?',
    options: [
      'Add state to functional components',
      'Create a new state variable in class components',
      'Navigate between pages',
      'Fetch data from API',
    ],
    correct: 0,
    explanation: 'useState allows functional components to have state without converting to class components.',
  },
  {
    id: 8,
    category: 'React',
    question: 'What does useEffect do?',
    options: [
      'Performs side effects in functional components',
      'Changes component styling',
      'Updates state immediately',
      'Creates new components',
    ],
    correct: 0,
    explanation: 'useEffect runs side effects like fetching data, subscriptions, or updating the DOM.',
  },
  {
    id: 9,
    category: 'React',
    question: 'What is the difference between props and state?',
    options: [
      'Props are read-only, state is mutable and managed inside component',
      'Props are mutable, state is read-only',
      'They are the same thing',
      'Props are for styling, state is for logic',
    ],
    correct: 0,
    explanation: 'Props are immutable data passed from parent to child, while state is mutable data managed within a component.',
  },
  {
    id: 10,
    category: 'React',
    question: 'What is React Router used for?',
    options: [
      'Navigate between different pages/views',
      'Style React components',
      'Manage API requests',
      'Create animations',
    ],
    correct: 0,
    explanation: 'React Router enables navigation and URL management in single-page applications.',
  },
  {
    id: 11,
    category: 'Node.js',
    question: 'What is Node.js?',
    options: [
      'JavaScript runtime built on Chrome\'s V8 engine',
      'A JavaScript framework',
      'A database',
      'A CSS preprocessor',
    ],
    correct: 0,
    explanation: 'Node.js is a JavaScript runtime that allows running JavaScript on the server-side.',
  },
  {
    id: 12,
    category: 'Node.js',
    question: 'What is Express.js?',
    options: [
      'A minimal web application framework for Node.js',
      'A database management system',
      'A frontend framework',
      'A testing library',
    ],
    correct: 0,
    explanation: 'Express.js is a lightweight framework for building web applications and APIs with Node.js.',
  },
  {
    id: 13,
    category: 'Node.js',
    question: 'What is middleware in Express?',
    options: [
      'Functions that execute during request-response cycle',
      'Database queries',
      'CSS classes',
      'HTML templates',
    ],
    correct: 0,
    explanation: 'Middleware functions execute in the request-response cycle and can modify requests or responses.',
  },
  {
    id: 14,
    category: 'Node.js',
    question: 'What does res.send() do?',
    options: [
      'Sends response to client',
      'Creates a new response object',
      'Sends a request to server',
      'Logs data to console',
    ],
    correct: 0,
    explanation: 'res.send() sends a response back to the client with data and appropriate headers.',
  },
  {
    id: 15,
    category: 'Node.js',
    question: 'What is a REST API?',
    options: [
      'API using HTTP requests (GET, POST, PUT, DELETE)',
      'A type of database',
      'A frontend library',
      'A server operating system',
    ],
    correct: 0,
    explanation: 'REST API uses standard HTTP methods to perform CRUD operations on resources.',
  },
  {
    id: 16,
    category: 'MongoDB',
    question: 'What type of database is MongoDB?',
    options: [
      'NoSQL document database',
      'Relational database',
      'Graph database',
      'Time-series database',
    ],
    correct: 0,
    explanation: 'MongoDB is a NoSQL database that stores data in flexible, JSON-like documents.',
  },
  {
    id: 17,
    category: 'MongoDB',
    question: 'What is a collection in MongoDB?',
    options: [
      'A group of documents (similar to table in SQL)',
      'A single document',
      'A database connection',
      'A backup file',
    ],
    correct: 0,
    explanation: 'A collection is a group of related MongoDB documents, analogous to tables in relational databases.',
  },
  {
    id: 18,
    category: 'MongoDB',
    question: 'What is ObjectId in MongoDB?',
    options: [
      'Unique identifier for each document',
      'A date object',
      'A data type for storing images',
      'A collection name',
    ],
    correct: 0,
    explanation: 'ObjectId is a 12-byte unique identifier automatically created for each MongoDB document.',
  },
  {
    id: 19,
    category: 'MongoDB',
    question: 'What is Mongoose?',
    options: [
      'MongoDB object modeling for Node.js',
      'A database server',
      'A frontend framework',
      'A version control system',
    ],
    correct: 0,
    explanation: 'Mongoose is an ODM (Object Document Mapper) library for MongoDB and Node.js.',
  },
  {
    id: 20,
    category: 'Full-Stack',
    question: 'What is JWT?',
    options: [
      'JSON Web Token for authentication',
      'Java Web Technology',
      'JavaScript Web Template',
      'JSON Web Trigger',
    ],
    correct: 0,
    explanation: 'JWT is a compact token format for securely transmitting information between parties.',
  },
  {
    id: 21,
    category: 'Full-Stack',
    question: 'What is CORS?',
    options: [
      'Cross-Origin Resource Sharing',
      'Core Operating Resource System',
      'Cross-Origin Response Server',
      'Centralized Object Resource System',
    ],
    correct: 0,
    explanation: 'CORS allows restricted resources on a web page to be requested from another domain.',
  },
  {
    id: 22,
    category: 'Full-Stack',
    question: 'What does bcrypt do?',
    options: [
      'Hash and salt passwords securely',
      'Encrypts entire databases',
      'Compresses files',
      'Generates API keys',
    ],
    correct: 0,
    explanation: 'bcrypt is a password hashing function that salts passwords for secure storage.',
  },
  {
    id: 23,
    category: 'Full-Stack',
    question: 'What is the purpose of environment variables?',
    options: [
      'Store sensitive data like API keys and database URLs',
      'Define CSS variables',
      'Create local variables',
      'Set up development tools',
    ],
    correct: 0,
    explanation: 'Environment variables store sensitive configuration without exposing it in source code.',
  },
  {
    id: 24,
    category: 'Full-Stack',
    question: 'What is Git?',
    options: [
      'Version control system for tracking code changes',
      'A programming language',
      'A database',
      'A web framework',
    ],
    correct: 0,
    explanation: 'Git is a distributed version control system that tracks changes in code over time.',
  },
  {
    id: 25,
    category: 'Full-Stack',
    question: 'What is Docker?',
    options: [
      'Containerization platform for packaging applications',
      'A JavaScript library',
      'A database management tool',
      'A CSS framework',
    ],
    correct: 0,
    explanation: 'Docker packages applications in containers for consistent deployment across environments.',
  },
];

export default function MERNQuiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes
  const [quizStarted, setQuizStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!quizStarted || showResults) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          setShowResults(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, showResults]);

  const handleAnswer = (optionIndex) => {
    setAnswers({
      ...answers,
      [currentQuestion]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestion < MERN_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    MERN_QUESTIONS.forEach((q, idx) => {
      if (answers[idx] === q.correct) {
        correct++;
      }
    });
    return correct;
  };

  const handleSaveResults = async () => {
    try {
      const score = calculateScore();
      const percentage = Math.round((score / MERN_QUESTIONS.length) * 100);

      // Get first skill for assessment
      const skillsRes = await axios.get('http://localhost:5000/api/skills');
      if (skillsRes.data.length > 0) {
        await axios.post('http://localhost:5000/api/assessments', {
          skillId: skillsRes.data[0]._id,
          score: percentage,
          feedback: `MERN Quiz Score: ${score}/${MERN_QUESTIONS.length}`,
        });
      }

      alert('✅ Quiz results saved successfully!');
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving results:', err);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setTimeLeft(1800);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Quiz Start Screen
  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>

        <div className="w-full max-w-2xl z-10">
          <div className="card card-large card-hover animate-fade-in-up">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg mb-4">
                <AlertCircle size={40} className="text-white" />
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                MERN Stack Quiz Challenge 🚀
              </h1>
              <p className="text-slate-400 text-sm">
                Test your MERN Stack knowledge with 25 comprehensive questions
              </p>
            </div>

            {/* Quiz Info */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-indigo-400">25</p>
                <p className="text-xs text-slate-400 mt-1">Questions</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-purple-400">30</p>
                <p className="text-xs text-slate-400 mt-1">Minutes</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-pink-400">4</p>
                <p className="text-xs text-slate-400 mt-1">Options</p>
              </div>
              <div className="bg-slate-700/50 rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-cyan-400">60%</p>
                <p className="text-xs text-slate-400 mt-1">Pass</p>
              </div>
            </div>

            {/* Topics Covered */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-3">📚 Topics Covered:</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Full-Stack'].map(topic => (
                  <div key={topic} className="badge badge-blue text-sm">
                    {topic}
                  </div>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 mb-8">
              <p className="text-sm text-yellow-200">
                <strong>⚠️ Important:</strong> Once you start the quiz, you have 30 minutes to complete it. All answers will be recorded. Make sure you have a stable internet connection before starting.
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate('/reports')}
                className="btn btn-outline btn-md flex-1"
              >
                Review Learning Path
              </button>
              <button
                onClick={() => setQuizStarted(true)}
                className="btn btn-primary btn-md flex-1"
              >
                <ArrowRight size={20} />
                <span>Start Quiz</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    const percentage = Math.round((score / MERN_QUESTIONS.length) * 100);
    const passed = percentage >= 60;

    const categoryScores = {};
    MERN_QUESTIONS.forEach((q, idx) => {
      if (!categoryScores[q.category]) {
        categoryScores[q.category] = { correct: 0, total: 0 };
      }
      categoryScores[q.category].total++;
      if (answers[idx] === q.correct) {
        categoryScores[q.category].correct++;
      }
    });

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
        <div className="floating-shape floating-shape-1"></div>
        <div className="floating-shape floating-shape-2"></div>

        <div className="w-full max-w-3xl z-10">
          <div className="card card-large card-hover animate-fade-in-up">
            {/* Result Header */}
            <div className="text-center mb-8">
              <div className={`inline-block p-4 rounded-lg mb-4 ${
                passed
                  ? 'bg-gradient-to-br from-green-500 to-green-600'
                  : 'bg-gradient-to-br from-red-500 to-red-600'
              }`}>
                {passed ? (
                  <CheckCircle size={40} className="text-white" />
                ) : (
                  <XCircle size={40} className="text-white" />
                )}
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                {passed ? '🎉 Congratulations!' : '📚 Keep Learning'}
              </h1>
              <p className="text-slate-400 text-sm">
                {passed
                  ? 'You passed the MERN Stack quiz! Great job!'
                  : 'You need more practice. Review the learning path and try again!'}
              </p>
            </div>

            {/* Score Display */}
            <div className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/50 rounded-lg p-8 mb-8 text-center">
              <p className="text-slate-400 text-sm mb-2">Your Score</p>
              <p className={`text-5xl sm:text-6xl font-bold mb-2 ${
                passed ? 'gradient-text' : 'text-red-400'
              }`}>
                {score}/{MERN_QUESTIONS.length}
              </p>
              <p className="text-2xl font-bold text-white mb-2">{percentage}%</p>
              <p className={`text-sm ${passed ? 'text-green-400' : 'text-red-400'}`}>
                {passed ? '✓ PASSED' : '✗ FAILED (Need 60%+)'}
              </p>
            </div>

            {/* Category Breakdown */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Category Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(categoryScores).map(([category, data]) => (
                  <div key={category} className="bg-slate-700/50 rounded-lg p-3">
                    <p className="text-xs text-slate-400 mb-1">{category}</p>
                    <p className="text-lg font-bold text-white">
                      {data.correct}/{data.total}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {Math.round((data.correct / data.total) * 100)}%
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Review Answers */}
            <div className="mb-8">
              <h3 className="text-lg font-bold text-white mb-4">Review Your Answers</h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {MERN_QUESTIONS.map((q, idx) => {
                  const isCorrect = answers[idx] === q.correct;
                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border ${
                        isCorrect
                          ? 'bg-green-500/10 border-green-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-white">
                            {idx + 1}. {q.question}
                          </p>
                          <p className={`text-xs mt-1 ${
                            isCorrect ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </p>
                          {!isCorrect && (
                            <p className="text-xs text-slate-400 mt-1">
                              <strong>Correct:</strong> {q.options[q.correct]}
                            </p>
                          )}
                        </div>
                        <span className={`badge text-xs ${
                          isCorrect ? 'badge-green' : 'badge-red'
                        }`}>
                          {isCorrect ? 'Q' : 'W'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleRestart}
                className="btn btn-outline btn-md flex-1"
              >
                <RotateCcw size={20} />
                <span>Retake Quiz</span>
              </button>
              <button
                onClick={handleSaveResults}
                className="btn btn-primary btn-md flex-1"
              >
                <Download size={20} />
                <span>Save & Continue</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  const question = MERN_QUESTIONS[currentQuestion];
  const selectedAnswer = answers[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 py-6">
      <div className="container mx-auto max-w-3xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">MERN Quiz</h1>
            <p className="text-slate-400 text-sm">Question {currentQuestion + 1} of {MERN_QUESTIONS.length}</p>
          </div>
          <div className={`text-2xl font-bold px-4 py-2 rounded-lg ${
            timeLeft > 300
              ? 'bg-green-500/20 text-green-400'
              : timeLeft > 60
              ? 'bg-yellow-500/20 text-yellow-400'
              : 'bg-red-500/20 text-red-400'
          }`}>
            ⏱️ {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="progress-bar">
            <div
              className="progress-bar-fill"
              style={{ width: `${((currentQuestion + 1) / MERN_QUESTIONS.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="card card-large mb-6 animate-fade-in-up">
          {/* Category Badge */}
          <div className="flex items-center justify-between mb-4">
            <span className="badge badge-blue text-sm">{question.category}</span>
            <span className="text-xs text-slate-400">Difficulty: Medium</span>
          </div>

          {/* Question */}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">{question.question}</h2>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                  selectedAnswer === idx
                    ? 'border-indigo-500 bg-indigo-500/20'
                    : 'border-slate-700/50 bg-slate-700/20 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswer === idx
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-slate-500'
                    }`}
                  >
                    {selectedAnswer === idx && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                  <span className="text-slate-300">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Info Box */}
          {selectedAnswer !== undefined && (
            <div className="bg-indigo-500/10 border border-indigo-500/30 rounded-lg p-4">
              <p className="text-sm text-indigo-200">
                <strong>💡 Tip:</strong> {question.explanation}
              </p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="btn btn-outline btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex gap-2 flex-wrap justify-center flex-1">
            {MERN_QUESTIONS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-8 h-8 rounded-lg font-semibold text-xs transition-all ${
                  currentQuestion === idx
                    ? 'bg-indigo-500 text-white'
                    : answers[idx] !== undefined
                    ? 'bg-green-500/50 text-white'
                    : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === undefined}
            className="btn btn-primary btn-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentQuestion === MERN_QUESTIONS.length - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}