import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Search, Bell, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TopbarProps {
  toggleSidebar: () => void;
}

export default function Topbar({ toggleSidebar }: TopbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fonction pour récupérer les données de l'utilisateur
  const fetchUserData = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false); // Si pas de token, l'utilisateur est déconnecté
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/auth/current-user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      if (data && data.email) {
        setUserEmail(data.email); // Met à jour l'email de l'utilisateur
        setIsLoggedIn(true); // Utilisateur connecté
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  // Fonction de déconnexion
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:5000/auth/sign-out', {
        method: 'POST',
      });

      localStorage.removeItem("token"); // Supprimer le token
      setIsLoggedIn(false); // Mettre à jour le statut de connexion
      alert("Vous êtes maintenant déconnecté !");
      navigate('/signin'); // Rediriger vers la page de connexion
    } catch (error) {
      console.error('Erreur de déconnexion:', error);
    }
  };

  // Récupérer les données de l'utilisateur au chargement du composant
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <Menu className="h-5 w-5" />
        </Button>

        <div className="ml-4 flex flex-1 items-center space-x-4">
          <div className="relative w-96">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search ideas..." className="pl-8" />
          </div>
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces" />
                  <AvatarFallback>JS</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{isLoggedIn ? userEmail : "My Account"}</DropdownMenuLabel>
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
