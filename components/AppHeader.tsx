import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { 
  TvIcon,
  VideoIcon, VideoIconFilled,
  SparklesIcon, SparklesIconFilled,
  StoreIconFilled,
  StoreIcon,
  SearchIcon,
  NotificationsIcon,
  NotificationsIconFilled,
  MailIcon,
  MailIconFilled,
  HomeIcon,
  HomeIconFilled
} from '../constants';

interface AppHeaderProps {
  currentUser: User;
  activeView: string;
  onNavigate: (path: string) => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ currentUser, activeView, onNavigate }) => {
  const showTopRow = activeView === 'Home';
  const isVideoView = activeView === 'Videos';

  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (activeView !== 'Home') {
    return <></>;
  }

  return (
    <div className={`sticky top-0 z-20 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'} ${isVideoView ? 'bg-gradient-to-b from-black/80 via-black/40 to-transparent' : 'bg-background dark:bg-dark-background border-b border-gray-200 dark:border-dark-border shadow-md'}`}>
      <div className="px-4 py-4 flex flex-col gap-2 max-w-3xl mx-auto">
        {showTopRow && (
          <div className="relative flex items-center justify-center w-full h-12">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 md:hidden flex items-center gap-2">
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('Menu'); }} 
                aria-label="Account menu" 
                className="w-10 h-10 rounded-full overflow-hidden border border-border dark:border-dark-border hover:opacity-90 transition-opacity duration-200"
              >
                <img src={currentUser.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onNavigate('Askai'); }} 
                aria-label="Ask AI" 
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 ${activeView === 'Askai' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                {activeView === 'Askai' ? <SparklesIconFilled className="w-6 h-6" /> : <SparklesIcon className="w-6 h-6 stroke-[2.5]" />}
              </button>
            </div>

            <h1 
              onClick={() => { onNavigate('Home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-2xl font-black text-primary tracking-tighter cursor-pointer select-none font-sans leading-none"
            >
              cascade
            </h1>
            
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button onClick={(e) => { e.stopPropagation(); onNavigate('Explore'); }} aria-label="Search" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <SearchIcon className="w-6 h-6 stroke-[2.5]"/>
              </button>
              <button onClick={(e) => { e.stopPropagation(); onNavigate('live'); }} aria-label="Live" className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200">
                <TvIcon className="w-6 h-6 stroke-[2.5]"/>
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between w-full -ml-1 overflow-x-auto no-scrollbar gap-2 py-2">
          <button 
            onClick={() => onNavigate('Home')}
            className={`p-2 rounded-2xl transition-all duration-200 ${activeView === 'Home' ? 'bg-blue-100 text-blue-600 scale-110' : isVideoView ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            {activeView === 'Home' ? <HomeIconFilled className="w-6 h-6" /> : <HomeIcon className="w-6 h-6 stroke-[2.5]" />}
          </button>
          <button 
            onClick={() => onNavigate('Videos')}
            className={`p-2 rounded-2xl transition-all duration-200 ${activeView === 'Videos' ? 'bg-blue-100 text-blue-600 scale-110' : isVideoView ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            {activeView === 'Videos' ? <VideoIconFilled className="w-6 h-6" /> : <VideoIcon className="w-6 h-6 stroke-[2.5]" />}
          </button>
          <button 
            onClick={() => onNavigate('Store')}
            className={`p-2 rounded-2xl transition-all duration-200 ${activeView === 'Store' ? 'bg-blue-100 text-blue-600 scale-110' : isVideoView ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            {activeView === 'Store' ? <StoreIconFilled className="w-6 h-6" /> : <StoreIcon className="w-6 h-6 stroke-[2.5]" />}
          </button>
          <button 
            onClick={() => onNavigate('Notifications')}
            className={`p-2 rounded-2xl transition-all duration-200 ${activeView === 'Notifications' ? 'bg-blue-100 text-blue-600 scale-110' : isVideoView ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            {activeView === 'Notifications' ? <NotificationsIconFilled className="w-6 h-6" /> : <NotificationsIcon className="w-6 h-6 stroke-[2.5]" />}
          </button>
          <button 
            onClick={() => onNavigate('Messages')}
            className={`p-2 rounded-2xl transition-all duration-200 ${activeView === 'Messages' ? 'bg-blue-100 text-blue-600 scale-110' : isVideoView ? 'text-white/80 hover:bg-white/10 hover:text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'}`}
          >
            {activeView === 'Messages' ? <MailIconFilled className="w-6 h-6" /> : <MailIcon className="w-6 h-6 stroke-[2.5]" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
