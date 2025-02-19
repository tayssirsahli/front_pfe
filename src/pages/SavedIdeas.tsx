import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid, List, Filter } from 'lucide-react';
import axios from 'axios';

interface Idea {
  id: string;
  title: string;
  platform: string;
  author: string;
  created_at: string;
  hashtags: string;
  selected_text: string;
  image_url?: string;
}

export default function SavedIdeas() {
  const [scrapedData, setScrapedData] = useState<Idea[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1); // Page actuelle
  const [ideasPerPage] = useState<number>(3); // Nombre d'idées par page

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('http://localhost:5000/scraped-data');
        const data = await response.json();
        setScrapedData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const handleSeeMoreDetails = (idea: Idea) => {
    setSelectedIdea(idea);
  };

  const handleClosePopup = () => {
    setSelectedIdea(null);
  };

  const handleDeleteIdea = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/scraped-data/${id}`);
      setScrapedData((prevIdees) => prevIdees.filter((idee) => idee.id !== id));
      handleClosePopup();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'idée:', error);
    }
  };

  const filteredIdeas = scrapedData.filter((idea) =>
    idea.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculer les idées visibles en fonction de la page actuelle
  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = filteredIdeas.slice(indexOfFirstIdea, indexOfLastIdea);

  // Fonction pour changer de page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Saved Ideas</h1>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon">
            <Grid className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <List className="h-4 w-4" />
          </Button>
          <Button>
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Input
          className="max-w-sm"
          placeholder="Search saved ideas..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid gap-4">
        {currentIdeas.length === 0 ? (
          <p>No data available to display.</p>
        ) : (
          currentIdeas.map((idea) => (
            <Card key={idea.id}>
              <CardContent className="grid gap-4 p-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="font-semibold">{idea.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <span>{idea.platform}</span>
                      <span>·</span>
                      <span>{idea.author}</span>
                      <span>·</span>
                      <span>{new Date(idea.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleSeeMoreDetails(idea)}>
                    See more details
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {idea.selected_text.length > 150 ? idea.selected_text.slice(0, 150) + '...' : idea.selected_text}
                </p>
                {idea.image_url && (
                  <img src={idea.image_url} alt="Post Image" className="w-32 h-auto" />
                )}
                <div className="flex items-center space-x-2">
                  {idea.hashtags && idea.hashtags.split(',').slice(0, 7).map((hashtag, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => alert(`You clicked on the hashtag: ${hashtag.trim()}`)}
                    >
                      {hashtag.trim()}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 w-full">

          <Button
            variant="outline"
            size="sm"
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage * ideasPerPage >= filteredIdeas.length}
          >
            Next
          </Button>
      </div>





      {selectedIdea && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
          <div className="relative bg-white p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto flex flex-col">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
            >
              ❌
            </button>

            <h2 className="text-xl font-semibold">{selectedIdea.title}</h2>
            <p className="text-sm text-muted-foreground">{selectedIdea.selected_text}</p>

            {selectedIdea.image_url && (
              <img src={selectedIdea.image_url} alt="Post Image" className="w-full h-auto mt-4 rounded-lg" />
            )}

            <div className="mt-4 space-y-2">
              <p><strong>📌 Platform:</strong> {selectedIdea.platform}</p>
              <p><strong>✍️ Author:</strong> {selectedIdea.author}</p>
              <p><strong>📅 Created at:</strong> {new Date(selectedIdea.created_at).toLocaleDateString()}</p>
              <p><strong>🏷️ Hashtags:</strong> {selectedIdea.hashtags}</p>
            </div>

            <div className="mt-4 flex space-x-4">
              <Button
                variant="outline"
                onClick={() => handleDeleteIdea(selectedIdea.id)}
                className="w-full bg-red-500 text-white hover:bg-red-600"
              >
                Delete Idea
              </Button>
              <Button
                variant="outline"
                onClick={handleClosePopup}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
