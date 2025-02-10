import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Bell, Shield } from 'lucide-react';

export default function Profile() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Card>
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=128&h=128&fit=crop&crop=faces" />
              <AvatarFallback>JS</AvatarFallback>
            </Avatar>
            <CardTitle>Jane Smith</CardTitle>
            <div className="flex justify-center space-x-2">
              <Badge>Pro Plan</Badge>
              <Badge variant="outline">Content Creator</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Member since March 2024</p>
                <p>Last active: 2 hours ago</p>
              </div>
              <Button variant="outline" className="w-full">
                Edit Profile Picture
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile">
          <TabsList>
            <TabsTrigger value="profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications">
              <Bell className="mr-2 h-4 w-4" />
              Notifications
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="mr-2 h-4 w-4" />
              Security
            </TabsTrigger>
            <TabsTrigger value="preferences">
              <Settings className="mr-2 h-4 w-4" />
              Preferences
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border p-2"
                      defaultValue="Jane Smith"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-md border p-2"
                      defaultValue="jane.smith@example.com"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border p-2"
                      defaultValue="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Timezone</label>
                    <select className="mt-1 w-full rounded-md border p-2">
                      <option>Pacific Time (PT)</option>
                      <option>Eastern Time (ET)</option>
                      <option>Central Time (CT)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <textarea
                    className="mt-1 w-full rounded-md border p-2"
                    rows={4}
                    defaultValue="Content creator and digital marketer passionate about helping businesses grow their online presence."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Social Profiles</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">LinkedIn</label>
                    <input
                      type="url"
                      className="mt-1 w-full rounded-md border p-2"
                      defaultValue="https://linkedin.com/in/janesmith"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Twitter</label>
                    <input
                      type="url"
                      className="mt-1 w-full rounded-md border p-2"
                      defaultValue="https://twitter.com/janesmith"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Push Notifications</h4>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new ideas and mentions
                      </p>
                    </div>
                    <Button variant="outline">Configure</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}