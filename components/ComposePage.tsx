
import React, { useState, useRef, useEffect } from 'react';
import { 
    CalendarIcon, 
    LocationIcon,
    SparklesIcon,
    TagIcon,
    BackIcon,
    LinkIcon
} from '../constants';
import type { User, Community, Post, Product } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useNotifications } from './Notifications';
import { generateCaption, generatePostFromTopic, refineText, type RefineType } from '../services/geminiService';

interface ComposePageProps {
  handleCreatePost: (content: string, files?: File[], isSubscriberOnly?: boolean, communityId?: string, scheduledAt?: string, quotedPost?: Post, thumbnailUrl?: string, duration?: number, poll?: { choices: string[], durationInDays: number }, taggedProduct?: Product, location?: string, draftId?: string, linkUrl?: string) => void;
  handleEditPost: (postId: string, content: string) => void;
  currentUser: User;
  joinedCommunities: Community[];
  postToQuote: Post | null;
  postToEdit: Partial<Post> | null;
  allUsers: User[];
  initialText?: string;
  initialMode?: 'camera' | 'poll' | 'tag' | 'location' | 'ai' | 'schedule';
  userProducts: Product[];
  handleSaveDraft: (draftData: Partial<Post>, options?: { silent?: boolean }) => string;
  openDraftsModal: () => void;
  onBack: () => void;
}

interface MediaItem {
    file: File;
    preview: string;
    type: 'image' | 'video';
}

export const ComposePage: React.FC<ComposePageProps> = (props) => {
    const { handleCreatePost, handleEditPost, currentUser, postToQuote, postToEdit, initialText, initialMode, openDraftsModal, onBack, userProducts } = props;
    const { t } = useLanguage();
    const { addNotification } = useNotifications();

    const [content, setContent] = useState('');
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [postType, setPostType] = useState<'text' | 'image' | 'video' | 'poll' | 'link'>('text');
    const [linkUrl, setLinkUrl] = useState('');
    
    const [isCreatingPoll, setIsCreatingPoll] = useState(false);
    const [pollChoices, setPollChoices] = useState(['', '']);
    const [pollDurationInDays, setPollDurationInDays] = useState(1);
    
    const [showLocationInput, setShowLocationInput] = useState(false);
    const [location, setLocation] = useState('');
    
    const [draftId, setDraftId] = useState<string | null>(null);
    
    const [showScheduler, setShowScheduler] = useState(false);
    const [scheduledAt, setScheduledAt] = useState('');

    const [showProductPicker, setShowProductPicker] = useState(false);
    const [taggedProduct, setTaggedProduct] = useState<Product | undefined>(undefined);

    // AI State
    const [isGenerating, setIsGenerating] = useState(false);
    const [showTopicInput, setShowTopicInput] = useState(false);
    const [topicPrompt, setTopicPrompt] = useState('');
    const [showAiMenu, setShowAiMenu] = useState(false);

    const mediaInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    
    const isEditing = !!postToEdit && !postToEdit.id?.startsWith('draft-');

    // Calculate min date-time for the scheduler (current time)
    const getMinDateTime = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (initialText) {
            setContent(initialText);
        }
        if (initialMode) {
            switch (initialMode) {
                case 'camera':
                    setTimeout(() => mediaInputRef.current?.click(), 500);
                    break;
                case 'poll':
                    setIsCreatingPoll(true);
                    break;
                case 'tag':
                    setShowProductPicker(true);
                    break;
                case 'location':
                    setShowLocationInput(true);
                    break;
                case 'ai':
                    setShowTopicInput(true);
                    break;
                case 'schedule':
                    setShowScheduler(true);
                    break;
            }
        }
        if (postToEdit) {
            setContent(postToEdit.content || '');
            if (postToEdit.poll) {
                setIsCreatingPoll(true);
                setPollChoices(postToEdit.poll.choices.map(c => c.text));
            }
            if (postToEdit.taggedProduct) {
                setTaggedProduct(postToEdit.taggedProduct);
            }
            if (postToEdit.scheduledAt) {
                setScheduledAt(postToEdit.scheduledAt);
                setShowScheduler(true);
            }
            if (postToEdit.location) {
                setLocation(postToEdit.location);
                setShowLocationInput(true);
            }
            if (postToEdit.id && postToEdit.id.startsWith('draft-')) {
                setDraftId(postToEdit.id);
            }
        }
    }, [initialText, postToEdit, initialMode]);

    const handlePostTypeChange = (type: 'text' | 'image' | 'video' | 'poll' | 'link') => {
        setPostType(type);
        if (type === 'text') {
            setMediaItems([]);
            setIsCreatingPoll(false);
            setLinkUrl('');
        } else if (type === 'image') {
            setIsCreatingPoll(false);
            setLinkUrl('');
            setMediaItems(prev => prev.filter(m => m.type === 'image'));
            if (mediaInputRef.current) {
                mediaInputRef.current.accept = "image/*";
                mediaInputRef.current.click();
            }
        } else if (type === 'video') {
            setIsCreatingPoll(false);
            setLinkUrl('');
            setMediaItems(prev => prev.filter(m => m.type === 'video'));
            if (mediaInputRef.current) {
                mediaInputRef.current.accept = "video/*";
                mediaInputRef.current.click();
            }
        } else if (type === 'poll') {
            setMediaItems([]);
            setLinkUrl('');
            setIsCreatingPoll(true);
        } else if (type === 'link') {
            setMediaItems([]);
            setIsCreatingPoll(false);
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files) as File[];
            const newItems: MediaItem[] = [];

            for (const file of newFiles) {
                const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : null;
                if (type) {
                    newItems.push({
                        file,
                        preview: URL.createObjectURL(file),
                        type: type as 'image' | 'video'
                    });
                }
            }
            
            setMediaItems(prev => [...prev, ...newItems]);
            setIsCreatingPoll(false);
            if (mediaInputRef.current) mediaInputRef.current.value = "";
        }
    };
    
    const removeMedia = (index: number) => {
        setMediaItems(prev => {
            const updated = [...prev];
            URL.revokeObjectURL(updated[index].preview);
            updated.splice(index, 1);
            return updated;
        });
    };

    const addPollChoice = () => {
        if (pollChoices.length < 4) setPollChoices([...pollChoices, '']);
    };

    const handlePollChoiceChange = (index: number, value: string) => {
        const newChoices = [...pollChoices];
        newChoices[index] = value;
        setPollChoices(newChoices);
    };
    
    const handlePost = () => {
        if (isEditing && !draftId) {
            handleEditPost(postToEdit!.id!, content);
        } else {
            handleCreatePost(
                content, 
                mediaItems.map(m => m.file),
                false, undefined, scheduledAt || undefined, postToQuote || undefined,
                undefined, undefined,
                isCreatingPoll && pollChoices.filter(c => c.trim()).length >= 2
                    ? { choices: pollChoices.filter(c => c.trim()), durationInDays: pollDurationInDays }
                    : undefined,
                taggedProduct, location || undefined, draftId || undefined, linkUrl || undefined
            );
        }
    };

    const handleAiAction = async () => {
        if (isGenerating) return;

        const firstMedia = mediaItems[0] as MediaItem | undefined;

        if (firstMedia && firstMedia.type === 'image' && !content.trim()) {
            setIsGenerating(true);
            try {
                const reader = new FileReader();
                reader.readAsDataURL(firstMedia.file);
                reader.onloadend = async () => {
                    const base64data = reader.result as string;
                    const caption = await generateCaption(base64data, firstMedia.file.type);
                    setContent(caption);
                    addNotification('Caption generated!', 'info');
                    setIsGenerating(false);
                };
            } catch (error) {
                console.error(error);
                addNotification('Failed to generate caption.', 'info');
                setIsGenerating(false);
            }
            return;
        }

        if (content.trim()) {
            setShowAiMenu(!showAiMenu);
            return;
        }

        setShowTopicInput(true);
    };

    const handleRefineText = async (type: RefineType) => {
        setShowAiMenu(false);
        setIsGenerating(true);
        try {
            const refined = await refineText(content, type);
            setContent(refined);
            addNotification('Text refined!', 'info');
        } catch (error) {
            console.error(error);
            addNotification('Failed to refine text.', 'info');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleTopicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topicPrompt.trim()) return;
        
        setShowTopicInput(false);
        setIsGenerating(true);
        try {
            const postContent = await generatePostFromTopic(topicPrompt);
            setContent(postContent);
            setTopicPrompt('');
        } catch (error) {
            console.error(error);
            addNotification('Failed to generate post.', 'info');
        } finally {
            setIsGenerating(false);
        }
    };

    const characterCount = content.length;
    const MAX_CHARS = 280;
    const isPostButtonDisabled = (characterCount === 0 && mediaItems.length === 0 && !postToQuote && !isCreatingPoll && !linkUrl.trim()) || characterCount > MAX_CHARS;

    const formattedScheduledDate = scheduledAt ? new Date(scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : '';

    return (
        <div className="flex flex-col h-[100dvh] bg-background dark:bg-dark-background relative">
            <header className="flex items-center justify-between p-3 border-b border-border dark:border-dark-border flex-shrink-0">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface-hover text-on-surface dark:text-dark-on-surface">
                        <BackIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-black text-on-surface dark:text-dark-on-surface truncate">
                        {isEditing && !draftId ? 'Edit' : 'Post'}
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={openDraftsModal} 
                        className="text-primary font-bold text-sm px-4 py-2 rounded-xl hover:bg-primary-light transition-colors whitespace-nowrap"
                    >
                        Drafts
                    </button>
                    <button
                        onClick={handlePost}
                        disabled={isPostButtonDisabled}
                        className="bg-on-surface dark:bg-dark-on-surface text-background dark:text-dark-background font-black px-6 py-2 rounded-xl disabled:opacity-50 transition-all shadow-md hover:opacity-90 active:scale-95 text-base border-2 border-on-surface dark:border-dark-on-surface"
                    >
                        {isEditing && !draftId ? 'Save' : (scheduledAt ? 'Schedule' : 'Post')}
                    </button>
                </div>
            </header>

            <main className="flex-1 p-4 overflow-y-auto">
                <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
                    {(['text', 'image', 'video', 'poll', 'link'] as const).map(type => (
                        <button
                            key={type}
                            onClick={() => handlePostTypeChange(type)}
                            className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize whitespace-nowrap transition-colors ${postType === type ? 'bg-primary text-white' : 'bg-surface dark:bg-dark-surface border border-border dark:border-dark-border text-on-surface dark:text-dark-on-surface hover:bg-gray-100 dark:hover:bg-dark-surface-hover'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {scheduledAt && (
                    <div className="flex items-center justify-between bg-primary/10 border border-primary/20 p-3 rounded-2xl mb-4 animate-fade-in">
                        <div className="flex items-center gap-3">
                            <CalendarIcon className="w-5 h-5 text-primary" />
                            <div className="text-sm font-bold text-primary">
                                Will be posted on {formattedScheduledDate}
                            </div>
                        </div>
                        <button 
                            onClick={() => setScheduledAt('')} 
                            className="text-primary hover:bg-primary/20 p-1.5 rounded-full transition-colors"
                        >
                            &times;
                        </button>
                    </div>
                )}

                <div className="flex gap-4">
                    <img src={currentUser.avatarUrl} alt="Your avatar" className="w-12 h-12 rounded-full flex-shrink-0 border border-border dark:border-dark-border" />
                    <div className="flex-1 min-w-0">
                        <textarea
                            ref={textareaRef}
                            value={content}
                            onChange={(e) => { setContent(e.target.value); e.target.style.height = 'auto'; e.target.style.height = `${e.target.scrollHeight}px`; }}
                            placeholder={t('compose_placeholder')}
                            className="w-full text-xl bg-transparent focus:outline-none resize-none placeholder:text-on-surface-secondary dark:placeholder:text-dark-on-surface-secondary min-h-[120px] py-2"
                            autoFocus
                        />
                    </div>
                </div>

                {mediaItems.length > 0 && (
                    <div className="ml-16 mt-2">
                        <div className={`grid gap-2 ${mediaItems.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                            {mediaItems.map((item, idx) => (
                                <div key={idx} className="relative group rounded-2xl overflow-hidden border border-border dark:border-dark-border shadow-sm aspect-square bg-surface dark:bg-dark-surface">
                                    {item.type === 'image' ? (
                                        <img src={item.preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <video src={item.preview} className="w-full h-full object-cover" />
                                    )}
                                    <button 
                                        onClick={() => removeMedia(idx)} 
                                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center text-lg font-bold hover:bg-black/80 shadow-md backdrop-blur-sm transition-opacity"
                                    >
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                        
                        {mediaItems.length === 1 && mediaItems[0].type === 'image' && !content && (
                            <div className="mt-3">
                                <button 
                                    onClick={handleAiAction}
                                    disabled={isGenerating}
                                    className="bg-primary/10 text-primary text-xs font-bold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-primary/20 transition-all disabled:opacity-70 border border-primary/20"
                                >
                                    {isGenerating ? (
                                        <>
                                            <div className="w-3 h-3 border-2 border-primary/50 border-t-primary rounded-full animate-spin"></div>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <SparklesIcon className="w-3.5 h-3.5 text-primary" />
                                            Generate AI Caption
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {postToQuote && (
                    <div className="ml-16 mt-4 border border-border dark:border-dark-border rounded-xl p-3 bg-surface/50 dark:bg-dark-surface/50">
                        <div className="flex items-center gap-2 mb-2">
                            <img src={postToQuote.user.avatarUrl} className="w-5 h-5 rounded-full" />
                            <span className="font-bold text-sm">{postToQuote.user.name}</span>
                            <span className="text-xs text-on-surface-secondary dark:text-dark-on-surface-secondary">{postToQuote.user.handle}</span>
                        </div>
                        <p className="text-sm line-clamp-3">{postToQuote.content}</p>
                    </div>
                )}

                <div className="ml-16 mt-4 space-y-3">
                    {isCreatingPoll && (
                        <div className="border border-border dark:border-dark-border rounded-2xl p-4 bg-surface/50 dark:bg-dark-surface/50 animate-fade-in">
                            <div className="space-y-3">
                                {pollChoices.map((choice, index) => (
                                    <input key={index} type="text" placeholder={`Choice ${index + 1}`} value={choice} onChange={(e) => handlePollChoiceChange(index, e.target.value)} className="w-full bg-background dark:bg-dark-background p-3 rounded-xl border border-border dark:border-dark-border focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                                ))}
                            </div>
                            {pollChoices.length < 4 && <button onClick={addPollChoice} className="text-sm font-bold text-primary mt-3 hover:underline flex items-center gap-1">+ Add choice</button>}
                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border dark:border-dark-border">
                                <span className="text-sm font-medium text-on-surface-secondary dark:text-dark-on-surface-secondary">Poll Duration</span>
                                <select value={pollDurationInDays} onChange={e => setPollDurationInDays(Number(e.target.value))} className="bg-background dark:bg-dark-background text-sm p-2 rounded-lg border border-border dark:border-dark-border font-medium focus:outline-none focus:border-primary">
                                    <option value={1}>1 day</option>
                                    <option value={3}>3 days</option>
                                    <option value={7}>7 days</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {postType === 'link' && (
                        <div className="flex items-center gap-2 animate-fade-in bg-surface dark:bg-dark-surface p-2 rounded-xl border border-border dark:border-dark-border w-full">
                            <LinkIcon className="w-5 h-5 text-primary ml-1" />
                            <input 
                                type="url" 
                                value={linkUrl} 
                                onChange={(e) => setLinkUrl(e.target.value)} 
                                placeholder="https://example.com" 
                                className="flex-1 bg-transparent py-1 focus:outline-none text-sm font-medium"
                                autoFocus
                            />
                        </div>
                    )}

                    {taggedProduct && (
                        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-full text-sm border border-primary/20 animate-fade-in">
                            <TagIcon className="w-4 h-4" />
                            <span className="font-semibold">{taggedProduct.name}</span>
                            <button onClick={() => setTaggedProduct(undefined)} className="ml-1 hover:text-primary-hover font-bold">&times;</button>
                        </div>
                    )}

                    {showProductPicker && (
                        <div className="border border-border dark:border-dark-border rounded-2xl overflow-hidden bg-surface dark:bg-dark-surface shadow-sm animate-fade-in mb-4">
                            <div className="p-3 bg-background dark:bg-dark-background border-b border-border dark:border-dark-border flex justify-between items-center">
                                <span className="text-sm font-bold text-on-surface-secondary dark:text-dark-on-surface-secondary">Select a product</span>
                                <button onClick={() => setShowProductPicker(false)} className="text-on-surface-secondary dark:text-dark-on-surface-secondary hover:text-on-surface">&times;</button>
                            </div>
                            {userProducts.length > 0 ? (
                                <ul className="max-h-48 overflow-y-auto">
                                    {userProducts.map(product => (
                                        <li key={product.id}>
                                            <button 
                                                onClick={() => { setTaggedProduct(product); setShowProductPicker(false); }}
                                                className="w-full text-left p-3 hover:bg-gray-100 dark:hover:bg-dark-surface-hover flex items-center gap-3 transition-colors"
                                            >
                                                <img src={product.imageUrl} className="w-10 h-10 rounded-md object-cover bg-gray-200" alt={product.name} />
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-sm truncate">{product.name}</p>
                                                    <p className="text-xs text-on-surface-secondary dark:text-dark-on-surface-secondary">${product.price.toFixed(2)}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-4 text-center text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary">
                                    No products found. <br/>
                                    <span className="text-xs opacity-70">Add products to your store from your profile.</span>
                                </div>
                            )}
                        </div>
                    )}

                    {showLocationInput && (
                        <div className="flex items-center gap-2 animate-fade-in bg-surface dark:bg-dark-surface p-2 rounded-xl border border-border dark:border-dark-border w-full max-w-sm">
                            <LocationIcon className="w-5 h-5 text-primary ml-1" />
                            <input 
                                type="text" 
                                value={location} 
                                onChange={(e) => setLocation(e.target.value)} 
                                placeholder="Add location" 
                                className="flex-1 bg-transparent py-1 focus:outline-none text-sm font-medium"
                                autoFocus
                            />
                            <button onClick={() => { setShowLocationInput(false); setLocation(''); }} className="p-1 rounded-full text-on-surface-secondary hover:bg-gray-200 dark:hover:bg-gray-700">&times;</button>
                        </div>
                    )}

                    {showScheduler && (
                        <div className="flex flex-col gap-2 animate-fade-in bg-surface dark:bg-dark-surface p-4 rounded-2xl border border-border dark:border-dark-border w-full max-w-sm">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-black uppercase tracking-widest text-on-surface-secondary dark:text-dark-on-surface-secondary">Schedule Post</span>
                                <button onClick={() => { setShowScheduler(false); setScheduledAt(''); }} className="text-on-surface-secondary hover:text-on-surface">&times;</button>
                            </div>
                            <div className="flex items-center gap-3">
                                <CalendarIcon className="w-6 h-6 text-primary" />
                                <input 
                                    type="datetime-local" 
                                    value={scheduledAt} 
                                    min={getMinDateTime()}
                                    onChange={(e) => setScheduledAt(e.target.value)} 
                                    className="flex-1 bg-background dark:bg-dark-background text-sm font-bold p-2.5 rounded-xl border border-border dark:border-dark-border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                                />
                            </div>
                            <p className="text-[10px] text-on-surface-secondary dark:text-dark-on-surface-secondary">
                                Choose a future time to automatically publish this post.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            <footer className="p-3 border-t border-border dark:border-dark-border flex-shrink-0 bg-background dark:bg-dark-background safe-area-pb">
                <div className="flex justify-end px-2 pb-2">
                     <div className={`text-xs font-bold ${characterCount > MAX_CHARS ? 'text-red-500' : 'text-on-surface-secondary dark:text-dark-on-surface-secondary'}`}>
                        {characterCount > 0 && (
                            <span className="flex items-center gap-1">
                                {characterCount} / {MAX_CHARS}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 overflow-x-auto no-scrollbar flex-1">
                        <input type="file" ref={mediaInputRef} onChange={handleFileChange} hidden accept="image/*,video/*" multiple />
                        
                        <button onClick={() => setShowProductPicker(!showProductPicker)} className={`p-2.5 rounded-full transition-colors ${showProductPicker ? 'bg-primary-light text-primary' : 'text-primary hover:bg-primary-light'}`} title="Tag Product"><TagIcon className="w-6 h-6" /></button>
                        
                        <button onClick={() => setShowLocationInput(!showLocationInput)} className={`p-2.5 rounded-full transition-colors ${showLocationInput ? 'bg-primary-light text-primary' : 'text-primary hover:bg-primary-light'}`} title="Add Location"><LocationIcon className="w-6 h-6" /></button>
                        
                        <button 
                            onClick={handleAiAction}
                            disabled={isGenerating}
                            className={`p-2.5 rounded-full transition-all duration-300 group ${isGenerating ? 'bg-gray-100 dark:bg-dark-surface cursor-wait' : 'hover:bg-gradient-to-tr hover:from-purple-100 hover:to-blue-100 dark:hover:from-purple-900/30 dark:hover:to-blue-900/30'}`}
                            title="AI Tools"
                        >
                            <SparklesIcon className={`w-6 h-6 ${isGenerating ? 'text-gray-400 animate-pulse' : 'text-purple-500 group-hover:scale-110 transition-transform'}`} />
                        </button>

                        <button 
                            onClick={() => setShowScheduler(!showScheduler)} 
                            className={`p-2.5 rounded-full transition-colors ${(showScheduler || scheduledAt) ? 'bg-primary-light text-primary' : 'text-primary hover:bg-primary-light'}`} 
                            title="Schedule Post"
                        >
                            <CalendarIcon className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </footer>

            {showAiMenu && (
                <div className="absolute bottom-16 right-4 bg-surface dark:bg-dark-surface border border-border dark:border-dark-border rounded-xl shadow-xl z-50 overflow-hidden w-56 animate-fade-in">
                    <div className="p-2 border-b border-border dark:border-dark-border">
                        <p className="text-xs font-bold text-on-surface-secondary dark:text-dark-on-surface-secondary px-2 py-1">AI Tools</p>
                    </div>
                    <div className="p-1">
                        <button onClick={() => handleRefineText('fix_grammar')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>📝</span> Fix Grammar
                        </button>
                        <button onClick={() => handleRefineText('funnier')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>😂</span> Make Funnier
                        </button>
                        <button onClick={() => handleRefineText('professional')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>💼</span> Make Professional
                        </button>
                        <button onClick={() => handleRefineText('hashtags')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>#️⃣</span> Generate Hashtags
                        </button>
                        <button onClick={() => handleRefineText('expand')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>➕</span> Expand Text
                        </button>
                        <button onClick={() => handleRefineText('shorten')} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-dark-surface-hover rounded-lg transition-colors flex items-center gap-2">
                            <span>➖</span> Shorten Text
                        </button>
                    </div>
                </div>
            )}

            {showTopicInput && (
                <div className="absolute inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={() => setShowTopicInput(false)}>
                    <div className="bg-background dark:bg-dark-background p-6 rounded-3xl w-full max-w-sm shadow-2xl border border-border dark:border-dark-border transform transition-all scale-100" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <SparklesIcon className="w-6 h-6 text-purple-500" />
                                Write with AI
                            </h3>
                            <button onClick={() => setShowTopicInput(false)} className="text-on-surface-secondary hover:text-on-surface text-2xl font-bold leading-none">&times;</button>
                        </div>
                        <p className="text-sm text-on-surface-secondary dark:text-dark-on-surface-secondary mb-4">What should this post be about?</p>
                        <form onSubmit={handleTopicSubmit}>
                            <input 
                                type="text" 
                                value={topicPrompt} 
                                onChange={e => setTopicPrompt(e.target.value)} 
                                placeholder="e.g., A funny story about my cat..." 
                                className="w-full bg-surface dark:bg-dark-background border border-border dark:border-dark-border rounded-xl p-4 mb-6 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-medium"
                                autoFocus
                            />
                            <button type="submit" disabled={!topicPrompt.trim()} className="w-full bg-primary text-white py-3 rounded-full font-bold hover:bg-primary-hover disabled:opacity-50 transition-colors shadow-lg shadow-primary/30">Generate</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
