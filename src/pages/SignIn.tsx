import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react'; // Import des icônes
import TopbarSign from '@/components/layout/TopbarSign';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); // État pour toggler l'affichage du mot de passe
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Gérer l'état de la barre latérale
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
    
        try {
            const response = await fetch('http://localhost:5000/auth/sign-in', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(data.message || 'Sign-in failed');
            }
    
            // Vérification que le token est bien dans la réponse
            if (data.session?.access_token) {
                localStorage.setItem('access_token', data.session.access_token); // Sauvegarde du token dans le localStorage
                navigate('/'); // Redirection après succès
            } else {
                throw new Error('No token received');
            }
        } catch (err) {
            setError((err as any)?.message);
        } finally {
            setLoading(false);
        }
    };
    

    // Fonction pour toggler la barre latérale
    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            {/* Inclure la barre latérale en haut */}
            <TopbarSign toggleSidebar={toggleSidebar} />

            <div className="flex min-h-screen items-center justify-center">
                <div className="mx-auto w-full max-w-sm space-y-6">
                    <div className="space-y-2 text-center">
                        <h1 className="text-3xl font-bold">Welcome back</h1>
                        <p className="text-muted-foreground">Enter your credentials to sign in</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="m@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type={showPassword ? 'text' : 'password'} // Basculer entre texte et mot de passe
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            {/* Bouton pour afficher/masquer le mot de passe */}
                            <button
                                type="button"
                                className="absolute right-3 top-2/3 transform -translate-y-1/2 flex items-center justify-center"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5 text-gray-500" />
                                ) : (
                                    <Eye className="h-5 w-5 text-gray-500" />
                                )}
                            </button>
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Don't have an account?{' '}
                        <Link to="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>

            {/* Sidebar - Conditionner l'affichage de la sidebar indépendamment */}
            <div className={`transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                {/* Sidebar content ici */}
            </div>
        </div>
    );
}
