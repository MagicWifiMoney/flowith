
class CreditCardNewsletter {
    constructor() {
        this.apiKey = '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';
        this.apiEndpoint = 'https://openrouter.ai/api/v1/chat/completions';
        this.model = 'deepseek/deepseek-chat-v3-0324:free';
        this.init();
    }

    init() {
        this.setLastUpdated();
        this.loadStaticData();
        this.bindEvents();
        this.loadDailyPost();
        this.scheduleAutomaticUpdates();
    }

    setLastUpdated() {
        const now = new Date();
        const pstTime = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        const timeString = pstTime.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }) + ' PST'; 
        
        const lastUpdatedElement = document.getElementById('lastUpdated');
        if (lastUpdatedElement) {
            lastUpdatedElement.textContent = timeString;
        }
    }

    async loadStaticData() {
        try {
            await this.loadInfluencers();
            await this.loadSources();
            await this.loadBonusOffers();
            await this.loadCardUpdates();
        } catch (error) {
            console.error('Error loading static data:', error);
        }
    }

    async loadInfluencers() {
        try {
            const response = await fetch('data/influencers.json');
            const influencers = await response.json();
            this.renderInfluencers(influencers);
        } catch (error) {
            console.error('Error loading influencers:', error);
        }
    }

    async loadSources() {
        try {
            const response = await fetch('data/sources.json');
            const sources = await response.json();
            this.renderSources(sources);
        } catch (error) {
            console.error('Error loading sources:', error);
        }
    }

    renderInfluencers(influencers) {
        const container = document.getElementById('influencersContainer');
        if (!container) return;

        container.innerHTML = influencers.map(influencer => `
            <a href="https://twitter.com/${influencer.handle.replace('@', '')}" target="_blank" 
               class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="font-medium text-gray-900">${influencer.handle}</div>
                <div class="text-sm text-gray-600">${influencer.description}</div>
            </a>
        `).join('');
    }

    renderSources(sources) {
        const container = document.getElementById('sourcesContainer');
        if (!container) return;

        container.innerHTML = sources.map(source => `
            <a href="${source.url}" target="_blank" 
               class="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div class="font-medium text-gray-900">${source.name}</div>
                <div class="text-sm text-gray-600">${source.description}</div>
            </a>
        `).join('');
    }

    async loadBonusOffers() {
        const bonusOffers = [
            {
                title: "Chase Sapphire Preferred",
                bonus: "60,000 Points",
                requirement: "After $5,000 spend in 3 months",
                fee: "$95 annual fee",
                expires: "Limited time"
            },
            {
                title: "Capital One Venture X",
                bonus: "75,000 Miles",
                requirement: "After $4,000 spend in 3 months",
                fee: "$395 annual fee",
                expires: "Ongoing"
            },
            {
                title: "American Express Gold",
                bonus: "100,000 Points", 
                requirement: "After $15,000 spend in 3 months", 
                fee: "$325 annual fee", 
                expires: "May 31, 2025" 
            }
        ];

        this.renderBonusOffers(bonusOffers);
    }

    renderBonusOffers(offers) {
        const container = document.getElementById('bonusContainer');
        if (!container) return;

        container.innerHTML = offers.map(offer => `
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-lg font-semibold text-gray-900">${offer.title}</h3>
                    <span class="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        ${offer.expires}
                    </span>
                </div>
                <div class="space-y-2">
                    <div class="text-2xl font-bold text-blue-600">${offer.bonus}</div>
                    <div class="text-sm text-gray-600">${offer.requirement}</div>
                    <div class="text-sm text-gray-500">${offer.fee}</div>
                </div>
            </div>
        `).join('');
    }

    async loadCardUpdates() {
        const updates = [
            {
                title: "Chase Sapphire Reserve Fee Increase",
                date: "May 25, 2025",
                type: "Fee Change",
                description: "Annual fee increasing from $550 to $595 for new applications starting June 1, 2025.",
                impact: "moderate"
            },
            {
                title: "American Express Platinum New Benefits",
                date: "May 24, 2025",
                type: "Benefit Enhancement",
                description: "Added new $200 annual streaming credit and enhanced hotel status benefits.",
                impact: "positive"
            },
            {
                title: "Capital One Venture Rate Changes",
                date: "May 23, 2025",
                type: "Rate Change",
                description: "Purchase APR range adjusted to 19.99% - 29.99% based on creditworthiness.",
                impact: "neutral"
            }
        ];

        this.renderCardUpdates(updates);
    }

    renderCardUpdates(updates) {
        const container = document.getElementById('updatesContainer');
        if (!container) return;

        container.innerHTML = updates.map(update => {
            const impactColor = {
                positive: 'bg-green-100 text-green-800',
                moderate: 'bg-yellow-100 text-yellow-800',
                neutral: 'bg-gray-100 text-gray-800'
            }[update.impact] || 'bg-gray-100 text-gray-800';

            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="text-lg font-semibold text-gray-900">${update.title}</h3>
                            <div class="flex items-center mt-2 space-x-2">
                                <span class="text-sm text-gray-500">${update.date}</span>
                                <span class="text-xs ${impactColor} px-2 py-1 rounded-full font-medium">
                                    ${update.type}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p class="text-gray-600">${update.description}</p>
                </div>
            `;
        }).join('');
    }

    async loadDailyPost() {
        try {
            const latestPostFilename = 'daily-digest-2025-06-01.md';
            const response = await fetch(`content/daily-posts/${latestPostFilename}`); 
            if (!response.ok) {
                throw new Error(`Failed to fetch daily post: ${response.status} ${response.statusText}`);
            }
            const markdownContent = await response.text();
            
            const { metadata, content } = this.parseMarkdownWithFrontMatter(markdownContent);
            const htmlContent = marked.parse(content);
            
            this.renderDailyPost(metadata, htmlContent);
        } catch (error) {
            console.error('Error loading daily post:', error);
            this.renderDailyPostError();
        }
    }

    parseMarkdownWithFrontMatter(markdownText) {
        const frontMatterRegex = new RegExp('^---\\\s*\\n([\\s\\S]+?)\\n---\\\s*\\n([\\s\\S]*)$');
        const match = markdownText.match(frontMatterRegex);
        
        if (match && match[1] && match[2]) {
            try {
                const metadata = jsyaml.load(match[1]);
                const content = match[2];
                return { metadata, content };
            } catch (error) {
                console.error('Error parsing YAML front matter:', error);
                return { metadata: {}, content: markdownText.replace(frontMatterRegex, '$2') }; 
            }
        }
        return { metadata: {}, content: markdownText };
    }

    renderDailyPost(metadata, htmlContent) {
        const container = document.getElementById('dailyPostContainer');
        if (!container) return;

        container.innerHTML = `
            <article class="prose prose-lg max-w-none">
                <header class="mb-8">
                    <h1 class="text-3xl font-bold text-gray-900 mb-4">${metadata.title || 'Daily Analysis'}</h1>
                    <div class="flex items-center text-gray-600 text-sm">
                        <span>${metadata.date || new Date().toLocaleDateString()}</span>
                        <span class="mx-2">•</span>
                        <span>By ${metadata.author || 'Credit Card Daily'}</span>
                    </div>
                </header>
                <div class="prose-content">
                    ${htmlContent}
                </div>
            </article>
        `;
    }

    renderDailyPostError() {
        const container = document.getElementById('dailyPostContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="text-center text-gray-500 py-8">
                <p>Unable to load today's analysis. Please check back later.</p>
            </div>
        `;
    }

    bindEvents() {
        const generateNewsBtn = document.getElementById('generateNews');
        if (generateNewsBtn) {
            generateNewsBtn.addEventListener('click', () => this.generateLatestNews());
        }
    }

    async generateLatestNews() {
        const button = document.getElementById('generateNews');
        const container = document.getElementById('newsContainer');
        
        if (!button || !container) return;

        button.disabled = true;
        button.textContent = 'Generating...';
        container.innerHTML = '<div class="col-span-full text-center py-8 text-gray-500">Generating latest news...</div>';

        try {
            const newsContent = await this.fetchAIGeneratedNews();
            this.renderGeneratedNews(newsContent);
        } catch (error) {
            console.error('Error generating news:', error);
            container.innerHTML = '<div class="col-span-full text-center py-8 text-red-500">Error generating news. Please try again.</div>';
        } finally {
            button.disabled = false;
            button.textContent = 'Generate Latest News';
        }
    }

    async fetchAIGeneratedNews() {
        const prompt = `Generate 3 current credit card news items for today's newsletter. Include:\\n        1. A recent bonus offer change or new card launch\\\\n        2. An industry trend or regulatory update\\\\n        3. A consumer tip or strategy update\\\\n        \\\\n        Format each as a JSON object with: title, summary, category, and impact (positive, negative, neutral).\\\\n        Return as a JSON array.`;

        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                max_tokens: 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error("AI API Error:", response.status, errorData);
            throw new Error(`AI API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        try {
            return JSON.parse(content);
        } catch (error) {
            console.error("Failed to parse AI response JSON:", error, "Raw content:", content);
            return [ 
                {
                    title: "AI Content Error",
                    summary: "Could not parse news content from AI. Displaying fallback.",
                    category: "Error",
                    impact: "negative"
                }
            ];
        }
    }

    renderGeneratedNews(newsItems) {
        const container = document.getElementById('newsContainer');
        if (!container) return;

        container.innerHTML = newsItems.map(item => {
            const categoryColors = {
                'Bonus Offers': 'bg-green-100 text-green-800',
                'Industry News': 'bg-blue-100 text-blue-800',
                'Tips': 'bg-purple-100 text-purple-800',
                'Error': 'bg-red-100 text-red-800'
            };

            return `
                <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <div class="flex justify-between items-start mb-4">
                        <span class="text-xs font-medium px-2 py-1 rounded-full ${categoryColors[item.category] || 'bg-gray-100 text-gray-800'}">
                            ${item.category}
                        </span>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-900 mb-3">${item.title}</h3>
                    <p class="text-gray-600">${item.summary}</p>
                </div>
            `;
        }).join('');
    }

    scheduleAutomaticUpdates() {
        const now = new Date();
        const pstNow = new Date(now.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}));
        
        const next7AM = new Date(pstNow);
        next7AM.setHours(7, 0, 0, 0);
        
        if (pstNow.getTime() >= next7AM.getTime()) { 
            next7AM.setDate(next7AM.getDate() + 1); 
        }
        
        const timeUntil7AM = next7AM.getTime() - pstNow.getTime();
        
        console.log(`Scheduling next automatic update for: ${next7AM.toString()} (in ${timeUntil7AM/1000/60} minutes)`);

        setTimeout(() => {
            this.performDailyUpdate();
            setInterval(() => this.performDailyUpdate(), 24 * 60 * 60 * 1000);
        }, timeUntil7AM);
    }

    async performDailyUpdate() {
        console.log(`Performing daily update at ${new Date().toLocaleString("en-US", {timeZone: "America/Los_Angeles"})} PST`);
        this.setLastUpdated();


        await this.generateLatestNews(); 
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new CreditCardNewsletter();
});
