
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Outlet } from 'react-router-dom';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Home } from './pages/Home';
import { Watch } from './pages/Watch';
import { Channel } from './pages/Channel';
import { SearchResults } from './pages/SearchResults';
import { Trending } from './pages/Trending';
import { Subscriptions } from './pages/Subscriptions';
import { Library } from './pages/Library';
import { PlaylistDetail } from './pages/PlaylistDetail';
import { Upload } from './pages/Upload';
import { Settings } from './pages/Settings';
import { Studio } from './pages/Studio';
import { Notifications } from './pages/Notifications';
import { History } from './pages/History';
import { Live } from './pages/Live';
import { Shorts } from './pages/Shorts';
import { Login } from './pages/Login';
import { UserProvider } from './UserContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Layout component handles the persistent UI elements (Header, Sidebar)
const Layout = ({ isSidebarOpen, toggleSidebar, isDarkMode, toggleTheme }: any) => {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-yt-base text-black dark:text-white transition-colors duration-300">
      <Header 
        toggleSidebar={toggleSidebar} 
        isDarkMode={isDarkMode} 
        toggleTheme={toggleTheme} 
      />
      <div className="flex flex-1 overflow-hidden h-[calc(100vh-56px)]">
        <Sidebar isOpen={isSidebarOpen} />
        <main 
          className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-200 ${isSidebarOpen ? 'ml-0 sm:ml-60' : 'ml-0 sm:ml-[72px]'}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Initialize theme from HTML class or localStorage
  useEffect(() => {
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    } else {
      setIsDarkMode(false);
    }
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleTheme = () => {
    const html = document.documentElement;
    if (isDarkMode) {
      html.classList.remove('dark');
      setIsDarkMode(false);
    } else {
      html.classList.add('dark');
      setIsDarkMode(true);
    }
  };

  return (
    <UserProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <Layout 
                  isSidebarOpen={isSidebarOpen} 
                  toggleSidebar={toggleSidebar}
                  isDarkMode={isDarkMode}
                  toggleTheme={toggleTheme}
                />
              </ProtectedRoute>
            }
          >
            <Route index element={<Home />} />
            <Route path="watch/:id" element={<Watch />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="channel/:id" element={<Channel />} />
            <Route path="results" element={<SearchResults />} />
            <Route path="trending" element={<Trending />} />
            <Route path="subscriptions" element={<Subscriptions />} />
            <Route path="library" element={<Library />} />
            <Route path="playlist/:id" element={<PlaylistDetail />} />
            <Route path="upload" element={<Upload />} />
            <Route path="settings" element={<Settings />} />
            <Route path="studio" element={<Studio />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="history" element={<History />} />
            <Route path="live/:id" element={<Live />} />
            <Route path="*" element={<div className="p-10 text-xl text-center">Страница не найдена</div>} />
          </Route>
        </Routes>
      </HashRouter>
    </UserProvider>
  );
}

export default App;
