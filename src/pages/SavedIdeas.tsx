import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Grid, List, Filter, Linkedin, Twitter, Facebook, Calendar } from 'lucide-react';

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
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [ideasPerPage] = useState<number>(3);

  // 👉 Nouveaux états pour les filtres combinés
  const [selectedPlatform, setSelectedPlatform] = useState<string>('All');
  const [dateFilter, setDateFilter] = useState<string>('recent'); // default: Most Recent

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
  const handleClosePopup = () => setSelectedIdea(null);

  const handleDeleteIdea = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/scraped-data/${id}`);
      setScrapedData((prevIdees) => prevIdees.filter((idee) => idee.id !== id));
      handleClosePopup();
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'idée:', error);
    }
  };

  // 🗓️ Fonction de filtrage combiné (date + tri)
  const filterAndSortIdeas = (ideas: Idea[]) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000;

    return ideas
      .filter((idea) => {
        const ideaDate = new Date(idea.created_at);
        switch (dateFilter) {
          case 'today':
            return ideaDate.toDateString() === now.toDateString();
          case 'yesterday':
            return (
              ideaDate.toDateString() ===
              new Date(now.getTime() - oneDay).toDateString()
            );
          case '30days':
            return ideaDate >= new Date(now.getTime() - 30 * oneDay);
          case '90days':
            return ideaDate >= new Date(now.getTime() - 90 * oneDay);
          case 'lastyear':
            return ideaDate.getFullYear() === now.getFullYear() - 1;
          default:
            return true; // 'recent' et 'oldest' ne filtrent pas, juste trient
        }
      })
      .sort((a, b) =>
        dateFilter === 'oldest'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  };

  // 🔍 Application des filtres (plateforme + date + recherche)
  const filteredIdeas = filterAndSortIdeas(
    scrapedData.filter(
      (idea) =>
        (selectedPlatform === 'All' || idea.platform === selectedPlatform) &&
        idea.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const indexOfLastIdea = currentPage * ideasPerPage;
  const indexOfFirstIdea = indexOfLastIdea - ideasPerPage;
  const currentIdeas = filteredIdeas.slice(indexOfFirstIdea, indexOfLastIdea);

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

          {/* 🎯 Filtre par plateforme avec icônes */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              {/* Icône dynamique en fonction de la plateforme sélectionnée */}
              {selectedPlatform === 'linkedin' && <Linkedin className="h-4 w-4 text-gray-400 dark:text-gray-300" />}
              {selectedPlatform === 'X' && <Twitter className="h-4 w-4 text-gray-400 dark:text-gray-300" />}
              {selectedPlatform === 'facebook' && <Facebook className="h-4 w-4 text-gray-400 dark:text-gray-300" />}
              {selectedPlatform === 'All' && <Grid className="h-4 w-4 text-gray-400 dark:text-gray-300" />}
            </div>
            <select
              className="border rounded-md pl-8 pr-2 py-1 text-xs bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
            >
              <option value="All">All Platforms</option>
              <option value="linkedin">LinkedIn</option>
              <option value="X">X (Twitter)</option>
              <option value="facebook">Facebook</option>
            </select>
          </div>

          {/* 🗓️ Filtre combiné (date + tri) avec icône calendrier */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
              <Calendar className="h-4 w-4 text-gray-400 dark:text-gray-300" />
            </div>
            <select
              className="border rounded-md pl-8 pr-2 py-1 text-xs bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 transition-colors duration-300"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="recent">Most Recent</option>
              <option value="oldest">Oldest First</option>
              <option value="today">Aujourd’hui</option>
              <option value="yesterday">Hier</option>
              <option value="30days">30 derniers jours</option>
              <option value="90days">90 derniers jours</option>
              <option value="lastyear">L’année dernière</option>
            </select>
          </div>



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
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSeeMoreDetails(idea)}
                  >
                    See more details
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  {idea.selected_text.length > 150
                    ? idea.selected_text.slice(0, 150) + '...'
                    : idea.selected_text}
                </p>
                {idea.image_url && (
                  <img src={idea.image_url} className="w-32 h-auto" />
                )}
                <div className="flex items-center space-x-2">
                  {idea.hashtags &&
                    idea.hashtags.split(',').slice(0, 7).map((hashtag, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          alert(`You clicked on the hashtag: ${hashtag.trim()}`)
                        }
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

      {/* 📚 Pagination */}
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
          <div className="relative bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto flex flex-col shadow-lg dark:shadow-xl">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 bg-gray-200 dark:bg-gray-700 rounded-full p-2 hover:bg-gray-300 dark:hover:bg-gray-600"
            >
              ❌
            </button>

            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{selectedIdea.title}</h2>
            <p className="text-sm text-muted-foreground dark:text-gray-400">{selectedIdea.selected_text}</p>

            {selectedIdea.image_url && (
              <img
                src={selectedIdea.image_url}
                alt="Post Image"
                className="w-52 h-52 object-cover mt-4 rounded-lg"
              />
            )}

            <div className="mt-4 space-y-2 text-gray-900 dark:text-gray-100">
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
                className="w-full bg-gray-200 dark:bg-gray-600 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-500"
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
