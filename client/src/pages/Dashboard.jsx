import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Award,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  X,
  ChevronRight,
  Activity,
  CheckCircle,
  Calendar,
  BookOpen,
  MessageSquare,
} from 'lucide-react';

const API_BASE_URL = 'https://skillgap-analyzer-server.onrender.com';

const createAxiosInstance = (token) => {
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export default function Dashboard() {
  const [skills, setSkills] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Technical',
    currentSkillLevel: 2,
    targetSkillLevel: 5,
    learningPreference: 'Mixed',
    availableHoursPerWeek: 10,
    areasOfWeakness: '',
    strengthsToLeverge: '',
    specificChallenges: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const api = createAxiosInstance(token);

  useEffect(() => {
    if (token) {
      fetchDashboardData();
    }
  }, [token]);

  const fetchDashboardData = async () => {
    try {
      const [skillsRes, assessmentsRes] = await Promise.all([
        api.get('/skills').catch(() => ({ data: [] })),
        api.get('/assessments').catch(() => ({ data: [] })),
      ]);

      setSkills(skillsRes.data);
      setAssessments(assessmentsRes.data);
      setActivities(generateMockActivities());
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setActivities(generateMockActivities());
    } finally {
      setLoading(false);
    }
  };

  const generateMockActivities = () => {
    const mockActivities = [
      {
        id: 1,
        type: 'skill_added',
        title: 'Added "MERN Stack" skill',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        icon: 'target',
      },
      {
        id: 2,
        type: 'assessment_completed',
        title: 'Completed JavaScript Assessment - 85%',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
        icon: 'award',
      },
      {
        id: 3,
        type: 'step_completed',
        title: 'Completed "React Basics" learning step',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
        icon: 'check',
      },
      {
        id: 4,
        type: 'report_generated',
        title: 'Generated gap analysis report',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        icon: 'trending',
      },
      {
        id: 5,
        type: 'goal_set',
        title: 'Set learning goal for MERN Stack',
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        icon: 'zap',
      },
    ];
    return mockActivities;
  };

  const handleGapFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const gapData = {
        skillName: formData.skillName,
        category: formData.category,
        currentSkillLevel: formData.currentSkillLevel,
        targetSkillLevel: formData.targetSkillLevel,
        learningPreference: formData.learningPreference,
        availableHoursPerWeek: formData.availableHoursPerWeek,
        areasOfWeakness: formData.areasOfWeakness,
        strengthsToLeverge: formData.strengthsToLeverge,
        specificChallenges: formData.specificChallenges,
        gapScore: formData.targetSkillLevel - formData.currentSkillLevel,
      };

      // Navigate to reports with gap analysis data
      navigate('/reports', {
        state: {
          gapAnalysis: gapData,
          newGapAnalysis: true
        }
      });
    } catch (err) {
      console.error('Error analyzing gap:', err);
      alert('Failed to analyze gap. Please try again.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleFormInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'currentSkillLevel' || name === 'targetSkillLevel' || name === 'availableHoursPerWeek'
        ? parseInt(value)
        : value,
    });
  };

  const handleClearForm = () => {
    setFormData({
      skillName: '',
      category: 'Technical',
      currentSkillLevel: 2,
      targetSkillLevel: 5,
      learningPreference: 'Mixed',
      availableHoursPerWeek: 10,
      areasOfWeakness: '',
      strengthsToLeverge: '',
      specificChallenges: '',
    });
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getActivityIcon = (type) => {
    const iconProps = { size: 18, className: 'flex-shrink-0' };
    switch (type) {
      case 'target':
        return <Target {...iconProps} className={`${iconProps.className} text-indigo-400`} />;
      case 'award':
        return <Award {...iconProps} className={`${iconProps.className} text-purple-400`} />;
      case 'check':
        return <CheckCircle {...iconProps} className={`${iconProps.className} text-green-400`} />;
      case 'trending':
        return <TrendingUp {...iconProps} className={`${iconProps.className} text-cyan-400`} />;
      case 'zap':
        return <Zap {...iconProps} className={`${iconProps.className} text-yellow-400`} />;
      default:
        return <Activity {...iconProps} className={`${iconProps.className} text-slate-400`} />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loader"></div>
      </div>
    );
  }

  const categoryData = skills.reduce((acc, skill) => {
    const existing = acc.find(item => item.name === skill.category);
    if (existing) {
      existing.count += 1;
    } else {
      acc.push({ name: skill.category, count: 1 });
    }
    return acc;
  }, []);

  const COLORS = ['#6366f1', '#8b5cf6', '#d946ef', '#06b6d4'];

  const StatCard = ({ icon: Icon, label, value, trend, color }) => (
    <div className="card card-hover card-large group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-sm mb-2">{label}</p>
          <p className="text-3xl sm:text-4xl font-bold text-white">{value}</p>
          {trend !== undefined && (
            <div className="flex items-center space-x-1 mt-3 text-xs sm:text-sm">
              {trend > 0 ? (
                <>
                  <ArrowUpRight size={16} className="text-green-400" />
                  <span className="text-green-400">{trend}% increase</span>
                </>
              ) : (
                <>
                  <ArrowDownRight size={16} className="text-red-400" />
                  <span className="text-red-400">{Math.abs(trend)}% decrease</span>
                </>
              )}
            </div>
          )}
        </div>
        <div className={`p-3 sm:p-4 rounded-lg group-hover:shadow-lg transition-all ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            Welcome back, <span className="gradient-text">{user?.name}!</span> 👋
          </h1>
          <p className="text-slate-400 text-sm sm:text-base">
            {user?.department} • {user?.designation}
          </p>
        </div>

        {/* Gap Analysis Form - Full Width */}
        <div className="mb-8 animate-fade-in-up">
          <div className="card card-hover card-large">
            {/* Form Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-700/50">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <MessageSquare size={20} className="text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Skill Gap Analysis</h2>
                  <p className="text-xs text-slate-400 mt-1">Fill form to generate personalized learning path</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleGapFormSubmit} className="space-y-4">
              {/* Row 1: Skill Name & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label required">Skill Name</label>
                  <input
                    type="text"
                    name="skillName"
                    value={formData.skillName}
                    onChange={handleFormInputChange}
                    className="input-field"
                    placeholder="e.g., MERN Stack, React, Node.js"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label required">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleFormInputChange}
                    className="select-field"
                  >
                    <option>Technical</option>
                    <option>Soft Skills</option>
                    <option>Domain</option>
                    <option>Tool</option>
                    <option>Framework</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Current Level */}
              <div className="form-group">
                <label className="form-label">
                  Current Level: <span className="text-indigo-400 font-bold">{formData.currentSkillLevel}/5</span>
                </label>
                <input
                  type="range"
                  name="currentSkillLevel"
                  min="0"
                  max="5"
                  value={formData.currentSkillLevel}
                  onChange={handleFormInputChange}
                  className="w-full accent-indigo-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* Row 3: Target Level */}
              <div className="form-group">
                <label className="form-label">
                  Target Level: <span className="text-purple-400 font-bold">{formData.targetSkillLevel}/5</span>
                </label>
                <input
                  type="range"
                  name="targetSkillLevel"
                  min="0"
                  max="5"
                  value={formData.targetSkillLevel}
                  onChange={handleFormInputChange}
                  className="w-full accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* Row 4: Learning Preference & Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="form-label">Learning Preference</label>
                  <select
                    name="learningPreference"
                    value={formData.learningPreference}
                    onChange={handleFormInputChange}
                    className="select-field"
                  >
                    <option>Video</option>
                    <option>Reading</option>
                    <option>Hands-on</option>
                    <option>Mixed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Hours/Week: <span className="text-cyan-400 font-bold">{formData.availableHoursPerWeek}h</span>
                  </label>
                  <input
                    type="range"
                    name="availableHoursPerWeek"
                    min="1"
                    max="40"
                    value={formData.availableHoursPerWeek}
                    onChange={handleFormInputChange}
                    className="w-full accent-cyan-500"
                  />
                </div>
              </div>

              {/* Row 5: Areas of Weakness */}
              <div className="form-group">
                <label className="form-label">Areas of Weakness</label>
                <textarea
                  name="areasOfWeakness"
                  value={formData.areasOfWeakness}
                  onChange={handleFormInputChange}
                  className="textarea-field"
                  placeholder="e.g., Struggling with async/await, Redux state management..."
                  rows="2"
                />
              </div>

              {/* Row 6: Strengths to Leverage */}
              <div className="form-group">
                <label className="form-label">Strengths to Leverage</label>
                <textarea
                  name="strengthsToLeverge"
                  value={formData.strengthsToLeverge}
                  onChange={handleFormInputChange}
                  className="textarea-field"
                  placeholder="e.g., Strong JavaScript fundamentals, quick learner..."
                  rows="2"
                />
              </div>

              {/* Row 7: Specific Challenges */}
              <div className="form-group">
                <label className="form-label">Specific Challenges/Goals</label>
                <textarea
                  name="specificChallenges"
                  value={formData.specificChallenges}
                  onChange={handleFormInputChange}
                  className="textarea-field"
                  placeholder="e.g., Need to complete full-stack project in 3 months..."
                  rows="2"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button
                  type="button"
                  onClick={handleClearForm}
                  className="btn btn-outline btn-md flex-1"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !formData.skillName}
                  className="btn btn-primary btn-md flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {formLoading ? (
                    <>
                      <div className="loader-sm"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <TrendingUp size={20} />
                      <span>Analyze & Generate Report</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Stats Grid - 4 Columns in One Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-fade-in-up">
          <StatCard
            icon={Target}
            label="Total Skills"
            value={skills.length}
            trend={12}
            color="bg-gradient-to-br from-indigo-500 to-indigo-600"
          />
          <StatCard
            icon={TrendingUp}
            label="Assessments"
            value={assessments.length}
            trend={8}
            color="bg-gradient-to-br from-purple-500 to-purple-600"
          />
          <StatCard
            icon={Award}
            label="Avg Score"
            value={assessments.length > 0 ? Math.round(assessments.reduce((acc, a) => acc + a.score, 0) / assessments.length) : '0'}
            trend={-5}
            color="bg-gradient-to-br from-pink-500 to-pink-600"
          />
          <StatCard
            icon={Zap}
            label="Total Score"
            value={assessments.length > 0 ? assessments.reduce((acc, a) => acc + a.score, 0) : '0'}
            trend={-3}
            color="bg-gradient-to-br from-cyan-500 to-cyan-600"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in-up">
          {/* Pie Chart */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <Zap size={24} className="mr-2 text-indigo-400" />
              Skills by Category
            </h2>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, count }) => `${name}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-400">
                No data available
              </div>
            )}
          </div>

          {/* Bar Chart */}
          <div className="card card-hover card-large">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
              <Award size={24} className="mr-2 text-purple-400" />
              Assessment Scores
            </h2>
            {assessments && assessments.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={assessments.slice(0, 5)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                  <XAxis dataKey="skillName" stroke="#94a3b8" angle={-45} textAnchor="end" height={80} />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(99, 102, 241, 0.3)',
                      borderRadius: '8px',
                    }}
                    labelStyle={{ color: '#e2e8f0' }}
                  />
                  <Bar dataKey="score" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-80 text-slate-400">
                No data available
              </div>
            )}
          </div>
        </div>

        {/* Area Chart */}
        <div className="card card-hover card-large mb-8 animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center">
            <TrendingUp size={24} className="mr-2 text-cyan-400" />
            Assessment Progress
          </h2>
          {assessments.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={assessments.slice(-10)}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.1)" />
                <XAxis stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#6366f1"
                  fillOpacity={1}
                  fill="url(#colorScore)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-80 text-slate-400">
              No data available
            </div>
          )}
        </div>

        {/* Recent Assessments */}
        <div className="card card-hover card-large animate-fade-in-up">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6">Recent Assessments</h2>
          {assessments.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No assessments yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead className="table-head">
                  <tr>
                    <th className="table-th">Skill</th>
                    <th className="table-th">Score</th>
                    <th className="table-th">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.slice(0, 5).map(assessment => (
                    <tr key={assessment._id} className="table-row">
                      <td className="table-td font-semibold">
                        {assessment.skillName || 'N/A'}
                      </td>
                      <td className="table-td">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 sm:w-32 bg-slate-700/50 rounded-full h-2">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full"
                              style={{ width: `${assessment.score}%` }}
                            ></div>
                          </div>
                          <span className="badge badge-green text-xs sm:text-sm">
                            {assessment.score}%
                          </span>
                        </div>
                      </td>
                      <td className="table-td text-slate-400 text-xs sm:text-sm">
                        {new Date(assessment.assessmentDate).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
