import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image, Video, Linkedin, Users, Smile, LinkIcon, Calendar } from 'lucide-react';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Input } from './ui/input';

interface PlanifierPostDialogProps {
    initialContent?: string;
}

export function PlanifierPostDialog({ initialContent = '' }: PlanifierPostDialogProps) {
    const [postContent, setPostContent] = useState(initialContent);
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [linkUrl, setLinkUrl] = useState('');
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [data, setData] = useState<any>(null);

    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isPlanifierDialogOpen, setIsPlanifierDialogOpen] = useState(false); // ✅ Gestion du popup principal

    const [scheduledDate, setScheduledDate] = useState<string>('');
    const [scheduledTime, setScheduledTime] = useState<string>('');

    useEffect(() => {
        import('@emoji-mart/data').then((emojiData) => setData(emojiData.default || emojiData));
        const token = localStorage.getItem('linkedin_token');
        if (token) {
            setAccessToken(token);
            window.history.replaceState({}, document.title, '/');
        }
    }, []);

    const handlePostToLinkedIn = async () => {
        if (!scheduledDate || !scheduledTime) {
            alert('Veuillez sélectionner une date et une heure pour planifier votre post.');
            return;
        }

        try {
            const token = localStorage.getItem("access_token");
            const response = await fetch("http://localhost:5000/auth/current-user", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (!response.ok) throw new Error('Erreur lors de la récupération de l’utilisateur');
            const data = await response.json();
            const userId = data.id;
            console.log('👤 scheduledTime:', scheduledTime);

            // Créer la date en utilisant le fuseau horaire local
            const localDate = new Date(`${scheduledDate}T${scheduledTime}:00`);
    
            // Convertir la date locale en format ISO-8601 (sans perte d'heure)
            const isoDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000).toISOString();
    
            console.log('👤 scheduled time in ISO-8601', isoDate);
            const postData = {
                content: postContent,
                urls: mediaUrls,
                date: new Date(scheduledDate).toISOString(), // Convertir en ISO 8601
                temps: isoDate,               
                user_id: userId,
                joints_urls: mediaUrls,
            };

            const postResponse = await axios.post('http://localhost:5000/posts/add', postData);
            if (postResponse.status === 201) {
                setIsPlanifierDialogOpen(false); // ✅ Fermer le popup de planification
                setTimeout(() => setIsSuccessModalOpen(true), 300); // ✅ Attendre que le popup se ferme, puis ouvrir le modal
                setPostContent('');
                setMediaUrls([]);
                setScheduledDate('');
                setScheduledTime('');
            }
        } catch (error) {
            console.error('Erreur lors de l\'enregistrement du post:', error);
            alert('Erreur lors de la planification');
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
                console.error('Erreur lors de l\'upload :', error);
            }
        }
    };

    const handleDeleteMedia = (url: string) => setMediaUrls((prev) => prev.filter((mediaUrl) => mediaUrl !== url));
    const handleEmojiSelect = (emoji: any) => setPostContent((prev) => prev + emoji.native);
    const handleMentionUser = () => setPostContent((prev) => `${prev} @user`);
    const handleAddLink = () => {
        if (linkUrl) {
            setPostContent((prev) => `${prev} ${linkUrl}`);
            setLinkUrl('');
            setShowLinkInput(false);
        }
    };

    return (
        <>
            {/* ✅ Popup Planification */}
            <Dialog open={isPlanifierDialogOpen} onOpenChange={setIsPlanifierDialogOpen}>
                <DialogTrigger asChild>
                    <Button size="sm">
                        <Calendar className="mr-2 h-4 w-4" /> Planification
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                        <DialogTitle>Planifier un post</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-start space-x-4 pt-4">
                        <Avatar><AvatarFallback>U</AvatarFallback></Avatar>
                        <div className="flex-1">
                            <Textarea
                                placeholder="De quoi voulez-vous parler ?"
                                className="min-h-[150px] resize-none border-none focus-visible:ring-0"
                                value={postContent}
                                onChange={(e) => setPostContent(e.target.value)}
                            />
                            <div className="grid grid-cols-2 gap-2 mt-2 overflow-auto max-h-72">
                                {mediaUrls.map((url, idx) => (
                                    <div key={idx} className="relative">
                                        {url.match(/\.(mp4|webm|ogg)$/i) ? (
                                            <video src={`http://localhost:5000${url}`} controls className="mt-2 w-full max-h-64 object-cover rounded-lg shadow-md" />
                                        ) : (
                                            <img src={`http://localhost:5000${url}`} alt="Uploaded media" className="mt-2 w-full max-h-64 object-cover rounded-lg shadow-md" />
                                        )}
                                        <button
                                            className="absolute top-2 right-2 text-black p-1 rounded-full shadow-md"
                                            onClick={() => handleDeleteMedia(url)}
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Date & Heure */}
                    <div className="mt-4 flex space-x-2">
                        <Input type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} />
                        <Input type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} />
                    </div>

                    <div className="flex items-center justify-between pt-4 flex-wrap">
                        <div className="flex space-x-2">
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleMediaUpload}
                            />
                            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()}>
                                <Image className="h-5 w-5 text-blue-600" />
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-9 w-9">
                                        <Smile className="h-5 w-5 text-blue-600" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0" align="start">
                                    <Picker data={data} onEmojiSelect={handleEmojiSelect} theme="light" set="native" />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="flex flex-grow justify-end mt-4 sm:mt-0">
                            <Button onClick={handlePostToLinkedIn} className="flex items-center space-x-2">
                                <Linkedin className="h-4 w-4" />
                                <span>Planifier sur LinkedIn</span>
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* ✅ Modal Succès affiché après fermeture */}
            <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
                <DialogContent className="dark:bg-gray-800 dark:text-white">
                    <DialogHeader>
                        <DialogTitle>Succès 🎉</DialogTitle>
                    </DialogHeader>
                    <p>Votre post a été planifié avec succès ! 🚀</p>
                    <Button onClick={() => setIsSuccessModalOpen(false)}>Fermer</Button>
                </DialogContent>
            </Dialog>
        </>
    );
}
