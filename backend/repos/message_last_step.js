const { OpenAI } = require('openai');

class ScamMessageAnalyzer {
    constructor() {
        // Use environment variable for API key
        if (!process.env.OPENAI) {
            throw new Error('OPENAI environment variable is not set');
        }
        this.client = new OpenAI({
            apiKey: process.env.OPENAI
        });

        this.systemPrompt = `
        You are an expert fraud detection AI analyzing text messages for potential scams.
        Given a set of messages, return only those flagged as potential scams along with a scam likelihood score from 0 to 100.

        Your analysis should consider:
        - **Urgency** (e.g., "as soon as possible", "urgent", "immediately").
        - **Financial Requests** (e.g., "gift cards", "wire transfer", "send money").
        - **Persuasive Language** (e.g., "trust me", "help me", "do this for me").
        - **Phishing Indicators** (e.g., "click this link", "confirm your account").
        - **Confidence Scores in Sentiment Analysis** (messages with high positivity might be scams).
        
        Return a JSON array of objects with the original message data plus a scam likelihood score (0-100).
        Ensure the response matches this format:

        [
            {
                "sender": "Message sender",
                "content": "Message text",
                "timestamp": null,
                "type": "text",
                "sentiment": "neutral | positive | negative",
                "confidenceScores": { "positive": 0.XX, "neutral": 0.XX, "negative": 0.XX },
                "scamPrediction": "scam",
                "score": scam_likelihood_score (0-100)
            }
        ]
        `.replace(/\n\s+/g, '\n').trim();
    }

    async analyzeScamMessages(messages) {
        if (!Array.isArray(messages)) {
            throw new Error("Expected an array of messages.");
        }

        // **Filter messages flagged as scams**
        const scamMessages = messages.filter(msg => msg.scamPrediction === "scam");

        if (scamMessages.length === 0) {
            return [];
        }

        try {
            const response = await this.client.chat.completions.create({
                model: "gpt-4o",
                messages: [
                    {
                        role: "system",
                        content: this.systemPrompt
                    },
                    {
                        role: "user",
                        content: `Analyze the following scam messages:\n${JSON.stringify(scamMessages, null, 2)}`
                    }
                ],
                temperature: 0.1,
                max_tokens: 1000
            });

            return this._parseLLMResponse(response.choices[0].message.content);
        } catch (error) {
            console.error("❌ Error analyzing scam messages:", error);
            return { error: true, message: error.message };
        }
    }

    _parseLLMResponse(text) {
        const jsonPattern = /```(?:json)?\s*([\s\S]*?)\s*```/;
        const match = text.match(jsonPattern);
        const jsonString = match ? match[1] : text;

        try {
            return JSON.parse(jsonString);
        } catch (error) {
            throw new Error(`Failed to parse LLM response: ${error.message}`);
        }
    }
}

module.exports = ScamMessageAnalyzer;
