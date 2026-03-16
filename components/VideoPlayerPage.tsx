
import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import type { Post as PostType, User, Product, Community } from '../types';
import { 
    VerifiedIcon, 
    PlayIcon, 
    PauseIcon,
    VolumeUpIcon, 
    VolumeOffIcon,
    LikeIcon,
    LikedIcon,
    CommentIcon,
    EchoIcon,
    ShareIcon,
    BackIcon,
    BookmarkIcon,
    BookmarkedIcon,
    MoreIcon,
    FullscreenIcon,
    RefreshIcon,
    AnalyticsIcon
} from '../constants';
import ShareModal from './ShareModal';
import RepostModal from './RepostModal';
import { useNotifications } from './Notifications';

// Reusing PostProps, but adding onBack.
interface VideoPlayerPageProps {
  post: PostType;
  onBack: () => void;
  currentUser: User;
  allUsers: User[];
  subscribedToUserIds: string[];
  handleToggleLike: (postId: string) => void;
  handleToggleEcho: (postId: string, isQuotePost?: boolean) => void;
  handleToggleBookmark: (postId: string) => void;
  handleSubscribe: (userId: string) => void;
  openTipModal: (user: User) => void;
  openGiftModal: (post: PostType) => void;
  handleAddToCart: (product: Product) => void;
  claimedPostRewardIds: string[];
  handleClaimPostReward: (postId: string, reward: number) => void;
  viewCommunity: (community: Community) => void;
  handleSearch: (query: string) => void;
  blockedUserIds: string[];
  handleToggleBlock: (userId: string) => void;
  handleViewPost: (post: PostType) => void;
  handleOpenQuoteModal: (post: PostType) => void;
  handleOpenEditModal: (post: PostType) => void;
  handleViewProfile: (userId: string) => void;
  handlePlayVideo: (postId: string) => void;
  handleShareToCommunity: (post: PostType) => void;
  onNavigate: (path: string) => void;
  allPosts: PostType[];
}

const formatCount = (count: number): string => {
  if (count >= 1000000) return (count / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return count.toString();
};

const VideoPlayerPage: React.FC<VideoPlayerPageProps> = (props) => {
  const { post, handleToggleLike, handleToggleEcho, handleToggleBookmark, handleViewPost, handleViewProfile, handleOpenQuoteModal, handleShareToCommunity, onBack, onNavigate, allPosts } = props;

  const videoUrl = useMemo(() => {
      if (post.videoUrl) return post.videoUrl;
      if (post.media) {
          const videoMedia = post.media.find(m => m.type === 'video');
          if (videoMedia) return videoMedia.url;
      }
      return '';
  }, [post]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [showControls, setShowControls] = useState(true);

  const [canClaim, setCanClaim] = useState(false);
  const isRewardClaimed = props.claimedPostRewardIds?.includes(post.id);
  
  const [isShareMenuOpen, setShareMenuOpen] = useState(false);
  const [isRepostMenuOpen, setRepostMenuOpen] = useState(false);
  const { addNotification } = useNotifications();

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const videoPosts = useMemo(() => {
      return (allPosts || []).filter(p => p.fileType === 'video' || p.videoUrl || (p.media && p.media.some(m => m.type === 'video')));
  }, [allPosts]);

  const currentIndex = videoPosts.findIndex(p => p.id === post.id);
  const nextVideo = currentIndex !== -1 && currentIndex < videoPosts.length - 1 ? videoPosts[currentIndex + 1] : null;
  const prevVideo = currentIndex !== -1 && currentIndex > 0 ? videoPosts[currentIndex - 1] : null;

  const handleScroll = useCallback((e: React.WheelEvent) => {
      if (e.deltaY > 50 && nextVideo) {
          onNavigate(`video/${nextVideo.id}`);
      } else if (e.deltaY < -50 && prevVideo) {
          onNavigate(`video/${prevVideo.id}`);
      }
  }, [nextVideo, prevVideo, onNavigate]);

  // Touch handling for swipe
  const touchStartY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
      handleUserActivity();
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchStartY.current === null) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY.current - touchEndY;

      if (diff > 50 && nextVideo) {
          onNavigate(`video/${nextVideo.id}`);
      } else if (diff < -50 && prevVideo) {
          onNavigate(`video/${prevVideo.id}`);
      }
      touchStartY.current = null;
  };

  const handleUserActivity = useCallback(() => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    // Auto hide controls after 3 seconds of inactivity if playing
    if (isPlaying) {
        controlsTimeoutRef.current = window.setTimeout(() => setShowControls(false), 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    handleUserActivity();
    return () => {
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    };
  }, [handleUserActivity]);

  const togglePlay = useCallback((e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.paused) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            if (error.name !== 'AbortError') {
              console.error("Video player play failed:", error);
            }
          });
        }
        setIsPlaying(true);
        handleUserActivity();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  }, [handleUserActivity]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (videoElement) {
       const playPromise = videoElement.play();
       if (playPromise !== undefined) {
          playPromise.catch(error => {
             if (error.name === 'AbortError') return;
             if (error.name === 'NotAllowedError') {
                 console.log("Auto-play blocked, muting and retrying");
                 videoElement.muted = true;
                 setIsMuted(true);
                 videoElement.play().catch(e => {
                     if (e.name !== 'AbortError') console.error("Retry play failed:", e);
                 });
             } else {
                 console.error("Auto-play failed:", error);
             }
          });
       }
    }
    return () => {
        if (videoElement) videoElement.pause();
    };
  }, []);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const pos = (e.clientX - rect.left) / rect.width;
      videoRef.current.currentTime = pos * duration;
    }
  };

  const handleLoadedMetadata = () => { if (videoRef.current) setDuration(videoRef.current.duration); };
  
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    setCurrentTime(video.currentTime);
    setProgress((video.currentTime / video.duration) * 100);

    if (post.watchAndEarn && !isRewardClaimed && !canClaim) {
      if (video.currentTime >= post.watchAndEarn.duration) {
        setCanClaim(true);
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const handleNativeShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareMenuOpen(false);
    const url = `https://cascade-app.dev/post/${post.id}`;
    const shareData = {
      title: `Post by ${post.user.name}`,
      text: post.content.substring(0, 120) + (post.content.length > 120 ? '...' : ''),
      url: url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if ((err as Error).name !== 'AbortError') console.error("Error sharing post:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        addNotification('Link copied to clipboard!', 'info');
      } catch (err) {
        console.error('Failed to copy link:', err);
        addNotification('Failed to copy link.', 'info');
      }
    }
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShareMenuOpen(false);
    const url = `https://cascade-app.dev/post/${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
        addNotification('Link copied to clipboard!', 'info');
    }).catch(err => {
        console.error('Failed to copy link:', err);
        addNotification('Failed to copy link.', 'info');
    });
  };

  return (
    <div 
        className="w-full h-[100dvh] bg-black flex flex-col relative overflow-hidden" 
        onMouseMove={handleUserActivity} 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onWheel={handleScroll}
        ref={containerRef}
    >
      {/* Top Bar (Back & More) */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-[max(1rem,env(safe-area-inset-top))] flex justify-between items-center bg-gradient-to-b from-black/50 to-transparent z-20 pointer-events-none">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-2 rounded-full transition-colors pointer-events-auto">
          <BackIcon className="w-6 h-6" />
        </button>
        <button className="text-white hover:bg-white/10 p-2 rounded-full transition-colors pointer-events-auto">
          <MoreIcon className="w-6 h-6" />
        </button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black flex items-center justify-center" onClick={togglePlay}>
        <video
          ref={videoRef}
          src={videoUrl}
          loop
          playsInline
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          className="w-full max-h-full object-contain"
        />

        {/* Video Controls Overlay */}
        <div className={`absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'} pointer-events-none`}>
          <div className="flex justify-between items-end mb-2 pointer-events-auto">
            <button onClick={togglePlay} className="text-white hover:text-gray-300 transition-colors">
              {isPlaying ? <PauseIcon className="w-8 h-8" /> : <PlayIcon className="w-8 h-8" />}
            </button>
            
            <div className="flex items-center gap-4 text-white">
              <button className="hover:text-gray-300 transition-colors">
                <RefreshIcon className="w-6 h-6" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="hover:text-gray-300 transition-colors">
                {isMuted ? <VolumeOffIcon className="w-6 h-6" /> : <VolumeUpIcon className="w-6 h-6" />}
              </button>
              <button className="hover:text-gray-300 transition-colors">
                <FullscreenIcon className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div 
              className="relative w-full h-1 bg-white/30 rounded-full cursor-pointer group pointer-events-auto touch-none mb-1"
              onClick={handleSeek}
              ref={progressRef}
          >
              <div 
                  className="absolute top-0 left-0 h-full bg-white rounded-full" 
                  style={{ width: `${progress}%` }}
              >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm scale-150"></div>
              </div>
          </div>

          <div className="flex justify-end pointer-events-auto">
            <span className="text-white text-xs font-medium drop-shadow-md">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
        </div>
      </div>

      {/* Post Details Area (Bottom) */}
      <div className="bg-black text-white px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3 border-t border-white/10 z-20 relative">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); handleViewProfile(post.user.id); }}>
            <img src={post.user.avatarUrl} className="w-10 h-10 rounded-full object-cover border border-white/20" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold hover:underline">{post.user.name}</span>
                {post.user.verificationStatus === 'verified' && <VerifiedIcon className="w-4 h-4 text-yellow-400" />}
              </div>
              <span className="text-gray-400 text-sm">@{post.user.handle.replace('@', '')}</span>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors"><MoreIcon className="w-5 h-5" /></button>
        </div>

        <p className="text-sm mb-4 whitespace-pre-wrap">{post.content}</p>

        <div className="flex items-center justify-between text-gray-400 text-sm">
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); handleViewPost(post); }}>
            <CommentIcon className="w-5 h-5"/> {formatCount(post.comments)}
          </button>
          <button className={`flex items-center gap-1.5 hover:text-green-500 transition-colors ${post.isEchoed ? 'text-green-500' : ''}`} onClick={(e) => { e.stopPropagation(); setRepostMenuOpen(true); }}>
            <EchoIcon className="w-5 h-5"/> {formatCount(post.echos)}
          </button>
          <button className={`flex items-center gap-1.5 hover:text-pink-500 transition-colors ${post.isLiked ? 'text-pink-500' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleLike(post.id); }}>
            {post.isLiked ? <LikedIcon className="w-5 h-5 fill-current"/> : <LikeIcon className="w-5 h-5"/>} {formatCount(post.likes)}
          </button>
          <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <AnalyticsIcon className="w-5 h-5"/> {formatCount(post.views || 0)}
          </button>
          <div className="flex items-center gap-4">
            <button className={`hover:text-primary transition-colors ${post.isBookmarked ? 'text-primary' : ''}`} onClick={(e) => { e.stopPropagation(); handleToggleBookmark(post.id); }}>
              {post.isBookmarked ? <BookmarkedIcon className="w-5 h-5 fill-current"/> : <BookmarkIcon className="w-5 h-5"/>}
            </button>
            <button className="hover:text-primary transition-colors" onClick={(e) => { e.stopPropagation(); setShareMenuOpen(true); }}>
              <ShareIcon className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>

      <ShareModal 
          isOpen={isShareMenuOpen}
          onClose={() => setShareMenuOpen(false)}
          post={post}
          handleEcho={handleToggleEcho}
          handleQuotePost={handleOpenQuoteModal}
          handleNativeShare={handleNativeShare}
          handleCopyLink={handleCopyLink}
          handleShareToCommunity={(e) => { e.stopPropagation(); handleShareToCommunity(post); setShareMenuOpen(false); }}
      />
      
      <RepostModal 
          isOpen={isRepostMenuOpen} 
          onClose={() => setRepostMenuOpen(false)} 
          post={post} 
          handleEcho={handleToggleEcho} 
          handleQuotePost={handleOpenQuoteModal} 
      />
    </div>
  );
};

export default VideoPlayerPage;
