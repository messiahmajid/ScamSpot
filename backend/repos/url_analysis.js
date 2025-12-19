const { OpenAI } = require('openai');

class URLAnalyzer {
    constructor() {
        this.client = new OpenAI({
            apiKey: process.env.OPENAI
        });

        this.systemPrompt = `
Analyze the given URLs and return a structured risk assessment for each URL. 
Returns: [
    {
        "url": "https://example.com",
        "risk": "High|Low"
    }
]

You are a phishing link analysis expert. For each URL, provide:
1. A "url" key containing the full URL to be analyzed.
2. A "risk" key with the value "High" or "Low" based on:
   - Suspicious Domain Name
   - Uncommon TLDs (.xyz, .online, .top)
   - Lack of HTTPS
   - Hidden Redirects
   - Strange Subdomains
   - Random Characters
   - Formatting Issues
   - Generic Links

risk:
- Flag ANY suspicious characteristic as "High" risk
- Only mark "Low" if NO flags are found

Return ONLY valid JSON array. No commentary. Maintain original order.
        `.replace(/\n\s+/g, '\n').trim();
    }

    _parseLLMResponse(text) {
        const jsonPattern = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonPattern);
        const jsonString = match ? match[1] : text;

        try {
            const parsed = JSON.parse(jsonString);
            if (!Array.isArray(parsed)) throw new Error("Response not an array");
            return parsed.map(item => ({
                url: item.url,
                risk_classification: item.risk === "High" ? "High" : "Low"
            }));
        } catch (error) {
            throw new Error(`Failed to parse LLM response: ${error.message}`);
        }
    }

    async analyzeURLs(urls) {
        try {
            if (!Array.isArray(urls)) {
                throw new Error("Input must be an array of URL objects");
            }

            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: this.systemPrompt
                    },
                    {
                        role: "user",
                        content: JSON.stringify(urls)
                    }
                ],
                temperature: 0.1,
                max_tokens: 2000
            });

            const rawResponse = response.choices[0].message.content;
            return this._parseLLMResponse(rawResponse);

        } catch (error) {
            return {
                error: true,
                message: error.message,
                details: error.response?.data || null
            };
        }
    }
}

module.exports = URLAnalyzer;