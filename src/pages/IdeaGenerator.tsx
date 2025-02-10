import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';

const selectedIdeas = [
  {
    id: 1,
    title: 'The Impact of AI on Future Workplaces',
    source: 'LinkedIn',
    selected: false,
  },
  {
    id: 2,
    title: 'Building Sustainable Business Models',
    source: 'Twitter',
    selected: false,
  },
  {
    id: 3,
    title: 'Digital Marketing Trends 2024',
    source: 'LinkedIn',
    selected: false,
  },
];

export default function IdeaGenerator() {
  const [step, setStep] = useState(1);

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

      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Select Ideas to Combine</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedIdeas.map((idea) => (
              <div key={idea.id} className="flex items-center space-x-4">
                <Checkbox id={`idea-${idea.id}`} />
                <div className="flex-1">
                  <label htmlFor={`idea-${idea.id}`} className="text-sm font-medium">
                    {idea.title}
                  </label>
                  <p className="text-sm text-muted-foreground">{idea.source}</p>
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
            />
            <div className="flex space-x-2">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button onClick={() => setStep(3)}>Next: Generate</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Selected Ideas:</h3>
              <div className="space-y-2">
                {selectedIdeas.slice(0, 2).map((idea) => (
                  <div key={idea.id} className="rounded-lg bg-muted p-2">
                    <p className="font-medium">{idea.title}</p>
                    <p className="text-sm text-muted-foreground">{idea.source}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Your Context:</h3>
              <div className="rounded-lg bg-muted p-2">
                <p className="text-sm">
                  These ideas align well with current market trends...
                </p>
              </div>
            </div>
            <Button className="w-full">Generate New Content</Button>
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