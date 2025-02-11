import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Share2, Bookmark } from 'lucide-react';

interface Post {
  id: number;
  user_id: number;
  created_at: string;
  generated_text: string;
}

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('http://localhost:5000/generated-idea')
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generated Ideas</h1>
        <Button>Share an Idea</Button>
      </div>

      <div className="grid gap-4">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-start space-x-4">
                <Avatar>
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center space-x-2">
                    {/*                     <p className="font-semibold">User {post.user_id}</p>
 */}
                    <p className="font-semibold">created_at </p>
                    <span className="text-sm text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleString()}</span>
                  </div>
                  <Badge variant="outline">Generated Idea</Badge>
                </div>
              </div>
              <p className="text-sm">{post.generated_text}</p>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ThumbsUp className="mr-2 h-4 w-4" /> Like
                </Button>
                <Button variant="ghost" size="sm">
                  <MessageSquare className="mr-2 h-4 w-4" /> Comment
                </Button>
                <Button variant="ghost" size="sm">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
                <Button variant="ghost" size="sm">
                  <Bookmark className="mr-2 h-4 w-4" /> Save
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
