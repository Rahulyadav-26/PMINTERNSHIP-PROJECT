import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SKILLS } from '@/lib/skills';
import { useStudent } from '@/contexts/StudentContext';
import {
  Search, Plus, X, Lightbulb, Target, TrendingUp, Award,
  CheckCircle, AlertCircle, Sparkles, BookOpen, Zap, Brain,
  Star, Users, Building2, Code, Palette, Database, Shield
} from 'lucide-react';

// TypeScript Interfaces
interface Skill {
  id: string;
  name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
}

interface RecommendedSkill extends Skill {
  reason: string;
  popularity: number;
  isInDemand: boolean;
}

interface SkillGap {
  internshipTitle: string;
  requiredSkills: string[];
  missingSkills: string[];
  matchPercentage: number;
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
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

const skillTagVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, x: -20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    x: 20,
    transition: {
      duration: 0.2
    }
  }
};

// Individual Components
const SkillTag: React.FC<{
  skill: string;
  onRemove: (skill: string) => void;
  index: number;
}> = ({ skill, onRemove, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleRemove = useCallback(() => {
    if (showConfirmation) {
      onRemove(skill);
      setShowConfirmation(false);
    } else {
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 3000);
    }
  }, [skill, onRemove, showConfirmation]);

  return (
    <motion.div
      variants={skillTagVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Badge 
        className={`
          inline-flex items-center gap-2 px-4 py-2 cursor-pointer transition-all duration-200 border-2
          ${showConfirmation 
            ? 'bg-red-50 border-red-200 text-red-700 hover:bg-red-100' 
            : 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300'
          }
        `}
        role="button"
        tabIndex={0}
        aria-label={`Remove ${skill} skill`}
        onClick={handleRemove}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRemove();
          }
        }}
      >
        <span className="font-medium">{skill}</span>
        <motion.div
          animate={{ 
            rotate: isHovered ? 90 : 0,
            scale: showConfirmation ? 1.2 : 1
          }}
          transition={{ duration: 0.2 }}
        >
          {showConfirmation ? (
            <AlertCircle className="h-4 w-4" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </motion.div>
      </Badge>
      
      {showConfirmation && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full left-0 mt-2 bg-white border border-red-200 rounded-lg p-2 shadow-lg z-10 whitespace-nowrap"
        >
          <span className="text-xs text-red-600 font-medium">Click again to remove</span>
        </motion.div>
      )}
    </motion.div>
  );
};

const SkillInput: React.FC<{
  query: string;
  setQuery: (query: string) => void;
  suggestions: string[];
  onAddSkill: (skill: string) => void;
  existingSkills: string[];
}> = ({ query, setQuery, suggestions, onAddSkill, existingSkills }) => {
  const [customSkill, setCustomSkill] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter(skill => 
      !existingSkills.includes(skill) &&
      skill.toLowerCase().includes(query.toLowerCase())
    );
  }, [suggestions, existingSkills, query]);

  const handleAddCustomSkill = useCallback(() => {
    const trimmedSkill = customSkill.trim();
    if (trimmedSkill && !existingSkills.includes(trimmedSkill)) {
      onAddSkill(trimmedSkill);
      setCustomSkill('');
    }
  }, [customSkill, onAddSkill, existingSkills]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomSkill();
    }
  }, [handleAddCustomSkill]);

  return (
    <motion.div 
      className="space-y-4"
      variants={itemVariants}
    >
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Search skills (e.g., JavaScript, Python, Communication)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-10 pr-4 py-3 text-base border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
          aria-label="Search for skills"
        />
      </div>

      {/* Skill Suggestions Grid */}
      <AnimatePresence>
        {(isFocused && query) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-white shadow-lg"
          >
            {filteredSuggestions.slice(0, 12).map((skill, index) => (
              <motion.button
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onAddSkill(skill)}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-blue-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{skill}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Skill Input */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Add custom skill (e.g., Public Speaking, Leadership)"
            value={customSkill}
            onChange={(e) => setCustomSkill(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-4 py-3 text-base border-2 border-gray-200 focus:border-green-500 transition-colors duration-200"
            aria-label="Add custom skill"
          />
        </div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            onClick={handleAddCustomSkill}
            disabled={!customSkill.trim() || existingSkills.includes(customSkill.trim())}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

const RecommendedSkillCard: React.FC<{
  skill: RecommendedSkill;
  onAdd: (skill: string) => void;
  isAdded: boolean;
  index: number;
}> = ({ skill, onAdd, isAdded, index }) => {
  const iconMap = {
    'Technical': Code,
    'Design': Palette,
    'Data': Database,
    'Security': Shield,
    'Communication': Users,
    'Leadership': Award
  };

  const IconComponent = iconMap[skill.category as keyof typeof iconMap] || Sparkles;

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <IconComponent className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900">{skill.name}</h4>
            {skill.isInDemand && (
              <Badge className="bg-orange-100 text-orange-700 text-xs px-2 py-1 mt-1">
                <TrendingUp className="h-3 w-3 mr-1" />
                High Demand
              </Badge>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Popularity</div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium">{skill.popularity}%</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-4 leading-relaxed">{skill.reason}</p>

      <motion.div
        whileHover={!isAdded ? { scale: 1.02 } : {}}
        whileTap={!isAdded ? { scale: 0.98 } : {}}
      >
        <Button
          onClick={() => onAdd(skill.name)}
          disabled={isAdded}
          className={`w-full font-semibold transition-colors duration-200 ${
            isAdded
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <CheckCircle className="h-4 w-4 mr-2" />
              Added
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </>
          )}
        </Button>
      </motion.div>
    </motion.div>
  );
};

const SkillGapAnalysis: React.FC<{
  skillGaps: SkillGap[];
  onAddSkill: (skill: string) => void;
  existingSkills: string[];
}> = ({ skillGaps, onAddSkill, existingSkills }) => {
  if (skillGaps.length === 0) return null;

  return (
    <motion.div variants={itemVariants}>
      <Card className="border border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <Target className="h-5 w-5" />
            Skill Gap Analysis
          </CardTitle>
          <CardDescription className="text-orange-700">
            Skills you might need for your target internships
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {skillGaps.map((gap, index) => (
            <motion.div
              key={gap.internshipTitle}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg p-4 border border-orange-200"
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">{gap.internshipTitle}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Match:</span>
                  <Badge className={`${
                    gap.matchPercentage >= 70 ? 'bg-green-100 text-green-700' :
                    gap.matchPercentage >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {gap.matchPercentage}%
                  </Badge>
                </div>
              </div>

              <div className="mb-3">
                <Progress value={gap.matchPercentage} className="h-2" />
              </div>

              {gap.missingSkills.length > 0 && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Missing skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {gap.missingSkills.map((skill) => (
                      <motion.button
                        key={skill}
                        onClick={() => onAddSkill(skill)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-200 hover:bg-red-100 transition-colors duration-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={existingSkills.includes(skill)}
                      >
                        <Plus className="h-3 w-3" />
                        {skill}
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Skills Component
export const Skills: React.FC = () => {
  const { profile, addSkill, removeSkill } = useStudent();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Mock data for recommended skills
  const recommendedSkills: RecommendedSkill[] = useMemo(() => [
    {
      id: '1',
      name: 'Data Analysis',
      category: 'Data',
      reason: 'High demand in government and private sector internships',
      popularity: 85,
      isInDemand: true
    },
    {
      id: '2',
      name: 'Project Management',
      category: 'Leadership',
      reason: 'Essential for coordinating cross-functional teams',
      popularity: 78,
      isInDemand: true
    },
    {
      id: '3',
      name: 'Public Speaking',
      category: 'Communication',
      reason: 'Critical for presentations and stakeholder communication',
      popularity: 72,
      isInDemand: false
    },
    {
      id: '4',
      name: 'Digital Marketing',
      category: 'Technical',
      reason: 'Growing demand in government digital initiatives',
      popularity: 69,
      isInDemand: true
    },
    {
      id: '5',
      name: 'UI/UX Design',
      category: 'Design',
      reason: 'Important for creating user-friendly government services',
      popularity: 76,
      isInDemand: true
    },
    {
      id: '6',
      name: 'Cybersecurity',
      category: 'Security',
      reason: 'Critical for protecting government data and systems',
      popularity: 82,
      isInDemand: true
    }
  ], []);

  // Mock skill gap data
  const skillGaps: SkillGap[] = useMemo(() => [
    {
      internshipTitle: 'Software Development Intern',
      requiredSkills: ['JavaScript', 'React', 'Node.js', 'Database Management', 'Git'],
      missingSkills: ['React', 'Node.js', 'Database Management'].filter(skill => 
        !profile?.skills?.includes(skill)
      ),
      matchPercentage: profile?.skills ? 
        Math.round((profile.skills.filter(skill => 
          ['JavaScript', 'React', 'Node.js', 'Database Management', 'Git'].includes(skill)
        ).length / 5) * 100) : 0
    },
    {
      internshipTitle: 'Data Analytics Intern',
      requiredSkills: ['Python', 'Data Analysis', 'SQL', 'Statistics', 'Excel'],
      missingSkills: ['Python', 'Data Analysis', 'SQL', 'Statistics'].filter(skill => 
        !profile?.skills?.includes(skill)
      ),
      matchPercentage: profile?.skills ? 
        Math.round((profile.skills.filter(skill => 
          ['Python', 'Data Analysis', 'SQL', 'Statistics', 'Excel'].includes(skill)
        ).length / 5) * 100) : 0
    }
  ], [profile?.skills]);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SKILLS.slice(0, 20);
    return SKILLS.filter(s => s.toLowerCase().includes(q)).slice(0, 20);
  }, [query]);

  const handleAddSkill = useCallback(async (skill: string) => {
    setIsLoading(true);
    try {
      await addSkill(skill);
      setNotification(`Added "${skill}" to your skills`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error adding skill:', error);
    } finally {
      setIsLoading(false);
    }
  }, [addSkill]);

  const handleRemoveSkill = useCallback(async (skill: string) => {
    setIsLoading(true);
    try {
      await removeSkill(skill);
      setNotification(`Removed "${skill}" from your skills`);
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error removing skill:', error);
    } finally {
      setIsLoading(false);
    }
  }, [removeSkill]);

  const skillsCount = profile?.skills?.length || 0;
  const progressPercentage = Math.min((skillsCount / 8) * 100, 100);

  return (
    <DashboardLayout title="My Skills">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Notification */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.95 }}
              className="fixed top-20 right-4 bg-green-100 border border-green-200 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50 max-w-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{notification}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-4xl font-black text-gray-900">My Skills</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your skills to get better internship matches. Add skills you're confident using.
          </p>
          
          {/* Progress Indicator */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Skills Progress</span>
              <span className="text-sm text-gray-600">{skillsCount}/8+ skills</span>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {skillsCount < 5 && 'Add at least 5 skills for better matching'}
              {skillsCount >= 5 && skillsCount < 8 && 'Great! Add a few more for optimal matching'}
              {skillsCount >= 8 && 'Excellent! You have a comprehensive skill set'}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Current Skills Section */}
          <div className="xl:col-span-2 space-y-6">
            <motion.div variants={itemVariants}>
              <Card className="border-2 border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Zap className="h-5 w-5" />
                    Your Skills ({skillsCount})
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    These skills are used to match you with relevant internships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AnimatePresence mode="wait">
                    {skillsCount > 0 ? (
                      <motion.div 
                        className="flex flex-wrap gap-3 mb-6"
                        initial="hidden"
                        animate="visible"
                        variants={{
                          visible: {
                            transition: {
                              staggerChildren: 0.05
                            }
                          }
                        }}
                      >
                        {profile?.skills?.map((skill, index) => (
                          <SkillTag
                            key={skill}
                            skill={skill}
                            onRemove={handleRemoveSkill}
                            index={index}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-8 space-y-4"
                      >
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                          <BookOpen className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">No skills added yet</h3>
                          <p className="text-gray-600">Start by adding skills you're confident using</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <SkillInput
                    query={query}
                    setQuery={setQuery}
                    suggestions={suggestions}
                    onAddSkill={handleAddSkill}
                    existingSkills={profile?.skills || []}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Skill Gap Analysis */}
            <SkillGapAnalysis
              skillGaps={skillGaps}
              onAddSkill={handleAddSkill}
              existingSkills={profile?.skills || []}
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <motion.div variants={itemVariants}>
              <Card className="border border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Lightbulb className="h-5 w-5" />
                    Tips for Success
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3 text-sm text-green-700">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Add at least 5-8 relevant skills for better matching</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Only include skills you can confidently demonstrate</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Upload your resume to auto-extract skills</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span>Review and update your skills regularly</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recommended Skills */}
            <motion.div variants={itemVariants}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Recommended Skills
                  </CardTitle>
                  <CardDescription>
                    Skills in high demand for internships
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <motion.div 
                    className="space-y-4"
                    variants={{
                      visible: {
                        transition: {
                          staggerChildren: 0.1
                        }
                      }
                    }}
                  >
                    {recommendedSkills.slice(0, 3).map((skill, index) => (
                      <RecommendedSkillCard
                        key={skill.id}
                        skill={skill}
                        onAdd={handleAddSkill}
                        isAdded={profile?.skills?.includes(skill.name) || false}
                        index={index}
                      />
                    ))}
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* All Recommended Skills */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-600" />
                All Recommended Skills
              </CardTitle>
              <CardDescription>
                Skills that can boost your internship applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  visible: {
                    transition: {
                      staggerChildren: 0.05
                    }
                  }
                }}
              >
                {recommendedSkills.map((skill, index) => (
                  <RecommendedSkillCard
                    key={skill.id}
                    skill={skill}
                    onAdd={handleAddSkill}
                    isAdded={profile?.skills?.includes(skill.name) || false}
                    index={index}
                  />
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Save Button */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center pt-8"
        >
          <motion.div
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              disabled={isLoading}
              className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <motion.div
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-3" />
                  Save & Continue
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Skills;
