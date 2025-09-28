import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useStudent } from '@/contexts/StudentContext';
import { SAMPLE_INTERNSHIPS } from '@/lib/sampleData';
import { toast } from '@/components/ui/sonner';
import {
  Star, Send, RotateCw, MessageCircle, TrendingUp, Users,
  CheckCircle, AlertCircle, Clock, Calendar, Award, Heart,
  ThumbsUp, ThumbsDown, Lightbulb, Settings, Zap, Target,
  Eye, BookOpen, Sparkles, ArrowRight, Plus, X, Info,
  BarChart3, PieChart, User, Building2, Globe, Smile,
  Frown, Meh, ChevronDown, ChevronUp, Edit, Filter, Shield
} from 'lucide-react';

// TypeScript Interfaces
interface FeedbackData {
  id: string;
  applicationId: string;
  internshipId: string;
  feedbackType: 'student' | 'industry';
  rating: number;
  mostLiked: string;
  improvements: string;
  wouldRecommend: boolean;
  category?: string;
  createdAt: string;
}

interface QuickFeedbackOption {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  category: 'positive' | 'negative' | 'suggestion';
  autoFill: {
    rating?: number;
    mostLiked?: string;
    improvements?: string;
  };
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
  }
};

// Reusable Components
const StarRating: React.FC<{
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}> = ({ rating, onRatingChange, readonly = false, size = 'md' }) => {
  const [hoverRating, setHoverRating] = useState(0);
  
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  return (
    <div className="flex items-center gap-1" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => handleClick(star)}
          onMouseEnter={() => !readonly && setHoverRating(star)}
          onMouseLeave={() => !readonly && setHoverRating(0)}
          className={`${sizeClasses[size]} transition-colors duration-200 ${
            readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          }`}
          whileHover={!readonly ? { scale: 1.2 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          role="radio"
          aria-checked={star <= rating}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
          disabled={readonly}
        >
          <Star 
            className={`${sizeClasses[size]} ${
              star <= (hoverRating || rating) 
                ? 'text-yellow-500 fill-yellow-500' 
                : 'text-gray-300'
            } transition-all duration-200`}
          />
        </motion.button>
      ))}
    </div>
  );
};

const QuickFeedbackChips: React.FC<{
  onQuickFeedback: (option: QuickFeedbackOption) => void;
  selectedChips: string[];
}> = ({ onQuickFeedback, selectedChips }) => {
  const quickOptions: QuickFeedbackOption[] = [
    {
      id: 'easy-to-use',
      label: 'Easy to use',
      icon: CheckCircle,
      category: 'positive',
      autoFill: { rating: 5, mostLiked: 'The platform was very intuitive and easy to navigate.' }
    },
    {
      id: 'great-recommendations',
      label: 'Great recommendations',
      icon: Lightbulb,
      category: 'positive',
      autoFill: { rating: 5, mostLiked: 'The AI recommendations were spot-on and very helpful.' }
    },
    {
      id: 'fast-process',
      label: 'Fast application process',
      icon: Zap,
      category: 'positive',
      autoFill: { rating: 4, mostLiked: 'Quick and efficient application process.' }
    },
    {
      id: 'confusing',
      label: 'Confusing interface',
      icon: AlertCircle,
      category: 'negative',
      autoFill: { rating: 2, improvements: 'The interface could be more intuitive and user-friendly.' }
    },
    {
      id: 'slow-loading',
      label: 'Slow loading times',
      icon: Clock,
      category: 'negative',
      autoFill: { rating: 2, improvements: 'Page loading times need significant improvement.' }
    },
    {
      id: 'needs-more-filters',
      label: 'Needs more filters',
      icon: Filter,
      category: 'suggestion',
      autoFill: { rating: 3, improvements: 'More filtering options would improve the search experience.' }
    },
    {
      id: 'better-mobile',
      label: 'Better mobile experience',
      icon: Globe,
      category: 'suggestion',
      autoFill: { rating: 3, improvements: 'Mobile responsiveness could be enhanced.' }
    },
    {
      id: 'more-guidance',
      label: 'Need more guidance',
      icon: BookOpen,
      category: 'suggestion',
      autoFill: { rating: 3, improvements: 'More guidance and tutorials would be helpful.' }
    }
  ];

  const getChipColor = (category: string) => {
    switch (category) {
      case 'positive': return 'bg-green-100 text-green-700 hover:bg-green-200 border-green-200';
      case 'negative': return 'bg-red-100 text-red-700 hover:bg-red-200 border-red-200';
      case 'suggestion': return 'bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-gray-200';
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Target className="h-5 w-5 text-purple-600" />
            Quick Feedback
          </CardTitle>
          <CardDescription>Select options that match your experience</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {quickOptions.map((option, index) => (
              <motion.button
                key={option.id}
                onClick={() => onQuickFeedback(option)}
                className={`
                  inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border-2 transition-all duration-200
                  ${getChipColor(option.category)}
                  ${selectedChips.includes(option.id) ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
                `}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <option.icon className="h-4 w-4" />
                {option.label}
              </motion.button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const FeedbackForm: React.FC<{
  applications: any[];
  onSubmit: (data: Omit<FeedbackData, 'id' | 'createdAt'>) => void;
  onQuickFeedback: (option: QuickFeedbackOption) => void;
  selectedChips: string[];
}> = ({ applications, onSubmit, onQuickFeedback, selectedChips }) => {
  const [formData, setFormData] = useState({
    applicationId: '',
    feedbackType: 'student' as 'student' | 'industry',
    rating: 5,
    mostLiked: '',
    improvements: '',
    wouldRecommend: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const byId = useMemo(() => Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i])), []);

  const validateForm = useCallback(() => {
    const newErrors: Record<string, string> = {};

    if (!formData.applicationId) {
      newErrors.applicationId = 'Please select an application';
    }

    if (formData.mostLiked.trim().length < 10) {
      newErrors.mostLiked = 'Please provide at least 10 characters';
    }

    if (formData.improvements.trim().length < 10) {
      newErrors.improvements = 'Please provide at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast('Please fix the errors in the form', { 
        description: 'Check the highlighted fields and try again.' 
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedApp = applications.find(app => app.id === formData.applicationId);
      const internshipId = selectedApp?.internshipId || '';

      onSubmit({
        applicationId: formData.applicationId,
        internshipId,
        feedbackType: formData.feedbackType,
        rating: formData.rating,
        mostLiked: formData.mostLiked.trim(),
        improvements: formData.improvements.trim(),
        wouldRecommend: formData.wouldRecommend
      });

      // Reset form
      setFormData({
        applicationId: '',
        feedbackType: 'student',
        rating: 5,
        mostLiked: '',
        improvements: '',
        wouldRecommend: true
      });

      toast('Feedback submitted successfully!', { 
        description: 'Thank you for helping us improve the platform.' 
      });
    } catch (error) {
      toast('Failed to submit feedback', { 
        description: 'Please try again later.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, validateForm, applications, onSubmit]);

  const handleQuickFeedbackSelect = useCallback((option: QuickFeedbackOption) => {
    setFormData(prev => ({
      ...prev,
      ...option.autoFill
    }));
    onQuickFeedback(option);
  }, [onQuickFeedback]);

  const updateFormData = useCallback((updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      if (newErrors[key]) delete newErrors[key];
    });
    setErrors(newErrors);
  }, [errors]);

  return (
    <div className="space-y-8">
      {/* Quick Feedback Chips */}
      <QuickFeedbackChips 
        onQuickFeedback={handleQuickFeedbackSelect}
        selectedChips={selectedChips}
      />

      {/* Main Feedback Form */}
      <motion.div variants={itemVariants}>
        <Card className="border border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <MessageCircle className="h-6 w-6" />
              Share Your Feedback
            </CardTitle>
            <CardDescription className="text-blue-700">
              Help us improve the PM Internship Scheme by sharing your detailed experience
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white rounded-b-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Form Type and Application Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">
                    Feedback Type
                  </Label>
                  <RadioGroup 
                    value={formData.feedbackType} 
                    onValueChange={(value) => updateFormData({ feedbackType: value as any })}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" className="cursor-pointer flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        Student
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="industry" id="industry" />
                      <Label htmlFor="industry" className="cursor-pointer flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-purple-600" />
                        Industry
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-semibold text-gray-900 mb-3 block">
                    Select Application <span className="text-red-500">*</span>
                  </Label>
                  <Select 
                    value={formData.applicationId} 
                    onValueChange={(value) => updateFormData({ applicationId: value })}
                  >
                    <SelectTrigger className={`${errors.applicationId ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Choose an application" />
                    </SelectTrigger>
                    <SelectContent>
                      {applications.map(app => {
                        const internship = byId[app.internshipId];
                        return (
                          <SelectItem key={app.id} value={app.id}>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-gray-100 text-gray-700 text-xs">
                                {app.status}
                              </Badge>
                              <span>
                                {internship ? `${internship.title} • ${internship.organization}` : app.internshipId}
                              </span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {errors.applicationId && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.applicationId}
                    </p>
                  )}
                </div>
              </div>

              {/* Rating */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  Overall Rating
                </Label>
                <div className="flex items-center gap-4">
                  <StarRating 
                    rating={formData.rating}
                    onRatingChange={(rating) => updateFormData({ rating })}
                    size="lg"
                  />
                  <span className="text-2xl font-bold text-gray-900">
                    {formData.rating}/5
                  </span>
                  <Badge className={`
                    ${formData.rating >= 4 ? 'bg-green-100 text-green-700' : 
                      formData.rating >= 3 ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-red-100 text-red-700'}
                  `}>
                    {formData.rating >= 4 ? 'Excellent' : 
                     formData.rating >= 3 ? 'Good' : 'Needs Improvement'}
                  </Badge>
                </div>
              </div>

              {/* What did you like most */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  What did you like the most? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.mostLiked}
                  onChange={(e) => updateFormData({ mostLiked: e.target.value })}
                  placeholder="Share what you enjoyed about your experience with the platform, application process, or internship matching..."
                  rows={4}
                  className={`resize-none ${errors.mostLiked ? 'border-red-500' : ''}`}
                />
                <div className="flex items-center justify-between mt-2">
                  {errors.mostLiked && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.mostLiked}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.mostLiked.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Improvements */}
              <div>
                <Label className="text-base font-semibold text-gray-900 mb-3 block">
                  What can we improve? <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  value={formData.improvements}
                  onChange={(e) => updateFormData({ improvements: e.target.value })}
                  placeholder="Help us understand what aspects of the platform, process, or experience could be enhanced..."
                  rows={4}
                  className={`resize-none ${errors.improvements ? 'border-red-500' : ''}`}
                />
                <div className="flex items-center justify-between mt-2">
                  {errors.improvements && (
                    <p className="text-red-500 text-sm flex items-center gap-1">
                      <AlertCircle className="h-4 w-4" />
                      {errors.improvements}
                    </p>
                  )}
                  <p className="text-gray-500 text-sm ml-auto">
                    {formData.improvements.length}/500 characters
                  </p>
                </div>
              </div>

              {/* Recommendation Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <Label className="text-base font-semibold text-gray-900">
                    Would you recommend this program to others?
                  </Label>
                  <p className="text-sm text-gray-600">
                    Help us understand if you'd suggest this to fellow students
                  </p>
                </div>
                <Switch
                  checked={formData.wouldRecommend}
                  onCheckedChange={(checked) => updateFormData({ wouldRecommend: checked })}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <motion.div 
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 text-base shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <>
                        <motion.div
                          className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Submit Feedback
                      </>
                    )}
                  </Button>
                </motion.div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        applicationId: '',
                        feedbackType: 'student',
                        rating: 5,
                        mostLiked: '',
                        improvements: '',
                        wouldRecommend: true
                      });
                      setErrors({});
                    }}
                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400"
                  >
                    <RotateCw className="h-5 w-5 mr-2" />
                    Reset
                  </Button>
                </motion.div>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

const FeedbackHistory: React.FC<{
  feedbacks: FeedbackData[];
  applications: any[];
}> = ({ feedbacks, applications }) => {
  const [expandedFeedback, setExpandedFeedback] = useState<string | null>(null);
  const byId = useMemo(() => Object.fromEntries(SAMPLE_INTERNSHIPS.map(i => [i.id, i])), []);
  
  const sortedFeedbacks = useMemo(() => {
    return [...feedbacks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [feedbacks]);

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) return 0;
    return feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length;
  }, [feedbacks]);

  if (feedbacks.length === 0) {
    return (
      <motion.div variants={itemVariants}>
        <Card className="border border-gray-200">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No feedback submitted yet
            </h3>
            <p className="text-gray-600 mb-6">
              Be the first to share your experience and help improve the platform.
            </p>
            <Badge className="bg-blue-100 text-blue-700">
              Your voice matters
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div variants={itemVariants} className="space-y-6">
      {/* Summary Stats */}
      <Card className="border border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <BarChart3 className="h-5 w-5" />
            Feedback Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white rounded-b-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-black text-green-600 mb-2">
                {feedbacks.length}
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                Total Submissions
              </div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <StarRating rating={Math.round(averageRating)} readonly size="md" />
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                Average Rating: {averageRating.toFixed(1)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-600 mb-2">
                {Math.round((feedbacks.filter(f => f.wouldRecommend).length / feedbacks.length) * 100)}%
              </div>
              <div className="text-sm text-gray-600 font-semibold">
                Would Recommend
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Timeline */}
      <Card className="border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Clock className="h-5 w-5 text-purple-600" />
            Your Feedback History
          </CardTitle>
          <CardDescription>
            Track all your submitted feedback and responses
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedFeedbacks.map((feedback, index) => {
            const internship = byId[feedback.internshipId];
            const isExpanded = expandedFeedback === feedback.id;
            
            return (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 text-lg">
                      {internship ? internship.title : 'Unknown Internship'}
                    </h4>
                    <p className="text-gray-600">
                      {internship?.organization} • {new Date(feedback.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <StarRating rating={feedback.rating} readonly size="sm" />
                      <Badge className={`
                        ${feedback.feedbackType === 'student' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}
                      `}>
                        {feedback.feedbackType === 'student' ? 'Student' : 'Industry'} Feedback
                      </Badge>
                      {feedback.wouldRecommend && (
                        <Badge className="bg-green-100 text-green-700">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          Recommends
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => setExpandedFeedback(isExpanded ? null : feedback.id)}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </motion.button>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 pt-4 border-t border-gray-200"
                    >
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">What you liked:</h5>
                        <p className="text-gray-700 bg-green-50 p-3 rounded-lg">
                          {feedback.mostLiked}
                        </p>
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-gray-900 mb-2">Suggestions for improvement:</h5>
                        <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">
                          {feedback.improvements}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Component
export const Feedback: React.FC = () => {
  const { applications, feedbacks, submitFeedback } = useStudent();
  const [selectedChips, setSelectedChips] = useState<string[]>([]);
  const [notification, setNotification] = useState<string | null>(null);

  const handleSubmitFeedback = useCallback((data: Omit<FeedbackData, 'id' | 'createdAt'>) => {
    const feedbackData: FeedbackData = {
      id: `fb-${Date.now()}`,
      applicationId: data.applicationId,
      internshipId: data.internshipId,
      feedbackType: data.feedbackType,
      rating: data.rating,
      mostLiked: data.mostLiked,
      improvements: data.improvements,
      wouldRecommend: data.wouldRecommend,
      createdAt: new Date().toISOString(),
    };

    submitFeedback(feedbackData);

    setNotification('Feedback submitted successfully!');
    setTimeout(() => setNotification(null), 3000);
    setSelectedChips([]);
  }, [submitFeedback]);

  const handleQuickFeedback = useCallback((option: QuickFeedbackOption) => {
    setSelectedChips(prev => {
      const newChips = prev.includes(option.id) 
        ? prev.filter(id => id !== option.id)
        : [...prev, option.id];
      return newChips;
    });
  }, []);

  return (
    <DashboardLayout title="Your Feedback Matters">
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
              className="fixed top-20 right-4 bg-green-100 border border-green-200 text-green-800 px-6 py-4 rounded-lg shadow-lg z-50 max-w-sm"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">{notification}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900">Your Feedback Matters</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Help us improve the PM Internship Scheme by sharing your experience. 
            Your insights shape the future of fair internship allocation.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Anonymous & Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy Protected</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Instant Impact</span>
            </div>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Feedback Form - Takes 2 columns */}
          <div className="xl:col-span-2">
            <FeedbackForm
              applications={applications}
              onSubmit={handleSubmitFeedback}
              onQuickFeedback={handleQuickFeedback}
              selectedChips={selectedChips}
            />
          </div>

          {/* Feedback History - Takes 1 column */}
          <div className="space-y-6">
            <FeedbackHistory 
              feedbacks={feedbacks || []} 
              applications={applications}
            />

            {/* Motivational Quote */}
            <motion.div variants={itemVariants}>
              <Card className="border border-purple-200 bg-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <blockquote className="text-lg font-semibold text-purple-800 mb-3">
                    "Your voice shapes the future of internships"
                  </blockquote>
                  <p className="text-purple-700 text-sm">
                    Every feedback helps thousands of students find better opportunities
                  </p>
                  <div className="flex justify-center gap-3 mt-4">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-300 text-purple-700 hover:bg-purple-100"
                      >
                        <ArrowRight className="h-4 w-4 mr-2" />
                        View Recommendations
                      </Button>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Feedback;
