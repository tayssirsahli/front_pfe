import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const scheduledPosts = [
  {
    id: 1,
    title: 'Social Media Strategy 2025',
    platform: 'LinkedIn',
    date: new Date(2025, 3, 15),
    time: '10:00 AM',
    status: 'scheduled',
  },
  {
    id: 2,
    title: 'Tech Trends Analysis',
    platform: 'Twitter',
    date: new Date(2025, 3, 16),
    time: '2:30 PM',
    status: 'draft',
  },
  {
    id: 3,
    title: 'Industry Insights Report',
    platform: 'LinkedIn',
    date: new Date(2025, 3, 17),
    time: '11:00 AM',
    status: 'scheduled',
  },
];

/* interface ScheduledPost {
  id: number;
  title: string;
  platform: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'draft';
} */

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredPosts = scheduledPosts.filter((post) => {
    if (selectedPlatform === 'all') return true;
    return post.platform.toLowerCase() === selectedPlatform;
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Calendar</h1>
          <p className="text-muted-foreground mt-2">
            Schedule and manage your social media posts
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Schedule Post
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>Select dates to view scheduled posts</CardDescription>
          </CardHeader>
          <CardContent>
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Platform" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Platforms</SelectItem>
                <SelectItem value="linkedin">LinkedIn</SelectItem>
                <SelectItem value="twitter">Twitter</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredPosts.map((post) => (
              <Card key={post.id} className={cn(
                "transition-colors hover:bg-muted/50 cursor-pointer",
                post.status === 'draft' && "border-dashed"
              )}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-base">{post.title}</CardTitle>
                    <CardDescription>{post.platform}</CardDescription>
                  </div>
                  {post.status === 'draft' && (
                    <span className="text-sm text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full">
                      Draft
                    </span>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>
                        {post.date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{post.time}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}