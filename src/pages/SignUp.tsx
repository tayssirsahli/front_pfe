import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import TopbarSign from '@/components/layout/TopbarSign';
import axios from 'axios';

export default function SignUp() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const validateEmail = (email: string) => /\S+@\S+\.\S+/.test(email);
    //const validatePhone = (phone: string) => /^[+]?[0-9]{10,15}$/.test(phone);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);

        // Validation des champs
        if (!validateEmail(email)) {
            setError("Please enter a valid email.");
            return;
        }
       /*  if (!validatePhone(phone)) {
            setError("Please enter a valid phone number.");
            return;
        } */
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const profileImageUrl = mediaUrls[0].startsWith('http')
                ? mediaUrls[0]
                : `http://localhost:5000${mediaUrls[0]}`;

            const response = await fetch('http://localhost:5000/auth/sign-up', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email,
                    password,
                    username,
                    phone,
                    location,
                    avatar_url: profileImageUrl,
                }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Sign-up failed');
            }

            navigate('/signin');
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setLoading(false);
        }
    };

    const handleMediaUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const formData = new FormData();
            Array.from(files).forEach((file) => formData.append('media', file));

            try {
                const response = await axios.post('http://localhost:5000/generated-idea/upload-media', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setMediaUrls((prev) => [...prev, ...response.data.urls]);
            } catch (error) {
                console.error('Upload error:', error);
            }
        }
    };
    const handleRemoveImage = (index: number) => {
        const updatedUrls = mediaUrls.filter((_, i) => i !== index);
        setMediaUrls(updatedUrls);

    };

    return (
        <div>
            <TopbarSign toggleSidebar={() => { }} />
            <div className="flex min-h-screen items-center justify-center pt-16 px-4">
                <div className="mx-auto w-full max-w-lg space-y-6">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold text-primary">Create an Account</h1>
                        <p className="text-gray-500 mt-2 text-sm">Fill in your details below to start your journey</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    type="text"
                                    placeholder="JohnDoe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="+1234567890"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    type="text"
                                    placeholder="Paris, France"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    required
                                />
                            </div>
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
                        </div>

                        {/* Profile Image Upload */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                            <div className="space-y-2">
                                <Label>Profile Image</Label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        multiple
                                        onChange={handleMediaUpload}
                                    />
                                    <Button variant="outline" onClick={() => fileInputRef.current?.click()} type="button">
                                        <ImageIcon className="mr-2 h-5 w-5 text-blue-600" />
                                        Upload Image
                                    </Button>

                                </div>

                            </div>
                            <div className="space-y-2">
                                <div className="flex flex-wrap gap-2">
                                    {mediaUrls.map((url, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={`http://localhost:5000${url}`}
                                                alt={`Uploaded ${index}`}
                                                className="h-20 w-30 rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                            
                                                className="absolute top-0 right-0 p-1  text-black rounded-full"
                                            >
                                                X
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Password Fields */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2/3 transform -translate-y-1/2"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                </button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <div className="relative">
                                <Input
                                    id="confirm-password"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute right-3 top-2/3 transform -translate-y-1/2"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                                </button>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && <p className="text-red-500 text-sm">{error}</p>}

                        <Button className="w-full" type="submit" disabled={loading}>
                            {loading ? 'Signing up...' : 'Sign Up'}
                        </Button>
                    </form>
                    <div className="text-center text-sm">
                        Already have an account?{' '}
                        <Link to="/signin" className="underline">
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
