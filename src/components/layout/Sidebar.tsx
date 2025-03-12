import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Lightbulb,
  Sparkles,
  Rss,
  BookMarked,
  Calendar,
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: BookMarked, label: 'Saved Ideas', path: '/saved-ideas' },
    { icon: Sparkles, label: 'Idea Generator', path: '/idea-generator' },
    { icon: Rss, label: 'Generated Posts', path: '/posts-feed' },
    { icon: Calendar, label: 'Scheduled Posts', path: 'calendar' },

  ];



  return (
    <div
      className={cn(
        'fixed left-0 top-0 z-40 h-screen w-64 transform bg-card transition-transform duration-300 ease-in-out',
        isOpen ? 'translate-x-0' : '-translate-x-full'
      )}
    >
      <div className="flex h-16 items-center justify-center border-b px-4">
        <Link to="/" className="flex items-center space-x-2">
          <Lightbulb className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">SocialSpark</span>
        </Link>
      </div>

      <ScrollArea className="h-[calc(100vh-4rem)] px-4 py-6">
        <nav className="space-y-6">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  className="w-full justify-start"
                >
                  <item.icon className="mr-2 h-4 w-4" />
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>


        </nav>
      </ScrollArea>
    </div>
  );
}