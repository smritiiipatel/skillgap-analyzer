import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react';

export default function SkillManagement() {
  const [skills, setSkills] = useState([]);
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [formData, setFormData] = useState({
    skillName: '',
    category: 'Technical',
    currentLevel: 0,
    desiredLevel: 5,
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSkills();
  }, []);

  useEffect(() => {
    filterSkills();
  }, [skills, searchTerm, categoryFilter]);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/skills');
      setSkills(res.data);
    } catch (err) {
      console.error('Error fetching skills:', err);
    }
  };

  const filterSkills = () => {
    let filtered = skills;

    if (categoryFilter !== 'All') {
      filtered = filtered.filter(s => s.category === categoryFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.skillName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSkills(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/api/skills/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:5000/api/skills', formData);
      }
      fetchSkills();
      resetForm();
      setShowModal(false);
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      try {
        await axios.delete(`http://localhost:5000/api/skills/${id}`);
        fetchSkills();
      } catch (err) {
        console.error('Error deleting skill:', err);
      }
    }
  };

  const handleEdit = (skill) => {
    setFormData(skill);
    setEditingId(skill._id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      skillName: '',
      category: 'Technical',
      currentLevel: 0,
      desiredLevel: 5,
      priority: 'Medium',
    });
    setEditingId(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'badge-red';
      case 'Medium':
        return 'badge-yellow';
      default:
        return 'badge-green';
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      Technical: 'badge-blue',
      Soft: 'badge-purple',
      Domain: 'badge-pink',
      Tool: 'badge-cyan',
    };
    return colors[category] || 'badge-blue';
  };

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">Skill Management</h1>
            <p className="text-slate-400 text-sm mt-2">Manage and track your skills</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary btn-md w-full sm:w-auto"
          >
            <Plus size={20} />
            <span>Add Skill</span>
          </button>
        </div>

        {/* Search and Filter */}
        <div className="card card-large mb-8 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Search */}
            <div className="sm:col-span-2 lg:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search skills..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="select-field"
            >
              <option>All</option>
              <option>Technical</option>
              <option>Soft</option>
              <option>Domain</option>
              <option>Tool</option>
            </select>
          </div>
        </div>

        {/* Skills Grid */}
        {filteredSkills.length === 0 ? (
          <div className="card card-large text-center">
            <p className="text-slate-400 text-lg">No skills found. Start by adding a new skill! 🎯</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredSkills.map(skill => (
              <div key={skill._id} className="card card-hover card-large group">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg sm:text-xl font-bold text-white flex-1 group-hover:gradient-text transition-all">
                    {skill.skillName}
                  </h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 hover:bg-indigo-500/20 rounded-lg text-indigo-400 hover:text-indigo-300 transition-all"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(skill._id)}
                      className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Category Badge */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Category</p>
                    <span className={`badge ${getCategoryColor(skill.category)}`}>
                      {skill.category}
                    </span>
                  </div>

                  {/* Priority Badge */}
                  <div>
                    <p className="text-xs text-slate-400 mb-1">Priority</p>
                    <span className={`badge ${getPriorityColor(skill.priority)}`}>
                      {skill.priority}
                    </span>
                  </div>

                  {/* Levels */}
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Progress</p>
                    <div className="flex justify-between text-sm mb-2">
                      <span>
                        Current: <strong className="text-indigo-400">{skill.currentLevel}</strong>
                      </span>
                      <span>
                        Target: <strong className="text-purple-400">{skill.desiredLevel}</strong>
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${(skill.currentLevel / skill.desiredLevel) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content w-full mx-4 sm:mx-0 sm:max-w-md">
              <div className="modal-header">
                <h2 className="modal-title">
                  {editingId ? 'Edit Skill' : 'Add New Skill'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="modal-close"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="modal-body space-y-4">
                {/* Skill Name */}
                <div className="form-group">
                  <label className="form-label required">Skill Name</label>
                  <input
                    type="text"
                    value={formData.skillName}
                    onChange={e =>
                      setFormData({ ...formData, skillName: e.target.value })
                    }
                    className="input-field"
                    placeholder="Enter skill name"
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label className="form-label required">Category</label>
                  <select
                    value={formData.category}
                    onChange={e =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="select-field"
                  >
                    <option>Technical</option>
                    <option>Soft</option>
                    <option>Domain</option>
                    <option>Tool</option>
                  </select>
                </div>

                {/* Current Level */}
                <div className="form-group">
                  <label className="form-label">
                    Current Level: <span className="text-indigo-400">{formData.currentLevel}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.currentLevel}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        currentLevel: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-indigo-500"
                  />
                </div>

                {/* Desired Level */}
                <div className="form-group">
                  <label className="form-label">
                    Desired Level: <span className="text-purple-400">{formData.desiredLevel}</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={formData.desiredLevel}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        desiredLevel: parseInt(e.target.value),
                      })
                    }
                    className="w-full accent-purple-500"
                  />
                </div>

                {/* Priority */}
                <div className="form-group">
                  <label className="form-label required">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={e =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="select-field"
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="btn btn-outline btn-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-md"
                  >
                    {loading ? 'Saving...' : editingId ? 'Update Skill' : 'Add Skill'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}