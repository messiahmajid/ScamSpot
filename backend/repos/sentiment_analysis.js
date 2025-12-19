const { TextAnalyticsClient, AzureKeyCredential } = require("@azure/ai-text-analytics");

class SentimentAnalyzer {
    constructor() {
        this.client = new TextAnalyticsClient(
            process.env.AZUREURL,
            new AzureKeyCredential(process.env.AZUREKEY)
        );
    }

    // Convert message array to conversation string
    _formatConversation(messages) {
        return messages.map(msg =>
            `${msg.sender}: ${msg.content}`
        ).join('\n');
    }

    async analyzeConversation(messages) {
        try {
            // 1. Convert messages to conversation format
            const conversationText = this._formatConversation(messages);

            // 2. Prepare documents for analysis
            const documents = [{
                id: "1",
                text: conversationText,
                language: "en"
            }];

            // 3. Perform sentiment analysis
            const results = await this.client.analyzeSentiment(documents, {
                includeOpinionMining: true
            });

            // 4. Process results
            if (results.length === 0 || results[0].error) {
                throw new Error(results[0]?.error?.message || "Sentiment analysis failed");
            }

            const documentResult = results[0];

            // 5. Map results back to original messages
            return messages.map((message, index) => ({
                ...message,
                sentiment: documentResult.sentences[index]?.sentiment || "neutral",
                confidenceScores: documentResult.sentences[index]?.confidenceScores || {
                    positive: 0,
                    neutral: 0,
                    negative: 0
                }
            }));

        } catch (error) {
            console.error("Sentiment analysis error:", error);
            return messages.map(msg => ({
                ...msg,
                error: error.message,
                sentiment: "neutral"
            }));
        }
    }
}

module.exports = SentimentAnalyzer;