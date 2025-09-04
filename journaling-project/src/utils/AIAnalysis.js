// AI Analysis utilities for journal entries
// All analysis is done on-device for privacy

// Sentiment analysis keywords and scoring
const sentimentKeywords = {
    positive: [
        'happy', 'joy', 'excited', 'grateful', 'blessed', 'amazing', 'wonderful', 'fantastic',
        'great', 'excellent', 'love', 'adore', 'enjoy', 'pleasure', 'delight', 'thrilled',
        'proud', 'accomplished', 'success', 'achievement', 'progress', 'growth', 'improvement',
        'peaceful', 'calm', 'relaxed', 'content', 'satisfied', 'fulfilled', 'optimistic',
        'hopeful', 'confident', 'strong', 'energized', 'motivated', 'inspired', 'creative'
    ],
    negative: [
        'sad', 'depressed', 'down', 'upset', 'angry', 'frustrated', 'annoyed', 'irritated',
        'worried', 'anxious', 'stressed', 'overwhelmed', 'tired', 'exhausted', 'drained',
        'lonely', 'isolated', 'hurt', 'pain', 'suffering', 'struggle', 'difficult', 'hard',
        'challenging', 'problem', 'issue', 'concern', 'fear', 'scared', 'afraid', 'nervous',
        'disappointed', 'discouraged', 'hopeless', 'helpless', 'lost', 'confused', 'stuck'
    ],
    neutral: [
        'okay', 'fine', 'normal', 'regular', 'usual', 'typical', 'average', 'standard',
        'work', 'job', 'meeting', 'appointment', 'plan', 'schedule', 'routine', 'daily',
        'today', 'yesterday', 'tomorrow', 'week', 'month', 'year', 'time', 'date'
    ]
};

// Theme detection keywords
const themeKeywords = {
    'work': ['work', 'job', 'career', 'office', 'meeting', 'project', 'boss', 'colleague', 'deadline', 'presentation'],
    'family': ['family', 'mom', 'dad', 'parent', 'sibling', 'brother', 'sister', 'child', 'kid', 'son', 'daughter'],
    'relationships': ['relationship', 'partner', 'boyfriend', 'girlfriend', 'spouse', 'husband', 'wife', 'friend', 'dating'],
    'health': ['health', 'exercise', 'workout', 'gym', 'doctor', 'medical', 'sick', 'illness', 'medicine', 'fitness'],
    'hobbies': ['hobby', 'hobbies', 'music', 'art', 'reading', 'writing', 'gaming', 'sports', 'cooking', 'travel'],
    'education': ['school', 'college', 'university', 'study', 'learning', 'class', 'course', 'exam', 'test', 'homework'],
    'travel': ['travel', 'trip', 'vacation', 'holiday', 'flight', 'hotel', 'destination', 'journey', 'adventure'],
    'finance': ['money', 'budget', 'expense', 'income', 'salary', 'investment', 'saving', 'spending', 'financial']
};

// Analyze sentiment of text
export const analyzeSentiment = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let neutralScore = 0;

    words.forEach(word => {
        if (sentimentKeywords.positive.includes(word)) {
            positiveScore++;
        } else if (sentimentKeywords.negative.includes(word)) {
            negativeScore++;
        } else if (sentimentKeywords.neutral.includes(word)) {
            neutralScore++;
        }
    });

    const total = positiveScore + negativeScore + neutralScore;
    if (total === 0) return 'neutral';

    const positiveRatio = positiveScore / total;
    const negativeRatio = negativeScore / total;

    if (positiveRatio > negativeRatio && positiveRatio > 0.3) {
        return 'positive';
    } else if (negativeRatio > positiveRatio && negativeRatio > 0.3) {
        return 'negative';
    } else {
        return 'neutral';
    }
};

// Detect themes in text
export const detectThemes = (text) => {
    const words = text.toLowerCase().split(/\s+/);
    const detectedThemes = [];

    Object.entries(themeKeywords).forEach(([theme, keywords]) => {
        const matches = keywords.filter(keyword => 
            words.some(word => word.includes(keyword))
        );
        if (matches.length > 0) {
            detectedThemes.push({
                theme,
                confidence: matches.length / keywords.length,
                matches: matches.length
            });
        }
    });

    return detectedThemes.sort((a, b) => b.confidence - a.confidence);
};

// Generate dynamic prompts based on recent entries
export const generateDynamicPrompts = (entries) => {
    if (!entries || entries.length === 0) {
        return [
            "What's on your mind today?",
            "How are you feeling right now?",
            "What made you smile today?",
            "What are you grateful for?",
            "What's one thing you learned today?"
        ];
    }

    const recentEntries = entries.slice(-5); // Last 5 entries
    const recentThemes = [];
    const recentSentiments = [];

    recentEntries.forEach(entry => {
        const themes = detectThemes(entry.content || '');
        const sentiment = analyzeSentiment(entry.content || '');
        
        recentThemes.push(...themes.map(t => t.theme));
        recentSentiments.push(sentiment);
    });

    // Count theme frequency
    const themeCounts = recentThemes.reduce((acc, theme) => {
        acc[theme] = (acc[theme] || 0) + 1;
        return acc;
    }, {});

    // Count sentiment frequency
    const sentimentCounts = recentSentiments.reduce((acc, sentiment) => {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});

    const prompts = [];

    // Generate prompts based on recent themes
    if (themeCounts.work > 1) {
        prompts.push("How did work go today? Any new challenges or wins?");
        prompts.push("What's one thing you accomplished at work recently?");
    }
    
    if (themeCounts.family > 1) {
        prompts.push("How are things with your family lately?");
        prompts.push("What's a favorite memory with family you've been thinking about?");
    }
    
    if (themeCounts.health > 1) {
        prompts.push("How are you taking care of yourself today?");
        prompts.push("What's one healthy choice you made recently?");
    }

    // Generate prompts based on sentiment patterns
    if (sentimentCounts.negative > sentimentCounts.positive) {
        prompts.push("What's one thing that brought you comfort today?");
        prompts.push("How did you find moments of calm in your day?");
        prompts.push("What's something you're looking forward to?");
    } else if (sentimentCounts.positive > sentimentCounts.negative) {
        prompts.push("What's contributing to your positive energy lately?");
        prompts.push("How can you carry this good feeling forward?");
    }

    // Add some general prompts
    prompts.push("What's one thing you're grateful for today?");
    prompts.push("How did you grow or learn something new today?");
    prompts.push("What's a small win you had today?");

    return prompts.slice(0, 5); // Return top 5 prompts
};

// Generate weekly reflection summary
export const generateWeeklyReflection = (entries) => {
    // Check if we have mock data (timestamps in 2025 range for demo)
    const hasMockData = entries.some(entry => entry.timestamp && entry.timestamp > 1730000000000 && entry.timestamp < 1760000000000);
    
    let weekEntries;
    if (hasMockData) {
        // For mock data, use all entries
        weekEntries = entries;
    } else {
        // For real data, filter by last 7 days
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        weekEntries = entries.filter(entry => {
            const entryDate = new Date(entry.timestamp || entry.date || entry.id);
            return entryDate >= oneWeekAgo;
        });
    }

    if (weekEntries.length === 0) {
        return {
            summary: "No entries this week to reflect on.",
            themes: [],
            sentiment: 'neutral',
            insights: []
        };
    }

    const allThemes = [];
    const allSentiments = [];
    const insights = [];

    weekEntries.forEach(entry => {
        const themes = detectThemes(entry.content || '');
        const sentiment = analyzeSentiment(entry.content || '');
        
        allThemes.push(...themes.map(t => t.theme));
        allSentiments.push(sentiment);
    });

    // Count themes
    const themeCounts = allThemes.reduce((acc, theme) => {
        acc[theme] = (acc[theme] || 0) + 1;
        return acc;
    }, {});

    // Count sentiments
    const sentimentCounts = allSentiments.reduce((acc, sentiment) => {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});

    const topThemes = Object.entries(themeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 3)
        .map(([theme]) => theme);

    const dominantSentiment = Object.entries(sentimentCounts)
        .sort(([,a], [,b]) => b - a)[0][0];

    // Generate insights
    if (themeCounts.work > 2) {
        insights.push("You wrote about work frequently this week. Consider how work-life balance is going.");
    }
    
    if (themeCounts.family > 2) {
        insights.push("Family was a recurring theme. How are your relationships feeling?");
    }
    
    if (sentimentCounts.positive > sentimentCounts.negative) {
        insights.push("You've been feeling quite positive this week! What's contributing to this energy?");
    } else if (sentimentCounts.negative > sentimentCounts.positive) {
        insights.push("This week had some challenges. Remember to be gentle with yourself.");
    }

    const themesText = topThemes.length > 0 ? topThemes.join(', ') : 'general reflection and personal growth';
    
    return {
        summary: `This week you wrote ${weekEntries.length} entries with themes around ${themesText}.`,
        themes: topThemes,
        sentiment: dominantSentiment,
        insights: insights,
        entryCount: weekEntries.length
    };
};

// Generate monthly reflection summary
export const generateMonthlyReflection = (entries) => {
    // Check if we have mock data (timestamps in 2025 range for demo)
    const hasMockData = entries.some(entry => entry.timestamp && entry.timestamp > 1730000000000 && entry.timestamp < 1760000000000);
    
    let monthEntries;
    if (hasMockData) {
        // For mock data, use all entries
        monthEntries = entries;
    } else {
        // For real data, filter by last month
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        monthEntries = entries.filter(entry => {
            const entryDate = new Date(entry.timestamp || entry.date || entry.id);
            return entryDate >= oneMonthAgo;
        });
    }

    if (monthEntries.length === 0) {
        return {
            summary: "No entries this month to reflect on.",
            themes: [],
            sentiment: 'neutral',
            insights: []
        };
    }

    const allThemes = [];
    const allSentiments = [];
    const insights = [];

    monthEntries.forEach(entry => {
        const themes = detectThemes(entry.content || '');
        const sentiment = analyzeSentiment(entry.content || '');
        
        allThemes.push(...themes.map(t => t.theme));
        allSentiments.push(sentiment);
    });

    // Count themes
    const themeCounts = allThemes.reduce((acc, theme) => {
        acc[theme] = (acc[theme] || 0) + 1;
        return acc;
    }, {});

    // Count sentiments
    const sentimentCounts = allSentiments.reduce((acc, sentiment) => {
        acc[sentiment] = (acc[sentiment] || 0) + 1;
        return acc;
    }, {});

    const topThemes = Object.entries(themeCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([theme]) => theme);

    const dominantSentiment = Object.entries(sentimentCounts)
        .sort(([,a], [,b]) => b - a)[0][0];

    // Generate insights
    if (themeCounts.work > 5) {
        insights.push("Work has been a major focus this month. Consider your work-life balance.");
    }
    
    if (themeCounts.family > 5) {
        insights.push("Family relationships have been important to you this month.");
    }
    
    if (themeCounts.health > 3) {
        insights.push("You've been thinking about health and wellness. How are you feeling?");
    }

    if (sentimentCounts.positive > sentimentCounts.negative * 1.5) {
        insights.push("You've had a very positive month! What's been contributing to this?");
    } else if (sentimentCounts.negative > sentimentCounts.positive * 1.5) {
        insights.push("This month had its challenges. Remember that growth often comes from difficult times.");
    }

    const themesText = topThemes.length > 0 ? topThemes.join(', ') : 'general reflection and personal growth';
    
    return {
        summary: `This month you wrote ${monthEntries.length} entries with themes around ${themesText}.`,
        themes: topThemes,
        sentiment: dominantSentiment,
        insights: insights,
        entryCount: monthEntries.length
    };
};
