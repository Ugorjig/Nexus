import React, { useState, useRef, useEffect } from 'react';
import type { User, Post as PostType } from '../types';
import { SparklesIcon } from '../constants';
import { useNotifications } from './Notifications';
import { generateReplySuggestions } from '../services/geminiService';

interface CreateCommentProps {
  currentUser: User;
  onCreateComment: (content: string) => void;
  post: PostType;
  initialText?: string;
  sticky?: boolean;
}

const CreateComment: React.FC<CreateCommentProps> = ({ currentUser, onCreateComment, post, initialText, sticky = true }) => {
  const [content, setContent] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { addNotification } = useNotifications();
  const [replySuggestions, setReplySuggestions] = useState<string[]>([]);
  const [isGeneratingReplies, setIsGeneratingReplies] = useState(false);

  useEffect(() => {
    if (initialText) {
      setContent(initialText);
      if (textareaRef.current) {
        textareaRef.current.focus();
        // Auto-resize
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
          }
        }, 0);
      }
    }
  }, [initialText]);

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };
  
  const applySuggestion = (suggestion: string) => {
    setContent(suggestion);
    setReplySuggestions([]);
    if (textareaRef.current) {
        setTimeout(() => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                textareaRef.current.focus();
            }
        }, 0);
    }
  };

  const handleGenerateReplies = async () => {
    if (isGeneratingReplies) return;
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }

    setIsGeneratingReplies(true);
    try {
        const suggestions = await generateReplySuggestions(post.content);
        setReplySuggestions(suggestions.slice(0, 3));
    } catch (error) {
        console.error("Failed to get reply suggestions", error);
        addNotification("Could not generate replies.", 'info');
    } finally {
        setIsGeneratingReplies(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onCreateComment(content.trim());
      setContent('');
      setReplySuggestions([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className={`p-4 border-t border-gray-200 dark:border-dark-border bg-background dark:bg-dark-background ${sticky ? 'sticky bottom-0' : ''}`}>
      {replySuggestions.length > 0 && (
        <div className="mb-3 space-y-2">
          <p className="text-xs font-bold text-on-surface-secondary dark:text-dark-on-surface-secondary flex items-center gap-1.5">
            <SparklesIcon className="w-4 h-4 text-primary"/>
            AI Suggested Replies
          </p>
          {replySuggestions.map((suggestion, index) => (
            <button 
              key={index} 
              onClick={() => applySuggestion(suggestion)}
              className="w-full text-left text-sm bg-surface dark:bg-dark-surface p-2 rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-100 dark:hover:bg-dark-surface-secondary transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex items-start space-x-2">
        <img src={currentUser.avatarUrl} alt="Your avatar" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            placeholder="Post your reply"
            className="w-full bg-surface dark:bg-dark-surface rounded-xl p-2 focus:outline-none resize-none"
            rows={1}
          />
        </div>
        <button
            type="button"
            onClick={handleGenerateReplies}
            disabled={isGeneratingReplies}
            className="p-2 h-10 rounded-full text-primary hover:bg-primary/10 disabled:opacity-50"
            aria-label="Generate AI reply suggestions"
        >
          {isGeneratingReplies 
            ? <div className="w-6 h-6 border-2 border-current rounded-full border-t-transparent animate-spin"></div>
            : <SparklesIcon className="w-6 h-6"/>
          }
        </button>
        <button
          type="submit"
          disabled={!content.trim()}
          className="bg-primary text-white font-bold px-6 py-2 h-10 rounded-full disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors duration-200"
        >
          Reply
        </button>
      </form>
    </div>
  );
};

export default CreateComment;