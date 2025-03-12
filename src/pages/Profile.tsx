import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';

export default function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [UserId, setUserId] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [memberSince, setMemberSince] = useState('');
  const [lastActive, setLastActive] = useState('');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const fetchUserData = async () => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setIsLoggedIn(false);
      return;
    } else {
      setIsLoggedIn(true);
    }

    try {
      const response = await fetch("http://localhost:5000/auth/current-user", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      const data = await response.json();
      console.log("User data from API:", data); // 🔍 Debug
      setUserId(data.id);

      if (data && data.id) {
        setUserName(data.raw_user_meta_data.username);
        setEmail(data.email);
        setLocation(data.raw_user_meta_data.location);
        setPhone(data.raw_user_meta_data.phone);
        setProfileImageUrl(data.raw_user_meta_data.avatar_url);
        const createdAt = new Date(data.created_at);
        setMemberSince(createdAt.toLocaleDateString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric' }));

        // Formatage de la dernière activité "Last active" (last_sign_in_at) au format "DD MMMM YYYY HH:mm:ss"
        const lastSignInAt = new Date(data.last_sign_in_at);
        setLastActive(lastSignInAt.toLocaleString("fr-FR", { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleSaveChanges = async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !UserId) return;

    try {
      const response = await fetch(`http://localhost:5000/auth/update-profile`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: userName,
          email: email,
          location: location,
          phone: phone,
          avatar_url: profileImageUrl
        })
      });

      const data = await response.json();

      if (response.ok) {
        fetchUserData();
        setUserName(data.user_metadata.username);
        setEmail(data.email);
        setLocation(data.user_metadata.location);
        setPhone(data.user_metadata.phone);
        setProfileImageUrl(data.user_metadata.avatar_url);

        // Afficher le modal de succès
        setIsSuccessModalOpen(true);
      } else {
        console.error("Error saving changes:", data.message);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  const handleImageSave = async () => {
    if (selectedImage) {
      const formData = new FormData();
      formData.append("media", selectedImage); // Envoie l'image avec le champ 'media'
  
      const token = localStorage.getItem("access_token");
      if (!token) return;
  
      try {
        const response = await fetch("http://localhost:5000/generated-idea/upload-media", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: formData,
        });
  
        const data = await response.json();
  
        if (response.ok) {
          const fullImageUrl = `http://localhost:5000${data.urls[0]}`;
          setProfileImageUrl(fullImageUrl); // Mise à jour de l'URL d'image avec celle renvoyée par le backend
        } else {
          console.error("Error uploading image:", data.message);
        }
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  
    setIsImageModalOpen(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file); // Save the selected image file
    }
  };

  return (
    <div className="space-y-8 dark:bg-gray-900 dark:text-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button onClick={handleSaveChanges}>Save Changes</Button>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_1fr]">
        <Card className="dark:bg-gray-800">
          <CardHeader className="text-center">
            <Avatar className="mx-auto h-24 w-24">
            <AvatarImage src={profileImageUrl} />
            <AvatarFallback>{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle>{userName}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground dark:text-gray-400">
                <p>Member since : {memberSince}</p>
                <p>Last active : {lastActive}</p>
              </div>
              <Button variant="outline" className="w-full dark:border-gray-600" onClick={() => setIsImageModalOpen(true)}>
                Edit Profile Picture
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="profile">
          <TabsList className="dark:bg-gray-800 dark:border-gray-700">
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card className="dark:bg-gray-800">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">Full Name</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">Location</label>
                    <input
                      type="text"
                      className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium dark:text-gray-300">Phone</label>
                    <input
                      type="phone"
                      className="mt-1 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal pour afficher le succès après la mise à jour */}
      <Dialog open={isSuccessModalOpen} onOpenChange={setIsSuccessModalOpen}>
        <DialogContent className="dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <p>Your profile has been updated successfully!</p>
          <DialogFooter>
            <Button onClick={() => setIsSuccessModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal pour modifier l'image de profil */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="dark:bg-gray-800 dark:text-white">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>
          <input
            type="file"
            accept="image/*"
            className="mt-4 w-full rounded-md border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            onChange={handleImageChange}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImageModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleImageSave}>Save Image</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
