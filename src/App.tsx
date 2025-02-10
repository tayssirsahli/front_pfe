import { Toaster } from './components/ui/sonner';
import Layout from './components/layout/Layout';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import SignIn from './pages/SignIn';
import Dashboard from './pages/Dashboard';
import SavedIdeas from './pages/SavedIdeas';
import IdeaGenerator from './pages/IdeaGenerator';
import PostsFeed from './pages/PostsFeed';
import Profile from './pages/Profile';


import SignUp from './pages/SignUp';
import { ThemeProvider } from './components/theme-provider';
import Calendar from './pages/Calendar';


function App() {

  return (
    <ThemeProvider   defaultTheme="light" storageKey="socialspark-theme">


      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="saved-ideas" element={<SavedIdeas />} />
            <Route path="idea-generator" element={<IdeaGenerator />} />
            <Route path="posts-feed" element={<PostsFeed />} />
            <Route path="profile" element={<Profile />} />
            <Route path="/calendar" element={<Calendar />} />

          </Route>
        </Routes>
       
      </Router>
      
      <Toaster position="top-right" />

    </ThemeProvider>
  );
}

export default App;