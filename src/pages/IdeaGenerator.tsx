import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';

interface Idea {
  id: string;
  title: string;
  platform: string;
  author: string;
  created_at: string;
  hashtags: string;
  selected_text: string;
  image_url?: string;
  id_user: string;
}

export default function IdeaGenerator() {
  const [step, setStep] = useState(1);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [selectedIdeas, setSelectedIdeas] = useState<Idea[]>([]);
  const [userInput, setUserInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch('http://localhost:5000/scraped-data')
      .then((response) => response.json())
      .then((data: Idea[]) => {
        setIdeas(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load data');
        setLoading(false);
      });
  }, []);

  const handleSelectIdea = (idea: Idea) => {
    setSelectedIdeas((prev) => {
      const isAlreadySelected = prev.some((item) => item.id === idea.id);
      return isAlreadySelected
        ? prev.filter((item) => item.id !== idea.id) // Désélection
        : [...prev, idea]; // Sélection
    });
  };

  const handleGenerateContent = async () => {
    setGenerating(true);
    setResponse(null);

    // Concaténer les textes sélectionnés et l'input utilisateur
    const selectedText = selectedIdeas.map((idea) => idea.selected_text).join(' ');
    const finalMessage = `${userInput} ${selectedText} `.trim();

    const payload = { message: finalMessage };

    try {
      const res = await fetch('http://localhost:5000/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setResponse(data.response);
    } catch (err) {
      setResponse('Failed to generate content.');
    } finally {
      setGenerating(false);
    }

    setStep(3);
  };

  const handleSaveNewContent = async () => {
    if (!selectedIdeas.length || !response) {
      setError('Please select ideas and generate content before saving.');
      return;
    }

    setLoading(true);
    setError(null);

    const userId = selectedIdeas[0].id_user; // Assurez-vous que l'ID utilisateur provient des idées sélectionnées
    const generatedText = response; // Le texte généré par le chatbot

    const payload = {
      user_id: userId,
      generated_text: generatedText,
    };

    console.log('Payload:', JSON.stringify(payload, null, 2));
    try {
      const res = await fetch('http://localhost:5000/generated-idea/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload, null, 2), // Ajout du formatage JSON
      });

      if (res.ok) {
        const data = await res.json();
        setResponse('Content saved successfully!');
        setStep(1); // Réinitialiser l'étape après sauvegarde
        setSelectedIdeas([]); // Réinitialiser la sélection
        setUserInput(''); // Réinitialiser l'input utilisateur
      } else {
        setError('Failed to save content.');
      }
    } catch (err) {
      setError('Error occurred while saving content.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Idea Generator</h1>
        <div className="flex items-center space-x-2">
          <Badge variant={step >= 1 ? 'default' : 'outline'}>Select Ideas</Badge>
          <Badge variant={step >= 2 ? 'default' : 'outline'}>Add Context</Badge>
          <Badge variant={step >= 3 ? 'default' : 'outline'}>Generate</Badge>
        </div>
      </div>

      {loading && <p>Loading ideas...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {step === 1 && !loading && !error && (
        <Card>
          <CardHeader>
            <CardTitle>Select Ideas to Combine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {ideas.map((idea) => (
              <div key={idea.id} className="flex items-center space-x-4">
                <Checkbox
                  id={`idea-${idea.id}`}
                  onCheckedChange={() => handleSelectIdea(idea)}
                />
                <div className="flex-1">
                  <label htmlFor={`idea-${idea.id}`} className="text-sm font-medium">
                    {idea.title}
                  </label>
                  <p className="text-sm text-muted-foreground">{idea.platform}</p>
                </div>
              </div>
            ))}
            <Button onClick={() => setStep(2)} className="mt-4">
              Next: Add Context
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Add Your Thoughts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Add your thoughts and context to help generate better content..."
              className="min-h-[200px]"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={handleGenerateContent}>Next: Generate</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Selected Ideas:</h3>
              <div className="space-y-2">
                {selectedIdeas.map((idea) => (
                  <div key={idea.id} className="rounded-lg bg-muted p-2">
                    <p className="font-medium">{idea.title}</p>
                    <p className="text-sm text-muted-foreground">{idea.platform}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Your Input + Selected Text:</h3>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-sm">{selectedIdeas.map((idea) => idea.selected_text).join(' ')} {userInput}</p>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Generated Response:</h3>
              <div className="rounded-lg bg-muted p-2">
                {generating ? <p>Generating...</p> : <p className="text-sm">{response}</p>}
              </div>
            </div>
            <Button onClick={handleSaveNewContent} className="w-full">Save New Content</Button>
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
