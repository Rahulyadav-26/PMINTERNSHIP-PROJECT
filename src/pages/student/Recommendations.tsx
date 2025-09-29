import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { useStudent } from '@/contexts/StudentContext';
import { formatRemaining } from '@/lib/utils';
import { Recommendation } from '@/types/student';
import { DEFAULT_MATCH_CONFIG, MatchConfig } from '@/lib/matching';
import {
  Search, Filter, MapPin, Calendar, DollarSign, Users, Building2,
  ChevronDown, ChevronUp, ExternalLink, Heart, Star, TrendingUp,
  CheckCircle, Clock, Award, Sparkles, Target, Lightbulb, BookOpen,
  Briefcase, Globe, Home, Settings, RotateCw, AlertCircle, Zap,
  Eye, ThumbsUp, Brain, Shield, ArrowRight, Plus, X, Info, Crown
} from 'lucide-react';

// Using shared Recommendation type from '@/types/student'

interface FilterState {
  search: string;
  location: string;
  sector: string;
  duration: string;
  modality: string;
  sortBy: 'match' | 'newest' | 'stipend';
}

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

// Reusable Components
const ScoringControls: React.FC<{
  config: MatchConfig;
  onChange: (next: MatchConfig) => void;
}> = ({ config, onChange }) => {
  const [open, setOpen] = useState(false);
  const setWeight = (key: keyof MatchConfig['weights']) => (values: number[]) => {
    const v = (values?.[0] ?? 0) / 100;
    onChange({ ...config, weights: { ...config.weights, [key]: Number(v.toFixed(2)) } });
  };
  const setToggle = (key: keyof MatchConfig) => (checked: boolean | string) => {
    const v = checked === true;
    onChange({ ...config, [key]: v } as MatchConfig);
  };
  return (
    <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5 text-gray-600" />
          <span className="font-semibold text-gray-900">Scoring Controls</span>
        </div>
        <Button variant="outline" onClick={() => setOpen(!open)}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
          >
            {/* Weights */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Required skills weight</span>
                <span className="text-xs text-gray-500">{Math.round(config.weights.req * 100)}%</span>
              </div>
              <Slider value={[Math.round(config.weights.req * 100)]} onValueChange={setWeight('req')} max={100} step={1} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Preferred skills weight</span>
                <span className="text-xs text-gray-500">{Math.round(config.weights.pref * 100)}%</span>
              </div>
              <Slider value={[Math.round(config.weights.pref * 100)]} onValueChange={setWeight('pref')} max={100} step={1} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Location weight</span>
                <span className="text-xs text-gray-500">{Math.round(config.weights.loc * 100)}%</span>
              </div>
              <Slider value={[Math.round(config.weights.loc * 100)]} onValueChange={setWeight('loc')} max={100} step={1} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Sector weight</span>
                <span className="text-xs text-gray-500">{Math.round(config.weights.sector * 100)}%</span>
              </div>
              <Slider value={[Math.round(config.weights.sector * 100)]} onValueChange={setWeight('sector')} max={100} step={1} />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-700">Modality weight</span>
                <span className="text-xs text-gray-500">{Math.round(config.weights.modality * 100)}%</span>
              </div>
              <Slider value={[Math.round(config.weights.modality * 100)]} onValueChange={setWeight('modality')} max={100} step={1} />
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3 mt-2">
              <Checkbox checked={!!config.requireAllRequiredSkills} onCheckedChange={setToggle('requireAllRequiredSkills')} />
              <span className="text-sm text-gray-700">Require all required skills</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox checked={!!config.deadlineFilter} onCheckedChange={setToggle('deadlineFilter')} />
              <span className="text-sm text-gray-700">Hide past-deadline internships</span>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <Checkbox checked={!!config.capacityFilter} onCheckedChange={setToggle('capacityFilter')} />
              <span className="text-sm text-gray-700">Hide full (no capacity) internships</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FilterBar: React.FC<{
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  onClearFilters: () => void;
}> = ({ filters, onFilterChange, onClearFilters }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      className="bg-white rounded-2xl border border-gray-200 shadow-lg p-6 mb-8"
    >
      {/* Search and Toggle */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search internships, companies, or roles..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
          />
        </div>
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-colors duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Filter className="h-5 w-5" />
            <span>Filters</span>
            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </motion.button>
          <Button variant="outline" onClick={onClearFilters} className="px-4 py-3">
            Clear All
          </Button>
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-200"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <Select value={filters.location} onValueChange={(value) => onFilterChange({ location: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any location</SelectItem>
                  <SelectItem value="Delhi">Delhi</SelectItem>
                  <SelectItem value="Mumbai">Mumbai</SelectItem>
                  <SelectItem value="Bangalore">Bangalore</SelectItem>
                  <SelectItem value="Chennai">Chennai</SelectItem>
                  <SelectItem value="Kolkata">Kolkata</SelectItem>
                  <SelectItem value="Pune">Pune</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sector</label>
              <Select value={filters.sector} onValueChange={(value) => onFilterChange({ sector: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any sector" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any sector</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Education">Education</SelectItem>
                  <SelectItem value="Government">Government</SelectItem>
                  <SelectItem value="Non-profit">Non-profit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
              <Select value={filters.duration} onValueChange={(value) => onFilterChange({ duration: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Any duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any duration</SelectItem>
                  <SelectItem value="1-3 months">1-3 months</SelectItem>
                  <SelectItem value="3-6 months">3-6 months</SelectItem>
                  <SelectItem value="6+ months">6+ months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <Select value={filters.sortBy} onValueChange={(value) => onFilterChange({ sortBy: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="match">Best Match</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="stipend">Highest Stipend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const ExplanationPanel: React.FC<{
  explanations: Recommendation['explanations'];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ explanations, isExpanded, onToggle }) => {
  const getIconForType = (type?: string) => {
    switch (type) {
      case 'skill': return Zap;
      case 'location': return MapPin;
      case 'sector': return Building2;
      case 'modality': return Home;
      case 'preference': return Heart;
      case 'affirmative': return Shield;
      default: return Info;
    }
  };

  const getColorForType = (type?: string) => {
    switch (type) {
      case 'skill': return 'text-blue-600 bg-blue-50';
      case 'location': return 'text-green-600 bg-green-50';
      case 'sector': return 'text-purple-600 bg-purple-50';
      case 'modality': return 'text-indigo-600 bg-indigo-50';
      case 'preference': return 'text-pink-600 bg-pink-50';
      case 'affirmative': return 'text-orange-600 bg-orange-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="border-t border-gray-200 pt-4">
      <motion.button
        onClick={onToggle}
        className="flex items-center justify-between w-full p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors duration-200"
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <div className="flex items-center gap-2">
          <Eye className="h-5 w-5 text-blue-600" />
          <span className="font-medium text-blue-800">Why this recommendation?</span>
        </div>
        {isExpanded ? <ChevronUp className="h-5 w-5 text-blue-600" /> : <ChevronDown className="h-5 w-5 text-blue-600" />}
      </motion.button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-3"
          >
            {explanations.map((explanation, index) => {
              const IconComponent = getIconForType((explanation as any).kind);
              const colorClasses = getColorForType((explanation as any).kind);
              
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-start gap-3 p-3 rounded-lg ${colorClasses}`}
                >
                  <IconComponent className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <span className="text-sm font-medium">{explanation.reason}</span>
                    <div className="mt-1">
                      <div className="w-full bg-white/50 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full bg-current opacity-60"
                          initial={{ width: 0 }}
                          animate={{ width: `${explanation.weight * 100}%` }}
                          transition={{ duration: 1, delay: index * 0.1 }}
                        />
                      </div>
                      <span className="text-xs opacity-75 mt-1 block">
                        Impact: {Math.round(explanation.weight * 100)}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RecommendationCard: React.FC<{
  recommendation: Recommendation;
  isSelected: boolean;
  onSelect: (selected: boolean) => void;
  onApply: () => void;
  onQuickApply: () => void;
  index: number;
}> = ({ recommendation, isSelected, onSelect, onApply, onQuickApply, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const { internship, score, explanations } = recommendation;

  const getModalityIcon = (modality: string) => {
    switch (modality) {
      case 'remote': return Home;
      case 'onsite': return Building2;
      case 'hybrid': return Globe;
      default: return Building2;
    }
  };

  const getModalityColor = (modality: string) => {
    switch (modality) {
      case 'remote': return 'bg-green-100 text-green-700';
      case 'onsite': return 'bg-blue-100 text-blue-700';
      case 'hybrid': return 'bg-purple-100 text-purple-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={{ delay: index * 0.1 }}
      className={`relative bg-white rounded-2xl border-2 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
        internship.isTopPick ? 'border-yellow-300 bg-yellow-50/30' : 'border-gray-200'
      } ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      {/* Top Pick Ribbon */}
      {index === 0 && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
            <Crown className="h-3 w-3" />
            Top Pick
          </div>
        </div>
      )}

      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4 flex-1">
            <Checkbox
              checked={isSelected}
              onCheckedChange={onSelect}
              className="mt-1"
              aria-label={`Select ${internship.title} internship`}
            />
            
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                    {internship.title}
                  </CardTitle>
                  <CardDescription className="text-base text-gray-600 mt-1">
                    {internship.organization} • {internship.sector}
                  </CardDescription>
                </div>
                
                <motion.button
                  onClick={() => setIsBookmarked(!isBookmarked)}
                  className={`p-2 rounded-full transition-colors duration-200 ${
                    isBookmarked ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
                </motion.button>
              </div>

              {/* Key Info Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={`${getModalityColor(internship.modality)} font-medium`}>
                  {React.createElement(getModalityIcon(internship.modality), { className: "h-3 w-3 mr-1" })}
                  {internship.modality}
                </Badge>
                
                <Badge className="bg-gray-100 text-gray-700 font-medium">
                  <Calendar className="h-3 w-3 mr-1" />
                  {internship.durationWeeks ? `${internship.durationWeeks} weeks` : '—'}
                </Badge>
                
                {(typeof internship.stipendMin === 'number' || typeof internship.stipendMax === 'number') && (
                  <Badge className="bg-green-100 text-green-700 font-medium">
                    <DollarSign className="h-3 w-3 mr-1" />
                    {typeof internship.stipendMin === 'number' && typeof internship.stipendMax === 'number'
                      ? `₹${internship.stipendMin.toLocaleString()} - ₹${internship.stipendMax.toLocaleString()}/month`
                      : typeof internship.stipendMin === 'number'
                        ? `₹${internship.stipendMin.toLocaleString()}/month`
                        : `₹${internship.stipendMax!.toLocaleString()}/month`
                    }
                  </Badge>
                )}

                <Badge className="bg-purple-100 text-purple-700 font-medium">
                  <Users className="h-3 w-3 mr-1" />
                  {internship.capacity} positions
                </Badge>
              </div>
            </div>
          </div>

          {/* Match Score */}
          <div className="text-right ml-4">
            <div className="text-3xl font-black text-blue-600">
              {Math.round(score * 100)}%
            </div>
            <div className="text-xs text-gray-500 font-medium">Match Score</div>
            <div className="mt-2 w-20">
              <Progress value={score * 100} className="h-2" />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Location and Deadline */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span>{internship.locations.join(', ')}</span>
          </div>
          {internship.applicationDeadline && (
            <div className="flex items-center gap-1 text-orange-600">
              <Clock className="h-4 w-4" />
              <span>Deadline: {formatRemaining(internship.applicationDeadline)}</span>
            </div>
          )}
        </div>

        {/* Skills Match */}
        <div>
          <p className="text-sm font-medium text-gray-900 mb-2">Skills Match</p>
          <div className="flex flex-wrap gap-2">
            {internship.requiredSkills.slice(0, 4).map((skill, idx) => (
              <Badge 
                key={idx} 
                className="bg-blue-100 text-blue-700 text-xs font-medium"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                {skill}
              </Badge>
            ))}
            {internship.requiredSkills.length > 4 && (
              <Badge className="bg-gray-100 text-gray-600 text-xs">
                +{internship.requiredSkills.length - 4} more
              </Badge>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 leading-relaxed">
          {internship.description}
        </p>

        {/* Explanation Panel */}
        <ExplanationPanel
          explanations={explanations}
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              onClick={onApply}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Apply Now
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button 
              variant="outline" 
              onClick={onQuickApply}
              className="px-6 py-3 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
            >
              <Zap className="h-4 w-4 mr-2" />
              Quick Apply
            </Button>
          </motion.div>
        </div>
      </CardContent>
    </motion.div>
  );
};

const EmptyState: React.FC<{
  onGoToSkills: () => void;
}> = ({ onGoToSkills }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.6 }}
    className="text-center py-16 space-y-6"
  >
    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
      <BookOpen className="h-12 w-12 text-blue-600" />
    </div>
    <div>
      <h3 className="text-2xl font-bold text-gray-900 mb-3">No recommendations yet</h3>
      <p className="text-gray-600 max-w-md mx-auto leading-relaxed">
        We need more information about your skills and preferences to find the perfect internships for you.
      </p>
    </div>
    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
      <Button 
        onClick={onGoToSkills}
        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 font-semibold"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Skills to Get Started
      </Button>
    </motion.div>
  </motion.div>
);

const LoadingState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="space-y-6"
  >
    {[...Array(3)].map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-lg"
      >
        <div className="animate-pulse space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-3 flex-1">
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="h-12 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-6 bg-gray-200 rounded w-20"></div>
            <div className="h-6 bg-gray-200 rounded w-16"></div>
            <div className="h-6 bg-gray-200 rounded w-24"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </motion.div>
    ))}
  </motion.div>
);

// Main Component
export const Recommendations: React.FC = () => {
  const navigate = useNavigate();
  const { getRecommendations, applyToInternship } = useStudent();
  
  // Scoring config state
  const [config, setConfig] = useState<MatchConfig>(DEFAULT_MATCH_CONFIG);

  // State Management
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    location: '',
    sector: '',
    duration: '',
    modality: '',
    sortBy: 'match'
  });
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

// Compute recommendations using the matching engine and current config
  const allRecommendations: Recommendation[] = useMemo(() => {
    const matchFilters: any = {
      location: filters.location || undefined,
      sector: filters.sector || undefined,
      modality: (filters.modality as any) || 'any',
      // duration mapping omitted for prototype
    };
    return getRecommendations(50, matchFilters, config);
  }, [getRecommendations, filters.location, filters.sector, filters.modality, config]);

  // Filter and sort recommendations
  const filteredRecommendations = useMemo(() => {
    let filtered = allRecommendations;

    // Apply filters
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(rec => 
        rec.internship.title.toLowerCase().includes(searchLower) ||
        rec.internship.organization.toLowerCase().includes(searchLower) ||
        rec.internship.sector.toLowerCase().includes(searchLower)
      );
    }

    if (filters.location) {
      filtered = filtered.filter(rec => 
        rec.internship.locations.some(loc => 
          loc.toLowerCase().includes(filters.location.toLowerCase())
        )
      );
    }

    if (filters.sector) {
      filtered = filtered.filter(rec => rec.internship.sector === filters.sector);
    }

    if (filters.duration) {
      filtered = filtered.filter(rec => rec.internship.duration === filters.duration);
    }

    if (filters.modality) {
      filtered = filtered.filter(rec => rec.internship.modality === filters.modality);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'match':
          return b.score - a.score;
        case 'stipend':
          return (b.internship.stipend || 0) - (a.internship.stipend || 0);
        case 'newest':
          return new Date(b.internship.applicationDeadline || '').getTime() - 
                 new Date(a.internship.applicationDeadline || '').getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }, [allRecommendations, filters]);

  const selectedIds = useMemo(() => Object.keys(selected).filter(k => selected[k]), [selected]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: '',
      location: '',
      sector: '',
      duration: '',
      modality: '',
      sortBy: 'match'
    });
  }, []);

  const handleSelectInternship = useCallback((id: string, isSelected: boolean) => {
    setSelected(prev => ({ ...prev, [id]: isSelected }));
  }, []);

  const handleBulkApply = useCallback(() => {
    navigate('/dashboard/apply/bulk', { state: { ids: selectedIds } });
  }, [navigate, selectedIds]);

  const handleApply = useCallback((internshipId: string) => {
    navigate(`/dashboard/apply/${internshipId}`);
  }, [navigate]);

  const handleQuickApply = useCallback((internship: Recommendation['internship']) => {
    applyToInternship(internship);
    // Show success notification
  }, [applyToInternship]);

  if (isLoading) {
    return (
      <DashboardLayout title="Recommended Internships">
        <LoadingState />
      </DashboardLayout>
    );
  }

  if (filteredRecommendations.length === 0 && !filters.search && !filters.location && !filters.sector) {
    return (
      <DashboardLayout title="Recommended Internships">
        <EmptyState onGoToSkills={() => navigate('/dashboard/skills')} />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Recommended Internships">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900">Recommended Internships</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Opportunities tailored for your skills and preferences, powered by our AI matching engine.
          </p>
        </motion.div>

        {/* Scoring Controls */}
        <ScoringControls config={config} onChange={setConfig} />

        {/* Filters */}
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-2xl"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800">
                  {selectedIds.length} internship{selectedIds.length !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelected({})}>
                  <X className="h-4 w-4 mr-2" />
                  Clear Selection
                </Button>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button onClick={handleBulkApply} className="bg-blue-600 hover:bg-blue-700">
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Apply to Selected
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <p className="text-gray-600">
            Found <span className="font-semibold text-gray-900">{filteredRecommendations.length}</span> matching internships
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Brain className="h-4 w-4" />
            <span>AI-powered recommendations</span>
          </div>
        </motion.div>

        {/* Recommendations List */}
        {filteredRecommendations.length > 0 ? (
          <motion.div className="space-y-6">
            {filteredRecommendations.map((recommendation, index) => (
              <RecommendationCard
                key={recommendation.internship.id}
                recommendation={recommendation}
                isSelected={!!selected[recommendation.internship.id]}
                onSelect={(isSelected) => handleSelectInternship(recommendation.internship.id, isSelected)}
                onApply={() => handleApply(recommendation.internship.id)}
                onQuickApply={() => handleQuickApply(recommendation.internship)}
                index={index}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 space-y-4"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No internships found</h3>
              <p className="text-gray-600">Try adjusting your filters or search terms.</p>
            </div>
            <Button variant="outline" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Load More Button */}
        {filteredRecommendations.length > 0 && (
          <motion.div 
            variants={itemVariants}
            className="flex justify-center pt-8"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button 
                variant="outline" 
                onClick={() => setPage(prev => prev + 1)}
                className="px-8 py-3 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-600"
              >
                <RotateCw className="h-5 w-5 mr-2" />
                Load More Recommendations
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Recommendations;
