
import React, { useState, useEffect, useReducer, useCallback, useRef, useMemo } from 'react';

// Contexts
import { LanguageProvider } from './contexts/LanguageContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider, useNotifications } from './components/Notifications';

// Components
import AdManagerPage from './components/AdManagerPage';
import AnalyticsPage from './components/AnalyticsPage';
import AskAiPage from './components/AskAiModal';
import AuthPage from './components/AuthPage';
import BookmarksPage from './components/BookmarksPage';
import CartModal from './components/CartModal';
import CommunitiesPage from './components/CommunitiesPage';
import { CommunityPage } from './components/CommunityPage';
import { ComposePage } from './components/ComposePage';
import CreateAdModal from './components/CreateAdModal';
import CreateCommunityModal from './components/CreateCommunityModal';
import CreateProductModal from './components/CreateProductModal';
import CreateStoryModal from './components/CreateStoryModal';
import DraftsModal from './components/DraftsModal';
import ExplorePage from './components/ExplorePage';
import Feed from './components/Feed';
import FollowersPage from './components/FollowersPage';
import GiftModal from './components/GiftModal';
import LanguageModal from './components/LanguageModal';
import LivePage from './components/LivePage';
import LiveStreamPage from './components/LiveStreamPage';
import MessagesPage from './components/MessagesPage';
import { MonetizationPage } from './components/MonetizationPage';
import NotificationsPage from './components/NotificationsPage';
import PostDetailPage from './components/PostDetailPage';
import PostStreamSummaryModal from './components/PostStreamSummaryModal';
import PrivacySettingsPage from './components/PrivacySettingsPage';
import { ProfilePage } from './components/ProfilePage';
import QrCodeModal from './components/QrCodeModal';
import SettingsPage from './components/SettingsPage';
import ShareModal from './components/ShareModal';
import ShopPage from './components/ShopPage';
import Sidebar from './components/Sidebar';
import StartLiveModal from './components/StartLiveModal';
import StoryViewer from './components/StoryViewer';
import ThemeModal from './components/ThemeModal';
import TipModal from './components/TipModal';
import Trends from './components/Trends';
import VerificationPage from './components/VerificationPage';
import VideoPlayerPage from './components/VideoPlayerPage';
import WalletPage from './components/WalletPage';
import MenuPage from './components/MenuPage';
import SponsorshipPage from './components/SponsorshipPage';
import MediaViewerPage from './components/MediaViewerPage';

// Constants and Types
import { ALL_USERS, USERS, INITIAL_POSTS, INITIAL_STORIES, INITIAL_MESSAGES, MOCK_PRODUCTS, MOCK_COMMUNITIES, MOCK_AD_CAMPAIGNS, MOCK_LIVE_STREAMS } from './mockData';
import { PLATFORM_FEE_PERCENTAGE, ComposeIcon } from './constants';
import type { User, Post, Story, Message, Product, Community, AdCampaign, LiveStream, Transaction, NewStoryData, Comment, Gift, LiveStreamComment, MonetizationSettings, MessagingSettings, PostMedia, Order } from './types';

// --- MODAL STATE & REDUCER ---
interface ModalState {
  isStoryViewerOpen: boolean;
  storyViewerInitialIndex: number;
  isCreateStoryModalOpen: boolean;
  isCartModalOpen: boolean;
  isGiftModalOpen: boolean;
  postToGift: Post | null;
  isTipModalOpen: boolean;
  userToTip: User | null;
  isCreateAdModalOpen: boolean;
  postToPromote: Post | null;
  isCreateCommunityModalOpen: boolean;
  isCreateProductModalOpen: boolean;
  isStartLiveModalOpen: boolean;
  completedStream: LiveStream | null;
  isThemeModalOpen: boolean;
  isQrCodeModalOpen: boolean;
  isLanguageModalOpen: boolean;
  isDraftsModalOpen: boolean;
  isShareModalOpen: boolean;
  postToShare: Post | null;
}

const initialModalState: ModalState = {
  isStoryViewerOpen: false,
  storyViewerInitialIndex: 0,
  isCreateStoryModalOpen: false,
  isCartModalOpen: false,
  isGiftModalOpen: false,
  postToGift: null,
  isTipModalOpen: false,
  userToTip: null,
  isCreateAdModalOpen: false,
  postToPromote: null,
  isCreateCommunityModalOpen: false,
  isCreateProductModalOpen: false,
  isStartLiveModalOpen: false,
  completedStream: null,
  isThemeModalOpen: false,
  isQrCodeModalOpen: false,
  isLanguageModalOpen: false,
  isDraftsModalOpen: false,
  isShareModalOpen: false,
  postToShare: null,
};

type ModalAction =
  | { type: 'OPEN_STORY_VIEWER'; payload: number }
  | { type: 'OPEN_CREATE_STORY' }
  | { type: 'OPEN_CART' }
  | { type: 'OPEN_GIFT'; payload: Post }
  | { type: 'OPEN_TIP'; payload: User }
  | { type: 'OPEN_CREATE_AD'; payload: Post | null }
  | { type: 'OPEN_CREATE_COMMUNITY' }
  | { type: 'OPEN_CREATE_PRODUCT' }
  | { type: 'OPEN_START_LIVE' }
  | { type: 'OPEN_STREAM_SUMMARY', payload: LiveStream }
  | { type: 'OPEN_THEME' }
  | { type: 'OPEN_QR_CODE' }
  | { type: 'OPEN_LANGUAGE' }
  | { type: 'OPEN_DRAFTS' }
  | { type: 'OPEN_SHARE'; payload: Post }
  | { type: 'CLOSE_MODALS' };

const modalReducer = (state: ModalState, action: ModalAction): ModalState => {
  const resetState = { ...initialModalState };
  switch (action.type) {
    case 'OPEN_STORY_VIEWER':
      return { ...resetState, isStoryViewerOpen: true, storyViewerInitialIndex: action.payload };
    case 'OPEN_CREATE_STORY':
      return { ...resetState, isCreateStoryModalOpen: true };
    case 'OPEN_CART':
      return { ...resetState, isCartModalOpen: true };
    case 'OPEN_GIFT':
      return { ...resetState, isGiftModalOpen: true, postToGift: action.payload };
    case 'OPEN_TIP':
      return { ...resetState, isTipModalOpen: true, userToTip: action.payload };
    case 'OPEN_CREATE_AD':
      return { ...resetState, isCreateAdModalOpen: true, postToPromote: action.payload };
    case 'OPEN_CREATE_COMMUNITY':
      return { ...resetState, isCreateCommunityModalOpen: true };
    case 'OPEN_CREATE_PRODUCT':
      return { ...resetState, isCreateProductModalOpen: true };
    case 'OPEN_START_LIVE':
      return { ...resetState, isStartLiveModalOpen: true };
    case 'OPEN_STREAM_SUMMARY':
        return { ...resetState, completedStream: action.payload };
    case 'OPEN_THEME':
      return { ...resetState, isThemeModalOpen: true };
    case 'OPEN_QR_CODE':
      return { ...resetState, isQrCodeModalOpen: true };
    case 'OPEN_LANGUAGE':
      return { ...resetState, isLanguageModalOpen: true };
    case 'OPEN_DRAFTS':
      return { ...resetState, isDraftsModalOpen: true };
    case 'OPEN_SHARE':
        return { ...resetState, isShareModalOpen: true, postToShare: action.payload };
    case 'CLOSE_MODALS':
      return initialModalState;
    default:
      return state;
  }
};

const AppContent = () => {
  const { addNotification } = useNotifications();
  
  const [currentUser, setCurrentUser] = useState<User | null>(ALL_USERS[0]);
  const [route, setRoute] = useState({ path: 'Home', rawPath: 'home', params: [] as string[] });
  
  const [users, setUsers] = useState<Record<string, User>>(USERS);
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const [stories, setStories] = useState<Story[]>(INITIAL_STORIES);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS);
  const [communities, setCommunities] = useState<Community[]>(MOCK_COMMUNITIES);
  const [adCampaigns, setAdCampaigns] = useState<AdCampaign[]>(MOCK_AD_CAMPAIGNS);
  const [liveStreams, setLiveStreams] = useState<LiveStream[]>(MOCK_LIVE_STREAMS);
  const [transactions] = useState<Transaction[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [claimedAdRewards, setClaimedAdRewards] = useState<Record<string, ('like' | 'echo')[]>>({});
  const [claimedPostRewardIds, setClaimedPostRewardIds] = useState<string[]>([]);
  const [drafts, setDrafts] = useState<Partial<Post>[]>([]);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimeoutRef = useRef<number | null>(null);
  
  const [activeConversationUserId, setActiveConversationUserId] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [postToQuote, setPostToQuote] = useState<Post | null>(null);
  const [postToEdit, setPostToEdit] = useState<Partial<Post> | null>(null);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [modalState, dispatchModal] = useReducer(modalReducer, initialModalState);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      const [path, ...params] = hash.split('/');
      let normalizedPath = path ? path.charAt(0).toUpperCase() + path.slice(1) : 'Home';
      
      const specialPaths = ['post', 'profile', 'community', 'video', 'live', 'compose', 'sponsorship', 'askai', 'media'];
      if (specialPaths.includes(path.toLowerCase())) {
          normalizedPath = path.charAt(0).toUpperCase() + path.slice(1);
      }
      
      if (normalizedPath.toLowerCase() === 'askai') normalizedPath = 'Askai';
      if (['following', 'followers'].includes(path)) normalizedPath = 'Followers';

      setRoute({ path: normalizedPath, rawPath: path, params });
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
        setIsScrolling(true);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
        scrollTimeoutRef.current = window.setTimeout(() => setIsScrolling(false), 200);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
        window.removeEventListener('scroll', handleScroll);
        if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  const onNavigate = useCallback((path: string) => {
    window.location.hash = path;
    setMobileMenuOpen(false); 
  }, []);

  const onBack = useCallback(() => {
    const currentHash = window.location.hash;
    if (currentHash && currentHash !== '' && currentHash !== '#Home') {
        window.history.back();
        setTimeout(() => { if (window.location.hash === currentHash) onNavigate('Home'); }, 100);
    }
  }, [onNavigate]);

  const handleLogin = (credentials: { email: string; password?: string }) => {
    const user = ALL_USERS.find(
      (u) => (u.email?.toLowerCase() === credentials.email.toLowerCase() || u.handle.toLowerCase() === credentials.email.toLowerCase()) && u.password === credentials.password
    );
    if (user) {
        if (user.accountStatus === 'disabled') {
            addNotification("This account has been disabled for violating community guidelines.", 'info');
            return;
        }
        setCurrentUser(user);
        onNavigate('Home');
    } else {
        addNotification("Invalid credentials. Please try again.", 'info');
    }
  };

  const handleSignUp = (newUserData: { name: string; handle: string; email: string; password?: string }) => {
    if (ALL_USERS.some(u => u.handle.toLowerCase() === newUserData.handle.toLowerCase())) {
        addNotification("Handle is already taken.", 'info');
        return;
    }
    if (ALL_USERS.some(u => u.email?.toLowerCase() === newUserData.email.toLowerCase())) {
        addNotification("An account with this email already exists.", 'info');
        return;
    }
    const newUser: User = {
        id: `user-${Date.now()}`,
        name: newUserData.name,
        handle: newUserData.handle.startsWith('@') ? newUserData.handle : `@${newUserData.handle}`,
        email: newUserData.email,
        password: newUserData.password,
        avatarUrl: `https://i.pravatar.cc/150?u=${Date.now()}`,
        bio: "New to Cascade!",
        followers: 0,
        following: 0,
        followingIds: [],
        coinBalance: 250,
        verificationStatus: 'none',
        joinedCommunityIds: [],
    };
    ALL_USERS.push(newUser);
    setUsers(prev => ({...prev, [newUser.id]: newUser}));
    setCurrentUser(newUser);
    addNotification('Welcome to Cascade! You received 250 bonus coins.', 'info');
    onNavigate('Home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    onNavigate('');
  };

  const handleRefresh = useCallback(() => window.scrollTo({ top: 0, behavior: 'smooth' }), []);

  const uploadFile = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = error => reject(error);
      });
  };

  const handleCreatePost = async (content: string, files?: File[], isSubscriberOnly?: boolean, communityId?: string, scheduledAt?: string, quotedPost?: Post, thumbnailUrl?: string, duration?: number, poll?: { choices: string[], durationInDays: number }, taggedProduct?: Product, location?: string, draftId?: string, linkUrl?: string) => {
    if (!currentUser) return;

    let status: 'published' | 'scheduled' | 'pending_approval' = scheduledAt ? 'scheduled' : 'published';

    if (communityId) {
        const community = communities.find(c => c.id === communityId);
        if (community) {
            if (community.moderationSettings?.autoFilterWords) {
                const bannedWords = community.moderationSettings.autoFilterWords;
                const hasBannedWord = bannedWords.some(word => content.toLowerCase().includes(word.toLowerCase()));
                if (hasBannedWord) {
                    addNotification('Post contains banned words and cannot be published.', 'error');
                    return;
                }
            }

            const isModerator = community.ownerId === currentUser.id || (community.moderatorIds || []).includes(currentUser.id);
            if (community.moderationSettings?.requireApproval && !isModerator) {
                status = 'pending_approval';
            }
        }
    }

    const mediaItems: PostMedia[] = [];

    if (files && files.length > 0) {
        for (const file of files) {
            const fileUrl = await uploadFile(file);
            const fileType = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
            if (fileType) {
                mediaItems.push({ url: fileUrl, type: fileType as any });
            }
        }
    }
    
    const newPost: Post = {
      id: `post-${Date.now()}`,
      user: currentUser,
      content,
      media: mediaItems.length > 0 ? mediaItems : undefined,
      imageUrl: mediaItems[0]?.type === 'image' ? mediaItems[0].url : undefined,
      videoUrl: mediaItems[0]?.type === 'video' ? mediaItems[0].url : undefined,
      fileType: mediaItems[0]?.type as any,
      likes: 0,
      comments: 0,
      echos: 0,
      timestamp: new Date().toISOString(),
      isLiked: false, isEchoed: false, isBookmarked: false,
      commentData: [],
      quotedPost,
      poll: poll ? { choices: poll.choices.map(c => ({ text: c, votes: 0 })), endsAt: new Date(Date.now() + poll.durationInDays * 86400000).toISOString() } : undefined,
      taggedProduct, location, linkUrl,
      status, scheduledAt,
      communityId,
      communityName: communityId ? communities.find(c => c.id === communityId)?.name : undefined
    };
    if (draftId) setDrafts(prev => prev.filter((d: Partial<Post>) => d.id !== draftId));
    setPosts(prev => [newPost, ...prev]);
    
    if (status === 'pending_approval') {
        addNotification('Post submitted for approval.', 'info');
    } else {
        addNotification(scheduledAt ? 'Post scheduled!' : 'Post published!', 'info');
    }
    onNavigate('Home');
  };

  const handleEditPost = (postId: string, content: string) => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, content, editedAt: new Date().toISOString() } : p));
      addNotification('Post updated', 'info');
      onBack();
  };

  const handleToggleLike = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isLiked = !post.isLiked;
        return { ...post, isLiked, likes: post.likes + (isLiked ? 1 : -1) };
      }
      return post;
    }));
  }, []);

  const handleToggleEcho = useCallback((postId: string, isQuotePost?: boolean) => {
    setPosts(prev => prev.map(post => {
      if (post.id === postId) {
        const isEchoed = !post.isEchoed;
        if (isQuotePost) return { ...post, echos: post.echos + 1 };
        return { ...post, isEchoed, echos: post.echos + (isEchoed ? 1 : -1) };
      }
      return post;
    }));
    if (isQuotePost) addNotification('Post quoted!', 'info');
  }, [addNotification]);

  const handleToggleBookmark = useCallback((postId: string) => {
    setPosts(prev => prev.map(post => post.id === postId ? { ...post, isBookmarked: !post.isBookmarked } : post));
    addNotification('Bookmark updated', 'info');
  }, [addNotification]);

  const handleCreateComment = useCallback((postId: string, content: string) => {
      if (!currentUser) return;

      const post = posts.find(p => p.id === postId);
      if (post && post.communityId) {
          const community = communities.find(c => c.id === post.communityId);
          if (community && community.moderationSettings?.autoFilterWords) {
             const bannedWords = community.moderationSettings.autoFilterWords;
             const hasBannedWord = bannedWords.some(word => content.toLowerCase().includes(word.toLowerCase()));
             if (hasBannedWord) {
                 addNotification('Comment contains banned words.', 'error');
                 return;
             }
          }
      }

      const newComment: Comment = {
          id: `comment-${Date.now()}`, user: currentUser, content,
          timestamp: new Date().toISOString(), replies: []
      };
      setPosts(prev => prev.map(post => {
          if (post.id === postId) {
              return { ...post, comments: post.comments + 1, commentData: [...(post.commentData || []), newComment] };
          }
          return post;
      }));
  }, [currentUser, posts, communities, addNotification]);

  const handleReplyToComment = useCallback((postId: string, parentCommentId: string, content: string) => {
      if (!currentUser) return;

      const post = posts.find(p => p.id === postId);
      if (post && post.communityId) {
          const community = communities.find(c => c.id === post.communityId);
          if (community && community.moderationSettings?.autoFilterWords) {
             const bannedWords = community.moderationSettings.autoFilterWords;
             const hasBannedWord = bannedWords.some(word => content.toLowerCase().includes(word.toLowerCase()));
             if (hasBannedWord) {
                 addNotification('Reply contains banned words.', 'error');
                 return;
             }
          }
      }

      const newReply: Comment = {
          id: `reply-${Date.now()}`, user: currentUser, content,
          timestamp: new Date().toISOString(), replies: []
      };
      const addReplyToTree = (comments: Comment[]): Comment[] => {
          return comments.map(comment => {
              if (comment.id === parentCommentId) return { ...comment, replies: [...(comment.replies || []), newReply] };
              if (comment.replies) return { ...comment, replies: addReplyToTree(comment.replies) };
              return comment;
          });
      };
      setPosts(prev => prev.map(post => {
          if (post.id === postId) {
              return { ...post, comments: post.comments + 1, commentData: addReplyToTree(post.commentData || []) };
          }
          return post;
      }));
  }, [currentUser, posts, communities, addNotification]);

  const handleCreateStory = async (storyData: NewStoryData, adData?: { isAd: boolean; ctaText: string; ctaLink: string }) => {
    if (!currentUser) return;
    let storyPayload: Partial<Story> = {
        id: `story-${Date.now()}`,
        user: currentUser,
        timestamp: new Date().toISOString(),
        ...adData
    };
    if (storyData.type === 'media') {
        const fileUrl = await uploadFile(storyData.file);
        const mediaPayload = storyData.fileType === 'image'
            ? { imageUrl: fileUrl }
            : { videoUrl: fileUrl };
        storyPayload = { ...storyPayload, ...mediaPayload, fileType: storyData.fileType };
    } else {
        storyPayload = { ...storyPayload, ...storyData, fileType: 'text' };
    }
    setStories(prev => [storyPayload as Story, ...prev]);
    addNotification('Story added!', 'info');
  };

  const handleSendMessage = (receiverId: string, messageData: { text?: string; audioUrl?: string; type: 'text' | 'audio' }) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: `msg-${Date.now()}`, senderId: currentUser.id, receiverId,
      timestamp: new Date().toISOString(), read: false, ...messageData
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleMarkAsRead = (partnerId: string) => {
      if (!currentUser) return;
      setMessages(prev => prev.map(msg => 
          (msg.senderId === partnerId && msg.receiverId === currentUser.id && !msg.read) ? { ...msg, read: true } : msg
      ));
  };
  
  const handleSubscribe = useCallback((userId: string) => {
    if (!currentUser) return;
    setUsers(prev => {
        const userToSub = prev[userId];
        if (!userToSub) return prev;
        const isSubscribed = (currentUser.followingIds || []).includes(userId);
        
        if (isSubscribed) {
            setCurrentUser(curr => curr ? { ...curr, following: (curr.following || 1) - 1, followingIds: (curr.followingIds || []).filter(id => id !== userId) } : null);
            addNotification(`Unsubscribed from ${userToSub.name}`, 'info');
            return { ...prev, [userId]: { ...userToSub, followers: (userToSub.followers || 1) - 1 } };
        } else {
            setCurrentUser(curr => curr ? { ...curr, following: (curr.following || 0) + 1, followingIds: [...(curr.followingIds || []), userId] } : null);
            addNotification(`Subscribed to ${userToSub.name}`, 'info');
            return { ...prev, [userId]: { ...userToSub, followers: (userToSub.followers || 0) + 1 } };
        }
    });
  }, [currentUser, addNotification]);

  const handleFollow = useCallback((userId: string) => handleSubscribe(userId), [handleSubscribe]);

  const handleAddToCart = useCallback((product: Product) => {
    setCart(prev => [...prev, product]);
    addNotification(`${product.name} added to cart!`, 'info');
    dispatchModal({ type: 'OPEN_CART' });
  }, [addNotification]);
  
  const handleRemoveFromCart = (productId: string) => {
      setCart(prev => {
          const index = prev.findIndex(p => p.id === productId);
          if (index > -1) {
              const newCart = [...prev];
              newCart.splice(index, 1);
              return newCart;
          }
          return prev;
      });
  };

  const handleCheckout = (address: string) => {
      const totalCost = cart.reduce((sum, item) => sum + (item.price * 100), 0);
      if (currentUser && (currentUser.coinBalance || 0) >= totalCost) {
          const newOrders: Order[] = cart.map(item => ({
              id: `order-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              productId: item.id,
              productName: item.name,
              buyerId: currentUser.id,
              buyerName: currentUser.name,
              sellerId: item.seller.id,
              amount: item.price,
              deliveryAddress: address,
              timestamp: new Date().toISOString()
          }));

          setOrders(prev => [...newOrders, ...prev]);

          // Update seller balances and notify them
          setUsers(prev => {
              const updatedUsers = { ...prev };
              cart.forEach(item => {
                  const seller = updatedUsers[item.seller.id];
                  if (seller) {
                      const itemPriceInCoins = item.price * 100;
                      const platformFee = Math.floor(itemPriceInCoins * PLATFORM_FEE_PERCENTAGE);
                      const sellerEarnings = itemPriceInCoins - platformFee;
                      
                      updatedUsers[item.seller.id] = {
                          ...seller,
                          coinBalance: (seller.coinBalance || 0) + sellerEarnings
                      };
                      // If the seller is the current user (e.g. testing), notification won't show in real-time but logic is here
                      // addNotification won't work across "accounts" in this mock, but we simulate it for logic
                  }
              });
              return updatedUsers;
          });

          // In a real app, we would send socket notifications. 
          // Since it's a mock, we just acknowledge the purchase.
          setCurrentUser(prev => prev ? { ...prev, coinBalance: (prev.coinBalance || 0) - totalCost } : null);
          setCart([]);
          addNotification(`Purchase successful! Items will be delivered to: ${address.substring(0, 30)}...`, 'info');
          dispatchModal({ type: 'CLOSE_MODALS' });
      } else {
          addNotification('Insufficient coin balance.', 'info');
      }
  };

  const handleSendGift = (post: Post, gift: Gift) => {
      if (currentUser && (currentUser.coinBalance || 0) >= gift.priceInCoins) {
          setCurrentUser(prev => prev ? { ...prev, coinBalance: (prev.coinBalance || 0) - gift.priceInCoins } : null);
          setPosts(prev => prev.map(p => p.id === post.id ? { ...p, giftsReceived: [...(p.giftsReceived || []), { giftId: gift.id, userId: currentUser.id }] } : p));
          addNotification(`You sent a ${gift.name} to ${post.user.name}!`, 'info');
          dispatchModal({ type: 'CLOSE_MODALS' });
      } else {
          addNotification('Insufficient coin balance.', 'info');
      }
  };

  const handleSendTip = (amount: number, userToTip: User) => {
      if (currentUser && (currentUser.coinBalance || 0) >= amount) {
          setCurrentUser(prev => prev ? { ...prev, coinBalance: (prev.coinBalance || 0) - amount } : null);
          setUsers(prev => ({ ...prev, [userToTip.id]: { ...userToTip, coinBalance: (userToTip.coinBalance || 0) + amount } }));
          addNotification(`You sent ${amount} coins to ${userToTip.name}!`, 'info');
          dispatchModal({ type: 'CLOSE_MODALS' });
      } else {
          addNotification('Insufficient coin balance.', 'info');
      }
  };

  const handleAddFunds = (amount: number) => {
    setCurrentUser(prev => prev ? {...prev, adBalance: (prev.adBalance || 0) + amount} : null);
    addNotification(`$${amount.toFixed(2)} added to your ad balance.`, 'info');
  };
  
  const handleBuyCoins = (amount: number) => {
    setCurrentUser(prev => prev ? {...prev, coinBalance: (prev.coinBalance || 0) + amount} : null);
    addNotification(`${amount} coins added to your wallet.`, 'info');
  };
  
  const handleUpdateProfile = async (updates: Partial<User>, avatarFile?: File, bannerFile?: File) => {
    if (!currentUser) return;
    let avatarUrl = currentUser.avatarUrl;
    let bannerUrl = currentUser.bannerUrl;
    if (avatarFile) avatarUrl = await uploadFile(avatarFile);
    if (bannerFile) bannerUrl = await uploadFile(bannerFile);
    
    const updatedUser = { ...currentUser, ...updates, avatarUrl, bannerUrl };
    setCurrentUser(updatedUser);
    setUsers(prev => ({ ...prev, [currentUser.id]: updatedUser }));
    addNotification('Profile updated!', 'info');
  };

  const handleToggleBlock = useCallback((userId: string) => {
    setBlockedUserIds(prev => {
        if (prev.includes(userId)) {
            addNotification(`Unblocked user.`, 'info');
            return prev.filter(id => id !== userId);
        } else {
            addNotification(`Blocked user.`, 'info');
            return [...prev, userId];
        }
    });
  }, [addNotification]);

  const handleSaveDraft = (draftData: Partial<Post>, options?: { silent?: boolean }) => {
      let id = draftData.id;
      if (id) {
          setDrafts(prev => prev.map((d: Partial<Post>) => d.id === id ? draftData : d));
      } else {
          id = `draft-${Date.now()}`;
          setDrafts(prev => [{ ...draftData, id }, ...prev]);
      }
      if (!options?.silent) addNotification('Draft saved!', 'info');
      return id;
  };

  const handleDeleteDraft = (draftId: string) => {
      setDrafts(prev => prev.filter((d: Partial<Post>) => d.id !== draftId));
      addNotification('Draft deleted.', 'info');
  };

  const handleClaimAdReward = useCallback((campaign: AdCampaign, engagementType: 'like' | 'echo') => {
      const reward = campaign.engagementReward || 0;
      if (reward > 0) {
          setCurrentUser(prev => prev ? { ...prev, coinBalance: (prev.coinBalance || 0) + reward } : null);
          setClaimedAdRewards(prev => ({ ...prev, [campaign.id]: [...(prev[campaign.id] || []), engagementType] }));
          addNotification(`You earned ${reward} coins for engaging!`, 'info');
      }
  }, [addNotification]);

  const handleClaimPostReward = useCallback((postId: string, reward: number) => {
    if (!claimedPostRewardIds.includes(postId)) {
      setCurrentUser(prev => prev ? { ...prev, coinBalance: (prev.coinBalance || 0) + reward } : null);
      setClaimedPostRewardIds(prev => [...prev, postId]);
      addNotification(`You earned ${reward} coins!`, 'info');
    }
  }, [claimedPostRewardIds, addNotification]);

  const handleCreateCommunity = (communityData: Omit<Community, 'id' | 'ownerId' | 'memberCount'>) => {
    if (!currentUser) return;
    const newCommunity: Community = {
        ...communityData,
        id: `comm-${Date.now()}`,
        ownerId: currentUser.id,
        memberCount: 1,
    };
    setCommunities(prev => [newCommunity, ...prev]);
    addNotification('Community created!', 'info');
    dispatchModal({ type: 'CLOSE_MODALS' });
  };
  
  const handleJoinCommunity = useCallback((communityId: string) => {
      if (!currentUser) return;
      const isMember = (currentUser.joinedCommunityIds || []).includes(communityId);
      let updatedUser: User;
      if (isMember) {
          updatedUser = { ...currentUser, joinedCommunityIds: (currentUser.joinedCommunityIds || []).filter(id => id !== communityId) };
          setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, memberCount: c.memberCount - 1 } : c));
      } else {
          updatedUser = { ...currentUser, joinedCommunityIds: [...(currentUser.joinedCommunityIds || []), communityId] };
          setCommunities(prev => prev.map(c => c.id === communityId ? { ...c, memberCount: c.memberCount + 1 } : c));
      }
      setCurrentUser(updatedUser);
      setUsers(prev => ({...prev, [currentUser.id]: updatedUser}));
  }, [currentUser]);

  const handleCreateProduct = (productData: Omit<Product, 'id' | 'seller'>, fileDataUrl: string) => {
    if (!currentUser) return;
    const newProduct: Product = {
        ...productData,
        id: `prod-${Date.now()}`,
        seller: currentUser,
        imageUrl: fileDataUrl,
    };
    setProducts(prev => [newProduct, ...prev]);
    addNotification('Product listed!', 'info');
    dispatchModal({ type: 'CLOSE_MODALS' });
  };
  
  const handleCreateAd = (campaignData: Omit<AdCampaign, 'id' | 'impressions' | 'clicks' | 'spent' | 'ownerId'>) => {
    if (!currentUser) return;
    const newCampaign: AdCampaign = {
        ...campaignData,
        id: `ad-${Date.now()}`,
        ownerId: currentUser.id,
        impressions: 0,
        clicks: 0,
        spent: 0,
    };
    setAdCampaigns(prev => [newCampaign, ...prev]);
    setCurrentUser(prev => prev ? { ...prev, adBalance: (prev.adBalance || 0) - newCampaign.budget } : null);
    addNotification('Ad campaign launched!', 'info');
    dispatchModal({ type: 'CLOSE_MODALS' });
  };
  
  const handleStartLiveStream = (title: string) => {
    if (!currentUser) return;
    const newStream: LiveStream = {
        id: `live-${Date.now()}`,
        broadcaster: currentUser,
        title,
        status: 'live',
        viewers: 1,
        startTime: new Date().toISOString(),
        thumbnailUrl: `https://picsum.photos/seed/live-${Date.now()}/1280/720`,
        comments: [],
    };
    setLiveStreams(prev => [newStream, ...prev]);
    dispatchModal({ type: 'CLOSE_MODALS' });
    onNavigate(`live/${newStream.id}`);
  };

  const handleEndLiveStream = (streamId: string) => {
      const stream = liveStreams.find(s => s.id === streamId);
      if (!stream) return;
      
      const updatedStream = { ...stream, status: 'ended' as const, endTime: new Date().toISOString() };
      setLiveStreams(prev => prev.map(s => s.id === streamId ? updatedStream : s));
      onNavigate('live');
      dispatchModal({ type: 'OPEN_STREAM_SUMMARY', payload: updatedStream });
  };
  
  const handleAddLiveComment = useCallback((streamId: string, text: string, user?: User) => {
      const commentUser = user || currentUser;
      if (!commentUser) return;
      const newComment: LiveStreamComment = {
          id: `ls-comment-${Date.now()}`,
          user: commentUser,
          text,
          timestamp: new Date().toISOString(),
      };
      setLiveStreams(prev => prev.map(s => s.id === streamId ? { ...s, comments: [...s.comments, newComment] } : s));
  }, [currentUser]);

  const handleUpdateMonetizationSettings = (setting: keyof MonetizationSettings, value: boolean) => {
    if (!currentUser) return;
    const newSettings = { ...(currentUser.monetizationSettings || {}), [setting]: value };
    handleUpdateProfile({ monetizationSettings: newSettings as MonetizationSettings });
  };

  const handleUpdateMessagingSettings = (settings: MessagingSettings) => {
    if (!currentUser) return;
    handleUpdateProfile({ messagingSettings: settings });
  };

  const handleVerificationRequestSubmit = () => {
    if (!currentUser) return;
    handleUpdateProfile({ verificationStatus: 'pending_review' });
    addNotification('Verification submitted for review.', 'info');
  };

  const handleVerificationPayment = () => {
    if (!currentUser) return;
    handleUpdateProfile({ verificationStatus: 'verified' });
    addNotification('Payment successful! You are now verified.', 'info');
  };

  const handleUpdateCommunity = (updatedCommunity: Community) => {
    setCommunities(prev => prev.map(c => c.id === updatedCommunity.id ? updatedCommunity : c));
    addNotification('Community settings updated.', 'info');
  };

  const handleBanUser = (communityId: string, userId: string, reason: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const newBan: any = {
          userId,
          reason,
          bannedAt: new Date().toISOString(),
          bannedBy: currentUser.id
        };
        const auditLog = {
          id: `audit-${Date.now()}`,
          action: 'ban' as const,
          moderatorId: currentUser.id,
          targetId: userId,
          reason,
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          bannedUsers: [...(c.bannedUsers || []), newBan],
          memberCount: c.memberCount - 1, // Assume banning removes them
          auditLogs: [...(c.auditLogs || []), auditLog]
        };
      }
      return c;
    }));
    // Also remove from joinedCommunityIds of the user (mock logic)
    setUsers(prev => {
        const user = prev[userId];
        if (user) {
            return {
                ...prev,
                [userId]: {
                    ...user,
                    joinedCommunityIds: (user.joinedCommunityIds || []).filter(id => id !== communityId)
                }
            };
        }
        return prev;
    });
    addNotification('User banned from community.', 'info');
  };

  const handleUnbanUser = (communityId: string, userId: string) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const auditLog = {
          id: `audit-${Date.now()}`,
          action: 'unban' as const,
          moderatorId: currentUser.id,
          targetId: userId,
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          bannedUsers: (c.bannedUsers || []).filter(b => b.userId !== userId),
          auditLogs: [...(c.auditLogs || []), auditLog]
        };
      }
      return c;
    }));
    addNotification('User unbanned.', 'info');
  };

  const handleResolveReport = (communityId: string, reportId: string, resolution: any) => {
    if (!currentUser) return;
    setCommunities(prev => prev.map(c => {
      if (c.id === communityId) {
        const auditLog = {
          id: `audit-${Date.now()}`,
          action: 'resolve_report' as const,
          moderatorId: currentUser.id,
          targetId: reportId,
          reason: `Resolution: ${resolution}`,
          timestamp: new Date().toISOString()
        };
        return {
          ...c,
          reports: (c.reports || []).map(r => r.id === reportId ? { ...r, status: resolution, resolvedAt: new Date().toISOString(), resolvedBy: currentUser.id } : r),
          auditLogs: [...(c.auditLogs || []), auditLog]
        };
      }
      return c;
    }));
    addNotification(`Report ${resolution}.`, 'info');
  };

  const handleApprovePost = (postId: string, communityId?: string) => {
      if (!currentUser) return;
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              const status = p.scheduledAt && new Date(p.scheduledAt) > new Date() ? 'scheduled' : 'published';
              return { ...p, status };
          }
          return p;
      }));
      if (communityId) {
          setCommunities(prev => prev.map(c => {
              if (c.id === communityId) {
                  const auditLog = {
                      id: `audit-${Date.now()}`,
                      action: 'approve_post' as const,
                      moderatorId: currentUser.id,
                      targetId: postId,
                      timestamp: new Date().toISOString()
                  };
                  return { ...c, auditLogs: [...(c.auditLogs || []), auditLog] };
              }
              return c;
          }));
      }
      addNotification('Post approved', 'info');
  };

  const handleRejectPost = (postId: string, communityId?: string) => {
      if (!currentUser) return;
      setPosts(prev => prev.filter(p => p.id !== postId));
      if (communityId) {
          setCommunities(prev => prev.map(c => {
              if (c.id === communityId) {
                  const auditLog = {
                      id: `audit-${Date.now()}`,
                      action: 'reject_post' as const,
                      moderatorId: currentUser.id,
                      targetId: postId,
                      timestamp: new Date().toISOString()
                  };
                  return { ...c, auditLogs: [...(c.auditLogs || []), auditLog] };
              }
              return c;
          }));
      }
      addNotification('Post rejected', 'info');
  };

  const handleReportContent = useCallback((type: 'post' | 'comment' | 'user', id: string, reason: string, description: string, communityId?: string) => {
      if (!currentUser) return;
      const newReport: any = {
          id: `rep-${Date.now()}`,
          reporterId: currentUser.id,
          reportedId: id,
          reportedType: type,
          reason,
          description,
          status: 'pending',
          timestamp: new Date().toISOString()
      };
      
      if (communityId) {
          setCommunities(prev => prev.map(c => {
              if (c.id === communityId) {
                  const updatedReports = [...(c.reports || []), newReport];
                  let updatedBannedUsers = c.bannedUsers || [];
                  let updatedAuditLogs = c.auditLogs || [];

                  // Auto-ban logic
                  if (c.moderationSettings?.autoBanReportCount && type === 'user') {
                      const userReportCount = updatedReports.filter(r => r.reportedType === 'user' && r.reportedId === id && r.status === 'pending').length;
                      if (userReportCount >= c.moderationSettings.autoBanReportCount) {
                          if (!updatedBannedUsers.find(b => b.userId === id)) {
                              updatedBannedUsers = [...updatedBannedUsers, { userId: id, reason: `Auto-banned: Received ${userReportCount} reports`, bannedAt: new Date().toISOString() }];
                              updatedAuditLogs = [...updatedAuditLogs, {
                                  id: `audit-${Date.now()}`,
                                  action: 'ban',
                                  moderatorId: 'system',
                                  targetId: id,
                                  reason: `Auto-banned: Received ${userReportCount} reports`,
                                  timestamp: new Date().toISOString()
                              }];
                              // Auto-resolve those reports
                              updatedReports.forEach(r => {
                                  if (r.reportedType === 'user' && r.reportedId === id && r.status === 'pending') {
                                      r.status = 'resolved';
                                  }
                              });
                          }
                      }
                  }

                  return { 
                      ...c, 
                      reports: updatedReports,
                      bannedUsers: updatedBannedUsers,
                      auditLogs: updatedAuditLogs
                  };
              }
              return c;
          }));
      } else {
          // Global report (mock)
          console.log('Global report submitted:', newReport);
      }
      addNotification('Report submitted. Thank you for keeping the community safe.', 'info');
  }, [currentUser, addNotification]);

  const handleAdImpression = useCallback((campaignId: string) => {
      setAdCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, impressions: (c.impressions || 0) + 1 } : c
      ));
  }, []);
  
  const handleAdClick = useCallback((campaignId: string) => {
      setAdCampaigns(prev => prev.map(c => 
          c.id === campaignId ? { ...c, clicks: (c.clicks || 0) + 1 } : c
      ));
  }, []);

  const handleSearch = useCallback((query: string) => onNavigate(`explore?q=${query}`), [onNavigate]);
  const handleViewPost = useCallback((post: Post) => onNavigate(`post/${post.id}`), [onNavigate]);
  const handleViewProfile = useCallback((userId: string) => onNavigate(`profile/${userId}`), [onNavigate]);
  const handlePlayVideo = useCallback((postId: string) => onNavigate(`video/${postId}`), [onNavigate]);
  const handleTogglePlayVideo = useCallback((postId: string) => setPlayingVideoId(prev => (prev === postId ? null : postId)), []);
  const handleOpenEditModal = useCallback((post: Post) => { setPostToEdit(post); onNavigate('compose'); }, [onNavigate]);
  const handleOpenQuoteModal = useCallback((post: Post) => { setPostToQuote(post); onNavigate('compose'); }, [onNavigate]);
  const handleOpenBoostModal = useCallback((post: Post) => dispatchModal({ type: 'OPEN_CREATE_AD', payload: post }), []);
  const handleShareToCommunity = useCallback((post: Post) => dispatchModal({ type: 'OPEN_SHARE', payload: post }), []);
  const openGiftModal = useCallback((post: Post) => dispatchModal({ type: 'OPEN_GIFT', payload: post }), []);

  const activeAdCampaigns = useMemo(() => (adCampaigns || []).filter(ad => {
    const now = new Date();
    const start = new Date(ad.startDate);
    const end = new Date(ad.endDate);
    return now >= start && now <= end;
  }), [adCampaigns]);

  const storiesByUser = useMemo(() => {
    const userStoryMap: { [userId: string]: { user: User, stories: Story[] } } = {};
    const storyList = stories as Story[];
    [...storyList].sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).forEach(story => {
        if (!userStoryMap[story.user.id]) {
            userStoryMap[story.user.id] = { user: story.user, stories: [] };
        }
        userStoryMap[story.user.id].stories.push(story);
    });
    return Object.values(userStoryMap);
  }, [stories]);

  const allUsersList = useMemo(() => Object.values(users) as User[], [users]);

  const renderContent = () => {
    if (!currentUser) return null;
    const allPostHandlers = {
      currentUser, allUsers: allUsersList, subscribedToUserIds: currentUser.followingIds || [],
      handleToggleLike, handleToggleEcho, handleToggleBookmark, handleSubscribe, handleFollow,
      openGiftModal,
      handleAddToCart, viewCommunity: (c: Community) => onNavigate(`community/${c.id}`), handleSearch,
      blockedUserIds, handleToggleBlock,
      handleViewPost,
      handleOpenQuoteModal,
      handleOpenEditModal,
      handleOpenBoostModal,
      handleViewProfile,
      handlePlayVideo,
      handleTogglePlayVideo,
      playingVideoId,
      handleShareToCommunity,
      activeAdCampaigns,
      onNavigate,
      onAdImpression: handleAdImpression,
      onAdClick: handleAdClick,
      onReportContent: handleReportContent,
    };

    switch (route.path) {
      case 'Home':
        return <Feed posts={posts} stories={storiesByUser} {...allPostHandlers} onStoryClick={(userId: string) => dispatchModal({ type: 'OPEN_STORY_VIEWER', payload: storiesByUser.findIndex(s => s.user.id === userId) })} onCreateStoryClick={() => dispatchModal({ type: 'OPEN_CREATE_STORY' })} activeView={route.path} handleGenerateAndCompose={(text: string) => { setPostToEdit({ content: text }); onNavigate('compose'); }} openCompose={() => onNavigate('compose')} handleRefresh={handleRefresh} onLogout={handleLogout} claimedAdRewards={claimedAdRewards} handleClaimAdReward={handleClaimAdReward} onMobileMenuToggle={() => setMobileMenuOpen(true)} allProducts={products} openCreateProductModal={() => dispatchModal({ type: 'OPEN_CREATE_PRODUCT' })} />;
      case 'Explore':
        return <ExplorePage posts={posts} onBack={onBack} {...allPostHandlers} allCommunities={communities} handleJoinCommunity={handleJoinCommunity} onNavigate={onNavigate} />;
      case 'Live':
        if (route.params && route.params.length > 0) {
            const stream = liveStreams.find((s: LiveStream) => s.id === route.params[0]);
            return stream ? <LiveStreamPage stream={stream} currentUser={currentUser} onEndStream={handleEndLiveStream} onAddComment={handleAddLiveComment} onCommentReaction={() => {}} onBack={onBack} /> : <div>Live stream not found</div>;
        }
        return <LivePage liveStreams={liveStreams} onViewStream={(s: LiveStream) => onNavigate(`live/${s.id}`)} onStartStream={() => dispatchModal({ type: 'OPEN_START_LIVE' })} onBack={onBack} {...allPostHandlers} adCampaigns={adCampaigns} allPosts={posts} allProducts={products} claimedAdRewards={claimedAdRewards} handleClaimAdReward={handleClaimAdReward} onNavigate={onNavigate} />;
      case 'Communities':
        return <CommunitiesPage allCommunities={communities} currentUser={currentUser} onJoinCommunity={handleJoinCommunity} onCreateCommunity={() => dispatchModal({ type: 'OPEN_CREATE_COMMUNITY' })} onViewCommunity={(c: Community) => onNavigate(`community/${c.id}`)} onBack={onBack} />;
      case 'Followers': {
        const targetUser = users[route.params[0]] || currentUser;
        return <FollowersPage currentUser={currentUser} targetUser={targetUser} allUsers={allUsersList} onBack={onBack} handleViewProfile={handleViewProfile} handleFollow={handleFollow} pageType={route.rawPath as 'followers' | 'following'} />;
      }
      case 'Notifications':
        return <NotificationsPage onBack={onBack} currentUser={currentUser} onNavigate={onNavigate} />;
      case 'Messages':
        return <MessagesPage messages={messages} currentUser={currentUser} allUsers={allUsersList} onSendMessage={handleSendMessage} onMarkAsRead={handleMarkAsRead} onMessageReaction={() => {}} activeConversationUserId={activeConversationUserId} setActiveConversationUserId={setActiveConversationUserId} blockedUserIds={blockedUserIds} onBack={onBack} onNavigate={onNavigate} />;
      case 'Bookmarks':
        return <BookmarksPage posts={posts} onBack={onBack} {...allPostHandlers} />;
      case 'Store':
        return <ShopPage handleAddToCart={handleAddToCart} openCartModal={() => dispatchModal({ type: 'OPEN_CART' })} showCart={true} cartItemCount={cart.length} onBack={onBack} currentUser={currentUser} onNavigate={onNavigate} />;
      case 'Profile': {
        const userIdParam = route.params[0];
        let profileUser = currentUser;
        
        if (userIdParam) {
            const foundUser = users[userIdParam];
            if (foundUser) {
                profileUser = foundUser;
            } else {
                return (
                    <div className="flex flex-col items-center justify-center h-full text-on-surface-secondary p-4 text-center">
                        <div className="bg-surface dark:bg-dark-surface p-8 rounded-2xl border border-border dark:border-dark-border shadow-sm max-w-sm w-full">
                            <div className="text-6xl mb-4">😕</div>
                            <h2 className="text-xl font-bold text-on-surface dark:text-dark-on-surface mb-2">User not found</h2>
                            <p className="mb-6">The user you are looking for doesn't exist or may have been removed.</p>
                            <button onClick={onBack} className="bg-primary text-white font-bold py-2 px-6 rounded-full hover:bg-primary-hover transition-colors w-full">
                                Go Back
                            </button>
                        </div>
                    </div>
                );
            }
        }
        
        return <ProfilePage user={profileUser} allPosts={posts} allProducts={products} handleUpdateProfile={handleUpdateProfile} openCreateProductModal={() => dispatchModal({ type: 'OPEN_CREATE_PRODUCT' })} onBack={onBack} {...allPostHandlers} handleToggleAccountStatus={() => {}} />;
      }
      case 'Compose': {
        const composeParam = route.params[0];
        const isMode = ['camera', 'poll', 'tag', 'location', 'ai', 'schedule'].includes(composeParam);
        const initialMode = isMode ? composeParam as any : undefined;
        const initialText = !isMode ? composeParam : undefined;
        return <ComposePage handleCreatePost={handleCreatePost} handleEditPost={handleEditPost} currentUser={currentUser} joinedCommunities={communities.filter(c => (currentUser.joinedCommunityIds || []).includes(c.id))} postToQuote={postToQuote} postToEdit={postToEdit} allUsers={allUsersList} initialText={initialText} initialMode={initialMode} userProducts={products.filter(p => p.seller.id === currentUser.id)} handleSaveDraft={handleSaveDraft} openDraftsModal={() => dispatchModal({ type: 'OPEN_DRAFTS' })} onBack={onBack} />;
      }
      case 'Post': {
        const post = posts.find(p => p.id === route.params[0]);
        return post ? <PostDetailPage post={post} onBack={onBack} onCreateComment={handleCreateComment} handleReplyToComment={handleReplyToComment} claimedPostRewardIds={claimedPostRewardIds} handleClaimPostReward={handleClaimPostReward} {...allPostHandlers} /> : <div>Post not found</div>;
      }
      case 'Videos': {
        const videoFeedPosts = posts.filter(p => p.fileType === 'video' || p.videoUrl || (p.media && p.media.some(m => m.type === 'video')));
        if (videoFeedPosts.length > 0) {
            return <VideoPlayerPage post={videoFeedPosts[0]} onBack={onBack} openTipModal={(user: User) => dispatchModal({ type: 'OPEN_TIP', payload: user })} claimedPostRewardIds={claimedPostRewardIds} handleClaimPostReward={handleClaimPostReward} {...allPostHandlers} onNavigate={onNavigate} allPosts={videoFeedPosts} />;
        }
        return <div className="flex items-center justify-center h-full text-on-surface-secondary">No videos available</div>;
      }
      case 'Video': {
          const videoPost = posts.find(p => p.id === route.params[0]);
          const hasVideo = videoPost && (videoPost.fileType === 'video' || videoPost.videoUrl || (videoPost.media && videoPost.media.some(m => m.type === 'video')));
          return hasVideo ? <VideoPlayerPage post={videoPost!} onBack={onBack} openTipModal={(user: User) => dispatchModal({ type: 'OPEN_TIP', payload: user })} claimedPostRewardIds={claimedPostRewardIds} handleClaimPostReward={handleClaimPostReward} {...allPostHandlers} onNavigate={onNavigate} allPosts={posts} /> : <div>Video not found</div>;
      }
      case 'Community': {
          const community = communities.find(c => c.id === route.params[0]);
          return community ? (
            <CommunityPage 
              community={community} 
              allPosts={posts} 
              onJoinCommunity={handleJoinCommunity} 
              onBack={onBack} 
              {...allPostHandlers}
              onUpdateCommunity={handleUpdateCommunity}
              onBanUser={(userId, reason) => handleBanUser(community.id, userId, reason)}
              onUnbanUser={(userId) => handleUnbanUser(community.id, userId)}
              onResolveReport={(reportId, resolution) => handleResolveReport(community.id, reportId, resolution)}
              onApprovePost={handleApprovePost}
              onRejectPost={handleRejectPost}
            />
          ) : <div>Community not found</div>;
      }
      case 'Ad-manager':
        return <AdManagerPage campaigns={adCampaigns.filter(c => c.ownerId === currentUser.id)} onCreateAd={() => dispatchModal({ type: 'OPEN_CREATE_AD', payload: null })} currentUser={currentUser} onAddFunds={handleAddFunds} onBack={onBack} />;
      case 'Analytics':
        return <AnalyticsPage currentUser={currentUser} allPosts={posts} onBack={onBack} {...allPostHandlers} />;
      case 'Monetization':
        return <MonetizationPage earnings={{ subscriptions: 120.5, tips: 55, adRevenue: 250.75, gifts: 75.2 }} currentUser={currentUser} orders={orders.filter(o => o.sellerId === currentUser.id)} onUpdateSettings={handleUpdateMonetizationSettings} allPosts={posts} onBack={onBack} onNavigate={onNavigate} />;
      case 'Verification':
        return <VerificationPage currentUser={currentUser} handleVerificationRequestSubmit={handleVerificationRequestSubmit} handleVerificationPayment={handleVerificationPayment} onBack={onBack} />;
      case 'Privacy':
        return <PrivacySettingsPage currentUser={currentUser} onUpdateSettings={handleUpdateMessagingSettings} onBack={onBack} />;
      case 'Settings':
        return <SettingsPage onNavigate={onNavigate} openLanguageModal={() => dispatchModal({ type: 'OPEN_LANGUAGE' })} openQrCodeModal={() => dispatchModal({ type: 'OPEN_QR_CODE' })} onBack={onBack} openThemeModal={() => dispatchModal({ type: 'OPEN_THEME' })} />;
      case 'Wallet':
        return <WalletPage currentUser={currentUser} transactions={transactions} onBuyCoins={handleBuyCoins} onBack={onBack} />;
      case 'Sponsorship':
        return <SponsorshipPage currentUser={currentUser} onBack={onBack} />;
      case 'Askai':
        return <AskAiPage onBack={onBack} />;
      case 'Menu':
        return <MenuPage user={currentUser} onNavigate={onNavigate} onLogout={handleLogout} onBack={onBack} activeView={route.path} />;
      case 'Media': {
          const mediaPost = posts.find(p => p.id === route.params[0]);
          const mediaIndex = parseInt(route.params[1] || '0', 10);
          return mediaPost ? <MediaViewerPage post={mediaPost} initialIndex={mediaIndex} onBack={onBack} {...allPostHandlers} /> : <div>Media not found</div>;
      }
      default:
        return <div>404 - Page not found</div>;
    }
  };

  if (!currentUser) {
    return <AuthPage onLogin={handleLogin} onSignUp={handleSignUp} />;
  }

  return (
    <div className="flex h-screen w-full bg-background dark:bg-dark-background">
      <Sidebar 
        activeView={route.path}
        onNavigate={onNavigate}
        openCompose={() => onNavigate('compose')}
        user={currentUser}
        onLogout={handleLogout}
        handleRefresh={handleRefresh}
        isMobileMenuOpen={isMobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      <div className="flex-1 min-w-0 flex flex-col md:flex-row">
        <main className="flex-1 min-w-0 md:border-r md:border-l border-border dark:border-dark-border">
          {renderContent()}
        </main>
        
        <aside className="hidden lg:block w-[350px] p-4 flex-shrink-0">
          <Trends handleSearch={handleSearch} suggestedUsers={allUsersList.filter(u => u.id !== currentUser.id && !(currentUser.followingIds || []).includes(u.id)).slice(0, 5)} handleFollow={handleFollow} handleViewProfile={handleViewProfile} />
        </aside>
      </div>
      
      {/* Floating Action Button - Mobile Only */}
      {route.path === 'Home' && (
      <button
        onClick={() => onNavigate('compose')}
        className={`fixed bottom-6 right-6 md:hidden bg-primary text-white p-4 rounded-full shadow-lg hover:bg-primary-hover transition-all z-40 flex items-center justify-center active:scale-95 ${isScrolling ? 'opacity-50 hover:opacity-100' : 'opacity-100'}`}
        aria-label="Compose"
      >
        <ComposeIcon className="w-6 h-6" />
      </button>
      )}
      
      {/* Modals rendered directly in the tree to avoid Portal issues */}
      <StoryViewer isOpen={modalState.isStoryViewerOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} usersWithStories={storiesByUser} initialUserIndex={modalState.storyViewerInitialIndex} onStoryReaction={() => {}} onStoryReply={() => {}} />
      <CreateStoryModal isOpen={modalState.isCreateStoryModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} handleCreateStory={handleCreateStory} />
      <CartModal isOpen={modalState.isCartModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} cartItems={cart} onRemove={handleRemoveFromCart} currentUser={currentUser} onCheckout={handleCheckout} onNavigate={onNavigate} />
      <GiftModal isOpen={modalState.isGiftModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} postToGift={modalState.postToGift} currentUser={currentUser} handleSendGift={handleSendGift} />
      <TipModal isOpen={modalState.isTipModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} userToTip={modalState.userToTip} currentUser={currentUser} handleSendTip={handleSendTip} />
      <CreateAdModal isOpen={modalState.isCreateAdModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} onCreate={handleCreateAd} currentUser={currentUser} userPosts={posts.filter(p => p.user.id === currentUser.id)} userProducts={products.filter(p => p.seller.id === currentUser.id)} postToPromote={modalState.postToPromote} />
      <CreateCommunityModal isOpen={modalState.isCreateCommunityModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} onCreate={handleCreateCommunity} />
      <CreateProductModal isOpen={modalState.isCreateProductModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} onCreate={handleCreateProduct} currentUser={currentUser} />
      <StartLiveModal isOpen={modalState.isStartLiveModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} onCreateStream={handleStartLiveStream} />
      <PostStreamSummaryModal stream={modalState.completedStream} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} onShare={(summary) => handleCreatePost(summary)} />
      <ThemeModal isOpen={modalState.isThemeModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} />
      <QrCodeModal isOpen={modalState.isQrCodeModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} user={currentUser} />
      <LanguageModal isOpen={modalState.isLanguageModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} />
      <DraftsModal isOpen={modalState.isDraftsModalOpen} onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} drafts={drafts} onLoadDraft={(draft) => { setPostToEdit(draft); onNavigate('compose'); dispatchModal({ type: 'CLOSE_MODALS' }); }} onDeleteDraft={handleDeleteDraft} />
      {modalState.postToShare && (
          <ShareModal 
              isOpen={modalState.isShareModalOpen} 
              onClose={() => dispatchModal({ type: 'CLOSE_MODALS' })} 
              post={modalState.postToShare}
              handleEcho={handleToggleEcho}
              handleQuotePost={handleOpenQuoteModal}
              handleNativeShare={(e) => { e.stopPropagation(); }}
              handleCopyLink={(e) => { e.stopPropagation(); }}
              handleShareToCommunity={(e) => { e.stopPropagation(); }}
          />
      )}
    </div>
  );
};

export default AppContent;

export const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <NotificationProvider>
          <AppContent />
        </NotificationProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};
