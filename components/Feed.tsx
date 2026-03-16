
import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import type { Post as PostType, User, Story as StoryType, Product, Community, AdCampaign } from '../types';
import { Post } from './Post';
import StoriesTray from './StoriesTray';
import { 
  RefreshIcon,
  VerifiedIcon,
  ShopIcon
} from '../constants';
import AdPost from './AdPost';
import { useLanguage } from '../contexts/LanguageContext';

const POSTS_PER_PAGE = 8;

interface FollowSuggestionBlock {
  type: 'follow-suggestions';
  users: User[];
}

interface ProductSuggestionBlock {
  type: 'product-suggestions';
  products: Product[];
}

interface FeedProps {
  posts: PostType[];
  stories: { user: User; stories: StoryType[] }[];
  activeAdCampaigns: AdCampaign[];
  allUsers: User[];
  allProducts: Product[];
  currentUser: User;
  subscribedToUserIds: string[];
  onLogout: () => void;
  activeView: string;
  onNavigate: (path: string) => void;
  handleGenerateAndCompose: (text: string) => void;
  openCompose: () => void;
  handleRefresh: () => void;
  claimedAdRewards: Record<string, ('like' | 'echo')[]>;
  handleClaimAdReward: (campaign: AdCampaign, engagementType: 'like' | 'echo') => void;
  onMobileMenuToggle: () => void;
  handleFollow: (userId: string) => void;
  onStoryClick: (userId: string) => void;
  onCreateStoryClick: () => void;
  handleToggleLike: (postId: string) => void;
  handleToggleEcho: (postId: string, isQuotePost?: boolean) => void;
  handleToggleBookmark: (postId: string) => void;
  handleSubscribe: (userId: string) => void;
  openGiftModal: (post: PostType) => void;
  handleAddToCart: (product: Product) => void;
  viewCommunity: (community: Community) => void;
  handleSearch: (query: string) => void;
  blockedUserIds: string[];
  handleToggleBlock: (userId: string) => void;
  handleViewPost: (post: PostType) => void;
  handleOpenQuoteModal: (post: PostType) => void;
  handleOpenEditModal: (post: PostType) => void;
  handleOpenBoostModal?: (post: PostType) => void;
  handleViewProfile: (userId: string) => void;
  handlePlayVideo: (postId: string) => void;
  playingVideoId: string | null;
  handleShareToCommunity: (post: PostType) => void;
  onAdImpression: (campaignId: string) => void;
  onAdClick: (campaignId: string) => void;
  openCreateProductModal: () => void;
}

const Spinner = () => (
    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
);

import AppHeader from './AppHeader';

const Feed: React.FC<FeedProps> = ({ posts, stories, activeAdCampaigns, allUsers, allProducts, currentUser, subscribedToUserIds, activeView, onNavigate, handleRefresh, claimedAdRewards, handleClaimAdReward, handleFollow, openCreateProductModal, ...handlers }) => {
  const { t } = useLanguage();
  
  const [sortBy, setSortBy] = useState<'newest' | 'viral'>('newest');
  const [displayedPosts, setDisplayedPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const [pullStartY, setPullStartY] = useState(0);
  const [pullMoveY, setPullMoveY] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const sortedPosts = useMemo(() => {
      const now = new Date();
      let filtered = (posts || []).filter(post => 
        !handlers.blockedUserIds.includes(post.user.id) &&
        (post.status !== 'scheduled' || !post.scheduledAt || new Date(post.scheduledAt) <= now) &&
        post.status !== 'pending_approval'
      );

      if (sortBy === 'newest') {
          filtered = filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      } else if (sortBy === 'viral') {
          filtered = filtered.sort((a, b) => {
              const scoreA = (a.likes || 0) + (a.echos || 0) * 2;
              const scoreB = (b.likes || 0) + (b.echos || 0) * 2;
              return scoreB - scoreA;
          });
      }
      return filtered;
  }, [posts, handlers.blockedUserIds, sortBy]);
  
  useEffect(() => {
    const initialPosts = sortedPosts.slice(0, POSTS_PER_PAGE);
    setDisplayedPosts(initialPosts);
    setPage(1);
    setHasMore(sortedPosts.length > POSTS_PER_PAGE);
  }, [sortedPosts]);

  const loadMorePosts = useCallback(() => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);

    setTimeout(() => { 
      const nextPage = page + 1;
      const newPosts = sortedPosts.slice(page * POSTS_PER_PAGE, nextPage * POSTS_PER_PAGE);
      
      if (newPosts.length > 0) {
        setDisplayedPosts(prev => [...prev, ...newPosts]);
        setPage(nextPage);
      }

      setHasMore(nextPage * POSTS_PER_PAGE < sortedPosts.length);
      setIsLoading(false);
    }, 500);
  }, [isLoading, hasMore, page, sortedPosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting) {
            if (hasMore && !isLoading) {
                loadMorePosts();
            }
        }
      },
      { rootMargin: '400px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, isLoading, loadMorePosts]);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      setPullStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (pullStartY === 0 || window.scrollY > 0) return;
    const touchY = e.touches[0].clientY;
    const pullDiff = touchY - pullStartY;
    
    if (pullDiff > 0) {
      const newPullMoveY = Math.min(pullDiff * 0.4, 120); 
      setPullMoveY(newPullMoveY);
    }
  };

  const performRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
        const initialPosts = sortedPosts.slice(0, POSTS_PER_PAGE);
        setDisplayedPosts(initialPosts);
        setPage(1);
        setHasMore(sortedPosts.length > POSTS_PER_PAGE);
        handleRefresh(); 
        setIsRefreshing(false);
        setPullMoveY(0);
    }, 1500);
  }, [sortedPosts, handleRefresh]);

  const handleTouchEnd = () => {
    if (pullStartY === 0) return;
    if (pullMoveY > 60) { 
      performRefresh();
    } else {
      setPullMoveY(0);
    }
    setPullStartY(0);
  };

  const activeAds = useMemo(() => (activeAdCampaigns || []).filter(ad => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    return now >= start && now <= end && ad.ownerId !== currentUser.id;
  }), [activeAdCampaigns, currentUser.id]);

  const suggestedUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.id !== currentUser.id && 
      !subscribedToUserIds.includes(u.id) &&
      u.accountStatus !== 'disabled' &&
      !handlers.blockedUserIds.includes(u.id)
    );
  }, [allUsers, currentUser.id, subscribedToUserIds, handlers.blockedUserIds]);

  const feedItems = useMemo(() => {
    const items: (PostType | AdCampaign | FollowSuggestionBlock | ProductSuggestionBlock)[] = [];
    let adIndex = 0;
    const SUGGESTION_POSITION = 1; 
    const PRODUCT_SUGGESTION_POSITION = 3;

    displayedPosts.forEach((post, index) => {
      items.push(post);
      if (index === SUGGESTION_POSITION && suggestedUsers.length > 0) {
         items.push({ type: 'follow-suggestions', users: suggestedUsers.slice(0, 10) } as FollowSuggestionBlock);
      }
      if (index === PRODUCT_SUGGESTION_POSITION && allProducts && allProducts.length > 0) {
         const suggestedProducts = allProducts.filter(p => p.seller.id !== currentUser.id).slice(0, 10);
         if (suggestedProducts.length > 0 || allProducts.filter(p => p.seller.id === currentUser.id).length === 0) {
             items.push({ type: 'product-suggestions', products: suggestedProducts } as ProductSuggestionBlock);
         }
      }
      if (index > 0 && (index + 1) % 3 === 0) {
        if (activeAds.length > 0) {
          items.push(activeAds[adIndex % activeAds.length]);
          adIndex++;
        }
      }
    });

    return items;
  }, [displayedPosts, activeAds, suggestedUsers, allProducts]);
  
  const allPostHandlers = useMemo(() => ({ ...handlers, allUsers, activeAdCampaigns, onNavigate }), [handlers, allUsers, activeAdCampaigns, onNavigate]);
  
  return (
    <>
      <div className="w-full">
        <AppHeader currentUser={currentUser} activeView={activeView} onNavigate={onNavigate} />

        <div 
            className="min-h-[calc(100vh-64px)] touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div 
                className="flex justify-center items-center overflow-hidden w-full bg-transparent pointer-events-none"
                style={{ 
                    height: isRefreshing ? '60px' : `${pullMoveY}px`,
                    transition: isRefreshing ? 'height 0.3s ease' : 'height 0.1s ease-out',
                    opacity: Math.min(pullMoveY / 40, 1)
                }}
            >
                <div className={`p-2 rounded-full bg-surface dark:bg-dark-surface shadow-md border border-gray-100 dark:border-dark-border ${isRefreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pullMoveY * 3}deg)` }}>
                    <RefreshIcon className="w-6 h-6 text-primary" />
                </div>
            </div>

            <StoriesTray 
              storiesByUser={stories}
              currentUser={currentUser}
              onStoryClick={handlers.onStoryClick}
              onCreateStoryClick={handlers.onCreateStoryClick}
            />
            
            <div className="flex items-center justify-between px-4 py-2 border-b border-border dark:border-dark-border">
                <p className="font-bold text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary">
                    {sortBy === 'newest' ? 'Latest Posts' : 'Viral Posts'}
                </p>
                <div className="flex bg-surface-hover dark:bg-dark-surface rounded-lg p-0.5 gap-1">
                    <button 
                        onClick={() => setSortBy('newest')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sortBy === 'newest' ? 'bg-background dark:bg-dark-background shadow-sm text-primary' : 'text-on-surface-secondary hover:text-on-surface dark:text-dark-on-surface-secondary dark:hover:text-dark-on-surface'}`}
                    >
                        Newest
                    </button>
                    <button 
                        onClick={() => setSortBy('viral')}
                        className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${sortBy === 'viral' ? 'bg-background dark:bg-dark-background shadow-sm text-primary' : 'text-on-surface-secondary hover:text-on-surface dark:text-dark-on-surface-secondary dark:hover:text-dark-on-surface'}`}
                    >
                        Viral
                    </button>
                </div>
            </div>

              {feedItems.map((item, index) => {
                if ('type' in item && item.type === 'follow-suggestions') {
                    const suggestionBlock = item as FollowSuggestionBlock;
                    return (
                        <div key="suggestions" className="py-4 border-b border-gray-200 dark:border-dark-border bg-gradient-to-b from-surface to-background dark:from-dark-surface dark:to-dark-background">
                            <div className="px-4 mb-3 flex items-center justify-between">
                                <h3 className="font-bold text-md">{t('follow_suggestions_title')}</h3>
                            </div>
                            <div className="flex overflow-x-auto px-4 gap-3 pb-2 scrollbar-hide snap-x snap-mandatory">
                                {suggestionBlock.users.map(user => (
                                    <div 
                                        key={user.id} 
                                        onClick={() => handlers.handleViewProfile(user.id)} 
                                        className="snap-center flex-shrink-0 w-40 p-4 border border-gray-200 dark:border-dark-border rounded-2xl bg-background dark:bg-dark-surface flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 group shadow-sm"
                                    >
                                        <img 
                                            src={user.avatarUrl} 
                                            alt={user.name} 
                                            className="w-20 h-20 rounded-full object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                        <div className="text-center w-full mt-1">
                                            <p className="font-bold text-base truncate w-full flex items-center justify-center gap-1">
                                                {user.name}
                                                {user.verificationStatus === 'verified' && <VerifiedIcon className="w-4 h-4 text-primary flex-shrink-0" />}
                                            </p>
                                            <p className="text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary truncate w-full">@{user.handle.replace('@', '')}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleFollow(user.id); }}
                                            className="w-full bg-on-surface dark:bg-dark-on-surface text-surface dark:text-dark-surface text-sm font-bold py-2 rounded-full mt-2 hover:opacity-90 transition-opacity"
                                        >
                                            {t('button_follow')}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                if ('type' in item && item.type === 'product-suggestions') {
                    const suggestionBlock = item as ProductSuggestionBlock;
                    const hasOwnProducts = allProducts.some(p => p.seller.id === currentUser.id);
                    return (
                        <div key="product-suggestions" className="py-4 border-b border-gray-200 dark:border-dark-border bg-gradient-to-b from-surface to-background dark:from-dark-surface dark:to-dark-background">
                            <div className="px-4 mb-3 flex items-center justify-between">
                                <h3 className="font-bold text-md flex items-center gap-2">
                                    <ShopIcon className="w-5 h-5 text-primary" />
                                    Shop Products
                                </h3>
                            </div>
                            <div className="flex overflow-x-auto px-4 gap-3 pb-2 scrollbar-hide snap-x snap-mandatory">
                                {!hasOwnProducts && (
                                    <div className="snap-center flex-shrink-0 w-40 p-4 border border-gray-200 dark:border-dark-border rounded-2xl bg-background dark:bg-dark-surface flex flex-col items-center gap-2 shadow-sm">
                                        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center">
                                            <ShopIcon className="w-10 h-10 text-primary" />
                                        </div>
                                        <div className="text-center w-full mt-1">
                                            <p className="font-bold text-base truncate w-full">Set up store</p>
                                            <p className="text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary truncate w-full">Sell products</p>
                                        </div>
                                        <button 
                                            onClick={openCreateProductModal}
                                            className="w-full bg-on-surface dark:bg-dark-on-surface text-surface dark:text-dark-surface text-sm font-bold py-2 rounded-full mt-2 hover:opacity-90 transition-opacity"
                                        >
                                            Create
                                        </button>
                                    </div>
                                )}
                                {suggestionBlock.products.map(product => (
                                    <div 
                                        key={product.id} 
                                        onClick={() => handlers.handleViewProfile(product.seller.id)} 
                                        className="snap-center flex-shrink-0 w-40 p-4 border border-gray-200 dark:border-dark-border rounded-2xl bg-background dark:bg-dark-surface flex flex-col items-center gap-2 cursor-pointer hover:border-primary/50 hover:shadow-md transition-all duration-300 group shadow-sm"
                                    >
                                        <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                                            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                                        </div>
                                        <div className="text-center w-full mt-1">
                                            <p className="font-bold text-base truncate w-full">{product.name}</p>
                                            <p className="text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary truncate w-full">${product.price.toFixed(2)}</p>
                                        </div>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handlers.handleAddToCart(product); }}
                                            className="w-full bg-on-surface dark:bg-dark-on-surface text-surface dark:text-dark-surface text-sm font-bold py-2 rounded-full mt-2 hover:opacity-90 transition-opacity"
                                        >
                                            Add to Cart
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                }

                if ('user' in item) {
                  const post = item as PostType;
                  const isBoosted = (activeAdCampaigns || []).some(c => c.promotionType === 'post' && c.promotedPostId === post.id);
                  return (
                    <Post 
                      key={post.id}
                      post={post} 
                      currentUser={currentUser}
                      subscribedToUserIds={subscribedToUserIds}
                      isBoosted={isBoosted}
                      {...allPostHandlers}
                    />
                  );
                }

                if ('ownerId' in item) {
                  const campaign = item as AdCampaign;
                  return (
                    <AdPost
                      key={`ad-${campaign.id}-${index}`}
                      campaign={campaign}
                      allPosts={posts}
                      allProducts={allProducts}
                      allUsers={allUsers}
                      currentUser={currentUser}
                      subscribedToUserIds={subscribedToUserIds}
                      onAdImpression={handlers.onAdImpression}
                      onAdClick={handlers.onAdClick}
                      handleClaimAdReward={handleClaimAdReward}
                      claimedAdRewards={claimedAdRewards}
                      handleFollow={handleFollow}
                      {...allPostHandlers}
                    />
                  );
                }
                
                return null;
              })}
              <div ref={loaderRef} className="flex justify-center items-center h-24">
                {isLoading && <Spinner />}
                {!hasMore && displayedPosts.length > POSTS_PER_PAGE && (
                    <p className="text-on-surface-secondary dark:text-dark-on-surface-secondary">{t('feed_reached_end')}</p>
                )}
              </div>
        </div>
      </div>
    </>
  );
};

export default Feed;
