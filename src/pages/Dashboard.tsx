import { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const recentIdeas = [
  {
    id: 1,
    title: 'The Future of Remote Work',
    source: 'LinkedIn',
    date: '2024-03-15',
    category: 'Business Strategy',
  },
  {
    id: 2,
    title: 'AI in Marketing: A Game Changer',
    source: 'Twitter',
    date: '2024-03-14',
    category: 'Marketing',
  },
  {
    id: 3,
    title: 'Building Strong Team Culture',
    source: 'LinkedIn',
    date: '2024-03-13',
    category: 'Leadership',
  },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg bg-background p-2 shadow-md border">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-muted-foreground">{`Ideas: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const [scrapedDataCount, setScrapedDataCount] = useState<number | null>(null);
  const [generatedIdeaCount, setGeneratedIdeaCount] = useState<number | null>(null);
  const [monthlyGeneratedIdeas, setMonthlyGeneratedIdeas] = useState<any[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
      localStorage.setItem('linkedin_token', token);

      window.location.href = '/posts-feed';
    }

    const fetchCounts = async () => {
      try {
        const [scrapedDataRes, generatedIdeaRes] = await Promise.all([
          axios.get('http://localhost:5000/scraped-data/count'),
          axios.get('http://localhost:5000/generated-idea/count'),
        ]);

        // Vérifiez ce que contient la réponse
        console.log('Scraped Data Count:', scrapedDataRes.data);
        console.log('Generated Idea Count:', generatedIdeaRes.data);

        setScrapedDataCount(scrapedDataRes.data); // Assurez-vous que la réponse est un nombre
        setGeneratedIdeaCount(generatedIdeaRes.data); // Assurez-vous que la réponse est un nombre

      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    const fetchMonthlyGeneratedIdeas = async () => {
      try {
        const response = await axios.get('http://localhost:5000/generated-idea/count-by-month');
        console.log('Monthly Generated Ideas:', response.data);
        setMonthlyGeneratedIdeas(response.data); // Remplir les données pour le graphique
      } catch (error) {
        console.error('Error fetching monthly generated ideas:', error);
      }
    };

    fetchCounts();
    fetchMonthlyGeneratedIdeas();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button>Generate New Ideas</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {scrapedDataCount !== null ? scrapedDataCount : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">+20% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Generated Content</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {generatedIdeaCount !== null ? generatedIdeaCount : 'Loading...'}
            </div>
            <p className="text-xs text-muted-foreground">+12 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Across all platforms</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Ideas Growth</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGeneratedIdeas} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                  activeDot={{ r: 8 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIdeas.map((idea) => (
                <div key={idea.id} className="flex items-center space-x-4">
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{idea.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {idea.source} · {idea.category}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">{idea.date}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
