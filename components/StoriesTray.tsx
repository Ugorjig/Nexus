import React from 'react';
import type { User, Story } from '../types';
import { AddIcon } from '../constants';

interface StoriesTrayProps {
  storiesByUser: { user: User, stories: Story[] }[];
  currentUser: User;
  onStoryClick: (userId: string) => void;
  onCreateStoryClick: () => void;
}

const StoryCircle: React.FC<{ user: User; stories: Story[]; onClick: () => void; }> = ({ user, stories, onClick }) => {
    const firstStory = stories[0];
    const storyCount = stories.length;
    let storyPreviewUrl = firstStory.imageUrl;

    if (firstStory.fileType === 'video' && !storyPreviewUrl) {
      // Hardcoding a thumbnail for the known video in mock data.
      if(firstStory.videoUrl === 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4') {
        storyPreviewUrl = 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg';
      } else {
        storyPreviewUrl = `https://picsum.photos/seed/${user.id}/200/300`; // fallback to a consistent placeholder per user
      }
    }
    
    if (!storyPreviewUrl) {
      storyPreviewUrl = `https://picsum.photos/seed/${user.id}/200/300`; // general fallback
    }

    return (
        <div className="flex-shrink-0 w-28 h-48">
            <button onClick={onClick} className="w-full h-full rounded-lg shadow-md overflow-hidden relative group border border-border dark:border-dark-border">
                <img 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    src={storyPreviewUrl}
                    alt={`${user.name}'s story`} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                {storyCount > 1 && (
                    <div className="absolute top-2 right-2 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-md border-2 border-background dark:border-dark-background">
                        {storyCount}
                    </div>
                )}
                <p className="absolute bottom-2 left-2 right-2 text-white text-sm font-semibold truncate">{user.name}</p>
            </button>
        </div>
    );
};

const CreateStoryCircle: React.FC<{ user: User; onClick: () => void; }> = ({ user, onClick }) => (
    <div className="flex-shrink-0 w-28 h-48">
        <button onClick={onClick} className="w-full h-full rounded-lg shadow-md overflow-hidden relative bg-surface dark:bg-dark-surface hover:brightness-95 transition-all duration-200 border border-border dark:border-dark-border group">
            <div className="h-[70%] w-full overflow-hidden">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" src={user.avatarUrl} alt={user.name} />
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-[30%] bg-surface dark:bg-dark-surface"></div>
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center border-4 border-surface dark:border-dark-surface">
                <AddIcon className="w-6 h-6" />
            </div>
            <p className="absolute bottom-2 left-0 right-0 text-sm font-semibold text-center text-on-surface dark:text-dark-on-surface">Create story</p>
        </button>
    </div>
);


const StoriesTray: React.FC<StoriesTrayProps> = ({ storiesByUser, currentUser, onStoryClick, onCreateStoryClick }) => {
  return (
    <div className="px-4 py-3 border-b border-border dark:border-dark-border">
      <div className="flex space-x-4 overflow-x-auto pb-2 -mb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
         <CreateStoryCircle user={currentUser} onClick={onCreateStoryClick} />
        {storiesByUser.map(({ user, stories }) => (
            <StoryCircle key={user.id} user={user} stories={stories} onClick={() => onStoryClick(user.id)} />
        ))}
      </div>
    </div>
  );
};

export default StoriesTray;