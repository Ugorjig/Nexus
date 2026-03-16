
import type { Post, Story, Message, Product, AdCampaign, LiveStream, User, MonetizationSettings, MessagingSettings, Community, Gift, WatchableAd, SponsorshipTier, BrandPartnership } from './types';

// ... (existing imports and code)

const defaultMonetization: MonetizationSettings = { subscriptionsEnabled: true, giftsEnabled: true, adsEnabled: true, tipsEnabled: true };
const defaultMessaging: MessagingSettings = { allowDmsFrom: 'everyone', allowAudioCalls: true, allowVideoCalls: true };

export const MOCK_SPONSORSHIP_TIERS: SponsorshipTier[] = [
  { id: 'tier-1', name: 'Community Support', price: 50, description: 'Support the creator monthly and get recognized.', benefits: ['Exclusive badge', 'Early access to posts', 'Discord role'], color: 'bg-blue-500' },
  { id: 'tier-2', name: 'Brand Mention', price: 250, description: 'Get your brand mentioned in a weekly post.', benefits: ['Post shoutout', 'Link in bio', 'Story feature'], color: 'bg-purple-500' },
  { id: 'tier-3', name: 'Strategic Partner', price: 1000, description: 'Full brand integration across all channels.', benefits: ['Co-branded content', 'Live stream takeover', 'Product placement'], color: 'bg-amber-500' },
];

export const MOCK_BRAND_PARTNERSHIPS: BrandPartnership[] = [
  { id: 'bp-1', brandName: 'TechFlow', brandLogo: 'https://picsum.photos/seed/techflow/100/100', campaignName: 'Summer Launch 2024', status: 'active', value: 2500, startDate: '2024-06-01T10:00:00Z' },
  { id: 'bp-2', brandName: 'GreenEats', brandLogo: 'https://picsum.photos/seed/greeneats/100/100', campaignName: 'Healthy Living', status: 'pending', value: 1200, startDate: '2024-07-15T10:00:00Z' },
];

const ugorji: User = {
    id: 'user-1',
    name: 'Ugorji Goodluck',
    handle: '@ugorjigoodluck',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-1',
    bannerUrl: 'https://picsum.photos/seed/user-1-banner/1500/500',
    email: 'ugorji@cascade.dev',
    password: 'password123',
    bio: 'Founder of Cascade ✨ | Building the future of social media with AI. #webdev #ai #react',
    location: 'Lagos, Nigeria',
    website: 'https://cascade.social',
    followers: 1250000,
    following: 250,
    subscriptionPrice: 4.99,
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    verificationStatus: 'verified',
    monetizationEligibility: 'eligible',
    joinedCommunityIds: ['comm-1', 'comm-2'],
    followingIds: ['user-2', 'user-3', 'user-4'],
    adBalance: 5000,
    coinBalance: 250000,
    mediaKit: {
        totalReach: 4500000,
        engagementRate: 4.8,
        topCountries: [{ name: 'USA', percentage: 45 }, { name: 'Nigeria', percentage: 25 }, { name: 'UK', percentage: 15 }],
        audienceGender: { male: 55, female: 40, other: 5 }
    }
};

const alex: User = {
    id: 'user-2',
    name: 'Alex Johnson',
    handle: '@alexj',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-2',
    bannerUrl: 'https://picsum.photos/seed/user-2-banner/1500/500',
    email: 'alex@example.com',
    password: 'password123',
    bio: 'Photographer & Digital Artist exploring the world through my lens. 📸 NFT enthusiast.',
    location: 'New York, USA',
    website: 'https://alexj.photo',
    followers: 820000,
    following: 500,
    subscriptionPrice: 2.99,
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    verificationStatus: 'verified',
    joinedCommunityIds: ['comm-1'],
    followingIds: ['user-1', 'user-3'],
    adBalance: 1500,
    coinBalance: 120000,
};

const maria: User = {
    id: 'user-3',
    name: 'Maria Garcia',
    handle: '@mariag',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-3',
    bannerUrl: 'https://picsum.photos/seed/user-3-banner/1500/500',
    email: 'maria@example.com',
    password: 'password123',
    bio: 'Chef, food blogger, and author. Sharing my passion for sustainable cooking. 🌿',
    location: 'Barcelona, Spain',
    website: 'https://mariascocina.com',
    followers: 2340000,
    following: 800,
    subscriptionPrice: 3.99,
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    verificationStatus: 'verified',
    joinedCommunityIds: [],
    followingIds: ['user-1', 'user-2', 'user-4'],
    adBalance: 2000,
    coinBalance: 50000,
};

const kenji: User = {
    id: 'user-4',
    name: 'Kenji Tanaka',
    handle: '@kenjit',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-4',
    bannerUrl: 'https://picsum.photos/seed/user-4-banner/1500/500',
    email: 'kenji@example.com',
    password: 'password123',
    bio: 'Indie game developer. Working on my next big project. 🎮 #gamedev #pixelart',
    location: 'Tokyo, Japan',
    website: 'https://kenjigames.dev',
    followers: 15000,
    following: 120,
    verificationStatus: 'none',
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    joinedCommunityIds: ['comm-2'],
    followingIds: ['user-1'],
    adBalance: 75,
    coinBalance: 850,
};

const sarah: User = {
    id: 'user-5',
    name: 'Sarah Chen',
    handle: '@sarahc',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-5',
    bannerUrl: 'https://picsum.photos/seed/user-5-banner/1500/500',
    email: 'sarah@example.com',
    password: 'password123',
    bio: 'UX Designer & Researcher. Obsessed with user-centric design. 🎨✨',
    location: 'San Francisco, USA',
    website: 'https://sarah.design',
    followers: 5400,
    following: 150,
    verificationStatus: 'none',
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    joinedCommunityIds: ['comm-1'],
    followingIds: ['user-1', 'user-2'],
    adBalance: 0,
    coinBalance: 100,
};

const david: User = {
    id: 'user-6',
    name: 'David Miller',
    handle: '@davidm',
    avatarUrl: 'https://i.pravatar.cc/150?u=user-6',
    bannerUrl: 'https://picsum.photos/seed/user-6-banner/1500/500',
    email: 'david@example.com',
    password: 'password123',
    bio: 'Fitness enthusiast and personal trainer. Let\'s get moving! 💪🏋️‍♂️',
    location: 'London, UK',
    website: 'https://davidfit.com',
    followers: 12000,
    following: 300,
    verificationStatus: 'verified',
    monetizationSettings: defaultMonetization,
    messagingSettings: defaultMessaging,
    joinedCommunityIds: [],
    followingIds: ['user-3'],
    adBalance: 0,
    coinBalance: 50,
};

export const ALL_USERS: User[] = [ugorji, alex, maria, kenji, sarah, david];
export const USERS: Record<string, User> = ALL_USERS.reduce((acc, user) => ({ ...acc, [user.id]: user }), {});

export const INITIAL_POSTS: Post[] = [
    {
      id: 'post-1', user: ugorji, content: 'Excited to announce the new AI-powered features coming to Cascade! 🚀 Get ready for a smarter social experience. #AI #SocialMedia #Cascade',
      timestamp: new Date(Date.now() - 3600000).toISOString(), likes: 2500, comments: 150, echos: 500,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
      analytics: { impressions: 50000, engagements: 3150, profileVisits: 1200, newFollowers: 150 },
    },
    {
      id: 'post-2', user: alex, content: 'Chasing sunsets in the city that never sleeps. 🌇 #NYC #Photography',
      imageUrl: 'https://picsum.photos/seed/post-2/1200/800', fileType: 'image',
      timestamp: new Date(Date.now() - 7200000).toISOString(), likes: 1200, comments: 80, echos: 200,
      isLiked: true, isEchoed: false, isBookmarked: true, commentData: [],
    },
    {
      id: 'post-3', user: maria, content: 'My latest creation: a vegan paella that tastes just like the real thing! Recipe dropping this Friday on my blog. 😋 #vegan #recipe #paella',
      imageUrl: 'https://picsum.photos/seed/post-3/1000/1000', fileType: 'image',
      timestamp: new Date(Date.now() - 86400000).toISOString(), likes: 850, comments: 120, echos: 95,
      isLiked: false, isEchoed: true, isBookmarked: false, commentData: [],
      taggedProduct: { id: 'prod-1', name: 'My Vegan Cookbook', description: 'Over 50 delicious recipes', price: 24.99, imageUrl: 'https://picsum.photos/seed/prod-1/400/400', seller: maria, category: 'Digital', rating: 4.9 },
    },
    {
      id: 'post-new-1', user: alex, content: 'Urban geometry is everywhere if you look closely. The intersection of architecture and light. 🏛️✨ #Architecture #Minimalism #Design',
      imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 10000000).toISOString(), likes: 3400, comments: 45, echos: 120,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-2', user: ugorji, content: 'Our community is growing faster than ever! Here is a glimpse of our latest meetup in Lagos. The energy was incredible. 🇳🇬🔥 #CascadeMeetup #CommunityFirst',
      imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 15000000).toISOString(), likes: 5600, comments: 230, echos: 890,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-3', user: maria, content: 'Fresh ingredients are the secret to any great meal. Picked these up from the local market this morning! 🍅🌿 #FarmToTable #HealthyEating',
      imageUrl: 'https://images.unsplash.com/photo-1488459711615-de64ef5996f6?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 20000000).toISOString(), likes: 1100, comments: 56, echos: 34,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-4', user: kenji, content: 'The sound design for Level 5 is finally coming together. Synthesisers and retro drum machines are a match made in heaven. 🎹🥁 #GameDev #IndieGames #SoundDesign',
      imageUrl: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 25000000).toISOString(), likes: 2700, comments: 89, echos: 410,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-5', user: alex, content: 'Foggy mornings in the mountains. There is a specific kind of silence that you only find here. 🏔️🌬️ #NaturePhotography #Adventure #Mountains',
      imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 30000000).toISOString(), likes: 4200, comments: 112, echos: 560,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-6', user: maria, content: 'Host your own cooking workshop! My new guide is live. Learn how to share your passion with others while building a business. 👩‍🍳💼 #Entrepreneur #CookingClass',
      imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 35000000).toISOString(), likes: 890, comments: 42, echos: 18,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-7', user: ugorji, content: 'Behind the scenes at Cascade HQ. We are working on something that will change how you view analytics forever. 📊👀 #BuildInPublic #SaaS #Cascade',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 40000000).toISOString(), likes: 1500, comments: 67, echos: 120,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-8', user: kenji, content: 'Pixel art is not just a style, it is a discipline. Every pixel counts. Working on some environment assets today. 🎨👾 #PixelArt #AssetStore #IndieDev',
      imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 45000000).toISOString(), likes: 3100, comments: 95, echos: 440,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-9', user: alex, content: 'Street photography is about capturing the unplanned moments. This was taken just as the rain started. 🌧️📸 #StreetPhotography #London #Candid',
      imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 50000000).toISOString(), likes: 2600, comments: 78, echos: 190,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-new-10', user: maria, content: 'Evening tea and a good book. Taking a moment to breathe and reset for a busy week ahead. ☕📖 #Wellness #SlowLiving #WeekendVibes',
      imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 55000000).toISOString(), likes: 1400, comments: 31, echos: 22,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: []
    },
    {
      id: 'post-4', user: kenji, content: 'Just pushed a new update for "Pixel Odyssey"! Check out the new world and enemies. Let me know what you think! 👾',
      videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', fileType: 'video',
      thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
      timestamp: new Date(Date.now() - 172800000).toISOString(), likes: 2100, comments: 300, echos: 450,
      isLiked: true, isEchoed: true, isBookmarked: true, commentData: [],
    },
    {
      id: 'post-5', user: ugorji, content: 'What feature should we build next for Cascade?',
      poll: { choices: [{ text: 'Creator Analytics', votes: 1200 }, { text: 'NFT Integration', votes: 850 }, { text: 'Direct Video Calls', votes: 950 }], endsAt: new Date(Date.now() + 86400000 * 2).toISOString() },
      timestamp: new Date(Date.now() - 259200000).toISOString(), likes: 1800, comments: 400, echos: 300,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
    },
    {
        id: 'post-6', user: alex, content: 'Found this incredible view and couldn\'t resist sharing. This is why I love photography.',
        imageUrl: 'https://picsum.photos/seed/post-6/1200/900', fileType: 'image',
        timestamp: new Date(Date.now() - 345600000).toISOString(), likes: 980, comments: 65, echos: 150,
        isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
    },
    {
        id: 'post-video-1', user: ugorji, content: 'Check out this amazing drone footage from our latest trip! The perspective from up here is just breathtaking. 🚁🌍 #Drone #Travel #Adventure',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', fileType: 'video',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
        timestamp: new Date(Date.now() - 360000000).toISOString(), likes: 3200, comments: 210, echos: 600,
        isLiked: false, isEchoed: false, isBookmarked: false, commentData: [
            { id: 'c1', user: alex, content: 'Wow, this is stunning! What drone are you using?', timestamp: new Date(Date.now() - 350000000).toISOString() },
            { id: 'c2', user: maria, content: 'The colors are incredible. 😍', timestamp: new Date(Date.now() - 340000000).toISOString() },
            { id: 'c3', user: kenji, content: 'I need to go there! Where is this?', timestamp: new Date(Date.now() - 330000000).toISOString() }
        ],
    },
    {
        id: 'post-video-2', user: maria, content: 'Quick tutorial on how to make the perfect sourdough starter. It is easier than you think! 🍞✨ #Baking #Sourdough #Tutorial',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', fileType: 'video',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
        timestamp: new Date(Date.now() - 380000000).toISOString(), likes: 1500, comments: 120, echos: 300,
        isLiked: false, isEchoed: false, isBookmarked: true, commentData: [],
    },
    {
        id: 'post-video-3', user: kenji, content: 'Gameplay teaser for the new boss fight in Pixel Odyssey. Still tweaking the mechanics, but it is looking intense! ⚔️🔥 #IndieDev #GameDev #PixelArt',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', fileType: 'video',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/Sintel.jpg',
        timestamp: new Date(Date.now() - 400000000).toISOString(), likes: 2800, comments: 350, echos: 500,
        isLiked: true, isEchoed: true, isBookmarked: false, commentData: [],
    },
    {
        id: 'post-video-4', user: alex, content: 'Time-lapse of the city waking up. There is something magical about watching the lights turn off and the sun come up. 🏙️☀️ #TimeLapse #CityLife #Morning',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4', fileType: 'video',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
        timestamp: new Date(Date.now() - 420000000).toISOString(), likes: 4100, comments: 180, echos: 750,
        isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
    },
    {
        id: 'post-video-5', user: sarah, content: 'My design process for the new app interface. From wireframes to high-fidelity prototypes. 📱🎨 #UIUX #DesignProcess #AppDesign',
        videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4', fileType: 'video',
        thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
        timestamp: new Date(Date.now() - 440000000).toISOString(), likes: 1900, comments: 90, echos: 250,
        isLiked: false, isEchoed: false, isBookmarked: true, commentData: [],
    },
    {
      id: 'post-affiliate-1', user: david, content: 'Transform your fitness journey with my new 4-week masterclass! 💪🔥 Join hundreds of others who have already seen amazing results. #Fitness #Workout #Transformation',
      imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 60000000).toISOString(), likes: 2200, comments: 150, echos: 300,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
      taggedProduct: { id: 'prod-4', name: 'Fitness Masterclass', description: 'A complete 4-week program to transform your body and mind. Includes workout plans and nutrition guides.', price: 39.99, imageUrl: 'https://picsum.photos/seed/prod-4/400/400', seller: david, category: 'Digital', rating: 4.7, allowAffiliate: true, affiliateCommission: 25 },
    },
    {
      id: 'post-affiliate-2', user: sarah, content: 'Design faster and smarter with my new UI Design System. 🎨✨ Perfect for freelancers and agencies. #UIUX #Figma #DesignSystem',
      imageUrl: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 65000000).toISOString(), likes: 1800, comments: 110, echos: 200,
      isLiked: true, isEchoed: false, isBookmarked: true, commentData: [],
      taggedProduct: { id: 'prod-5', name: 'UI Design System', description: 'A comprehensive UI kit for Figma. Speed up your workflow with over 500 components and styles.', price: 59.99, imageUrl: 'https://picsum.photos/seed/prod-5/400/400', seller: sarah, category: 'Digital', rating: 4.9, allowAffiliate: true, affiliateCommission: 10 },
    },
    {
      id: 'post-affiliate-3', user: ugorji, content: 'Stay hydrated in style! 💧 Our new sustainable water bottles are finally here. Durable, eco-friendly, and keeps your water cold all day. #Sustainable #EcoFriendly #Hydration',
      imageUrl: 'https://images.unsplash.com/photo-1602143407151-11115cd4e69b?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 70000000).toISOString(), likes: 3500, comments: 280, echos: 500,
      isLiked: false, isEchoed: true, isBookmarked: false, commentData: [],
      taggedProduct: { id: 'prod-6', name: 'Sustainable Water Bottle', description: 'Eco-friendly, insulated water bottle. Keeps drinks cold for 24 hours. Stylish and durable.', price: 29.99, imageUrl: 'https://picsum.photos/seed/prod-6/400/400', seller: ugorji, category: 'Home', rating: 4.6, allowAffiliate: true, affiliateCommission: 12 },
    },
    {
      id: 'post-affiliate-4', user: alex, content: 'Take your urban photography to the next level with my Cityscape Preset Pack. 🏙️📸 One click to transform your photos. #Lightroom #Presets #Photography',
      imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1000&auto=format&fit=crop', fileType: 'image',
      timestamp: new Date(Date.now() - 75000000).toISOString(), likes: 1600, comments: 95, echos: 180,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
      taggedProduct: { id: 'prod-2', name: 'Cityscape Preset Pack', description: 'A pack of 10 professional Lightroom presets for urban photography. Enhance your city shots with one click.', price: 49.99, imageUrl: 'https://picsum.photos/seed/prod-2/400/400', seller: alex, category: 'Digital', rating: 4.8, allowAffiliate: true, affiliateCommission: 20 },
    },
    {
      id: 'post-multi-1', user: alex, content: 'A weekend getaway to the coast. The waves were mesmerizing. 🌊📸 #Coast #Travel #Photography',
      media: [
        { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ],
      timestamp: new Date(Date.now() - 80000000).toISOString(), likes: 2100, comments: 120, echos: 300,
      isLiked: true, isEchoed: false, isBookmarked: false, commentData: [],
    },
    {
      id: 'post-multi-2', user: maria, content: 'Highlights from my latest culinary tour in Italy. The pasta, the wine, the people! 🍝🍷🇮🇹 #Italy #FoodTravel #CulinaryTour',
      media: [
        { url: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1523986390382-307e50c05695?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ],
      timestamp: new Date(Date.now() - 85000000).toISOString(), likes: 3200, comments: 250, echos: 400,
      isLiked: false, isEchoed: false, isBookmarked: true, commentData: [],
    },
    {
      id: 'post-multi-3', user: kenji, content: 'Concept art vs. Final in-game assets. It is amazing to see how ideas evolve during development. 🎨➡️👾 #GameDev #ConceptArt #IndieGame',
      media: [
        { url: 'https://images.unsplash.com/photo-1563089145-599997674d42?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ],
      timestamp: new Date(Date.now() - 90000000).toISOString(), likes: 1800, comments: 90, echos: 220,
      isLiked: false, isEchoed: true, isBookmarked: false, commentData: [],
    },
    {
      id: 'post-multi-4', user: sarah, content: 'Mood board for the new project. Going for earthy tones and natural textures. What do you think? 🌿🍂 #DesignInspiration #MoodBoard #Interiors',
      media: [
        { url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4f9d?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1594026112284-02bb6f3352fe?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ],
      timestamp: new Date(Date.now() - 95000000).toISOString(), likes: 1500, comments: 70, echos: 150,
      isLiked: true, isEchoed: false, isBookmarked: true, commentData: [],
    },
    {
      id: 'post-multi-5', user: ugorji, content: 'Throwback to our team retreat. Hiking, brainstorming, and building the future together. 🏔️💡 #TeamBuilding #StartupLife #Cascade',
      media: [
        { url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1000&auto=format&fit=crop', type: 'image' },
        { url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1000&auto=format&fit=crop', type: 'image' }
      ],
      timestamp: new Date(Date.now() - 100000000).toISOString(), likes: 4500, comments: 300, echos: 600,
      isLiked: false, isEchoed: false, isBookmarked: false, commentData: [],
    },
];

export const INITIAL_STORIES: Story[] = [
  { id: 'story-1', user: alex, imageUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?q=80&w=1000&auto=format&fit=crop', fileType: 'image', timestamp: new Date(Date.now() - 3600000).toISOString() },
  { id: 'story-2', user: ugorji, text: 'The Future of Cascade is here 🚀', fileType: 'text', backgroundStyle: 'bg-gradient-to-br from-blue-600 to-indigo-900', fontStyle: 'font-black', textColor: 'text-white', timestamp: new Date(Date.now() - 7200000).toISOString() },
  { id: 'story-3', user: maria, videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', fileType: 'video', timestamp: new Date(Date.now() - 10800000).toISOString() },
  { id: 'story-4', user: kenji, text: 'Debugging session... 💻☕️', fileType: 'text', backgroundStyle: 'bg-zinc-900', fontStyle: 'font-mono', textColor: 'text-emerald-400', timestamp: new Date(Date.now() - 14400000).toISOString() },
  { id: 'story-5', user: alex, imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?q=80&w=1000&auto=format&fit=crop', fileType: 'image', timestamp: new Date(Date.now() - 18000000).toISOString() },
  { id: 'story-6', user: maria, text: 'New recipe dropping soon! 🍝', fileType: 'text', backgroundStyle: 'bg-gradient-to-tr from-orange-400 to-rose-500', fontStyle: 'font-serif', textColor: 'text-white', timestamp: new Date(Date.now() - 21600000).toISOString() },
  { id: 'story-7', user: ugorji, imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=1000&auto=format&fit=crop', fileType: 'image', timestamp: new Date(Date.now() - 25200000).toISOString() },
  { id: 'story-8', user: kenji, imageUrl: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop', fileType: 'image', timestamp: new Date(Date.now() - 28800000).toISOString() },
  { id: 'story-9', user: alex, text: 'Golden hour hits different 🌅', fileType: 'text', backgroundStyle: 'bg-indigo-950', fontStyle: 'font-sans', textColor: 'text-yellow-200', timestamp: new Date(Date.now() - 32400000).toISOString() },
  { id: 'story-10', user: maria, imageUrl: 'https://images.unsplash.com/photo-1490818387583-1baba5e6382b?q=80&w=1000&auto=format&fit=crop', fileType: 'image', timestamp: new Date(Date.now() - 36000000).toISOString() },
];

export const INITIAL_MESSAGES: Message[] = [
  { id: 'msg-1', senderId: 'user-2', receiverId: 'user-1', text: 'Hey Ugorji, the new features look amazing! Congrats on the launch.', type: 'text', timestamp: new Date(Date.now() - 18000000).toISOString(), read: true },
  { id: 'msg-2', senderId: 'user-1', receiverId: 'user-2', text: 'Thanks Alex! Really appreciate the support. How are you finding them?', type: 'text', timestamp: new Date(Date.now() - 17900000).toISOString(), read: false },
];

export const MOCK_PRODUCTS: Product[] = [
  { id: 'prod-1', name: 'My Vegan Cookbook', description: 'Over 50 delicious plant-based recipes that will change the way you cook. From quick breakfasts to elaborate dinners.', price: 24.99, imageUrl: 'https://picsum.photos/seed/prod-1/400/400', seller: maria, category: 'Digital', rating: 4.9, allowAffiliate: true, affiliateCommission: 15 },
  { id: 'prod-2', name: 'Cityscape Preset Pack', description: 'A pack of 10 professional Lightroom presets for urban photography. Enhance your city shots with one click.', price: 49.99, imageUrl: 'https://picsum.photos/seed/prod-2/400/400', seller: alex, category: 'Digital', rating: 4.8, allowAffiliate: true, affiliateCommission: 20 },
  { id: 'prod-3', name: 'Pixel Odyssey - Steam Key', description: 'Get your official Steam key for my latest indie game, Pixel Odyssey. Embark on a retro-style adventure!', price: 19.99, imageUrl: 'https://picsum.photos/seed/prod-3/400/400', seller: kenji, category: 'Digital', rating: 5.0, allowAffiliate: false },
  { id: 'prod-4', name: 'Fitness Masterclass', description: 'A complete 4-week program to transform your body and mind. Includes workout plans and nutrition guides.', price: 39.99, imageUrl: 'https://picsum.photos/seed/prod-4/400/400', seller: david, category: 'Digital', rating: 4.7, allowAffiliate: true, affiliateCommission: 25 },
  { id: 'prod-5', name: 'UI Design System', description: 'A comprehensive UI kit for Figma. Speed up your workflow with over 500 components and styles.', price: 59.99, imageUrl: 'https://picsum.photos/seed/prod-5/400/400', seller: sarah, category: 'Digital', rating: 4.9, allowAffiliate: true, affiliateCommission: 10 },
  { id: 'prod-6', name: 'Sustainable Water Bottle', description: 'Eco-friendly, insulated water bottle. Keeps drinks cold for 24 hours. Stylish and durable.', price: 29.99, imageUrl: 'https://picsum.photos/seed/prod-6/400/400', seller: ugorji, category: 'Home', rating: 4.6, allowAffiliate: true, affiliateCommission: 12 },
];

export const MOCK_COMMUNITIES: Community[] = [
  { 
    id: 'comm-1', 
    name: 'Photographers Corner', 
    handle: 'photography', 
    description: 'A place for photographers of all levels to share their work and get feedback.', 
    avatarUrl: 'https://picsum.photos/seed/comm-1/200/200', 
    bannerUrl: 'https://picsum.photos/seed/comm-1-banner/1500/500', 
    memberCount: 15400, 
    ownerId: 'user-2', 
    isPrivate: false,
    moderatorIds: ['user-1'],
    moderationSettings: {
      autoFilterWords: ['spam', 'scam'],
      requireApproval: false,
      allowReports: true
    },
    reports: [
      {
        id: 'rep-1',
        reporterId: 'user-3',
        reportedId: 'post-2',
        reportedType: 'post',
        reason: 'spam',
        description: 'This is clearly a promotional post.',
        status: 'pending',
        timestamp: new Date(Date.now() - 86400000).toISOString()
      }
    ]
  },
  { 
    id: 'comm-2', 
    name: 'Indie Game Devs', 
    handle: 'gamedev', 
    description: 'Connect with other indie game developers. Share progress, ask questions, and collaborate.', 
    avatarUrl: 'https://picsum.photos/seed/comm-2/200/200', 
    bannerUrl: 'https://picsum.photos/seed/comm-1-banner/1500/500', 
    memberCount: 8900, 
    ownerId: 'user-4', 
    isPrivate: false,
    moderatorIds: ['user-1'],
    moderationSettings: {
      autoFilterWords: [],
      requireApproval: false,
      allowReports: true
    },
    bannedUsers: [
      {
        userId: 'user-6',
        reason: 'Harassment',
        bannedAt: new Date(Date.now() - 100000000).toISOString(),
        bannedBy: 'user-4'
      }
    ]
  },
];

export const MOCK_AD_CAMPAIGNS: AdCampaign[] = [
  { id: 'ad-1', name: 'Promote My Profile', ownerId: 'user-3', promotionType: 'account', ctaText: 'Follow', destinationUrl: '#', budget: 100, startDate: new Date(Date.now() - 86400000 * 3).toISOString(), endDate: new Date(Date.now() + 86400000 * 4).toISOString(), impressions: 12000, clicks: 800, spent: 45.50 },
  { id: 'ad-2', name: 'Boost My Photo Post', ownerId: 'user-2', promotionType: 'post', promotedPostId: 'post-2', ctaText: 'View Post', destinationUrl: '#', budget: 50, startDate: new Date(Date.now() - 86400000).toISOString(), endDate: new Date(Date.now() + 86400000 * 2).toISOString(), impressions: 8500, clicks: 1200, spent: 30.00 },
];

export const MOCK_LIVE_STREAMS: LiveStream[] = [
  { id: 'live-1', broadcaster: maria, title: 'Live Cooking Session: Vegan Tapas!', status: 'live', viewers: 1200, startTime: new Date(Date.now() - 1800000).toISOString(), thumbnailUrl: 'https://picsum.photos/seed/live-1/1280/720', comments: [] },
  { id: 'live-2', broadcaster: kenji, title: 'Game Dev Log: Creating the Final Boss', status: 'ended', viewers: 800, startTime: new Date(Date.now() - 86400000 * 2).toISOString(), endTime: new Date(Date.now() - (86400000 * 2 - 7200000)).toISOString(), thumbnailUrl: 'https://picsum.photos/seed/live-2/1280/720', comments: [] },
];

export const MOCK_GIFTS: Gift[] = [
  { id: 'gift-1', name: 'Rose', icon: '🌹', priceInCoins: 10 },
  { id: 'gift-2', name: 'Coffee', icon: '☕', priceInCoins: 50 },
  { id: 'gift-3', name: 'Heart', icon: '❤️', priceInCoins: 100 },
  { id: 'gift-4', name: 'Rocket', icon: '🚀', priceInCoins: 500 },
];

export const MOCK_WATCHABLE_ADS: WatchableAd[] = [
  {
    id: 'wad-1',
    title: 'Explore the Mountains',
    description: 'Book your next adventure with Travel Inc. and get 20% off.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerFun.jpg',
    reward: 25,
  },
  {
    id: 'wad-2',
    title: 'The New Super Car',
    description: 'Experience the thrill of the new Electric Super Car. Test drive today.',
    videoUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    thumbnailUrl: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
    reward: 50,
  },
];
