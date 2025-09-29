import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { LOCATIONS, SECTORS } from '@/lib/skills';
import { useStudent } from '@/contexts/StudentContext';
import { toast } from '@/components/ui/sonner';
import {
  MapPin, Building2, Clock, DollarSign, Globe, Home, Users,
  Zap, Target, Star, CheckCircle, AlertCircle, Search, Filter,
  Settings, Award, TrendingUp, Sparkles, Heart, Brain, Shield,
  Edit, Save, RotateCw, Plus, X, Info, Briefcase, Calendar,
  Navigation, Smartphone, Monitor, Coffee, Book, Code, Palette,
  Lightbulb // Added missing Lightbulb import
} from 'lucide-react';

// TypeScript Interfaces
interface PreferencesData {
  locations: string[];
  sectors: string[];
  modality: 'any' | 'remote' | 'onsite' | 'hybrid';
  minStipend: number;
  maxStipend: number; // Keep this as it's used in the local state
  minDurationWeeks: number;
  maxDurationWeeks: number;
  availabilityStart: string;
  availabilityEnd: string;
  homeState: string;
  city: string;
  ruralUrban: 'unspecified' | 'rural' | 'urban';
  willingToRelocate: boolean;
  organizationSize: 'any' | 'startup' | 'sme' | 'large';
  quickToggles: {
    topPaying: boolean;
    remote: boolean;
    government: boolean;
    flexible: boolean;
  };
}

interface QuickToggle {
  id: keyof PreferencesData['quickToggles'];
  label: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
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
const LocationSelector: React.FC<{
  selectedLocations: string[];
  onLocationChange: (locations: string[]) => void;
}> = ({ selectedLocations, onLocationChange }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const filteredLocations = useMemo(() => {
    return LOCATIONS.filter(location =>
      location.toLowerCase().includes(searchInput.toLowerCase()) &&
      !selectedLocations.includes(location)
    ).slice(0, 12);
  }, [searchInput, selectedLocations]);

  const addLocation = useCallback((location: string) => {
    if (!selectedLocations.includes(location)) {
      onLocationChange([...selectedLocations, location]);
      setSearchInput('');
    }
  }, [selectedLocations, onLocationChange]);

  const removeLocation = useCallback((location: string) => {
    onLocationChange(selectedLocations.filter(loc => loc !== location));
  }, [selectedLocations, onLocationChange]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          Preferred Locations
          <span className="text-red-500">*</span>
        </Label>
        <Badge className="bg-blue-100 text-blue-700">
          {selectedLocations.length} selected
        </Badge>
      </div>

      {/* Selected Locations */}
      <div className="flex flex-wrap gap-2 min-h-[40px] p-3 border-2 border-gray-200 rounded-xl bg-gray-50">
        <AnimatePresence>
          {selectedLocations.map((location) => (
            <motion.div
              key={location}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <Badge 
                className="bg-blue-600 text-white px-3 py-2 cursor-pointer hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                onClick={() => removeLocation(location)}
              >
                {location}
                <X className="h-3 w-3" />
              </Badge>
            </motion.div>
          ))}
        </AnimatePresence>
        {selectedLocations.length === 0 && (
          <span className="text-gray-500 text-sm flex items-center">
            Click suggestions below to add locations
          </span>
        )}
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search locations (e.g., Mumbai, Delhi, Bangalore)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onFocus={() => setIsExpanded(true)}
          className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-blue-500 transition-colors duration-200"
        />
      </div>

      {/* Location Suggestions */}
      <AnimatePresence>
        {(isExpanded || searchInput) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-4 bg-white shadow-lg"
          >
            {filteredLocations.map((location, index) => (
              <motion.button
                key={location}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => addLocation(location)}
                className="flex items-center gap-2 px-3 py-2 text-left text-sm bg-gray-50 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors duration-200 border border-gray-200 hover:border-blue-300"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Plus className="h-3 w-3" />
                {location}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {selectedLocations.length === 0 && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm flex items-center justify-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Please select at least one location
          </p>
        </div>
      )}
    </div>
  );
};

const SectorSelector: React.FC<{
  selectedSectors: string[];
  onSectorChange: (sectors: string[]) => void;
}> = ({ selectedSectors, onSectorChange }) => {
  const [searchInput, setSearchInput] = useState('');

  const filteredSectors = useMemo(() => {
    return SECTORS.filter(sector =>
      sector.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [searchInput]);

  const toggleSector = useCallback((sector: string) => {
    if (selectedSectors.includes(sector)) {
      onSectorChange(selectedSectors.filter(s => s !== sector));
    } else {
      onSectorChange([...selectedSectors, sector]);
    }
  }, [selectedSectors, onSectorChange]);

  const getSectorIcon = (sector: string) => {
    switch (sector.toLowerCase()) {
      case 'technology': return Code;
      case 'finance': return DollarSign;
      case 'healthcare': return Heart;
      case 'education': return Book;
      case 'marketing': return Sparkles;
      case 'design': return Palette;
      default: return Building2;
    }
  };

  const getSectorColor = (sector: string, isSelected: boolean) => {
    const colors = {
      'technology': isSelected ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200',
      'finance': isSelected ? 'bg-green-600 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200',
      'healthcare': isSelected ? 'bg-red-600 text-white' : 'bg-red-100 text-red-700 hover:bg-red-200',
      'education': isSelected ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200',
      'marketing': isSelected ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200',
      'design': isSelected ? 'bg-pink-600 text-white' : 'bg-pink-100 text-pink-700 hover:bg-pink-200'
    };
    return colors[sector.toLowerCase() as keyof typeof colors] || 
           (isSelected ? 'bg-gray-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base font-semibold text-gray-900 flex items-center gap-2">
          <Building2 className="h-5 w-5 text-purple-600" />
          Preferred Sectors
          <span className="text-red-500">*</span>
        </Label>
        <Badge className="bg-purple-100 text-purple-700">
          {selectedSectors.length} selected
        </Badge>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search sectors (e.g., Technology, Finance, Healthcare)..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="pl-10 pr-4 py-3 border-2 border-gray-200 focus:border-purple-500 transition-colors duration-200"
        />
      </div>

      {/* Sector Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSectors.map((sector, index) => {
          const isSelected = selectedSectors.includes(sector);
          const IconComponent = getSectorIcon(sector);
          
          return (
            <motion.button
              key={sector}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => toggleSector(sector)}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-2 font-medium
                ${isSelected ? 'border-current shadow-lg' : 'border-gray-200 hover:border-current'}
                ${getSectorColor(sector, isSelected)}
              `}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <IconComponent className="h-5 w-5" />
              <span>{sector}</span>
              {isSelected && <CheckCircle className="h-4 w-4 ml-auto" />}
            </motion.button>
          );
        })}
      </div>

      {selectedSectors.length === 0 && (
        <div className="text-center py-4">
          <p className="text-red-500 text-sm flex items-center justify-center gap-1">
            <AlertCircle className="h-4 w-4" />
            Please select at least one sector
          </p>
        </div>
      )}
    </div>
  );
};

const QuickToggles: React.FC<{
  toggles: PreferencesData['quickToggles'];
  onToggleChange: (toggles: PreferencesData['quickToggles']) => void;
}> = ({ toggles, onToggleChange }) => {
  const quickToggleOptions: QuickToggle[] = [
    {
      id: 'topPaying',
      label: 'Match me with top-paying internships',
      description: 'Prioritize internships with higher stipends',
      icon: DollarSign,
      color: 'green'
    },
    {
      id: 'remote',
      label: 'Prioritize remote opportunities',
      description: 'Focus on work-from-home positions',
      icon: Globe,
      color: 'blue'
    },
    {
      id: 'government',
      label: 'Suggest government/PSU internships',
      description: 'Include public sector opportunities',
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'flexible',
      label: 'Flexible schedule preferred',
      description: 'Prefer internships with flexible timings',
      icon: Clock,
      color: 'orange'
    }
  ];

  const handleToggleChange = useCallback((toggleId: keyof PreferencesData['quickToggles'], value: boolean) => {
    onToggleChange({
      ...toggles,
      [toggleId]: value
    });
  }, [toggles, onToggleChange]);

  const getToggleColor = (color: string) => {
    switch (color) {
      case 'green': return 'bg-green-100 border-green-200 text-green-800';
      case 'blue': return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'purple': return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'orange': return 'bg-orange-100 border-orange-200 text-orange-800';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  return (
    <motion.div variants={itemVariants}>
      <Card className="border border-teal-200 bg-teal-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-800">
            <Zap className="h-5 w-5" />
            Quick Preferences
          </CardTitle>
          <CardDescription className="text-teal-700">
            Toggle these options to quickly customize your preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="bg-white rounded-b-lg space-y-4">
          {quickToggleOptions.map((option, index) => (
            <motion.div
              key={option.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`
                flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200
                ${getToggleColor(option.color)}
                ${toggles[option.id] ? 'ring-2 ring-offset-2 ring-blue-500' : ''}
              `}
            >
              <div className="flex items-center gap-4">
                <div className={`
                  w-12 h-12 rounded-xl flex items-center justify-center
                  ${option.color === 'green' ? 'bg-green-600' :
                    option.color === 'blue' ? 'bg-blue-600' :
                    option.color === 'purple' ? 'bg-purple-600' : 'bg-orange-600'}
                `}>
                  <option.icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{option.label}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </div>
              <Switch
                checked={toggles[option.id]}
                onCheckedChange={(checked) => handleToggleChange(option.id, checked)}
              />
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
};

const SavedPreferencesCard: React.FC<{
  preferences: PreferencesData;
  completionPercentage: number;
  onEdit: () => void;
}> = ({ preferences, completionPercentage, onEdit }) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="border border-green-200 bg-green-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <Settings className="h-5 w-5" />
                Saved Preferences
              </CardTitle>
              <CardDescription className="text-green-700">
                Your current internship preferences summary
              </CardDescription>
            </div>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="outline"
                onClick={onEdit}
                className="border-green-300 text-green-700 hover:bg-green-100"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </motion.div>
          </div>
        </CardHeader>
        <CardContent className="bg-white rounded-b-lg space-y-6">
          {/* Completion Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Profile Completion</span>
              <span className="text-sm font-semibold text-green-600">{completionPercentage}%</span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            <p className="text-xs text-gray-500 mt-2">
              {completionPercentage < 70 ? 'Complete your preferences for better recommendations' : 
               completionPercentage < 90 ? 'Almost done! Add a few more details' : 
               'Excellent! Your preferences are comprehensive'}
            </p>
          </div>

          {/* Preferences Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-600" />
                Locations ({preferences.locations.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {preferences.locations.slice(0, 3).map(location => (
                  <Badge key={location} className="bg-blue-100 text-blue-700 text-xs">
                    {location}
                  </Badge>
                ))}
                {preferences.locations.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                    +{preferences.locations.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Building2 className="h-4 w-4 text-purple-600" />
                Sectors ({preferences.sectors.length})
              </h4>
              <div className="flex flex-wrap gap-1">
                {preferences.sectors.slice(0, 3).map(sector => (
                  <Badge key={sector} className="bg-purple-100 text-purple-700 text-xs">
                    {sector}
                  </Badge>
                ))}
                {preferences.sectors.length > 3 && (
                  <Badge className="bg-gray-100 text-gray-600 text-xs">
                    +{preferences.sectors.length - 3} more
                  </Badge>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Stipend Range
              </h4>
              <p className="text-sm text-gray-600">
                ₹{preferences.minStipend.toLocaleString()} - ₹{preferences.maxStipend.toLocaleString()}/month
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                <Globe className="h-4 w-4 text-orange-600" />
                Work Mode
              </h4>
              <Badge className="bg-orange-100 text-orange-700 text-xs capitalize">
                {preferences.modality}
              </Badge>
            </div>
          </div>

          {/* Quick Toggles Summary */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-600" />
              Quick Preferences
            </h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(preferences.quickToggles).map(([key, value]) => {
                if (!value) return null;
                const labels = {
                  topPaying: 'Top Paying',
                  remote: 'Remote Priority',
                  government: 'Government/PSU',
                  flexible: 'Flexible Schedule'
                };
                return (
                  <Badge key={key} className="bg-yellow-100 text-yellow-700 text-xs">
                    {labels[key as keyof typeof labels]}
                  </Badge>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Main Component
export const Preferences: React.FC = () => {
  const { preferences, setPreferences } = useStudent();
  const [localPreferences, setLocalPreferences] = useState<PreferencesData>({
    locations: preferences?.locations || [],
    sectors: preferences?.sectors || [],
    modality: preferences?.modality || 'any',
    minStipend: preferences?.minStipend || 5000,
    maxStipend: 50000, // Default max stipend since it may not exist in preferences
    minDurationWeeks: preferences?.minDurationWeeks || 4,
    maxDurationWeeks: 24, // Default max duration
    availabilityStart: preferences?.availabilityStart || '',
    availabilityEnd: preferences?.availabilityEnd || '',
    homeState: preferences?.homeState || '',
    city: preferences?.city || '',
    ruralUrban: preferences?.ruralUrban || 'unspecified',
    willingToRelocate: preferences?.willingToRelocate || false,
    organizationSize: 'any', // Default value
    quickToggles: {
      topPaying: false,
      remote: false,
      government: false,
      flexible: false
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate completion percentage
  const completionPercentage = useMemo(() => {
    const totalFields = 12;
    let completedFields = 0;
    
    if (localPreferences.locations.length > 0) completedFields++;
    if (localPreferences.sectors.length > 0) completedFields++;
    if (localPreferences.modality !== 'any') completedFields++;
    if (localPreferences.minStipend > 0) completedFields++;
    if (localPreferences.maxStipend > 0) completedFields++;
    if (localPreferences.minDurationWeeks > 0) completedFields++;
    if (localPreferences.availabilityStart) completedFields++;
    if (localPreferences.availabilityEnd) completedFields++;
    if (localPreferences.homeState) completedFields++;
    if (localPreferences.city) completedFields++;
    if (localPreferences.ruralUrban !== 'unspecified') completedFields++;
    if (localPreferences.organizationSize !== 'any') completedFields++;
    
    return Math.round((completedFields / totalFields) * 100);
  }, [localPreferences]);

  const validatePreferences = useCallback(() => {
    const newErrors: Record<string, string> = {};
    
    if (localPreferences.locations.length === 0) {
      newErrors.locations = 'Please select at least one location';
    }
    
    if (localPreferences.sectors.length === 0) {
      newErrors.sectors = 'Please select at least one sector';
    }
    
    if (localPreferences.minStipend >= localPreferences.maxStipend) {
      newErrors.stipend = 'Minimum stipend must be less than maximum stipend';
    }
    
    if (localPreferences.minDurationWeeks >= localPreferences.maxDurationWeeks) {
      newErrors.duration = 'Minimum duration must be less than maximum duration';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [localPreferences]);

  const handleSave = useCallback(async () => {
    if (!validatePreferences()) {
      toast('Please fix the errors in your preferences', { 
        description: 'Check the highlighted fields and try again.' 
      });
      return;
    }

    setIsSaving(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Only set the properties that exist in the actual preferences type
      setPreferences({
        locations: localPreferences.locations,
        sectors: localPreferences.sectors,
        modality: localPreferences.modality,
        minStipend: localPreferences.minStipend,
        // Note: maxStipend is not included since it doesn't exist in the Preferences type
        minDurationWeeks: localPreferences.minDurationWeeks,
        availabilityStart: localPreferences.availabilityStart,
        availabilityEnd: localPreferences.availabilityEnd,
        homeState: localPreferences.homeState,
        city: localPreferences.city,
        ruralUrban: localPreferences.ruralUrban,
        willingToRelocate: localPreferences.willingToRelocate
      });
      
      setIsEditing(false);
      
      toast('Preferences saved successfully!', { 
        description: 'Your preferences will be used to recommend better internships.' 
      });
    } catch (error) {
      toast('Failed to save preferences', { 
        description: 'Please try again later.' 
      });
    } finally {
      setIsSaving(false);
    }
  }, [localPreferences, validatePreferences, setPreferences]);

  const handleReset = useCallback(() => {
    setLocalPreferences({
      locations: [],
      sectors: [],
      modality: 'any',
      minStipend: 5000,
      maxStipend: 50000,
      minDurationWeeks: 4,
      maxDurationWeeks: 24,
      availabilityStart: '',
      availabilityEnd: '',
      homeState: '',
      city: '',
      ruralUrban: 'unspecified',
      willingToRelocate: false,
      organizationSize: 'any',
      quickToggles: {
        topPaying: false,
        remote: false,
        government: false,
        flexible: false
      }
    });
    setErrors({});
  }, []);

  const updatePreferences = useCallback((updates: Partial<PreferencesData>) => {
    setLocalPreferences(prev => ({ ...prev, ...updates }));
    
    // Clear related errors
    const newErrors = { ...errors };
    Object.keys(updates).forEach(key => {
      if (newErrors[key]) delete newErrors[key];
    });
    setErrors(newErrors);
  }, [errors]);

  return (
    <DashboardLayout title="Set Your Preferences">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <h1 className="text-5xl font-black text-gray-900">Set Your Preferences</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Customize your internship experience so we can recommend the best opportunities for you. 
            The more details you provide, the better our AI can match you with perfect internships.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              <span>AI-Powered Matching</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              <span>Personalized Results</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4" />
              <span>Better Recommendations</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Preferences Form */}
          <div className="xl:col-span-2 space-y-8">
            {/* Quick Toggles */}
            <QuickToggles
              toggles={localPreferences.quickToggles}
              onToggleChange={(toggles) => updatePreferences({ quickToggles: toggles })}
            />

            {/* Location and Sector Selection */}
            <motion.div variants={itemVariants}>
              <Card className="border border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Location & Sector Preferences</CardTitle>
                  <CardDescription className="text-blue-700">
                    Tell us where and in which fields you'd like to work
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg space-y-8">
                  <LocationSelector
                    selectedLocations={localPreferences.locations}
                    onLocationChange={(locations) => updatePreferences({ locations })}
                  />
                  
                  <SectorSelector
                    selectedSectors={localPreferences.sectors}
                    onSectorChange={(sectors) => updatePreferences({ sectors })}
                  />
                </CardContent>
              </Card>
            </motion.div>

            {/* Work Preferences */}
            <motion.div variants={itemVariants}>
              <Card className="border border-purple-200 bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-purple-800">Work Preferences</CardTitle>
                  <CardDescription className="text-purple-700">
                    Specify your preferred working conditions and arrangements
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg space-y-6">
                  {/* Work Mode */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-4 block flex items-center gap-2">
                      <Globe className="h-5 w-5 text-purple-600" />
                      Work Mode Preference
                    </Label>
                    <RadioGroup 
                      value={localPreferences.modality} 
                      onValueChange={(value) => updatePreferences({ modality: value as any })}
                      className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                      {[
                        { value: 'any', label: 'Any', icon: Target, color: 'gray' },
                        { value: 'remote', label: 'Remote', icon: Home, color: 'green' },
                        { value: 'onsite', label: 'On-site', icon: Building2, color: 'blue' },
                        { value: 'hybrid', label: 'Hybrid', icon: Globe, color: 'purple' }
                      ].map((option) => (
                        <div key={option.value} className="relative">
                          <RadioGroupItem 
                            value={option.value} 
                            id={option.value}
                            className="peer sr-only"
                          />
                          <Label 
                            htmlFor={option.value}
                            className={`
                              flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200
                              peer-checked:border-purple-500 peer-checked:bg-purple-50 peer-checked:text-purple-700
                              ${option.color === 'gray' ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' :
                                option.color === 'green' ? 'bg-green-50 border-green-200 hover:bg-green-100' :
                                option.color === 'blue' ? 'bg-blue-50 border-blue-200 hover:bg-blue-100' :
                                'bg-purple-50 border-purple-200 hover:bg-purple-100'}
                            `}
                          >
                            <option.icon className="h-6 w-6" />
                            <span className="font-medium">{option.label}</span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Organization Size */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      Organization Size Preference
                    </Label>
                    <Select 
                      value={localPreferences.organizationSize} 
                      onValueChange={(value) => updatePreferences({ organizationSize: value as any })}
                    >
                      <SelectTrigger className="py-3">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any Size</SelectItem>
                        <SelectItem value="startup">Startup (1-50 employees)</SelectItem>
                        <SelectItem value="sme">Small & Medium (51-500 employees)</SelectItem>
                        <SelectItem value="large">Large Enterprise (500+ employees)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Financial & Duration Preferences */}
            <motion.div variants={itemVariants}>
              <Card className="border border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-green-800">Financial & Duration Preferences</CardTitle>
                  <CardDescription className="text-green-700">
                    Set your expectations for stipend and internship duration
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg space-y-6">
                  {/* Stipend Range */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-4 block flex items-center gap-2">
                      <DollarSign className="h-5 w-5 text-green-600" />
                      Monthly Stipend Range (₹)
                    </Label>
                    <div className="space-y-4">
                      <div className="px-4">
                        <Slider
                          value={[localPreferences.minStipend, localPreferences.maxStipend]}
                          onValueChange={([min, max]) => updatePreferences({ minStipend: min, maxStipend: max })}
                          max={100000}
                          min={0}
                          step={1000}
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Minimum</Label>
                          <Input
                            type="number"
                            value={localPreferences.minStipend}
                            onChange={(e) => updatePreferences({ minStipend: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Maximum</Label>
                          <Input
                            type="number"
                            value={localPreferences.maxStipend}
                            onChange={(e) => updatePreferences({ maxStipend: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {errors.stipend && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.stipend}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Duration Range */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-4 block flex items-center gap-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      Duration Range (weeks)
                    </Label>
                    <div className="space-y-4">
                      <div className="px-4">
                        <Slider
                          value={[localPreferences.minDurationWeeks, localPreferences.maxDurationWeeks]}
                          onValueChange={([min, max]) => updatePreferences({ minDurationWeeks: min, maxDurationWeeks: max })}
                          max={52}
                          min={1}
                          step={1}
                          className="w-full"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm text-gray-600">Minimum (weeks)</Label>
                          <Input
                            type="number"
                            value={localPreferences.minDurationWeeks}
                            onChange={(e) => updatePreferences({ minDurationWeeks: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label className="text-sm text-gray-600">Maximum (weeks)</Label>
                          <Input
                            type="number"
                            value={localPreferences.maxDurationWeeks}
                            onChange={(e) => updatePreferences({ maxDurationWeeks: Number(e.target.value) })}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      {errors.duration && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Availability Dates */}
                  <div>
                    <Label className="text-base font-semibold text-gray-900 mb-3 block flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-green-600" />
                      Availability Period
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm text-gray-600">Available From</Label>
                        <Input
                          type="date"
                          value={localPreferences.availabilityStart}
                          onChange={(e) => updatePreferences({ availabilityStart: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-sm text-gray-600">Available Until</Label>
                        <Input
                          type="date"
                          value={localPreferences.availabilityEnd}
                          onChange={(e) => updatePreferences({ availabilityEnd: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Personal Details */}
            <motion.div variants={itemVariants}>
              <Card className="border border-orange-200 bg-orange-50">
                <CardHeader>
                  <CardTitle className="text-orange-800">Personal Details</CardTitle>
                  <CardDescription className="text-orange-700">
                    Help us understand your background for better matching
                  </CardDescription>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-2 block">Home State</Label>
                      <Input
                        placeholder="e.g., Maharashtra, Delhi, Karnataka"
                        value={localPreferences.homeState}
                        onChange={(e) => updatePreferences({ homeState: e.target.value })}
                        className="py-3"
                      />
                    </div>
                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-2 block">City</Label>
                      <Input
                        placeholder="e.g., Mumbai, New Delhi, Bangalore"
                        value={localPreferences.city}
                        onChange={(e) => updatePreferences({ city: e.target.value })}
                        className="py-3"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-base font-semibold text-gray-900 mb-2 block">Area Type</Label>
                      <Select 
                        value={localPreferences.ruralUrban} 
                        onValueChange={(value) => updatePreferences({ ruralUrban: value as any })}
                      >
                        <SelectTrigger className="py-3">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unspecified">Unspecified</SelectItem>
                          <SelectItem value="rural">Rural</SelectItem>
                          <SelectItem value="urban">Urban</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-end">
                      <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-xl w-full">
                        <Switch
                          checked={localPreferences.willingToRelocate}
                          onCheckedChange={(checked) => updatePreferences({ willingToRelocate: checked })}
                        />
                        <Label className="text-base font-medium text-gray-900 cursor-pointer">
                          Willing to relocate for internship
                        </Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Save Buttons */}
            <motion.div variants={itemVariants} className="flex gap-4 pt-4">
              <motion.div 
                className="flex-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {isSaving ? (
                    <>
                      <motion.div
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full mr-3"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      Saving Preferences...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Preferences
                    </>
                  )}
                </Button>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={handleReset}
                  className="px-8 py-4 border-2 border-gray-300 hover:border-gray-400"
                >
                  <RotateCw className="h-5 w-5 mr-2" />
                  Reset
                </Button>
              </motion.div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Saved Preferences Card */}
            <SavedPreferencesCard
              preferences={localPreferences}
              completionPercentage={completionPercentage}
              onEdit={() => setIsEditing(true)}
            />

            {/* Tips Card */}
            <motion.div variants={itemVariants}>
              <Card className="border border-yellow-200 bg-yellow-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <Lightbulb className="h-5 w-5" />
                    Pro Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="bg-white rounded-b-lg space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Add multiple locations to increase your opportunities</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Select related sectors for broader matching</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Keep stipend range flexible for more options</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Update preferences regularly as interests change</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Motivation Card */}
            <motion.div variants={itemVariants}>
              <Card className="border border-purple-200 bg-purple-50">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <blockquote className="text-lg font-semibold text-purple-800 mb-3">
                    "Your preferences guide the AI to match you with the right opportunities"
                  </blockquote>
                  <p className="text-purple-700 text-sm">
                    The more details you provide, the better our recommendations become
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </DashboardLayout>
  );
};

export default Preferences;
