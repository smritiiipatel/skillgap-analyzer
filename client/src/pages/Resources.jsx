import React, { useState } from 'react';
import { ExternalLink, BookOpen, Video, FileText, Award, Users, Star, Search } from 'lucide-react';

const MOCK_RESOURCES = [
  {
    id: 1,
    title: 'React Complete Guide',
    description: 'Master React with hooks, state management, and more',
    resourceType: 'Course',
    url: 'https://udemy.com/react',
    provider: 'Udemy',
    duration: '40 hours',
    difficulty: 'Intermediate',
    rating: 4.8,
    students: 500000,
    icon: BookOpen,
  },
  {
    id: 2,
    title: 'JavaScript ES6+ Tutorial',
    description: 'Learn modern JavaScript features and best practices',
    resourceType: 'Video',
    url: 'https://youtube.com/javascript',
    provider: 'YouTube',
    duration: '10 hours',
    difficulty: 'Beginner',
    rating: 4.6,
    students: 250000,
    icon: Video,
  },
  {
    id: 3,
    title: 'Web Design Patterns',
    description: 'Deep dive into design patterns for web development',
    resourceType: 'Book',
    url: 'https://amazon.com/webdesign',
    provider: 'Amazon',
    duration: '12 chapters',
    difficulty: 'Advanced',
    rating: 4.9,
    students: 150000,
    icon: FileText,
  },
  {
    id: 4,
    title: 'Node.js Advanced',
    description: 'Build scalable backend applications with Node.js',
    resourceType: 'Course',
    url: 'https://coursera.org/nodejs',
    provider: 'Coursera',
    duration: '25 hours',
    difficulty: 'Advanced',
    rating: 4.7,
    students: 180000,
    icon: Award,
  },
  {
    id: 5,
    title: 'TypeScript Masterclass',
    description: 'Complete guide to TypeScript for production apps',
    resourceType: 'Course',
    url: 'https://udemy.com/typescript',
    provider: 'Udemy',
    duration: '35 hours',
    difficulty: 'Intermediate',
    rating: 4.8,
    students: 320000,
    icon: BookOpen,
  },
  {
    id: 6,
    title: 'Database Design',
    description: 'Learn SQL, MongoDB, and database optimization',
    resourceType: 'Tutorial',
    url: 'https://youtube.com/database',
    provider: 'YouTube',
    duration: '20 hours',
    difficulty: 'Intermediate',
    rating: 4.5,
    students: 200000,
    icon: Video,
  },
];

export default function Resources() {
  const [selectedType, setSelectedType] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const resourceTypes = ['All', 'Course', 'Video', 'Book', 'Tutorial', 'Workshop'];
  const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredResources = MOCK_RESOURCES.filter(r => {
    const matchType = selectedType === 'All' || r.resourceType === selectedType;
    const matchDifficulty = selectedDifficulty === 'All' || r.difficulty === selectedDifficulty;
    const matchSearch = r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        r.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchDifficulty && matchSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner':
        return 'badge-green';
      case 'Intermediate':
        return 'badge-yellow';
      case 'Advanced':
        return 'badge-red';
      default:
        return 'badge-blue';
    }
  };

  const StarRating = ({ rating }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-slate-600'}
        />
      ))}
      <span className="text-sm text-slate-400 ml-2">{rating}</span>
    </div>
  );

  return (
    <div className="min-h-screen pb-12">
      <div className="container mx-auto py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">Learning Resources</h1>
          <p className="text-slate-400 text-sm sm:text-base">
            Curated resources to help you master your skills
          </p>
        </div>

        {/* Search */}
        <div className="card card-large mb-6 border-border-color animate-fade-in-up">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-full pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="card card-large mb-8 animate-fade-in-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {/* Type Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                Resource Type
              </label>
              <div className="flex flex-wrap gap-2">
                {resourceTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      selectedType === type
                        ? 'btn btn-primary'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Filter */}
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-2">
                Difficulty Level
              </label>
              <div className="flex flex-wrap gap-2">
                {difficulties.map(diff => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                      selectedDifficulty === diff
                        ? 'btn btn-primary'
                        : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {filteredResources.length === 0 ? (
          <div className="card card-large text-center">
            <p className="text-slate-400 text-lg">No resources found. Try adjusting your filters! 🔍</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in-up">
            {filteredResources.map(resource => {
              const Icon = resource.icon;
              return (
                <div
                  key={resource.id}
                  className="card card-hover card-large flex flex-col"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-indigo-500/20 p-3 rounded-lg group-hover:bg-indigo-500/30 transition-all">
                      <Icon className="text-indigo-400" size={24} />
                    </div>
                    <span className={`badge ${getDifficultyColor(resource.difficulty)} text-xs`}>
                      {resource.difficulty}
                    </span>
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:gradient-text transition-all">
                    {resource.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-4 flex-grow">{resource.description}</p>

                  {/* Metadata */}
                  <div className="space-y-3 mb-4 border-t border-slate-700/50 pt-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Rating</span>
                      <StarRating rating={resource.rating} />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Students</span>
                      <span className="text-indigo-400 font-semibold flex items-center">
                        <Users size={16} className="mr-1" />
                        {(resource.students / 1000).toFixed(0)}K
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Duration</span>
                      <span className="text-purple-400">{resource.duration}</span>
                    </div>
                  </div>

                  {/* Provider & Link */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <span className="text-xs text-slate-500">{resource.provider}</span>
                    <a
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary btn-sm"
                    >
                      <span>View</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}