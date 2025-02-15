import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Image, Link as LinkIcon, Smile, Users, Linkedin } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import axios from 'axios';


interface CreatePostDialogProps {
  initialContent?: string;
}

export function CreatePostDialog({ initialContent = '' }: CreatePostDialogProps) {
  const [postContent, setPostContent] = useState(initialContent);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('linkedin_token');
    if (token) {
      localStorage.setItem('linkedin_token', token);
      setAccessToken(token);
      window.history.replaceState({}, document.title, '/');
    } else {
      setAccessToken(localStorage.getItem('linkedin_token'));
    }
  }, []);

  const handleLinkedInAuth = () => {
    window.location.href = 'http://localhost:5000/auth/linkedin';
  };

  const handlePostToLinkedIn = async () => {
    if (accessToken) {
      localStorage.setItem('linkedin_token', accessToken);
    }

    console.log('accessToken:', accessToken);
    if (!accessToken) {
      handleLinkedInAuth();
      return;
    }

    try {
      await axios.post(
        'http://localhost:5000/linkedin/post',
        { content: postContent },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      alert('Post publié avec succès !');
    } catch (error) {
      alert('Erreur lors de la publication');
    }
  };



  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPostContent((prev) => `${prev}\n[Image: ${file.name}]`);
    }
  };

  const handleEmojiSelect = (emoji: any) => {
    setPostContent((prev) => prev + emoji.native);
  };

  const handleMentionUser = () => {
    setPostContent((prev) => `${prev} @user`);
  };

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
        <Button variant="outline" size="sm">
          Share an Idea
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a post</DialogTitle>
        </DialogHeader>
        <div className="flex items-start space-x-4 pt-4">
          <Avatar>
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="What do you want to talk about?"
              className="min-h-[150px] resize-none border-none focus-visible:ring-0"
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
            />
          </div>
        </div>
        <div className="flex items-center justify-between pt-4">
          <div className="flex space-x-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => fileInputRef.current?.click()}
            >
              <Image className="h-5 w-5 text-blue-600" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={handleMentionUser}
            >
              <Users className="h-5 w-5 text-blue-600" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9">
                  <Smile className="h-5 w-5 text-blue-600" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  theme="light"
                  set="native"
                />
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
                      if (e.key === 'Enter') {
                        handleAddLink();
                      }
                    }}
                  />
                  <Button size="sm" onClick={handleAddLink}>Add</Button>
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex items-center space-x-2">

            <Button
              onClick={handlePostToLinkedIn}
              className="flex items-center space-x-2"
            >
              <Linkedin className="h-4 w-4" />
              <span>Post to LinkedIn</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
