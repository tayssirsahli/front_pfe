import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Menu, Bell, User, Sun, Moon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useTheme } from '@/components/theme-provider';

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoggedIn(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/current-user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        navigate('/signin');
        return;
      }

      const data = await response.json();
      if (data?.id) {
        setUserName(data.raw_user_meta_data.username);
        setProfileImageUrl(data.raw_user_meta_data.avatar_url || '');
        setIsLoggedIn(true);
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données utilisateur:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/auth/sign-out', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        localStorage.removeItem("access_token");
        setIsLoggedIn(false);
        alert("Vous êtes maintenant déconnecté !");
        navigate('/signin');
      } else {
        console.error("Erreur lors de la déconnexion:", response.status);
      }
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  useEffect(() => {
    fetchUserData();

    const intervalId = setInterval(fetchUserData, 60000); 

    return () => clearInterval(intervalId); 
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profileImageUrl} />
                  <AvatarFallback>{userName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{isLoggedIn ? userName : "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {isLoggedIn && (
                <Link to="/profile">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                </Link>
              )}
              {isLoggedIn ? (
                <DropdownMenuItem onClick={handleLogout}>Sign out</DropdownMenuItem>
              ) : (
                <Link to="/signin">
                  <DropdownMenuItem>Sign in</DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
