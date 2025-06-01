// API utilities and external data fetching
class APIManager {
    constructor() {
        this.endpoints = {
            openrouter: 'https://openrouter.ai/api/v1/chat/completions',
            backup: 'https://api.openai.com/v1/chat/completions'
        };
        this.apiKey = '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';
        this.model = 'deepseek/deepseek-chat-v3-0324:free';
        this.rateLimitDelay = 1000; // 1 second between requests
        this.lastRequestTime = 0;
    }

    async makeRequest(endpoint, options) {
        // Simple rate limiting
        const now = Date.now();
        const timeSinceLastRequest = now - this.lastRequestTime;
        if (timeSinceLastRequest < this.rateLimitDelay) {
            await this.sleep(this.rateLimitDelay - timeSinceLastRequest);
        }

        try {
            const response = await fetch(endpoint, options);
            this.lastRequestTime = Date.now();
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    async generateContent(prompt, maxTokens = 1000) {
        const options = {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a financial expert specializing in credit cards. Provide accurate, helpful, and current information.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: maxTokens,
                temperature: 0.7
            })
        };

        try {
            const data = await this.makeRequest(this.endpoints.openrouter, options);
            return data.choices[0].message.content;
        } catch (error) {
            console.error('Content generation failed:', error);
            return this.getFallbackContent(prompt);
        }
    }

    getFallbackContent(prompt) {
        // Provide fallback content when API fails
        if (prompt.includes('news')) {
            return JSON.stringify([
                {
                    title: "Credit Card Market Update",
                    summary: "The credit card industry continues to evolve with new offers and regulatory changes.",
                    category: "Industry News",
                    impact: "neutral"
                }
            ]);
        }
        return "Content temporarily unavailable. Please check back later.";
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async fetchExternalData(url, options = {}) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'User-Agent': 'Credit Card Daily Newsletter Bot',
                    ...options.headers
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.error(`Error fetching external data from ${url}:`, error);
            return null;
        }
    }
}

// Make API manager globally available
window.apiManager = new APIManager();
