import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp,
  Award,
  Target,
  Zap,
  ChevronRight,
  BookOpen,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  Download,
  Share2,
} from 'lucide-react';

export default function Reports() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const gapAnalysis = location.state?.gapAnalysis;
    if (gapAnalysis) {
      setReport(gapAnalysis);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [location.state]);

  const handleStartAssessment = (skillName) => {
    navigate('/assessment', {
      state: {
        skillName: skillName,
      }
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen pb-12">
        <div className="container mx-auto py-6 sm:py-8">
          <div className="card card-hover card-large">
            <div className="flex items-center justify-center h-80">
              <p className="text-slate-400 text-xl">No report data available. Go back to Dashboard and submit the form.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const gapScore = report.targetSkillLevel - report.currentSkillLevel;
  const estimatedHours = gapScore * 10 * (40 / report.availableHoursPerWeek || 1);
  const estimatedWeeks = Math.ceil(estimatedHours / (report.availableHoursPerWeek || 1));

  const StatCard = ({ icon: Icon, label, value, color }) => (
    <div className="card card-hover card-large">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-400 text-sm mb-2">{label}</p>
          <p className="text-2xl sm:text-3xl font-bold text-white">{value}</p>
        </div>
        <div className={`p-4 rounded-lg ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Report Header */}
        <div className="mb-8 animate-fade-in-up">
          <div className="card card-hover card-large bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-indigo-500/20">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                  <span className="gradient-text">{report.skillName}</span> Gap Analysis
                </h1>
                <p className="text-slate-400 text-sm sm:text-base">
                  Comprehensive skill gap analysis and personalized learning roadmap
                </p>
              </div>
              <div className="flex flex-col items-center justify-center bg-slate-700/30 rounded-lg p-6">
                <p className="text-xs text-slate-400 mb-2">Skill Gap</p>
                <p className="text-4xl font-bold text-indigo-400 mb-2">{gapScore}</p>
                <p className="text-xs text-slate-400">{report.currentSkillLevel}/5 → {report.targetSkillLevel}/5</p>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-fade-in-up">
          <StatCard
            icon={Target}
            label="Gap Score"
            value={gapScore}
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <StatCard
            icon={Zap}
            label="Learning Hours"
            value={Math.round(estimatedHours)}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Estimated Weeks"
            value={estimatedWeeks}
            color="bg-gradient-to-br from-pink-500 to-pink-600"
          />
          <StatCard
            icon={Award}
            label="Weekly Hours"
            value={report.availableHoursPerWeek}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
          {/* Gap Analysis Chart */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <TrendingUp size={24} className="mr-2 text-indigo-400" />
              Skill Progression
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={[
                  { name: 'Current', level: report.currentSkillLevel, fill: '#8b5cf6' },
                  { name: 'Target', level: report.targetSkillLevel, fill: '#6366f1' },
                ]}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 5]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Bar dataKey="level" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Learning Details */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <BookOpen size={24} className="mr-2 text-purple-400" />
              Learning Details
            </h2>
            <div className="space-y-4">
              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-2">
                  <CheckCircle size={20} className="text-green-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-white">Learning Preference</p>
                    <p className="text-xs text-slate-400 mt-1">{report.learningPreference}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3 mb-2">
                  <Zap size={20} className="text-yellow-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-white">Estimated Timeline</p>
                    <p className="text-xs text-slate-400 mt-1">{estimatedWeeks} weeks at {report.availableHoursPerWeek}h/week</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/30 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle size={20} className="text-orange-400 flex-shrink-0 mt-1" />
                  <div>
                    <p className="text-sm font-semibold text-white">Category</p>
                    <p className="text-xs text-slate-400 mt-1">{report.category}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
          {/* Strengths */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <Award size={24} className="mr-2 text-green-400" />
              Strengths to Leverage
            </h2>
            <div className="space-y-3">
              {report.strengthsToLeverge ? (
                <p className="text-slate-300 text-sm leading-relaxed">
                  {report.strengthsToLeverge}
                </p>
              ) : (
                <p className="text-slate-500 text-sm italic">No strengths specified</p>
              )}
            </div>
          </div>

          {/* Weaknesses */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
              <AlertCircle size={24} className="mr-2 text-orange-400" />
              Areas of Weakness
            </h2>
            <div className="space-y-3">
              {report.areasOfWeakness ? (
                <p className="text-slate-300 text-sm leading-relaxed">
                  {report.areasOfWeakness}
                </p>
              ) : (
                <p className="text-slate-500 text-sm italic">No weaknesses specified</p>
              )}
            </div>
          </div>
        </div>

        {/* Specific Challenges */}
        <div className="card card-hover card-large mb-8 animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
            <Target size={24} className="mr-2 text-cyan-400" />
            Challenges & Goals
          </h2>
          <div className="bg-slate-700/30 rounded-lg p-6">
            {report.specificChallenges ? (
              <p className="text-slate-300 text-sm leading-relaxed">
                {report.specificChallenges}
              </p>
            ) : (
              <p className="text-slate-500 text-sm italic">No specific challenges mentioned</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8 animate-fade-in-up">
          <button
            onClick={() => handleStartAssessment(report.skillName)}
            className="btn btn-primary btn-md sm:btn-lg flex-1 flex items-center justify-center gap-2"
          >
            <BookOpen size={20} />
            <span>Start Learning & Assessment</span>
            <ArrowRight size={20} />
          </button>
          <button
            className="btn btn-outline btn-md sm:btn-lg flex-1 flex items-center justify-center gap-2"
          >
            <Download size={20} />
            <span>Download Report</span>
          </button>
          <button
            className="btn btn-outline btn-md sm:btn-lg flex-1 flex items-center justify-center gap-2"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>

        {/* Recommended Learning Path */}
        <div className="card card-hover card-large animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 flex items-center">
            <TrendingUp size={24} className="mr-2 text-indigo-400" />
            Recommended Learning Path
          </h2>
          <div className="space-y-3">
            {[
              { step: 1, title: 'Foundation Building', duration: '2-3 weeks', icon: '📚' },
              { step: 2, title: 'Core Concepts', duration: '3-4 weeks', icon: '💡' },
              { step: 3, title: 'Hands-on Projects', duration: '2-3 weeks', icon: '🛠️' },
              { step: 4, title: 'Advanced Topics', duration: '2-3 weeks', icon: '🚀' },
              { step: 5, title: 'Final Assessment & Certification', duration: '1 week', icon: '🎓' },
            ].map((phase, index) => (
              <div
                key={phase.step}
                className="flex items-center space-x-4 p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all cursor-pointer group"
              >
                <div className="flex-shrink-0 w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center">
                  <span className="text-lg">{phase.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-white">{phase.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{phase.duration}</p>
                </div>
                <ChevronRight size={18} className="text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}