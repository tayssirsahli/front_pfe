import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false); // Success modal state
  // Success modal state

  interface ScheduledPost {
    id: string;
    user_id: string;
    content: string;
    date: string;
    temps: string;
    etat: string;
    urls: string[];
    title?: string;
  }

  // 🔄 Récupérer les posts programmés depuis l'API
  const loadScheduledPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/posts');
      setScheduledPosts(response.data);

      //console.log('📥 Posts programmés chargés :', response.data);
    } catch (error) {
      console.error('❌ Erreur lors de la récupération des posts programmés', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = () => {
    window.location.href = 'http://localhost:5000/auth/linkedin';
  };

  useEffect(() => {
    const token = localStorage.getItem('linkedin_token');
    //console.log(`🔑 AccessToken utilisé : ${token}`);

    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, '/');
    } else {
      handleLinkedInAuth();
    }
    loadScheduledPosts();
  }, []);

  // 🔔 Vérifie toutes les 60 secondes si un post doit être publié
  useEffect(() => {
    const interval = setInterval(() => {
      checkAndPublishPosts();
    }, 60000);

    return () => clearInterval(interval);
  }, [scheduledPosts, accessToken]);

  const cancelScheduledPost = async (id: string) => {
    try {
      const response = await axios.put(`http://localhost:5000/posts/${id}`, {
        etat: 'Annuler',
      });
      if (response.status === 200) {
        console.log(`🔄 État du post ${id} mis à jour sur 'publiée'.`);
        setIsUpdateModalOpen(true); // Open success modal
        loadScheduledPosts(); // ♻️ Rafraîchir la liste après la publication

      }

    } catch (error) {
      if (error instanceof Error) {
        console.error(`❌ Erreur lors de l'annulation du post ${id}:`, error.message);
      } else {
        console.error(`❌ Erreur inconnue lors de l'annulation du post ${id}:`, error);
      }
    }
  };

  // 🚀 Publier les posts dont la date/heure correspond à l'heure actuelle
  const checkAndPublishPosts = async () => {
    const now = new Date();
    console.log(`🕒 Vérification des posts à : ${now}`);

    for (const post of scheduledPosts) {

      console.log('date', post.date);  // Affiche la date
      console.log('time', post.temps);  // Affiche l'heure
      const DateK = post.date.split('T')[0]; // "2025-03-07"
      const TimeK = post.temps.split('T')[1]?.split('.')[0]; // "19:44:00"  
      console.log('timeK', TimeK);
      console.log('DateK', DateK);
      const postDateTime = new Date(`${DateK} ${TimeK}`);
      console.log('postDateTime : ', postDateTime);
      console.log('nowTimestamp : ', now);
      console.log('post.etat : ', post.etat);
      if (!isNaN(postDateTime.getTime()) && now.getTime() >= postDateTime.getTime() && post.etat === 'planifer') {
        console.log(`🚀 Post ${post.id} en cours de publication...`);

        try {
          if (!accessToken) {
            console.log('🔒 Aucun token trouvé. Redirection pour authentification.');
            handleLinkedInAuth();
            return;
          }
          console.log(`🚀 Tentative de publication du post ${post.id} sur LinkedIn...`);
          console.log(`🔗 Contenu : ${post.content}`);
          console.log(`🖼️ Médias :`, post.urls)
          const profileResponse = await axios.get('http://localhost:5000/linkedin/profile', {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          console.log('profileResponse', profileResponse);
          if (profileResponse.status === 200) {
            const userId = profileResponse.data.sub;
            console.log(`🔗 Utilisateur : ${userId}`);
            const response = await axios.post(
              'http://localhost:5000/linkedin/post',
              { userId: userId, content: post.content, mediaUrls: post.urls },
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            console.log('response', response);
            if (response.status===201) {
              console.log(`✅ Post ${post.id} publié avec succès sur LinkedIn !`);
              await axios.put(`http://localhost:5000/posts/${post.id}`, {
                etat: 'publier',
              });
              console.log(`🔄 État du post ${post.id} mis à jour sur 'publiée'.`);

            } else {
              console.log(`🔄 État du post ${post.id} n'est pas mis à jour .`);

            }
            loadScheduledPosts(); // ♻️ Rafraîchir la liste après la publication
            setIsSuccessModalOpen(true); // Open success modal
          }
          else {
            console.log('❌ Erreur lors de la récupération du profil LinkedIn');
          }

        } catch (error) {
          if (error instanceof Error) {
            console.error(`❌ Erreur lors de la publication du post ${post.id}:`, error.message);
          } else {
            console.error(`❌ Erreur inconnue lors de la publication du post ${post.id}:`, error);
          }
        }
      }
    }
  };

  const filteredPosts = scheduledPosts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return Array.isArray(post.urls) && post.urls.some(url => url.toLowerCase() === selectedPlatform);
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage your social media posts
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select dates to view scheduled posts</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <Card
                key={post.id}
                className={cn(
                  'transition-colors hover:bg-muted/50 cursor-pointer',
                  post.etat === 'draft' && 'border-dashed'
                )}
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    {post.title || post.content?.slice(0, 50) + '...' || 'No title'}
                  </div>
                  {post.etat === 'draft' && (
                    <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {post.date
                          ? new Date(post.date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                          : 'No date'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>  {new Date(new Date(post.temps).getTime() + new Date(post.temps).getTimezoneOffset() * 60000).toLocaleTimeString()}
                      </span>
                    </div>
                    <Button onClick={() => cancelScheduledPost(post.id)} variant="outline" size="sm">
                      Cancel
                    </Button>
                  </div>

                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your post has been successfully published.</p>
            <Button onClick={() => setIsSuccessModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Your post has been successfully cancled.</p>
            <Button onClick={() => setIsUpdateModalOpen(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
