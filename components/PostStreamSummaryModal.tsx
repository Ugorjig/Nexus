import React, { useState, useEffect } from 'react';
import type { LiveStream } from '../types';
import { generatePostStreamSummary } from '../services/geminiService';
import { SparklesIcon } from '../constants';

interface PostStreamSummaryModalProps {
  stream: LiveStream | null;
  onClose: () => void;
  onShare: (summary: string) => void;
}

const PostStreamSummaryModal: React.FC<PostStreamSummaryModalProps> = ({ stream, onClose, onShare }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (stream) {
      const getSummary = async () => {
        setIsLoading(true);
        setError('');
        try {
          const result = await generatePostStreamSummary(stream.title, stream.comments);
          setSummary(result);
        } catch (e) {
          setError('Failed to generate summary. You can still write your own.');
          console.error(e);
        } finally {
          setIsLoading(false);
        }
      };
      getSummary();
    }
  }, [stream]);

  if (!stream) return null;

  const handleShare = () => {
    onShare(summary);
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-background dark:bg-dark-background rounded-2xl w-full max-w-lg shadow-lg flex flex-col h-[80vh]">
        <div className="p-4 border-b border-gray-200 dark:border-dark-border">
          <h2 className="text-xl font-bold">Post-Stream Summary</h2>
        </div>
        <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-2 text-primary font-semibold">
                <SparklesIcon className="w-5 h-5"/>
                <p>AI-Generated Summary</p>
            </div>
            {isLoading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <textarea 
                    value={summary}
                    onChange={e => setSummary(e.target.value)}
                    className="w-full flex-1 bg-surface dark:bg-dark-surface p-3 rounded-lg border border-gray-200 dark:border-dark-border resize-none focus:ring-primary focus:border-primary"
                    placeholder="Write a summary of your stream..."
                />
            )}
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-dark-border flex gap-4">
            <button onClick={onClose} className="flex-1 border border-on-surface-secondary dark:border-dark-on-surface-secondary font-bold py-3 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface">
                Discard
            </button>
            <button onClick={handleShare} disabled={!summary} className="flex-1 bg-primary text-white font-bold py-3 rounded-full hover:bg-primary/90 disabled:opacity-50">
                Share as Post
            </button>
        </div>
      </div>
    </div>
  );
};

export default PostStreamSummaryModal;