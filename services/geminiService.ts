
import { GoogleGenAI, Type } from "@google/genai";
import type { Post, User, LiveStreamComment } from '../types';

// FIX: Always use a named parameter and obtain process.env.API_KEY directly as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateCaption(base64Image: string, mimeType: string): Promise<string> {
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;
    const imagePart = { inlineData: { data: base64Data, mimeType } };
    const textPart = { text: "Generate a short, engaging, and creative caption for this image for a social media post. Make it sound like a real person posted it, including 1-3 relevant hashtags. The caption should be under 200 characters." };

    try {
        // FIX: Using gemini-3-flash-preview as recommended for basic multimodal/text tasks.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [imagePart, textPart] },
        });
        return response.text || "";
    } catch (error) {
        console.error("Error generating caption:", error);
        return "A beautiful moment captured."; // Fallback caption
    }
}

export async function generateSponsorshipPitch(user: User, tone: string = 'Professional'): Promise<string> {
  const kit = user.mediaKit;
  const prompt = `You are a world-class creator agent. Write a ${tone} sponsorship pitch email/DM from the creator ${user.name} (@${user.handle}) to a potential brand partner. 
  
  Context:
  - Followers: ${user.followers?.toLocaleString() || 'growing audience'}
  - Reach: ${kit?.totalReach.toLocaleString() || 'high'}
  - Engagement Rate: ${kit?.engagementRate || 'N/A'}%
  - Bio: ${user.bio || ''}
  
  The pitch should be concise, professional, and explain why a partnership would be mutually beneficial. Include a placeholders for [Brand Name] and [Product Name].`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });
    return response.text || "Could not generate pitch.";
  } catch (error) {
    console.error("Error generating pitch:", error);
    return "Error: Failed to generate AI pitch. Please try again.";
  }
}

export type RefineType = 'fix_grammar' | 'funnier' | 'professional' | 'hashtags' | 'expand' | 'shorten';

export async function refineText(text: string, type: RefineType): Promise<string> {
    if (!text.trim()) return "";
    
    let prompt = "";
    switch (type) {
        case 'fix_grammar':
            prompt = `Fix the grammar and spelling of the following text, keeping the original tone: "${text}"`;
            break;
        case 'funnier':
            prompt = `Make the following text funnier and more engaging for social media: "${text}"`;
            break;
        case 'professional':
            prompt = `Rewrite the following text to sound more professional and polished: "${text}"`;
            break;
        case 'hashtags':
            prompt = `Generate 3-5 relevant and trending hashtags for the following post content. Return ONLY the hashtags separated by spaces: "${text}"`;
            break;
        case 'expand':
            prompt = `Expand the following text to be more detailed and descriptive, but keep it under 280 characters if possible: "${text}"`;
            break;
        case 'shorten':
            prompt = `Shorten the following text to be more concise and punchy, under 140 characters: "${text}"`;
            break;
    }

    try {
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        const result = (response.text || "").trim();
        
        // For hashtags, append to original text if not already present
        if (type === 'hashtags') {
            return `${text}\n\n${result}`;
        }
        
        return result;
    } catch (error) {
        console.error("Error refining text:", error);
        return text;
    }
}

export async function generateSuggestion(text: string): Promise<string> {
    if (!text.trim()) return "";
    const prompt = `Based on the following draft for a social media post, generate a more engaging and concise version. Refine the language, and add 1-3 relevant hashtags at the end. The suggestion should be under 280 characters.\n\nDraft: "${text}"`;
    try {
        // FIX: Using gemini-3-flash-preview as recommended for text tasks.
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error generating suggestion:", error);
        return text; // Fallback to original text
    }
}

export async function askGeneralAI(question: string, chatHistory: { role: 'user' | 'model', parts: { text: string }[] }[]): Promise<string> {
    try {
        // FIX: Using gemini-3-flash-preview as recommended for chat/Q&A tasks.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: [...(chatHistory || []), { role: 'user', parts: [{ text: question }] }],
            config: { systemInstruction: `You are a helpful and friendly AI assistant for a social media app called Cascade. Be concise and conversational.` }
        });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error asking AI:", error);
        return "Sorry, I'm having trouble connecting right now.";
    }
}

interface CoachInsight {
    title: string;
    description: string;
}

export async function getAI_Business_Coach_Advice(
    user: User,
    earnings: { subscriptions: number; tips: number; adRevenue: number; gifts: number },
    userPosts: Post[]
): Promise<CoachInsight[]> {
    try {
        const topPosts = [...userPosts].sort((a, b) => ((b.likes || 0) + (b.echos || 0)) - ((a.likes || 0) + (a.echos || 0))).slice(0, 3).map(p => `  - Post: "${p.content.substring(0, 150)}..." (Likes: ${p.likes || 0}, Echos: ${p.echos || 0})`).join('\n');
        const prompt = `You are an expert business coach for social media creators. Analyze the following data and give 3 concise, actionable suggestions to improve monetization or engagement.
Creator Bio: "${user.bio || 'Not provided'}"
Earnings (30d): Subs: $${earnings.subscriptions}, Tips/Gifts: $${earnings.tips + earnings.gifts}, Ad Revenue: $${earnings.adRevenue}
Top Posts:
${topPosts}
`;

        // FIX: Using gemini-3-flash-preview as recommended for text analysis tasks.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { insights: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { title: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['title', 'description'] } } },
                    required: ['insights']
                }
            }
        });
        const result = JSON.parse((response.text || "{}").trim());
        return result.insights || [];
    } catch (error) {
        console.error("Error getting coach advice:", error);
        throw new Error("Could not get AI advice.");
    }
}

// FIX: Define and export LiveStreamInsights interface to resolve name errors in this file and import errors in LiveStreamPage.tsx.
export interface LiveStreamInsights {
    sentiment: string;
    questions: string[];
    summary: string;
}

export async function getLiveStreamInsights(comments: LiveStreamComment[]): Promise<LiveStreamInsights> {
    if (comments.length === 0) return { sentiment: 'Neutral', questions: [], summary: 'No comments yet.' };
    
    try {
        const commentTexts = comments.slice(-50).map(c => `${c.user.name}: ${c.text}`).join('\n');
        const prompt = `Analyze the following live stream chat log. Provide a JSON object with: 1. "sentiment" (one of: "Positive", "Neutral", "Negative", "Mixed"), 2. "questions" (an array of up to 3 important questions), 3. "summary" (a one-sentence summary). Chat Log:\n${commentTexts}`;

        // FIX: Using gemini-3-flash-preview for real-time data analysis and correctly set responseMimeType to application/json for structured results.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { sentiment: { type: Type.STRING }, questions: { type: Type.ARRAY, items: { type: Type.STRING } }, summary: { type: Type.STRING } },
                    required: ['sentiment', 'questions', 'summary']
                }
            }
        });
        const result = JSON.parse((response.text || "{}").trim());
        return {
            sentiment: result.sentiment || 'Neutral',
            questions: result.questions || [],
            summary: result.summary || 'Could not analyze chat.'
        };
    } catch (error) {
        console.error("Error getting live stream insights:", error);
        throw new Error("Could not load AI insights.");
    }
}

export async function generatePostStreamSummary(streamTitle: string, comments: LiveStreamComment[]): Promise<string> {
    try {
        const commentTexts = comments.slice(-100).map(c => `${c.user.name}: "${c.text}"`).join('\n');
        const prompt = `Based on the stream title "${streamTitle}" and these chat comments:\n${commentTexts}\n\nWrite an engaging, concise social media post summarizing the stream, including 2-3 relevant hashtags.`;

        // FIX: Using gemini-3-flash-preview for creative text summarization.
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error generating post-stream summary:", error);
        return `Great stream about "${streamTitle}"! Thanks to everyone who joined.`;
    }
}

export async function generatePostFromTopic(topic: string): Promise<string> {
    try {
        const prompt = `Write an engaging, concise social media post under 280 characters about "${topic}", including 2-3 popular hashtags.`;
        // FIX: Using gemini-3-flash-preview for basic text content generation.
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error generating post from topic:", error);
        return `Thinking about ${topic}... what are your thoughts?`;
    }
}

export async function generateBio(user: User): Promise<string> {
    try {
        const prompt = `Write a short, engaging social media bio for a user named ${user.name}. 
        Current bio: "${user.bio || ''}". 
        Location: "${user.location || ''}". 
        Interests/Context: Based on their profile. 
        Keep it under 160 characters, include 1-2 emojis, and make it sound authentic.`;
        
        const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
        return (response.text || "").trim();
    } catch (error) {
        console.error("Error generating bio:", error);
        return user.bio || "";
    }
}

export async function generateReplySuggestions(postContent: string): Promise<string[]> {
    try {
        const prompt = `Generate 3 distinct, short, and engaging replies for this post: "${postContent}". The replies should have different tones (e.g., inquisitive, supportive, funny).`;
        // FIX: Using gemini-3-flash-preview for quick reply generation.
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: { replies: { type: Type.ARRAY, items: { type: Type.STRING } } },
                    required: ['replies']
                }
            }
        });
        const result = JSON.parse((response.text || "{}").trim());
        return result.replies || [];
    } catch (error) {
        console.error("Error generating reply suggestions:", error);
        return ["Interesting!", "Great point!", "I agree!"];
    }
}
