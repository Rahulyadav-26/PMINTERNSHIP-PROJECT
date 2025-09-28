import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  User,
  FileText,
  Target,
  MessageSquare,
  Database,
  Settings,
  Users,
  BarChart3,
  Shield,
  Map,
  Activity,
  BookOpen,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: string[];
}

const sidebarItems: SidebarItem[] = [
  // Student Routes
  { name: 'Profile', href: '/dashboard/profile', icon: User, roles: ['student'] },
  { name: 'Skills', href: '/dashboard/skills', icon: BookOpen, roles: ['student'] },
  { name: 'Preferences', href: '/dashboard/preferences', icon: Target, roles: ['student'] },
  { name: 'Resume', href: '/dashboard/resume', icon: FileText, roles: ['student'] },
  { name: 'Recommendations', href: '/dashboard/recommendations', icon: Activity, roles: ['student'] },
  { name: 'Applications', href: '/dashboard/applications', icon: FileText, roles: ['student'] },
  { name: 'Offers', href: '/dashboard/offers', icon: Users, roles: ['student'] },
  { name: 'Consent', href: '/dashboard/consent', icon: Shield, roles: ['student'] },
  { name: 'Allocation Results', href: '/dashboard/results', icon: Target, roles: ['student'] },
  { name: 'Feedback', href: '/dashboard/feedback', icon: MessageSquare, roles: ['student'] },
  
  // Admin Routes
  { name: 'Data Management', href: '/admin/data', icon: Database, roles: ['admin'] },
  { name: 'Allocation Rules', href: '/admin/rules', icon: Settings, roles: ['admin'] },
  { name: 'Run Allocation', href: '/admin/allocation', icon: Activity, roles: ['admin'] },
  { name: 'Manual Overrides', href: '/admin/overrides', icon: Users, roles: ['admin'] },
  { name: 'Reports', href: '/admin/reports', icon: BarChart3, roles: ['admin'] },
  
  // Ministry Routes
  { name: 'Bias Detection', href: '/ministry/bias', icon: Shield, roles: ['ministry'] },
  { name: 'Fairness Score', href: '/ministry/fairness', icon: BarChart3, roles: ['ministry'] },
  { name: 'What-If Simulator', href: '/ministry/simulator', icon: Activity, roles: ['ministry'] },
  { name: 'Audit Logs', href: '/ministry/audit', icon: FileText, roles: ['ministry'] },
  
  // Shared Routes
  { name: 'Analytics', href: '/analytics', icon: Map, roles: ['admin', 'ministry'] },
  { name: 'FAQ & Support', href: '/faq', icon: HelpCircle, roles: ['student', 'admin', 'ministry'] },
  { name: 'About', href: '/about', icon: BookOpen, roles: ['student', 'admin', 'ministry'] },
  { name: 'Contact', href: '/contact', icon: Phone, roles: ['student', 'admin', 'ministry'] },
];

export const Sidebar: React.FC = () => {
  const { user } = useAuth();

  const filteredItems = sidebarItems.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-card border-r h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link to="/" className="flex items-center space-x-3 focus:outline-none">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">PM</span>
          </div>
          <div>
            <h2 className="font-semibold text-foreground">PM Internship</h2>
            <p className="text-xs text-muted-foreground">Smart Allocation</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            className={({ isActive }) =>
              cn(
                'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )
            }
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
            <span className="text-secondary-foreground font-medium text-xs">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {user?.name}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};