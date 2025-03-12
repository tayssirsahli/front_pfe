import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image, Video, Linkedin, Users, Smile, LinkIcon, Share2 } from 'lucide-react';
import axios from 'axios';
import Picker from '@emoji-mart/react';
import { Popover, PopoverContent, PopoverTrigger } from '@radix-ui/react-popover';
import { Input } from './ui/input';

interface CreatePostDialogProps {
  initialContent?: string;
}

export function CreatePostDialog({ initialContent = '' }: CreatePostDialogProps) {
  const [postContent, setPostContent] = useState(initialContent);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    import('@emoji-mart/data').then((emojiData) => setData(emojiData.default || emojiData));
    const token = localStorage.getItem('linkedin_token');
    if (token) {
      setAccessToken(token);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  const handleLinkedInAuth = () => {
    window.location.href = 'http://localhost:5000/auth/linkedin';
  };

  const handlePostToLinkedIn = async () => {
    if (!accessToken) {
      handleLinkedInAuth();
      return;
    }
    try {
      const profileResponse = await axios.get('http://localhost:5000/linkedin/profile', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const userId = profileResponse.data.sub;

      console.log('📝 Post mediaUrls:', mediaUrls);
      await axios.post(
        'http://localhost:5000/linkedin/post',
        { userId, content: postContent, mediaUrls },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert('Post publié avec succès !');
    } catch (error) {
      alert('Erreur lors de la publication');
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

  const handleDeleteMedia = (url: string) => {
    setMediaUrls((prev) => prev.filter((mediaUrl) => mediaUrl !== url));
  };

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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm">
          <Share2 className="mr-2 h-4 w-4" />share 
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="flex items-start space-x-4 pt-4">
          <Avatar><AvatarFallback>U</AvatarFallback></Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What do you want to talk about?"
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
                    className="absolute top-2 right-2  text-black p-1 rounded-full shadow-md "
                    onClick={() => handleDeleteMedia(url)}
                  >
                    X
                  </button>

                </div>
              ))}
            </div>
          </div>
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
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => fileInputRef.current?.click()}>
              <Video className="h-5 w-5 text-blue-600" />
            </Button>
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleMentionUser}>
              <Users className="h-5 w-5 text-blue-600" />
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
            <Popover open={showLinkInput} onOpenChange={setShowLinkInput}>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <LinkIcon className="h-5 w-5 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="flex space-x-2">
                  <Input
                    placeholder="Paste or type a link..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddLink();
                    }}
                  />
                  <Button size="sm" onClick={handleAddLink}>Add</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-grow justify-end mt-4 sm:mt-0">
            <Button onClick={handlePostToLinkedIn} className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4" />
              <span>Post to LinkedIn</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}