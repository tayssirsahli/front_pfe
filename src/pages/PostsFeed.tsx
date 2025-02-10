import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Share2, Bookmark } from 'lucide-react';

const posts = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces',
      initials: 'SJ',
    },
    content: 'Just saved this amazing article about AI trends in 2024. The insights about machine learning in healthcare are fascinating! #AI #Healthcare #Innovation',
    timestamp: '2 hours ago',
    likes: 24,
    comments: 5,
    shares: 3,
    source: 'LinkedIn',
  },
  {
    id: 2,
    user: {
      name: 'Michael Chen',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=64&h=64&fit=crop&crop=faces',
      initials: 'MC',
    },
    content: 'Great thread on sustainable business practices. Saving this for future reference. The part about carbon neutrality strategies is particularly relevant. #Sustainability #Business',
    timestamp: '4 hours ago',
    likes: 18,
    comments: 3,
    shares: 2,
    source: 'Twitter',
  },
];

export default function PostsFeed() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Posts Feed</h1>
        <Button>Share an Idea</Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarImage src={post.user.avatar} />
                  <AvatarFallback>{post.user.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{post.user.name}</p>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{post.timestamp}</span>
                  </div>
                  <Badge variant="outline">{post.source}</Badge>
                </div>
              </div>
              <p className="text-sm">{post.content}</p>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  {post.likes}
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  {post.comments}
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" />
                  {post.shares}
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" />
                  Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}