import React, { useState, useCallback } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useStudent } from '@/contexts/StudentContext';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  User, FileText, Target, MessageSquare, Database, Settings,
  Users, BarChart3, Shield, Map, Activity, BookOpen, Phone,
  HelpCircle, ChevronLeft, ChevronRight, LogOut, Bell,
  Sparkles, Crown, ChevronDown, Search, Home, Award
} from 'lucide-react';

// TypeScript Interfaces
interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
  badge?: number | string;
  isNew?: boolean;
  children?: SidebarItem[];
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

// Enhanced sidebar configuration with sections and badges
const sidebarConfig: SidebarSection[] = [
  {
    title: 'Dashboard',
    items: [
      { name: 'Overview', href: '/dashboard', icon: Home, roles: ['student', 'admin', 'ministry'] },
      { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['student'] },
      { name: 'Skills', href: '/dashboard/skills', icon: BookOpen, roles: ['student'] },
      { name: 'Preferences', href: '/dashboard/preferences', icon: Target, roles: ['student'] },
      { name: 'Resume', href: '/dashboard/resume', icon: FileText, roles: ['student'] },
    ]
  },
  {
    title: 'Applications',
    items: [
      { name: 'Recommendations', href: '/dashboard/recommendations', icon: Activity, roles: ['student'], badge: 'New', isNew: true },
      { name: 'Applications', href: '/dashboard/applications', icon: FileText, roles: ['student'], badge: 3 },
      { name: 'Offers', href: '/dashboard/offers', icon: Award, roles: ['student'], badge: 2 },
      { name: 'Results', href: '/dashboard/results', icon: Target, roles: ['student'] },
      { name: 'Feedback', href: '/dashboard/feedback', icon: MessageSquare, roles: ['student'] },
    ]
  },
  {
    title: 'Administration',
    items: [
      { name: 'Data Management', href: '/admin/data', icon: Database, roles: ['admin'] },
      { name: 'Allocation Rules', href: '/admin/rules', icon: Settings, roles: ['admin'] },
      { name: 'Run Allocation', href: '/admin/allocation', icon: Activity, roles: ['admin'] },
      { name: 'Manual Overrides', href: '/admin/overrides', icon: Users, roles: ['admin'] },
      { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['admin'] },
    ]
  },
  {
    title: 'Ministry',
    items: [
      { name: 'Bias Detection', href: '/ministry/bias', icon: Shield, roles: ['ministry'] },
      { name: 'Fairness Score', href: '/ministry/fairness', icon: BarChart3, roles: ['ministry'] },
      { name: 'What-If Simulator', href: '/ministry/simulator', icon: Activity, roles: ['ministry'] },
      { name: 'Audit Logs', href: '/ministry/audit', icon: FileText, roles: ['ministry'] },
    ]
  },
  {
    title: 'Support',
    items: [
      { name: 'Analytics', href: '/analytics', icon: Map, roles: ['admin', 'ministry'] },
      { name: 'FAQ & Support', href: '/faq', icon: HelpCircle, roles: ['student', 'admin', 'ministry'] },
      { name: 'About', href: '/about', icon: BookOpen, roles: ['student', 'admin', 'ministry'] },
      { name: 'Contact', href: '/contact', icon: Phone, roles: ['admin'] },
    ]
  }
];

// Animation Variants
const sidebarVariants: Variants = {
  expanded: {
    width: 280,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40
    }
  },
  collapsed: {
    width: 80,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 40
    }
  }
};

const itemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30
    }
  },
  hover: {
    x: 4,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30
    }
  }
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

// Utility Functions
const getRoleColor = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-red-100 text-red-700 border-red-200';
    case 'ministry': return 'bg-purple-100 text-purple-700 border-purple-200';
    case 'student': return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

const getRoleIcon = (role: string) => {
  switch (role) {
    case 'admin': return Shield;
    case 'ministry': return Crown;
    case 'student': return User;
    default: return User;
  }
};

// Reusable Components
const NavItem: React.FC<{
  item: SidebarItem;
  isCollapsed: boolean;
  isActive: boolean;
}> = ({ item, isCollapsed, isActive }) => {
  const IconComponent = item.icon;

  const navContent = (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      className={cn(
        'group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer relative',
        isActive
          ? 'bg-blue-600 text-white shadow-lg'
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      )}
    >
      <div className={cn(
        'flex items-center justify-center w-6 h-6 transition-colors duration-200',
        isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-600'
      )}>
        <IconComponent className="w-5 h-5" />
      </div>

      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-between w-full min-w-0"
          >
            <span className="truncate">{item.name}</span>
            
            {/* Badge */}
            {item.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 400, damping: 30 }}
              >
                {item.isNew ? (
                  <Badge className="bg-green-500 text-white text-xs px-2 py-0.5 ml-2">
                    <Sparkles className="w-3 h-3 mr-1" />
                    {item.badge}
                  </Badge>
                ) : (
                  <Badge 
                    className={cn(
                      "text-xs px-2 py-0.5 ml-2",
                      isActive ? "bg-white/20 text-white" : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {item.badge}
                  </Badge>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute left-0 top-1/2 w-1 h-8 bg-white rounded-r-full -translate-y-1/2"
          layoutId="activeIndicator"
          transition={{ type: "spring", stiffness: 400, damping: 40 }}
        />
      )}
    </motion.div>
  );

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <NavLink to={item.href}>
              {navContent}
            </NavLink>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <div className="flex items-center gap-2">
              <span>{item.name}</span>
              {item.badge && (
                <Badge className="bg-blue-100 text-blue-700 text-xs">
                  {item.badge}
                </Badge>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <NavLink to={item.href}>
      {navContent}
    </NavLink>
  );
};

const SectionHeader: React.FC<{
  title: string;
  isCollapsed: boolean;
}> = ({ title, isCollapsed }) => {
  if (isCollapsed) {
    return <Separator className="my-4 mx-4" />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="px-6 py-2 mt-6 first:mt-0"
    >
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
        {title}
      </h3>
    </motion.div>
  );
};

const UserProfile: React.FC<{
  isCollapsed: boolean;
  user: any;
  profile: any;
  onLogout: () => void;
}> = ({ isCollapsed, user, profile, onLogout }) => {
  const displayName = profile?.name || user?.name || 'User';
  const initial = displayName.charAt(0).toUpperCase();
  const RoleIcon = getRoleIcon(user?.role);

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="p-4">
              <Avatar className="w-12 h-12 border-2 border-gray-200">
                <AvatarImage src={user?.profileImage} />
                <AvatarFallback className="bg-blue-500 text-white font-bold text-lg">
                  {initial}
                </AvatarFallback>
              </Avatar>
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="ml-2">
            <div className="text-center">
              <p className="font-medium">{displayName}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="p-6 space-y-4"
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 border-2 border-gray-200">
          <AvatarImage src={user?.profileImage} />
          <AvatarFallback className="bg-blue-500 text-white font-bold text-lg">
            {initial}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {displayName}
          </p>
          <div className="flex items-center gap-2 mt-1">
            <RoleIcon className="w-3 h-3" />
            <span className="text-xs text-gray-500 capitalize">
              {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* Role Badge */}
      <Badge className={cn("w-full justify-center py-2", getRoleColor(user?.role))}>
        <RoleIcon className="w-3 h-3 mr-2" />
        {user?.role === 'admin' ? 'Administrator' : 
         user?.role === 'ministry' ? 'Ministry' : 'Student'}
      </Badge>

      {/* Quick Actions */}
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="flex-1 text-xs border-gray-300 hover:bg-gray-50"
        >
          <Bell className="w-3 h-3 mr-1" />
          Alerts
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={onLogout}
          className="flex-1 text-xs border-red-300 text-red-700 hover:bg-red-50"
        >
          <LogOut className="w-3 h-3 mr-1" />
          Logout
        </Button>
      </div>
    </motion.div>
  );
};

// Main Component
export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { profile } = useStudent();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter sidebar items based on user role and search
  const filteredSections = sidebarConfig
    .map(section => ({
      ...section,
      items: section.items.filter(item => 
        user?.role && 
        item.roles.includes(user.role) &&
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(section => section.items.length > 0);

  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
  }, [logout]);

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isCollapsed ? "collapsed" : "expanded"}
      className="bg-white border-r-2 border-gray-100 h-screen flex flex-col shadow-lg relative"
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <Link to="/" className="flex items-center gap-3 focus:outline-none group">
                  <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-200">
                    <span className="text-white font-bold text-lg">PM</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-gray-900 text-lg">PM Internship</h2>
                    <p className="text-xs text-gray-500 font-medium">Smart Allocation System</p>
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Collapse Toggle */}
          <motion.button
            onClick={toggleCollapse}
            className={cn(
              "p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200",
              isCollapsed && "mx-auto"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-gray-600" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Search */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="p-4 border-b border-gray-100"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search navigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-gray-300">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {filteredSections.map((section) => (
            <div key={section.title}>
              <SectionHeader title={section.title} isCollapsed={isCollapsed} />
              <div className="px-4 space-y-1">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    item={item}
                    isCollapsed={isCollapsed}
                    isActive={location.pathname === item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </motion.div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-gray-100">
        <UserProfile
          isCollapsed={isCollapsed}
          user={user}
          profile={profile}
          onLogout={handleLogout}
        />
      </div>

      {/* Version Info */}
      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="px-6 py-3 border-t border-gray-100 bg-gray-50"
        >
          <p className="text-xs text-gray-500 text-center">
            Version 2.1.0 • Built with ❤️
          </p>
        </motion.div>
      )}
    </motion.aside>
  );
};

export default Sidebar;
