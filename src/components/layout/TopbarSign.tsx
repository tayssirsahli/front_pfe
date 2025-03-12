import { Button } from '@/components/ui/button';
import { Sun, Moon, Lightbulb } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/components/theme-provider'; // 🔥 Import du hook pour le thème

interface TopbarProps {
  toggleSidebar: () => void; // Fonction pour toggler la sidebar
}

export default function TopbarSign({ }: TopbarProps) {
  const { theme, setTheme } = useTheme(); // 🌙 Récupération du thème actuel

  return (
    <div className="fixed top-0 left-0 z-40 w-full h-16 bg-card flex items-center justify-between px-4">
      <Link to="/" className="flex items-center space-x-2">
        <Lightbulb className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold text-primary">SocialSpark</span>
      </Link>

      <div className="ml-auto flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
{/*         <Button onClick={toggleSidebar}>Toggle Sidebar</Button> {/* Bouton pour ouvrir/fermer la sidebar */}
       </div>
    </div>
  );
}
