import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThumbsUp, MessageSquare, Share2, Bookmark, RefreshCcw, Calendar } from 'lucide-react';
import { CreatePostDialog } from '@/components/CreatePostDialog';
import { PlanifierPostDialog } from '@/components/PlanifierPostDialog';

interface Post {
  id: number;
  user_id: number;
  created_at: string;
  generated_text: string;
}

export default function PostsFeed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1); // Page actuelle
  const postsPerPage = 3; // Nombre de posts par page

  const fetchPosts = () => {
    setIsLoading(true);
    setError(null);

    fetch('http://localhost:5000/generated-idea')
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setError('Failed to load posts. Please try again.');
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Calculer les posts à afficher pour la page actuelle
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(posts.length / postsPerPage); // Total de pages

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Generated Ideas</h1>
        <Button variant="outline" size="sm" onClick={fetchPosts}>
          <RefreshCcw className="mr-2 h-4 w-4" /> Refresh
        </Button>
      </div>

      {isLoading && <p className="text-center text-gray-500">Loading posts...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          <div className="grid gap-4">
            {currentPosts.map((post) => (
              <Card key={post.id}>
                <CardContent className="grid gap-4 p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar>
                      <AvatarFallback>{post.user_id ? post.user_id.toString().charAt(0) : 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-semibold">Published on</p>
                        <span className="text-sm text-muted-foreground">·</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(post.created_at).toLocaleString()}
                        </span>
                      </div>
                      <Badge variant="outline">Generated Idea</Badge>
                    </div>
                  </div>
                  <p className="text-sm">{post.generated_text}</p>
                  <div className="flex items-center space-x-4">
                    

                    <PlanifierPostDialog initialContent={post.generated_text} />

                    <CreatePostDialog initialContent={post.generated_text} />
                    

                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center mt-4 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
